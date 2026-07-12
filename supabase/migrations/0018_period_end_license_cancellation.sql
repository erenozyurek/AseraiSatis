-- ============================================================
-- Aserai - Paket iptalini mevcut fatura donemi sonuna planlama
-- 0017 sonrasinda calistirilir.
--
-- Musteri iptal istediginde lisans hemen kapanmaz. Paket ve bagli
-- moduller expires_at tarihine kadar aktif kalir; yeni doneme yenilenmez.
-- ============================================================

alter table public.licenses
  add column if not exists cancelled_at timestamptz;

alter table public.licenses
  add column if not exists cancelled_by uuid
    references auth.users (id) on delete set null;

alter table public.licenses
  add column if not exists cancel_at_period_end boolean not null default false;

alter table public.licenses
  add column if not exists cancellation_requested_at timestamptz;

alter table public.licenses
  add column if not exists cancellation_effective_at timestamptz;

create index if not exists idx_licenses_period_end_cancellation
  on public.licenses (cancellation_effective_at)
  where cancel_at_period_end = true and status = 'active';

-- 0017'nin ilk surumuyle hemen iptal edilmis, ancak donemi bitmemis musteri
-- lisanslarini yeni urun kararina gore donem sonuna kadar yeniden etkinlestir.
with restored_packages as (
  update public.licenses
    set status = 'active',
        cancel_at_period_end = true,
        cancellation_requested_at = coalesce(cancelled_at, now()),
        cancellation_effective_at = expires_at,
        cancelled_at = null
    where status = 'cancelled'
      and coalesce(license_type, 'package') = 'package'
      and cancelled_at is not null
      and cancelled_by = user_id
      and expires_at > now()
    returning id, expires_at, cancellation_requested_at, cancelled_by
)
update public.licenses child
  set status = 'active',
      cancel_at_period_end = true,
      cancellation_requested_at = parent.cancellation_requested_at,
      cancellation_effective_at = parent.expires_at,
      cancelled_at = null,
      cancelled_by = parent.cancelled_by
  from restored_packages parent
  where child.parent_license_id = parent.id
    and child.status = 'cancelled'
    and child.cancelled_at is not null
    and child.cancelled_by = parent.cancelled_by;

-- Planlanmis iptal bulunan pakete yeni modul siparisi acilamaz ve eski bir
-- bekleyen modul siparisi odendi durumuna getirilemez.
create or replace function public.enforce_active_parent_license_order()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status public.licenses.status%type;
  v_expires_at timestamptz;
  v_cancel_at_period_end boolean;
begin
  if new.parent_license_id is null
     or new.status not in ('pending', 'paid') then
    return new;
  end if;

  select status, expires_at, cancel_at_period_end
    into v_status, v_expires_at, v_cancel_at_period_end
    from public.licenses
    where id = new.parent_license_id
      and coalesce(license_type, 'package') = 'package'
    for share;

  if not found then
    raise exception 'Paket lisansi bulunamadi';
  end if;

  if v_status <> 'active'
     or v_expires_at < now()
     or v_cancel_at_period_end then
    raise exception 'Iptali planlanmis veya aktif olmayan paket icin modul siparisi islenemez';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_active_parent_license_order on public.orders;
create trigger enforce_active_parent_license_order
  before insert or update of status, parent_license_id on public.orders
  for each row execute function public.enforce_active_parent_license_order();

-- Planlanmis iptal bulunan paket icin yeni yenileme acilmasini ve eski
-- yenilemenin sonradan odendi yapilmasini engeller.
create or replace function public.enforce_renewable_license()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status public.licenses.status%type;
  v_cancel_at_period_end boolean;
begin
  if new.status not in ('pending', 'paid') then
    return new;
  end if;

  select package.status, package.cancel_at_period_end
    into v_status, v_cancel_at_period_end
    from public.licenses license
    join public.licenses package
      on package.id = coalesce(license.parent_license_id, license.id)
    where license.id = new.license_id
    for share of package;

  if not found then
    raise exception 'Lisans bulunamadi';
  end if;

  if v_status = 'cancelled' or v_cancel_at_period_end then
    raise exception 'Iptal edilmis veya iptali planlanmis lisans yenilenemez';
  end if;

  return new;
end;
$$;

drop trigger if exists block_cancelled_license_renewal_payment
  on public.renewals;
drop trigger if exists enforce_renewable_license on public.renewals;
create trigger enforce_renewable_license
  before insert or update of status on public.renewals
  for each row execute function public.enforce_renewable_license();

-- Musterinin paket iptal talebini mevcut donemin bitis tarihine planlar.
create or replace function public.cancel_customer_license(p_license_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_license public.licenses%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Kimlik dogrulamasi gerekli';
  end if;

  if public.is_platform_admin() then
    raise exception 'Yonetim kullanicilari musteri lisans iptal islemini kullanamaz';
  end if;

  select * into v_license
    from public.licenses
    where id = p_license_id;

  if not found then
    raise exception 'Lisans bulunamadi';
  end if;

  if v_license.user_id <> auth.uid() then
    raise exception 'Bu lisans icin yetkiniz yok';
  end if;

  if coalesce(v_license.license_type, 'package') <> 'package' then
    raise exception 'Yalnizca paket lisansi iptal edilebilir';
  end if;

  perform 1
    from public.renewals
    where status = 'pending'
      and license_id in (
        select id
          from public.licenses
          where id = p_license_id or parent_license_id = p_license_id
      )
    order by id
    for update;

  select * into v_license
    from public.licenses
    where id = p_license_id
    for update;

  if v_license.user_id <> auth.uid()
     or coalesce(v_license.license_type, 'package') <> 'package' then
    raise exception 'Bu lisans icin yetkiniz yok';
  end if;

  if v_license.cancel_at_period_end then
    return v_license.id;
  end if;

  if v_license.status <> 'active' or v_license.expires_at <= now() then
    raise exception 'Yalnizca aktif paket lisansi icin iptal planlanabilir';
  end if;

  update public.licenses
    set cancel_at_period_end = true,
        cancellation_requested_at = now(),
        cancellation_effective_at = v_license.expires_at,
        cancelled_at = null,
        cancelled_by = auth.uid()
    where (id = v_license.id or parent_license_id = v_license.id)
      and status = 'active';

  update public.orders
    set status = 'cancelled'
    where user_id = auth.uid()
      and parent_license_id = v_license.id
      and status = 'pending';

  update public.renewals
    set status = 'cancelled'
    where user_id = auth.uid()
      and status = 'pending'
      and license_id in (
        select id
          from public.licenses
          where id = v_license.id or parent_license_id = v_license.id
      );

  insert into public.notifications (user_id, title, body, type, link)
  values (
    auth.uid(),
    'Paket iptaliniz planlandi',
    'Paketiniz ve bagli moduller mevcut donem sonuna kadar aktif kalacak; yeni donemde yenilenmeyecek.',
    'system',
    '/panel/lisanslarim'
  );

  return v_license.id;
end;
$$;

-- Donemi dolan planli iptalleri, musteri paneli lisanslari yenilerken
-- gercek cancelled durumuna tasir.
create or replace function public.finalize_due_customer_cancellations()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  if auth.uid() is null then
    raise exception 'Kimlik dogrulamasi gerekli';
  end if;

  update public.licenses
    set status = 'cancelled',
        cancelled_at = coalesce(cancelled_at, now())
    where user_id = auth.uid()
      and status = 'active'
      and cancel_at_period_end = true
      and cancellation_effective_at <= now();

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function public.cancel_customer_license(uuid)
  from public, anon;
revoke all on function public.finalize_due_customer_cancellations()
  from public, anon;
grant execute on function public.cancel_customer_license(uuid)
  to authenticated;
grant execute on function public.finalize_due_customer_cancellations()
  to authenticated;

revoke all on function public.enforce_active_parent_license_order()
  from public, anon, authenticated;
revoke all on function public.enforce_renewable_license()
  from public, anon, authenticated;
