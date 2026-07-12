-- ============================================================
-- Aserai — Faz 1: Kimlik & Üyelik şeması
-- Supabase SQL Editor'de (veya CLI ile) çalıştırın.
-- Auth (kayıt/giriş/doğrulama/2FA) Supabase Auth tarafından yönetilir;
-- bu şema profil, tenant (müşteri firma) ve üyelik/rol yapısını kurar.
-- ============================================================

-- ---------- profiles: her auth kullanıcısının 1-1 profili ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  phone       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- tenants: müşteri firma ----------
create table if not exists public.tenants (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  owner_id    uuid not null references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- ---------- tenant_users: firma üyelikleri + rol ----------
create table if not exists public.tenant_users (
  tenant_id   uuid not null references public.tenants (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  role        text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at  timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

-- ============================================================
-- Yeni kullanıcı kaydında profili otomatik oluştur
-- (kayıt sırasında verilen full_name / phone meta verisinden)
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Güvenli tenant oluşturma (kayıt sonrası firma oluşturma)
-- RLS insert karmaşasını önlemek için security definer RPC.
-- Frontend: supabase.rpc('create_tenant', { tenant_name })
-- ============================================================
create or replace function public.create_tenant(tenant_name text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  new_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Kimlik doğrulaması gerekli';
  end if;

  insert into public.tenants (name, owner_id)
  values (tenant_name, auth.uid())
  returning id into new_id;

  insert into public.tenant_users (tenant_id, user_id, role)
  values (new_id, auth.uid(), 'owner');

  return new_id;
end;
$$;

-- ============================================================
-- RLS (satır bazlı güvenlik)
-- ============================================================
alter table public.profiles     enable row level security;
alter table public.tenants      enable row level security;
alter table public.tenant_users enable row level security;

-- profiles: kullanıcı yalnızca kendi profilini görür/günceller
create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- tenant_users: kullanıcı yalnızca kendi üyeliklerini görür (özyineleme yok)
create policy "tenant_users_select_own"
  on public.tenant_users for select
  using (user_id = auth.uid());

-- tenants: kullanıcı üyesi olduğu firmaları görür
create policy "tenants_select_member"
  on public.tenants for select
  using (
    id in (select tenant_id from public.tenant_users where user_id = auth.uid())
  );

-- tenants: yalnızca sahip güncelleyebilir
create policy "tenants_update_owner"
  on public.tenants for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());
