-- ============================================================
-- Aserai — Faz 4: Katalog (Paket & Modül Yönetimi)
-- Paketler ve ek modüller statik veriden DB'ye taşınır.
-- Public: aktif kayıtları okur. Admin: hepsini yönetir.
-- ============================================================

create table if not exists public.packages (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  name           text not null,
  summary        text,
  monthly        numeric(12, 2) not null default 0,
  yearly_monthly numeric(12, 2) not null default 0,
  highlight      boolean not null default false,
  badge          text,
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  updated_at     timestamptz not null default now()
);

create table if not exists public.modules (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text,
  monthly     numeric(12, 2) not null default 0,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- RLS: public aktifleri okur; admin hepsini yönetir
-- ============================================================
alter table public.packages enable row level security;
alter table public.modules  enable row level security;

create policy "packages_select_public" on public.packages
  for select using (is_active or public.is_platform_admin());
create policy "packages_admin_all" on public.packages
  for all using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "modules_select_public" on public.modules
  for select using (is_active or public.is_platform_admin());
create policy "modules_admin_all" on public.modules
  for all using (public.is_platform_admin())
  with check (public.is_platform_admin());

-- ============================================================
-- Seed — mevcut statik veriden
-- ============================================================
insert into public.packages (slug, name, summary, monthly, yearly_monthly, highlight, badge, sort_order)
values
  ('baslangic', 'Başlangıç', 'E-ticarete yeni başlayan işletmeler için ideal.', 790, 590, false, null, 1),
  ('standart', 'Standart', 'Büyüyen KOBİ’ler için en çok tercih edilen paket.', 1490, 1190, true, 'En popüler', 2),
  ('profesyonel', 'Profesyonel', 'Yüksek hacimli, büyük ölçekli işletmeler için.', 2990, 2390, false, null, 3),
  ('e-ihracat', 'E-İhracat', 'Yurt dışına satış yapmak isteyen markalar için.', 4990, 3990, false, null, 4)
on conflict (slug) do nothing;

insert into public.modules (slug, name, description, monthly, sort_order)
values
  ('e-fatura', 'E-Fatura & E-Arşiv', 'GİB entegrasyonuyla otomatik e-fatura/e-arşiv.', 249, 1),
  ('pazaryeri', 'Pazaryeri Entegrasyonu', 'Trendyol, Hepsiburada, Amazon ve daha fazlası.', 499, 2),
  ('muhasebe', 'Muhasebe Entegrasyonu', 'Satış ve faturaları muhasebe programınıza aktarın.', 299, 3),
  ('b2b', 'B2B Modülü', 'Bayi/toptan için özel fiyat listeleri ve cari hesap.', 399, 4),
  ('kampanya', 'Kampanya & Kupon Yönetimi', 'İndirim kuponları ve sepet kampanya senaryoları.', 199, 5),
  ('raporlama', 'Gelişmiş Raporlama & Analitik', 'Canlı ciro, dönüşüm ve kanal performans raporları.', 299, 6)
on conflict (slug) do nothing;
