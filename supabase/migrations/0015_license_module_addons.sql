-- ============================================================
-- Aserai — Lisansa sonradan modül ekleme
-- Supabase SQL Editor'de 0014 sonrası çalıştırın.
--
-- Akış:
--   • Müşteri "Lisanslarım" ekranında aktif paket lisansı için modül seçer.
--   • request_license_module RPC modül için bekleyen sipariş oluşturur.
--   • Admin siparişi "paid" yapınca modül lisansı ana paket lisansına bağlanır.
--   • İlk satın alma siparişindeki modül kalemleri de paket lisansına bağlı
--     modül lisansları olarak üretilir.
-- ============================================================

alter table public.orders
  add column if not exists parent_license_id uuid
    references public.licenses (id) on delete set null;

alter table public.licenses
  add column if not exists license_type text not null default 'package'
    check (license_type in ('package', 'module'));

alter table public.licenses
  add column if not exists parent_license_id uuid
    references public.licenses (id) on delete cascade;

alter table public.licenses
  add column if not exists module_id text;

update public.licenses
  set license_type = 'package'
  where license_type is null;

create index if not exists idx_orders_parent_license
  on public.orders (parent_license_id);

create index if not exists idx_licenses_parent
  on public.licenses (parent_license_id);

create index if not exists idx_licenses_module
  on public.licenses (module_id);

create unique index if not exists uq_licenses_active_module_per_parent
  on public.licenses (parent_license_id, module_id)
  where license_type = 'module' and status = 'active';

-- ============================================================
-- Müşteri lisansına modül eklemek için bekleyen sipariş oluşturur.
-- Tutar sunucuda public.modules tablosundan alınır; istemci fiyatına güvenilmez.
-- ============================================================
create or replace function public.request_license_module(
  p_license_id uuid,
  p_module_id text
)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_lic       public.licenses%rowtype;
  v_module    record;
  v_existing  uuid;
  v_order_id  uuid;
  v_full_name text;
  v_phone     text;
  v_company   text;
begin
  if auth.uid() is null then
    raise exception 'Kimlik doğrulaması gerekli';
  end if;

  if public.is_platform_admin() then
    raise exception 'Yönetim kullanıcıları müşteri adına modül siparişi oluşturamaz';
  end if;

  select * into v_lic
    from public.licenses
    where id = p_license_id;

  if not found then
    raise exception 'Lisans bulunamadı';
  end if;

  if v_lic.user_id <> auth.uid() then
    raise exception 'Bu lisans için yetkiniz yok';
  end if;

  if coalesce(v_lic.license_type, 'package') <> 'package' then
    raise exception 'Modül yalnızca paket lisansına eklenebilir';
  end if;

  if v_lic.status <> 'active' or v_lic.expires_at < now() then
    raise exception 'Aktif olmayan lisansa modül eklenemez';
  end if;

  select slug, name, monthly into v_module
    from public.modules
    where slug = p_module_id and is_active = true;

  if not found then
    raise exception 'Modül bulunamadı veya aktif değil';
  end if;

  select id into v_existing
    from public.licenses
    where parent_license_id = v_lic.id
      and module_id = v_module.slug
      and license_type = 'module'
      and status = 'active'
    limit 1;

  if v_existing is not null then
    raise exception 'Bu modül lisansa zaten ekli';
  end if;

  select o.id into v_existing
    from public.orders o
    join public.order_items oi on oi.order_id = o.id
    where o.user_id = auth.uid()
      and o.parent_license_id = v_lic.id
      and o.status = 'pending'
      and oi.item_type = 'module'
      and oi.item_id = v_module.slug
    limit 1;

  if v_existing is not null then
    return v_existing;
  end if;

  select full_name, phone into v_full_name, v_phone
    from public.profiles
    where id = auth.uid();

  select name into v_company
    from public.tenants
    where id = v_lic.tenant_id;

  insert into public.orders (
    user_id, tenant_id, billing_period, status, total, payment_method,
    contact_name, contact_phone, company, parent_license_id
  )
  values (
    auth.uid(), v_lic.tenant_id, v_lic.billing_period, 'pending',
    v_module.monthly, 'havale',
    v_full_name, v_phone, v_company, v_lic.id
  )
  returning id into v_order_id;

  insert into public.order_items (
    order_id, item_type, item_id, name, unit_price, qty
  )
  values (
    v_order_id, 'module', v_module.slug, v_module.name, v_module.monthly, 1
  );

  return v_order_id;
end;
$$;

-- ============================================================
-- Sipariş 'paid' olunca paket lisansı + bağlı modül lisanslarını üret.
-- 0008/0014'teki handle_order_paid fonksiyonu genişletilir.
-- ============================================================
create or replace function public.handle_order_paid()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_package_item       record;
  v_module_item        record;
  v_parent_license     public.licenses%rowtype;
  v_package_license_id uuid;
  v_package_expires    timestamptz;
  v_expires            timestamptz;
begin
  if new.status = 'paid' and (old.status is distinct from 'paid') then
    if new.parent_license_id is not null then
      select * into v_parent_license
        from public.licenses
        where id = new.parent_license_id;

      select * into v_module_item
        from public.order_items
        where order_id = new.id and item_type = 'module'
        order by unit_price desc
        limit 1;

      if v_module_item.id is not null
         and not exists (select 1 from public.licenses where order_id = new.id) then
        insert into public.licenses (
          order_id, user_id, tenant_id, product, billing_period,
          status, starts_at, expires_at, license_type, parent_license_id, module_id
        )
        values (
          new.id, new.user_id, new.tenant_id,
          v_module_item.name, new.billing_period,
          'active', now(), coalesce(v_parent_license.expires_at, now()),
          'module', new.parent_license_id, v_module_item.item_id
        );
      end if;
    else
      select id, expires_at into v_package_license_id, v_package_expires
        from public.licenses
        where order_id = new.id and coalesce(license_type, 'package') = 'package'
        limit 1;

      if v_package_license_id is null then
        select * into v_package_item
          from public.order_items
          where order_id = new.id and item_type = 'package'
          order by unit_price desc
          limit 1;

        if v_package_item.id is null then
          select * into v_package_item
            from public.order_items
            where order_id = new.id
            order by unit_price desc
            limit 1;
        end if;

        v_expires := case new.billing_period
                       when 'yearly' then now() + interval '1 year'
                       else now() + interval '1 month'
                     end;

        insert into public.licenses (
          order_id, user_id, tenant_id, product, billing_period,
          status, starts_at, expires_at, license_type
        )
        values (
          new.id, new.user_id, new.tenant_id,
          coalesce(v_package_item.name, 'Aserai'), new.billing_period,
          'active', now(), v_expires, 'package'
        )
        returning id, expires_at into v_package_license_id, v_package_expires;
      end if;

      for v_module_item in
        select *
          from public.order_items
          where order_id = new.id and item_type = 'module'
      loop
        if not exists (
          select 1
            from public.licenses
            where order_id = new.id
              and license_type = 'module'
              and module_id = v_module_item.item_id
        ) then
          insert into public.licenses (
            order_id, user_id, tenant_id, product, billing_period,
            status, starts_at, expires_at, license_type, parent_license_id, module_id
          )
          values (
            new.id, new.user_id, new.tenant_id,
            v_module_item.name, new.billing_period,
            'active', now(), v_package_expires,
            'module', v_package_license_id, v_module_item.item_id
          )
          on conflict do nothing;
        end if;
      end loop;
    end if;

    if not exists (select 1 from public.invoices where order_id = new.id) then
      insert into public.invoices (
        order_id, user_id, tenant_id, number, amount,
        billing_period, status, issued_at
      )
      values (
        new.id, new.user_id, new.tenant_id,
        'ASR-' || to_char(now(), 'YYYY') || '-'
          || lpad(nextval('public.invoice_seq')::text, 6, '0'),
        new.total, new.billing_period, 'paid', now()
      );
    end if;
  end if;

  return new;
end;
$$;

-- Mevcut paid siparişlerdeki modül kalemleri için modül lisanslarını oluştur.
do $$
declare
  r            record;
  m            record;
  v_package_id uuid;
  v_expires    timestamptz;
begin
  for r in
    select *
      from public.orders
      where status = 'paid'
        and parent_license_id is null
  loop
    select id, expires_at into v_package_id, v_expires
      from public.licenses
      where order_id = r.id and coalesce(license_type, 'package') = 'package'
      limit 1;

    if v_package_id is not null then
      for m in
        select *
          from public.order_items
          where order_id = r.id and item_type = 'module'
      loop
        if not exists (
          select 1
            from public.licenses
            where parent_license_id = v_package_id
              and module_id = m.item_id
              and license_type = 'module'
        ) then
          insert into public.licenses (
            order_id, user_id, tenant_id, product, billing_period,
            status, starts_at, expires_at, license_type, parent_license_id, module_id
          )
          values (
            r.id, r.user_id, r.tenant_id, m.name, r.billing_period,
            'active', r.created_at, v_expires,
            'module', v_package_id, m.item_id
          )
          on conflict do nothing;
        end if;
      end loop;
    end if;
  end loop;
end $$;
