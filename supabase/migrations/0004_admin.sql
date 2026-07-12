-- ============================================================
-- Aserai — Faz 4: Yönetim Paneli (platform admin yetkisi + RLS)
-- Supabase SQL Editor'de çalıştırın.
--
-- BOOTSTRAP: Migration sonrası kendinizi admin yapın:
--   insert into public.platform_admins (user_id)
--   values ('<AUTH_USERS_TABLOSUNDAKI_ID>');
--   (Kullanıcı ID'sini Authentication > Users'tan alın.)
-- ============================================================

create table if not exists public.platform_admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- Sadece security-definer fonksiyon okur; doğrudan erişim kapalı.
alter table public.platform_admins enable row level security;

-- Geçerli kullanıcı platform admini mi?
create or replace function public.is_platform_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.platform_admins where user_id = auth.uid()
  );
$$;

-- ============================================================
-- Admin geniş erişim politikaları (mevcut "own" politikalarıyla OR'lanır)
-- ============================================================
create policy "orders_admin_all" on public.orders
  for all using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "order_items_admin_all" on public.order_items
  for all using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "tickets_admin_all" on public.support_tickets
  for all using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "ticket_messages_admin_all" on public.ticket_messages
  for all using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "profiles_admin_select" on public.profiles
  for select using (public.is_platform_admin());

create policy "tenants_admin_select" on public.tenants
  for select using (public.is_platform_admin());
