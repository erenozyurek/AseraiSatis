-- ============================================================
-- Aserai — Faz 2: Sipariş şeması (Sepet → Ödeme)
-- Supabase SQL Editor'de çalıştırın.
-- Not: Canlı kart tahsilatı (PayTR/İyzico) Edge Function ile ayrıca
-- eklenecek; bu aşamada sipariş 'pending' (beklemede) olarak oluşturulur.
-- ============================================================

create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  tenant_id      uuid references public.tenants (id) on delete set null,
  billing_period text not null check (billing_period in ('monthly', 'yearly')),
  status         text not null default 'pending'
                   check (status in ('pending', 'paid', 'cancelled')),
  total          numeric(12, 2) not null default 0,
  payment_method text,
  contact_name   text,
  contact_email  text,
  contact_phone  text,
  company        text,
  created_at     timestamptz not null default now()
);

create table if not exists public.order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders (id) on delete cascade,
  item_type   text not null check (item_type in ('package', 'module')),
  item_id     text not null,
  name        text not null,
  unit_price  numeric(12, 2) not null,
  qty         integer not null default 1
);

create index if not exists idx_orders_user on public.orders (user_id);
create index if not exists idx_order_items_order on public.order_items (order_id);

-- ============================================================
-- RLS
-- ============================================================
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

create policy "orders_select_own"
  on public.orders for select
  using (user_id = auth.uid());

create policy "order_items_select_own"
  on public.order_items for select
  using (
    order_id in (select id from public.orders where user_id = auth.uid())
  );

-- ============================================================
-- Sipariş oluşturma RPC
-- Toplam sunucuda hesaplanır (istemciye güvenilmez).
-- p_items: [{ item_type, item_id, name, unit_price, qty }]
-- p_contact: { name, email, phone, company }
-- ============================================================
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
