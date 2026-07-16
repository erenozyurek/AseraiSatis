-- ============================================================
-- Aserai — Faz 9: Yenileme Yönetimi (M + D7)
-- Supabase SQL Editor'de çalıştırın (0008_licenses_invoices.sql sonrası).
--
-- Akış:
--   • Müşteri, süresi yaklaşan/dolan lisansı için yenileme talebi oluşturur
--     (request_renewal RPC → renewals 'pending').
--   • Admin talebi onaylar (renewals.status = 'paid') → trigger lisansın
--     expires_at'ini uzatır (kalan süreyi yakmadan) + yenileme faturası üretir.
--   • Faturalar 0008'deki invoices tablosuna düşer; "Faturalarım"da görünür.
-- 0008'in orders/invoices trigger'larına DOKUNULMAZ.
-- ============================================================

-- ---------- renewals: lisans yenileme talepleri/geçmişi ----------
create table if not exists public.renewals (
  id                  uuid primary key default gen_random_uuid(),
  license_id          uuid not null references public.licenses (id) on delete cascade,
  user_id             uuid not null references auth.users (id) on delete cascade,
  tenant_id           uuid references public.tenants (id) on delete set null,
  billing_period      text not null check (billing_period in ('monthly', 'yearly')),
  amount              numeric(12, 2) not null default 0,
  status              text not null default 'pending'
                        check (status in ('pending', 'paid', 'cancelled')),
  previous_expires_at timestamptz,
  new_expires_at      timestamptz,
  paid_at             timestamptz,
  created_at          timestamptz not null default now()
);

create index if not exists idx_renewals_user on public.renewals (user_id);
create index if not exists idx_renewals_license on public.renewals (license_id);

-- Bir lisans için aynı anda yalnızca bir bekleyen yenileme olabilir.
create unique index if not exists uq_renewals_one_pending
  on public.renewals (license_id)
  where status = 'pending';

-- ---------- invoices: yenileme faturalarını destekle ----------
-- Yenileme faturaları bir siparişe bağlı değildir; order_id opsiyonel olur,
-- renewal_id eklenir, product görüntüleme için tutulur.
alter table public.invoices alter column order_id drop not null;
alter table public.invoices
  add column if not exists renewal_id uuid references public.renewals (id) on delete set null;
alter table public.invoices
  add column if not exists product text;

-- ============================================================
-- RLS — kullanıcı yalnızca kendi yenilemelerini görür; admin hepsini.
-- (INSERT security-definer RPC ile yapılır; ayrı insert policy gerekmez.)
-- ============================================================
alter table public.renewals enable row level security;

create policy "renewals_select_own"
  on public.renewals for select
  using (user_id = auth.uid());

create policy "renewals_admin_all" on public.renewals
  for all using (public.is_platform_admin())
  with check (public.is_platform_admin());

-- ============================================================
-- Yenileme talebi oluştur (müşteri veya admin)
-- Tutar, lisansın kaynaklandığı siparişin toplamından alınır.
-- Bekleyen talep varsa onun id'si döner (idempotent).
-- ============================================================
create or replace function public.request_renewal(p_license_id uuid)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_lic      public.licenses%rowtype;
  v_total    numeric(12, 2);
  v_existing uuid;
  v_id       uuid;
begin
  if auth.uid() is null then
    raise exception 'Kimlik doğrulaması gerekli';
  end if;

  select * into v_lic from public.licenses where id = p_license_id;
  if not found then
    raise exception 'Lisans bulunamadı';
  end if;

  if v_lic.user_id <> auth.uid() and not public.is_platform_admin() then
    raise exception 'Bu lisans için yetkiniz yok';
  end if;

  if v_lic.status = 'cancelled' then
    raise exception 'İptal edilmiş lisans yenilenemez';
  end if;

  -- Zaten bekleyen bir talep varsa onu döndür
  select id into v_existing
    from public.renewals
    where license_id = p_license_id and status = 'pending'
    limit 1;
  if v_existing is not null then
    return v_existing;
  end if;

  select total into v_total
    from public.orders where id = v_lic.order_id;

  insert into public.renewals (
    license_id, user_id, tenant_id, billing_period, amount,
    status, previous_expires_at
  )
  values (
    v_lic.id, v_lic.user_id, v_lic.tenant_id, v_lic.billing_period,
    coalesce(v_total, 0), 'pending', v_lic.expires_at
  )
  returning id into v_id;

  return v_id;
end;
$$;

-- ============================================================
-- Yenileme 'paid' olunca lisansı uzat + fatura üret (BEFORE UPDATE).
-- Kalan süre yakılmaz: yeni bitiş = max(mevcut bitiş, now) + dönem.
-- ============================================================
create or replace function public.handle_renewal_paid()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_cur     timestamptz;
  v_product text;
  v_base    timestamptz;
  v_new     timestamptz;
begin
  if new.status = 'paid' and (old.status is distinct from 'paid') then
    select expires_at, product into v_cur, v_product
      from public.licenses where id = new.license_id;

    v_base := greatest(coalesce(v_cur, now()), now());
    v_new := v_base + case new.billing_period
                        when 'yearly' then interval '1 year'
                        else interval '1 month'
                      end;

    update public.licenses
      set expires_at = v_new, status = 'active'
      where id = new.license_id;

    new.new_expires_at := v_new;
    new.paid_at := now();

    insert into public.invoices (
      renewal_id, user_id, tenant_id, number, amount,
      billing_period, status, issued_at, product
    )
    values (
      new.id, new.user_id, new.tenant_id,
      'ASR-' || to_char(now(), 'YYYY') || '-'
        || lpad(nextval('public.invoice_seq')::text, 6, '0'),
      new.amount, new.billing_period, 'paid', now(),
      coalesce(v_product, 'Yenileme')
    );
  end if;

  return new;
end;
$$;

drop trigger if exists on_renewal_paid on public.renewals;
create trigger on_renewal_paid
  before update of status on public.renewals
  for each row execute function public.handle_renewal_paid();
