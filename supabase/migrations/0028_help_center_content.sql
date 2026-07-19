-- ============================================================
-- Aserai - Yardim Merkezi kategori icerikleri
-- Yardim sayfasindaki kategori bolumu admin kalem modu ile duzenlenebilir.
-- Blog ve Akademi iceriklerinden bagimsiz calisir.
-- ============================================================

create table if not exists public.help_settings (
  key                  text primary key,
  category_eyebrow     text not null default 'Kategoriler',
  category_title       text not null,
  category_description text,
  updated_at           timestamptz not null default now(),

  constraint help_settings_key_length
    check (char_length(btrim(key)) between 2 and 80),
  constraint help_settings_category_eyebrow_length
    check (char_length(btrim(category_eyebrow)) between 2 and 80),
  constraint help_settings_category_title_length
    check (char_length(btrim(category_title)) between 3 and 180),
  constraint help_settings_category_description_length
    check (
      category_description is null
      or char_length(btrim(category_description)) <= 600
    )
);

create table if not exists public.help_categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  description   text,
  icon_path     text not null,
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_by    uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint help_categories_slug_format
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) between 3 and 180),
  constraint help_categories_title_length
    check (char_length(btrim(title)) between 2 and 160),
  constraint help_categories_description_length
    check (description is null or char_length(btrim(description)) <= 600),
  constraint help_categories_icon_path_length
    check (char_length(btrim(icon_path)) between 5 and 2000)
);

create index if not exists idx_help_categories_public
  on public.help_categories (is_active, sort_order);

create or replace function public.set_help_center_audit_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.created_by := auth.uid();
    new.created_at := pg_catalog.now();
  else
    new.created_by := old.created_by;
    new.created_at := old.created_at;
  end if;

  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

revoke all on function public.set_help_center_audit_fields()
  from public, anon, authenticated;

drop trigger if exists set_help_center_audit_fields on public.help_categories;
create trigger set_help_center_audit_fields
before insert or update on public.help_categories
for each row execute function public.set_help_center_audit_fields();

alter table public.help_settings enable row level security;
alter table public.help_categories enable row level security;

drop policy if exists "help_settings_select_public" on public.help_settings;
drop policy if exists "help_settings_admin_all" on public.help_settings;
drop policy if exists "help_categories_select_public" on public.help_categories;
drop policy if exists "help_categories_admin_all" on public.help_categories;

create policy "help_settings_select_public"
  on public.help_settings for select
  to anon, authenticated
  using (true);

create policy "help_settings_admin_all"
  on public.help_settings for all
  to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "help_categories_select_public"
  on public.help_categories for select
  to anon, authenticated
  using (is_active or public.is_platform_admin());

create policy "help_categories_admin_all"
  on public.help_categories for all
  to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

revoke all on public.help_settings from anon, authenticated;
revoke all on public.help_categories from anon, authenticated;
grant select on public.help_settings to anon, authenticated;
grant select on public.help_categories to anon, authenticated;
grant insert, update, delete on public.help_settings to authenticated;
grant insert, update, delete on public.help_categories to authenticated;

insert into public.help_settings (
  key,
  category_eyebrow,
  category_title,
  category_description
)
values (
  'main',
  'Kategoriler',
  'Konu başlığına göre keşfedin',
  'İhtiyacınıza en uygun başlığı seçin, ilgili rehberlere ulaşın.'
)
on conflict (key) do nothing;

insert into public.help_categories (
  slug,
  title,
  description,
  icon_path,
  sort_order
)
values
  (
    'baslangic-rehberi',
    'Başlangıç Rehberi',
    'Hesap oluşturma, mağaza kurulumu ve ilk ürün yükleme adımları.',
    'M12 3l9 4-9 4-9-4 9-4zM3 12l9 4 9-4M3 17l9 4 9-4',
    1
  ),
  (
    'urun-stok',
    'Ürün & Stok',
    'Ürün ekleme, varyant yönetimi, toplu güncelleme ve stok takibi.',
    'M20 7l-8-4-8 4v10l8 4 8-4V7zM4 7l8 4 8-4M12 11v10',
    2
  ),
  (
    'siparis-kargo',
    'Sipariş & Kargo',
    'Sipariş yönetimi, kargo entegrasyonu ve teslimat süreçleri.',
    'M3 7h11v8H3zM14 10h4l3 3v2h-7zM7 19a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z',
    3
  ),
  (
    'odeme-fatura',
    'Ödeme & Fatura',
    'Sanal POS, ödeme yöntemleri, fatura ve abonelik işlemleri.',
    'M3 6h18v12H3zM3 10h18M7 15h4',
    4
  ),
  (
    'hesap-guvenlik',
    'Hesap & Güvenlik',
    'Profil ayarları, kullanıcı rolleri ve güvenlik seçenekleri.',
    'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
    5
  ),
  (
    'entegrasyonlar',
    'Entegrasyonlar',
    'Pazaryeri, ERP, muhasebe ve e-fatura entegrasyon ayarları.',
    'M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1',
    6
  )
on conflict (slug) do nothing;
