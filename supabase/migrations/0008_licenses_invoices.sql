-- ============================================================
-- Aserai — Faz 8: Lisans & Fatura Otomasyonu (H + J)
-- Supabase SQL Editor'de çalıştırın (0002_orders.sql sonrası).
--
-- Bir sipariş 'paid' (ödendi) durumuna geçince otomatik olarak:
--   • 1 adet lisans (sipariş başına), dönemine göre bitiş tarihi ile
--   • 1 adet fatura (ASR-YYYY-000001 numarasıyla)
-- üretilir. Trigger idempotent'tir: paid→pending→paid tekrarında
-- çift kayıt oluşmaz. Aynı mantık, ileride ödeme webhook'u sipariş
-- durumunu 'paid' yaptığında da otomatik çalışır.
-- ============================================================

-- ---------- Fatura numarası için sıra ----------
create sequence if not exists public.invoice_seq;

-- ---------- licenses: sipariş başına lisans ----------
create table if not exists public.licenses (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references public.orders (id) on delete cascade,
  user_id        uuid not null references auth.users (id) on delete cascade,
  tenant_id      uuid references public.tenants (id) on delete set null,
  product        text not null,
  billing_period text not null check (billing_period in ('monthly', 'yearly')),
  status         text not null default 'active'
                   check (status in ('active', 'expired', 'cancelled')),
  starts_at      timestamptz not null default now(),
  expires_at     timestamptz not null,
  created_at     timestamptz not null default now()
);

-- ---------- invoices: sipariş başına fatura ----------
create table if not exists public.invoices (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references public.orders (id) on delete cascade,
  user_id        uuid not null references auth.users (id) on delete cascade,
  tenant_id      uuid references public.tenants (id) on delete set null,
  number         text not null unique,
  amount         numeric(12, 2) not null,
  billing_period text not null check (billing_period in ('monthly', 'yearly')),
  status         text not null default 'paid'
                   check (status in ('issued', 'paid', 'void')),
  issued_at      timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

create index if not exists idx_licenses_user on public.licenses (user_id);
create index if not exists idx_licenses_order on public.licenses (order_id);
create index if not exists idx_invoices_user on public.invoices (user_id);
create index if not exists idx_invoices_order on public.invoices (order_id);

-- ============================================================
-- RLS — kullanıcı yalnızca kendi kayıtlarını görür; admin hepsini.
-- ============================================================
alter table public.licenses enable row level security;
alter table public.invoices enable row level security;

create policy "licenses_select_own"
  on public.licenses for select
  using (user_id = auth.uid());

create policy "invoices_select_own"
  on public.invoices for select
  using (user_id = auth.uid());

create policy "licenses_admin_all" on public.licenses
  for all using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "invoices_admin_all" on public.invoices
  for all using (public.is_platform_admin())
  with check (public.is_platform_admin());

-- ============================================================
-- Sipariş 'paid' olunca lisans + fatura üret (idempotent)
-- ============================================================
create or replace function public.handle_order_paid()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_product text;
  v_expires timestamptz;
begin
  if new.status = 'paid' and (old.status is distinct from 'paid') then
    -- Lisans (sipariş başına 1)
    if not exists (select 1 from public.licenses where order_id = new.id) then
      -- Ürün adı: en yüksek fiyatlı paket kalemi; yoksa herhangi bir kalem
      select name into v_product
        from public.order_items
        where order_id = new.id and item_type = 'package'
        order by unit_price desc
        limit 1;
      if v_product is null then
        select name into v_product
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
        status, starts_at, expires_at
      )
      values (
        new.id, new.user_id, new.tenant_id,
        coalesce(v_product, 'Aserai'), new.billing_period,
        'active', now(), v_expires
      );
    end if;

    -- Fatura (sipariş başına 1)
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

drop trigger if exists on_order_paid on public.orders;
create trigger on_order_paid
  after update of status on public.orders
  for each row execute function public.handle_order_paid();

-- ============================================================
-- Backfill — migration'dan önce 'paid' olmuş siparişler için
-- (tarih hesabı sipariş oluşturulma anına göre yapılır)
-- ============================================================
do $$
declare
  r         record;
  v_product text;
  v_expires timestamptz;
begin
  for r in select * from public.orders where status = 'paid' loop
    if not exists (select 1 from public.licenses where order_id = r.id) then
      select name into v_product
        from public.order_items
        where order_id = r.id and item_type = 'package'
        order by unit_price desc limit 1;
      if v_product is null then
        select name into v_product
          from public.order_items where order_id = r.id
          order by unit_price desc limit 1;
      end if;

      v_expires := case r.billing_period
                     when 'yearly' then r.created_at + interval '1 year'
                     else r.created_at + interval '1 month'
                   end;

      insert into public.licenses (
        order_id, user_id, tenant_id, product, billing_period,
        status, starts_at, expires_at
      )
      values (
        r.id, r.user_id, r.tenant_id,
        coalesce(v_product, 'Aserai'), r.billing_period,
        case when v_expires < now() then 'expired' else 'active' end,
        r.created_at, v_expires
      );
    end if;

    if not exists (select 1 from public.invoices where order_id = r.id) then
      insert into public.invoices (
        order_id, user_id, tenant_id, number, amount,
        billing_period, status, issued_at
      )
      values (
        r.id, r.user_id, r.tenant_id,
        'ASR-' || to_char(r.created_at, 'YYYY') || '-'
          || lpad(nextval('public.invoice_seq')::text, 6, '0'),
        r.total, r.billing_period, 'paid', r.created_at
      );
    end if;
  end loop;
end $$;
