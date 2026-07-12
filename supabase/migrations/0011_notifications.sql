-- ============================================================
-- Aserai — Faz 11: Bildirim Sistemi (N + D10)
-- Supabase SQL Editor'de çalıştırın.
--
-- • Müşteri panelinde "Bildirimlerim".
-- • Admin tek müşteriye veya tüm müşterilere duyuru gönderir (RPC).
-- • Sipariş/yenileme 'paid' olunca otomatik bildirim (AYRI trigger'lar;
--   0008/0009 fonksiyonlarına DOKUNULMAZ).
-- ============================================================

create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  title      text not null,
  body       text,
  type       text not null default 'system'
               check (type in ('system', 'order', 'renewal', 'announcement')),
  link       text,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user
  on public.notifications (user_id, created_at desc);

-- ============================================================
-- RLS — kullanıcı yalnızca kendi bildirimlerini görür; admin hepsini.
-- (Okundu işaretleme mark_notifications_read RPC ile yapılır.)
-- ============================================================
alter table public.notifications enable row level security;

create policy "notifications_select_own"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "notifications_admin_all" on public.notifications
  for all using (public.is_platform_admin())
  with check (public.is_platform_admin());

-- ============================================================
-- Okundu işaretle (müşteri) — p_ids null ise tümü.
-- ============================================================
create or replace function public.mark_notifications_read(p_ids uuid[] default null)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Kimlik doğrulaması gerekli';
  end if;

  update public.notifications
    set read_at = now()
    where user_id = auth.uid()
      and read_at is null
      and (p_ids is null or id = any (p_ids));
end;
$$;

-- ============================================================
-- Admin: tek müşteriye bildirim
-- ============================================================
create or replace function public.admin_send_notification(
  p_user_id uuid,
  p_title   text,
  p_body    text default null,
  p_link    text default null
)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_id uuid;
begin
  if not public.is_platform_admin() then
    raise exception 'Yetkisiz erişim';
  end if;

  insert into public.notifications (user_id, title, body, type, link)
  values (p_user_id, p_title, p_body, 'announcement', p_link)
  returning id into v_id;

  return v_id;
end;
$$;

-- ============================================================
-- Admin: tüm müşterilere duyuru (adminler hariç). Gönderilen adedi döner.
-- ============================================================
create or replace function public.admin_broadcast_notification(
  p_title text,
  p_body  text default null,
  p_link  text default null
)
returns integer
language plpgsql
security definer set search_path = public
as $$
declare
  v_count integer;
begin
  if not public.is_platform_admin() then
    raise exception 'Yetkisiz erişim';
  end if;

  insert into public.notifications (user_id, title, body, type, link)
  select u.id, p_title, p_body, 'announcement', p_link
    from auth.users u
    where not exists (
      select 1 from public.platform_admins pa where pa.user_id = u.id
    );

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- ============================================================
-- Otomatik bildirim — sipariş 'paid' (ayrı AFTER trigger)
-- ============================================================
create or replace function public.notify_order_paid()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'paid' and (old.status is distinct from 'paid') then
    insert into public.notifications (user_id, title, body, type, link)
    values (
      new.user_id,
      'Siparişiniz onaylandı',
      'Ödemeniz alındı; lisans ve faturanız hesabınızda hazır.',
      'order',
      '/panel/lisanslarim'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_order_paid_notify on public.orders;
create trigger on_order_paid_notify
  after update of status on public.orders
  for each row execute function public.notify_order_paid();

-- ============================================================
-- Otomatik bildirim — yenileme 'paid' (ayrı AFTER trigger)
-- ============================================================
create or replace function public.notify_renewal_paid()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status = 'paid' and (old.status is distinct from 'paid') then
    insert into public.notifications (user_id, title, body, type, link)
    values (
      new.user_id,
      'Yenilemeniz tamamlandı',
      'Lisansınızın süresi uzatıldı. Yeni bitiş tarihini panelinizden görebilirsiniz.',
      'renewal',
      '/panel/lisanslarim'
    );
  end if;
  return new;
end;
$$;

drop trigger if exists on_renewal_paid_notify on public.renewals;
create trigger on_renewal_paid_notify
  after update of status on public.renewals
  for each row execute function public.notify_renewal_paid();
