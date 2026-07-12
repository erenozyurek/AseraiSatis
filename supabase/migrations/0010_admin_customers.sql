-- ============================================================
-- Aserai — Faz 10: Tenant / Müşteri Yönetimi (E)
-- Supabase SQL Editor'de çalıştırın.
--
-- Amaç: Admin'in kayıtlı müşterileri (auth.users) + profil + firma
-- bilgisiyle listeleyebilmesi. E-posta auth.users'ta olduğu ve tabloyla
-- erişilemediği için READ-ONLY, admin-guard'lı bir RPC ile okunur.
-- Mevcut auth/RLS politikaları DEĞİŞTİRİLMEZ; yalnızca yeni fonksiyon eklenir.
-- ============================================================

create or replace function public.admin_list_customers()
returns table (
  user_id    uuid,
  email      text,
  full_name  text,
  phone      text,
  companies  text,
  created_at timestamptz
)
language plpgsql
security definer set search_path = public
as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Yetkisiz erişim';
  end if;

  return query
    select
      u.id,
      u.email::text,
      p.full_name,
      p.phone,
      (select string_agg(t.name, ', ' order by t.created_at)
         from public.tenants t
         where t.owner_id = u.id),
      u.created_at
    from auth.users u
    left join public.profiles p on p.id = u.id
    where not exists (
      select 1 from public.platform_admins pa where pa.user_id = u.id
    )
    order by u.created_at desc;
end;
$$;
