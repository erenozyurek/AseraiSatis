-- Recalculate order totals from the catalog instead of trusting client prices.
-- Also prevents adding modules that are not addable for the selected package.

create or replace function public.create_order(
  p_billing        text,
  p_payment_method text,
  p_contact        jsonb,
  p_items          jsonb
)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_order_id uuid;
  v_total numeric(12, 2) := 0;
  v_package_count integer;
  v_package_slug text;
  v_package public.packages%rowtype;
  v_package_price numeric(12, 2);
  v_module public.modules%rowtype;
  v_module_items jsonb := '[]'::jsonb;
  v_seen_modules text[] := array[]::text[];
  it jsonb;
begin
  if auth.uid() is null then
    raise exception 'Kimlik doğrulaması gerekli';
  end if;

  if p_billing not in ('monthly', 'yearly') then
    raise exception 'Geçersiz faturalandırma dönemi';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Sipariş kalemleri boş olamaz';
  end if;

  select count(*), max(i ->> 'item_id')
    into v_package_count, v_package_slug
    from jsonb_array_elements(p_items) i
    where i ->> 'item_type' = 'package';

  if v_package_count <> 1 then
    raise exception 'Siparişte tam olarak bir paket bulunmalıdır';
  end if;

  select *
    into v_package
    from public.packages
    where slug = v_package_slug
      and is_active = true;

  if not found then
    raise exception 'Seçilen paket bulunamadı veya aktif değil';
  end if;

  v_package_price := case
    when p_billing = 'yearly' then v_package.yearly_monthly
    else v_package.monthly
  end;
  v_total := v_package_price;

  for it in select * from jsonb_array_elements(p_items)
  loop
    if it ->> 'item_type' not in ('package', 'module') then
      raise exception 'Geçersiz sipariş kalemi';
    end if;

    if it ->> 'item_type' = 'module' then
      if it ->> 'item_id' = any(v_seen_modules) then
        raise exception 'Aynı modül birden fazla eklenemez';
      end if;

      select m.*
        into v_module
        from public.modules m
        join public.package_module_rules r
          on r.module_slug = m.slug
         and r.package_slug = v_package.slug
         and r.status = 'addable'
        where m.slug = it ->> 'item_id'
          and m.is_active = true;

      if not found then
        raise exception 'Seçilen modül bu paket için sepete eklenemez';
      end if;

      v_seen_modules := array_append(v_seen_modules, v_module.slug);
      v_total := v_total + v_module.monthly;
      v_module_items := v_module_items || jsonb_build_array(
        jsonb_build_object(
          'item_id', v_module.slug,
          'name', v_module.name,
          'unit_price', v_module.monthly
        )
      );
    end if;
  end loop;

  insert into public.orders (
    user_id, billing_period, status, total, payment_method,
    contact_name, contact_email, contact_phone, company
  )
  values (
    auth.uid(),
    p_billing,
    'pending',
    v_total,
    p_payment_method,
    p_contact ->> 'name',
    p_contact ->> 'email',
    p_contact ->> 'phone',
    p_contact ->> 'company'
  )
  returning id into v_order_id;

  insert into public.order_items (order_id, item_type, item_id, name, unit_price, qty)
  values (
    v_order_id,
    'package',
    v_package.slug,
    v_package.name || ' Paketi',
    v_package_price,
    1
  );

  for it in select * from jsonb_array_elements(v_module_items)
  loop
    insert into public.order_items (order_id, item_type, item_id, name, unit_price, qty)
    values (
      v_order_id,
      'module',
      it ->> 'item_id',
      it ->> 'name',
      (it ->> 'unit_price')::numeric,
      1
    );
  end loop;

  return v_order_id;
end;
$$;
