-- ============================================================
-- Aserai — Admin kullanıcıların sipariş oluşturmasını engelle
-- Supabase SQL Editor'de 0013 sonrası çalıştırın.
--
-- Amaç:
-- - Platform adminleri yönetim panelinde siparişleri görebilir/güncelleyebilir.
-- - Platform adminleri müşteri gibi sepet/ödeme akışıyla yeni sipariş oluşturamaz.
-- - create_order RPC'si ve doğrudan orders/order_items insert politikası kapatılır.
-- ============================================================

drop policy if exists "orders_admin_all" on public.orders;
drop policy if exists "order_items_admin_all" on public.order_items;

create policy "orders_admin_select"
  on public.orders for select
  using (public.is_platform_admin());

create policy "orders_admin_update"
  on public.orders for update
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "orders_admin_delete"
  on public.orders for delete
  using (public.is_platform_admin());

create policy "order_items_admin_select"
  on public.order_items for select
  using (public.is_platform_admin());

create policy "order_items_admin_update"
  on public.order_items for update
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "order_items_admin_delete"
  on public.order_items for delete
  using (public.is_platform_admin());

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
  v_total    numeric(12, 2);
  it         jsonb;
begin
  if auth.uid() is null then
    raise exception 'Kimlik doğrulaması gerekli';
  end if;

  if public.is_platform_admin() then
    raise exception 'Yönetim kullanıcıları sipariş oluşturamaz';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Sipariş kalemleri boş olamaz';
  end if;

  select coalesce(
           sum((i ->> 'unit_price')::numeric * coalesce((i ->> 'qty')::int, 1)),
           0)
    into v_total
    from jsonb_array_elements(p_items) i;

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

  for it in select * from jsonb_array_elements(p_items)
  loop
    insert into public.order_items (order_id, item_type, item_id, name, unit_price, qty)
    values (
      v_order_id,
      it ->> 'item_type',
      it ->> 'item_id',
      it ->> 'name',
      (it ->> 'unit_price')::numeric,
      coalesce((it ->> 'qty')::int, 1)
    );
  end loop;

  return v_order_id;
end;
$$;
