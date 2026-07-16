-- ============================================================
-- Aserai - Operasyon ekranlari tamamlama
-- 0020 sonrasinda calistirilir.
-- Kapsam: fatura PDF/e-fatura durumlari, odeme kayitlari, API anahtarlari,
-- destek ekleri, sistem ayarlari, rol/yetki ve islem loglari.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- Fatura PDF ve e-fatura durum alanlari ----------
alter table public.invoices
  add column if not exists pdf_url text,
  add column if not exists e_invoice_status text not null default 'not_sent'
    check (e_invoice_status in ('not_sent', 'queued', 'sent', 'accepted', 'rejected', 'cancelled')),
  add column if not exists e_invoice_uuid text,
  add column if not exists e_invoice_error text,
  add column if not exists e_invoice_updated_at timestamptz;

alter table public.invoices
  drop constraint if exists invoices_pdf_url_https;
alter table public.invoices
  add constraint invoices_pdf_url_https
  check (pdf_url is null or pdf_url ~ '^https://[^[:space:]]+$') not valid;

alter table public.licenses
  add column if not exists activation_note text;

create or replace function public.admin_update_invoice_ops(
  p_invoice_id uuid,
  p_pdf_url text default null,
  p_e_invoice_status text default null,
  p_e_invoice_uuid text default null,
  p_e_invoice_error text default null
)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Yetkisiz erisim';
  end if;

  update public.invoices
     set pdf_url = nullif(btrim(coalesce(p_pdf_url, pdf_url, '')), ''),
         e_invoice_status = coalesce(nullif(p_e_invoice_status, ''), e_invoice_status),
         e_invoice_uuid = nullif(btrim(coalesce(p_e_invoice_uuid, e_invoice_uuid, '')), ''),
         e_invoice_error = nullif(btrim(coalesce(p_e_invoice_error, e_invoice_error, '')), ''),
         e_invoice_updated_at = now()
   where id = p_invoice_id;

  if not found then
    raise exception 'Fatura bulunamadi';
  end if;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, details)
  values (
    auth.uid(), 'invoice.ops_update', 'invoice', p_invoice_id,
    jsonb_build_object('status', p_e_invoice_status)
  );
end;
$$;

-- ---------- Odeme kayitlari ----------
create table if not exists public.payments (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid references public.orders (id) on delete cascade,
  renewal_id     uuid references public.renewals (id) on delete cascade,
  user_id        uuid not null references auth.users (id) on delete cascade,
  tenant_id      uuid references public.tenants (id) on delete set null,
  amount         numeric(12, 2) not null default 0,
  method         text not null default 'havale',
  status         text not null default 'pending'
                   check (status in ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  provider       text not null default 'manual',
  provider_ref   text,
  paid_at        timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint payments_one_source
    check ((order_id is not null)::int + (renewal_id is not null)::int = 1)
);

drop index if exists public.uq_payments_order;
drop index if exists public.uq_payments_renewal;
create unique index if not exists uq_payments_order
  on public.payments (order_id);
create unique index if not exists uq_payments_renewal
  on public.payments (renewal_id);
create index if not exists idx_payments_user_created
  on public.payments (user_id, created_at desc);

alter table public.payments enable row level security;

drop policy if exists "payments_select_own" on public.payments;
create policy "payments_select_own"
  on public.payments for select
  using (user_id = auth.uid());

drop policy if exists "payments_admin_all" on public.payments;
create policy "payments_admin_all"
  on public.payments for all
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create or replace function public.sync_order_payment()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.payments (
    order_id, user_id, tenant_id, amount, method, status, provider, paid_at
  )
  values (
    new.id, new.user_id, new.tenant_id, coalesce(new.total, 0),
    coalesce(nullif(new.payment_method, ''), 'havale'),
    case new.status
      when 'paid' then 'paid'
      when 'cancelled' then 'cancelled'
      else 'pending'
    end,
    'manual',
    case when new.status = 'paid' then now() else null end
  )
  on conflict (order_id) do update
     set amount = excluded.amount,
         method = excluded.method,
         status = excluded.status,
         paid_at = case
           when excluded.status = 'paid' and public.payments.paid_at is null then now()
           when excluded.status <> 'paid' then null
           else public.payments.paid_at
         end,
         updated_at = now();

  return new;
end;
$$;

drop trigger if exists sync_order_payment on public.orders;
create trigger sync_order_payment
  after insert or update of status, total, payment_method on public.orders
  for each row execute function public.sync_order_payment();

create or replace function public.sync_renewal_payment()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.payments (
    renewal_id, user_id, tenant_id, amount, method, status, provider, paid_at
  )
  values (
    new.id, new.user_id, new.tenant_id, coalesce(new.amount, 0),
    'havale',
    case new.status
      when 'paid' then 'paid'
      when 'cancelled' then 'cancelled'
      else 'pending'
    end,
    'manual',
    new.paid_at
  )
  on conflict (renewal_id) do update
     set amount = excluded.amount,
         status = excluded.status,
         paid_at = excluded.paid_at,
         updated_at = now();

  return new;
end;
$$;

drop trigger if exists sync_renewal_payment on public.renewals;
create trigger sync_renewal_payment
  after insert or update of status, amount on public.renewals
  for each row execute function public.sync_renewal_payment();

insert into public.payments (
  order_id, user_id, tenant_id, amount, method, status, provider, paid_at, created_at
)
select
  o.id, o.user_id, o.tenant_id, coalesce(o.total, 0),
  coalesce(nullif(o.payment_method, ''), 'havale'),
  case o.status when 'paid' then 'paid' when 'cancelled' then 'cancelled' else 'pending' end,
  'manual',
  case when o.status = 'paid' then o.created_at else null end,
  o.created_at
from public.orders o
on conflict (order_id) do nothing;

insert into public.payments (
  renewal_id, user_id, tenant_id, amount, method, status, provider, paid_at, created_at
)
select
  r.id, r.user_id, r.tenant_id, coalesce(r.amount, 0),
  'havale',
  case r.status when 'paid' then 'paid' when 'cancelled' then 'cancelled' else 'pending' end,
  'manual',
  r.paid_at,
  r.created_at
from public.renewals r
on conflict (renewal_id) do nothing;

create or replace function public.admin_update_payment(
  p_payment_id uuid,
  p_status text,
  p_provider_ref text default null
)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_payment public.payments%rowtype;
begin
  if not public.is_platform_admin() then
    raise exception 'Yetkisiz erisim';
  end if;

  select * into v_payment from public.payments where id = p_payment_id for update;
  if not found then
    raise exception 'Odeme kaydi bulunamadi';
  end if;

  update public.payments
     set status = p_status,
         provider_ref = nullif(btrim(coalesce(p_provider_ref, provider_ref, '')), ''),
         paid_at = case when p_status = 'paid' then coalesce(paid_at, now()) else paid_at end,
         updated_at = now()
   where id = p_payment_id;

  if v_payment.order_id is not null then
    update public.orders
       set status = case
         when p_status = 'paid' then 'paid'
         when p_status = 'cancelled' then 'cancelled'
         else status
       end
     where id = v_payment.order_id;
  elsif v_payment.renewal_id is not null then
    update public.renewals
       set status = case
         when p_status = 'paid' then 'paid'
         when p_status = 'cancelled' then 'cancelled'
         else status
       end
     where id = v_payment.renewal_id;
  end if;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, details)
  values (
    auth.uid(), 'payment.status_update', 'payment', p_payment_id,
    jsonb_build_object('status', p_status, 'provider_ref', p_provider_ref)
  );
end;
$$;

-- ---------- API anahtarlari ----------
create table if not exists public.api_keys (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  tenant_id   uuid references public.tenants (id) on delete set null,
  name        text not null,
  key_prefix  text not null,
  key_hash    text not null unique,
  status      text not null default 'active' check (status in ('active', 'revoked')),
  last_used_at timestamptz,
  revoked_at  timestamptz,
  created_at  timestamptz not null default now()
);

alter table public.api_keys enable row level security;

drop policy if exists "api_keys_select_own" on public.api_keys;
create policy "api_keys_select_own"
  on public.api_keys for select
  using (user_id = auth.uid());

drop policy if exists "api_keys_admin_select" on public.api_keys;
create policy "api_keys_admin_select"
  on public.api_keys for select
  using (public.is_platform_admin());

create or replace function public.create_api_key(p_name text, p_tenant_id uuid default null)
returns table(id uuid, api_key text, key_prefix text)
language plpgsql
security definer set search_path = public
as $$
declare
  v_raw text;
  v_prefix text;
  v_id uuid;
  v_name text := btrim(coalesce(p_name, ''));
begin
  if auth.uid() is null then
    raise exception 'Kimlik dogrulamasi gerekli';
  end if;
  if char_length(v_name) < 3 or char_length(v_name) > 80 then
    raise exception 'Anahtar adi 3-80 karakter arasinda olmalidir';
  end if;
  if p_tenant_id is not null and not exists (
    select 1 from public.tenant_users
    where tenant_id = p_tenant_id and user_id = auth.uid()
  ) then
    raise exception 'Bu firma icin yetkiniz yok';
  end if;

  v_raw := 'asr_' || encode(gen_random_bytes(24), 'hex');
  v_prefix := left(v_raw, 10);

  insert into public.api_keys (user_id, tenant_id, name, key_prefix, key_hash)
  values (auth.uid(), p_tenant_id, v_name, v_prefix, encode(digest(v_raw, 'sha256'), 'hex'))
  returning public.api_keys.id into v_id;

  return query select v_id, v_raw, v_prefix;
end;
$$;

create or replace function public.revoke_api_key(p_key_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Kimlik dogrulamasi gerekli';
  end if;

  update public.api_keys
     set status = 'revoked', revoked_at = now()
   where id = p_key_id
     and (user_id = auth.uid() or public.is_platform_admin())
     and status = 'active';

  if not found then
    raise exception 'Aktif API anahtari bulunamadi';
  end if;
end;
$$;

-- ---------- Destek ekleri ----------
create table if not exists public.support_attachments (
  id          uuid primary key default gen_random_uuid(),
  ticket_id   uuid not null references public.support_tickets (id) on delete cascade,
  message_id  uuid references public.ticket_messages (id) on delete set null,
  user_id     uuid not null references auth.users (id) on delete cascade,
  file_name   text not null,
  file_url    text not null,
  file_size   integer,
  mime_type   text,
  created_at  timestamptz not null default now()
);

alter table public.support_attachments
  drop constraint if exists support_attachments_file_url_https;
alter table public.support_attachments
  add constraint support_attachments_file_url_https
  check (file_url ~ '^https://[^[:space:]]+$') not valid;

alter table public.support_attachments enable row level security;

drop policy if exists "support_attachments_select_own" on public.support_attachments;
create policy "support_attachments_select_own"
  on public.support_attachments for select
  using (
    public.is_platform_admin()
    or exists (
      select 1 from public.support_tickets t
      where t.id = ticket_id and t.user_id = auth.uid()
    )
  );

create or replace function public.register_support_attachment(
  p_ticket_id uuid,
  p_message_id uuid,
  p_file_name text,
  p_file_url text,
  p_file_size integer,
  p_mime_type text
)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Kimlik dogrulamasi gerekli';
  end if;
  if not public.is_platform_admin() and not exists (
    select 1 from public.support_tickets
    where id = p_ticket_id and user_id = auth.uid()
  ) then
    raise exception 'Destek talebi bulunamadi';
  end if;

  insert into public.support_attachments (
    ticket_id, message_id, user_id, file_name, file_url, file_size, mime_type
  )
  values (
    p_ticket_id, p_message_id, auth.uid(), left(btrim(p_file_name), 180),
    p_file_url, p_file_size, p_mime_type
  )
  returning id into v_id;

  return v_id;
end;
$$;

-- ---------- Sistem ayarlari ----------
create table if not exists public.system_settings (
  key         text primary key,
  value       jsonb not null default '{}'::jsonb,
  updated_by  uuid references auth.users (id) on delete set null,
  updated_at  timestamptz not null default now()
);

alter table public.system_settings enable row level security;

drop policy if exists "system_settings_admin_all" on public.system_settings;
create policy "system_settings_admin_all"
  on public.system_settings for all
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create or replace function public.admin_upsert_system_setting(p_key text, p_value jsonb)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Yetkisiz erisim';
  end if;

  insert into public.system_settings (key, value, updated_by)
  values (p_key, coalesce(p_value, '{}'::jsonb), auth.uid())
  on conflict (key) do update
     set value = excluded.value,
         updated_by = auth.uid(),
         updated_at = now();

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, details)
  values (
    auth.uid(), 'settings.upsert', 'system_setting', null,
    jsonb_build_object('key', p_key)
  );
end;
$$;

-- ---------- Rol, yetki ve loglar ----------
create table if not exists public.roles (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  description text,
  is_system   boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists public.permissions (
  id          uuid primary key default gen_random_uuid(),
  code        text not null unique,
  description text
);

create table if not exists public.role_permissions (
  role_id       uuid not null references public.roles (id) on delete cascade,
  permission_id uuid not null references public.permissions (id) on delete cascade,
  primary key (role_id, permission_id)
);

create table if not exists public.user_roles (
  user_id     uuid not null references auth.users (id) on delete cascade,
  role_id     uuid not null references public.roles (id) on delete cascade,
  assigned_by uuid references auth.users (id) on delete set null,
  assigned_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

create table if not exists public.audit_logs (
  id          uuid primary key default gen_random_uuid(),
  actor_id    uuid references auth.users (id) on delete set null,
  action      text not null,
  entity_type text,
  entity_id   uuid,
  details     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "roles_admin_all" on public.roles;
create policy "roles_admin_all" on public.roles
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());
drop policy if exists "permissions_admin_all" on public.permissions;
create policy "permissions_admin_all" on public.permissions
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());
drop policy if exists "role_permissions_admin_all" on public.role_permissions;
create policy "role_permissions_admin_all" on public.role_permissions
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());
drop policy if exists "user_roles_admin_all" on public.user_roles;
create policy "user_roles_admin_all" on public.user_roles
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());
drop policy if exists "audit_logs_admin_select" on public.audit_logs;
create policy "audit_logs_admin_select" on public.audit_logs
  for select using (public.is_platform_admin());

insert into public.permissions (code, description) values
  ('orders.manage', 'Siparisleri goruntuleme ve durum guncelleme'),
  ('licenses.manage', 'Lisanslari guncelleme ve iptal etme'),
  ('invoices.manage', 'Fatura ve e-fatura durumlarini yonetme'),
  ('payments.manage', 'Odeme kayitlarini yonetme'),
  ('support.manage', 'Destek taleplerini yanitlama ve kapatma'),
  ('settings.manage', 'Sistem ayarlarini guncelleme'),
  ('roles.manage', 'Rol ve yetki atamalarini yonetme'),
  ('cms.manage', 'Icerik yonetimi')
on conflict (code) do nothing;

insert into public.roles (name, description, is_system)
values ('Platform Admin', 'Tum yonetim paneli yetkilerine sahip sistem rolu.', true)
on conflict (name) do nothing;

insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'Platform Admin'
on conflict do nothing;

-- Mevcut platform adminlerini role de bagla.
insert into public.user_roles (user_id, role_id)
select pa.user_id, r.id
from public.platform_admins pa
join public.roles r on r.name = 'Platform Admin'
on conflict do nothing;

-- ---------- Storage bucket'lari ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('invoice-pdfs', 'invoice-pdfs', true, 10485760, array['application/pdf']::text[]),
  (
    'support-attachments',
    'support-attachments',
    true,
    10485760,
    array[
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'text/plain'
    ]::text[]
  )
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "invoice_pdfs_public_read" on storage.objects;
create policy "invoice_pdfs_public_read"
  on storage.objects for select
  using (bucket_id = 'invoice-pdfs');

drop policy if exists "invoice_pdfs_admin_write" on storage.objects;
create policy "invoice_pdfs_admin_write"
  on storage.objects for insert
  with check (bucket_id = 'invoice-pdfs' and public.is_platform_admin());

drop policy if exists "invoice_pdfs_admin_update" on storage.objects;
create policy "invoice_pdfs_admin_update"
  on storage.objects for update
  using (bucket_id = 'invoice-pdfs' and public.is_platform_admin())
  with check (bucket_id = 'invoice-pdfs' and public.is_platform_admin());

drop policy if exists "support_attachments_public_read" on storage.objects;
create policy "support_attachments_public_read"
  on storage.objects for select
  using (bucket_id = 'support-attachments');

drop policy if exists "support_attachments_authenticated_insert" on storage.objects;
create policy "support_attachments_authenticated_insert"
  on storage.objects for insert
  with check (bucket_id = 'support-attachments' and auth.uid() is not null);

revoke all on function public.admin_update_invoice_ops(uuid, text, text, text, text) from public, anon;
revoke all on function public.admin_update_payment(uuid, text, text) from public, anon;
revoke all on function public.create_api_key(text, uuid) from public, anon;
revoke all on function public.revoke_api_key(uuid) from public, anon;
revoke all on function public.register_support_attachment(uuid, uuid, text, text, integer, text) from public, anon;
revoke all on function public.admin_upsert_system_setting(text, jsonb) from public, anon;

grant execute on function public.admin_update_invoice_ops(uuid, text, text, text, text) to authenticated;
grant execute on function public.admin_update_payment(uuid, text, text) to authenticated;
grant execute on function public.create_api_key(text, uuid) to authenticated;
grant execute on function public.revoke_api_key(uuid) to authenticated;
grant execute on function public.register_support_attachment(uuid, uuid, text, text, integer, text) to authenticated;
grant execute on function public.admin_upsert_system_setting(text, jsonb) to authenticated;
