-- ============================================================
-- Aserai - Musterinin paket lisansini dogrudan iptal etmesi
-- 0016 sonrasinda calistirilir.
--
-- Kayitlar silinmez. Paket, bagli modul lisanslari, bekleyen modul
-- siparisleri ve bekleyen yenilemeler iptal durumuna alinir.
-- ============================================================

alter table public.licenses
  add column if not exists cancelled_at timestamptz;

alter table public.licenses
  add column if not exists cancelled_by uuid
    references auth.users (id) on delete set null;

-- Bir paket iptal edilirken paralel bir modul siparisinin acilmasini veya
-- iptal edilen pakete ait siparisin sonradan odendi yapilmasini engeller.
create or replace function public.enforce_active_parent_license_order()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status public.licenses.status%type;
  v_expires_at timestamptz;
begin
  if new.parent_license_id is null
     or new.status not in ('pending', 'paid') then
    return new;
  end if;

  select status, expires_at
    into v_status, v_expires_at
    from public.licenses
    where id = new.parent_license_id
      and coalesce(license_type, 'package') = 'package'
    for share;

  if not found then
    raise exception 'Paket lisansi bulunamadi';
  end if;

  if v_status <> 'active' or v_expires_at < now() then
    raise exception 'Aktif olmayan paket lisansi icin modul siparisi islenemez';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_active_parent_license_order on public.orders;
create trigger enforce_active_parent_license_order
  before insert or update of status, parent_license_id on public.orders
  for each row execute function public.enforce_active_parent_license_order();

-- Iptal edilmis lisans, eski bir admin ekranindan yenileme odendi yapilarak
-- yeniden etkinlestirilemez.
create or replace function public.block_cancelled_license_renewal_payment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status public.licenses.status%type;
begin
  if new.status <> 'paid' or old.status = 'paid' then
    return new;
  end if;

  select status into v_status
    from public.licenses
    where id = new.license_id
    for share;

  if not found then
    raise exception 'Lisans bulunamadi';
  end if;

  if v_status = 'cancelled' then
    raise exception 'Iptal edilmis lisans icin yenileme odemesi islenemez';
  end if;

  return new;
end;
$$;

drop trigger if exists block_cancelled_license_renewal_payment
  on public.renewals;
create trigger block_cancelled_license_renewal_payment
  before update of status on public.renewals
  for each row execute function public.block_cancelled_license_renewal_payment();

-- Yalnizca lisansin sahibi olan musteri cagirabilir. Adminler bu musteri
-- islemini kullanamaz; admin lisans yonetimi ayri bir akistir.
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

  -- Yenileme odeme tetigi de once renewal, sonra license satirini kilitler.
  -- Ayni kilit sirasi, paralel iptal/odeme islemlerindeki deadlock riskini azaltir.
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

  if v_license.status = 'cancelled' then
    return v_license.id;
  end if;

  if v_license.status <> 'active' or v_license.expires_at < now() then
    raise exception 'Yalnizca aktif paket lisansi iptal edilebilir';
  end if;

  update public.licenses
    set status = 'cancelled',
        cancelled_at = now(),
        cancelled_by = auth.uid()
    where (id = v_license.id or parent_license_id = v_license.id)
      and status <> 'cancelled';

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
    'Paket lisansiniz iptal edildi',
    'Paketiniz ve pakete bagli aktif modul lisanslari kullanima kapatildi.',
    'system',
    '/panel/lisanslarim'
  );

  return v_license.id;
end;
$$;

revoke all on function public.cancel_customer_license(uuid)
  from public, anon;
grant execute on function public.cancel_customer_license(uuid)
  to authenticated;

revoke all on function public.enforce_active_parent_license_order()
  from public, anon, authenticated;
revoke all on function public.block_cancelled_license_renewal_payment()
  from public, anon, authenticated;
