-- ============================================================
-- Aserai — Tüm Özellikler sayfası (kategoriler + özellik kartları, inline düzenleme)
-- ============================================================

create table if not exists public.feature_categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  description text,
  sort_order  integer not null default 0,
  updated_at  timestamptz not null default now()
);

create table if not exists public.feature_items (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid not null references public.feature_categories (id) on delete cascade,
  title        text not null,
  description  text,
  icon_path    text,
  sort_order   integer not null default 0,
  is_active    boolean not null default true,
  updated_at   timestamptz not null default now()
);

create index if not exists idx_feature_items_cat on public.feature_items (category_id);

-- RLS
alter table public.feature_categories enable row level security;
alter table public.feature_items enable row level security;

create policy "feature_categories_select_public" on public.feature_categories
  for select using (true);
create policy "feature_categories_admin_all" on public.feature_categories
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());

create policy "feature_items_select_public" on public.feature_items
  for select using (is_active or public.is_platform_admin());
create policy "feature_items_admin_all" on public.feature_items
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());

-- ============================================================
-- Seed — kategoriler
-- ============================================================
insert into public.feature_categories (slug, title, description, sort_order) values
('yapay-zeka', 'Yapay Zeka & Otomasyon', 'Yapay zeka destekli araçlarla içerik, öneri ve fiyatlandırma süreçlerinizi otomatikleştirin.', 1),
('urun-katalog', 'Ürün & Katalog Yönetimi', 'Sınırsız ürün, esnek varyant ve markanıza özel vitrinle katalogunuzu yönetin.', 2),
('satis-pazarlama', 'Satış & Pazarlama', 'SEO, kampanya senaryoları ve bayi araçlarıyla satışlarınızı büyütün.', 3),
('global-satis', 'Global Satış & Entegrasyon', 'Modüler entegrasyon, çoklu dil-döviz ve e-ihracat desteğiyle dünyaya açılın.', 4)
on conflict (slug) do nothing;

-- Seed — özellikler (kategori slug'ına göre)
insert into public.feature_items (category_id, title, description, icon_path, sort_order)
select c.id, x.title, x.description, x.icon_path, x.sort_order
from public.feature_categories c cross join (values
  ('AI Otomatik İçerik Çevirisi', 'Ürün açıklamalarınız tüm dillere otomatik ve doğru şekilde çevrilir.', 'M4 5h7M7 4c0 6-3 10-4 11m2-4c3 0 6 2 7 4M13 20l4-9 4 9m-7-3h6', 1),
  ('AI Otomatik Metin Oluşturma', 'Ürünleriniz için profesyonel açıklamalar ve tanıtım metinleri otomatik hazırlanır.', 'M4 6h16M4 10h16M4 14h10M4 18h7M18 14l3 3-5 2 2-5z', 2),
  ('AI Tabanlı Ürün Öneri Motoru', 'Müşterilere en çok ilgisini çekecek ürünleri akıllıca önererek satışları artırır.', 'M12 3l2.5 5 5.5.8-4 3.9 1 5.5-5-2.6-5 2.6 1-5.5-4-3.9 5.5-.8z', 3),
  ('Kullanıcı Davranışını Öğrenen Akıllı Filtreler', 'Müşterilerin alışveriş alışkanlıklarına göre kendini geliştirerek daha doğru filtreleme sunar.', 'M4 5h16l-6 7v6l-4 2v-8z', 4),
  ('Akıllı Fiyatlandırma Algoritması', 'Piyasayı analiz ederek ürünlerinize en uygun fiyatı otomatik belirler.', 'M12 3v18M8 7h6a2 2 0 010 4H9a2 2 0 000 4h7', 5)
) as x(title, description, icon_path, sort_order)
where c.slug = 'yapay-zeka';

insert into public.feature_items (category_id, title, description, icon_path, sort_order)
select c.id, x.title, x.description, x.icon_path, x.sort_order
from public.feature_categories c cross join (values
  ('Sınırsız Ürün Sayısı', 'Platforma istediğiniz kadar ürün ekleyebilir, herhangi bir sınırla karşılaşmazsınız.', 'M4 7l8-4 8 4-8 4zM4 7v10l8 4 8-4V7M12 11v10', 1),
  ('Özelleştirilebilir Tema / Katalog-Vitrin', 'Mağazanızın görünümünü kolayca değiştirerek tamamen markanıza uygun bir vitrin oluşturun.', 'M3 5h18v4H3zM3 11h10v8H3zM15 11h6v8h-6z', 2),
  ('Ürün Versiyonlama', 'Ürünün stok, fiyat gibi değişikliklerinin kaydının tutulması ve geçmişe erişim.', 'M4 12a8 8 0 0114-5M20 12a8 8 0 01-14 5M17 4v3h-3M7 20v-3h3', 3),
  ('Set Ürün Oluşturma / Ortak Stok', 'Set halinde ürün satışı ve satış başına ortak stok takibi yapabilirsiniz.', 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z', 4),
  ('Teklif ile Yayın Özelliği', 'Ürünlerinizi fiyat belirtmeden teklif al şeklinde yayınlayarak özel satış yapın.', 'M4 5h16v10H8l-4 4zM8 9h8M8 12h5', 5)
) as x(title, description, icon_path, sort_order)
where c.slug = 'urun-katalog';

insert into public.feature_items (category_id, title, description, icon_path, sort_order)
select c.id, x.title, x.description, x.icon_path, x.sort_order
from public.feature_categories c cross join (values
  ('Güçlü SEO Altyapısı', 'Siteniz arama motorlarında daha görünür olur ve daha fazla ziyaretçi çekersiniz.', 'M11 4a7 7 0 105 12 7 7 0 00-5-12zM21 21l-4.3-4.3', 1),
  ('Sepet Kampanya Senaryoları', 'Müşterilerin sepet davranışlarına göre otomatik kampanyalar oluşturabilirsiniz.', 'M3 4h2l2.4 12.4a1 1 0 001 .8h9.2a1 1 0 001-.8L21 8H6M9 21a1 1 0 100-2 1 1 0 000 2z', 2),
  ('Bayii Rolü', 'Üyeler Bayii rolüyle otomatik indirimli alışveriş yapabilir.', 'M16 20a4 4 0 00-8 0M12 12a4 4 0 100-8 4 4 0 000 8M20 20a3 3 0 00-4-2.8', 3),
  ('Otomatik Yeniden Sipariş Eşikleri', 'B2B satışlarda sipariş eşiklerinin yönetimi ve takibi sağlanır.', 'M4 4v16h16M8 16v-4M12 16V8M16 16v-6', 4)
) as x(title, description, icon_path, sort_order)
where c.slug = 'satis-pazarlama';

insert into public.feature_items (category_id, title, description, icon_path, sort_order)
select c.id, x.title, x.description, x.icon_path, x.sort_order
from public.feature_categories c cross join (values
  ('Modüler Entegrasyon Uyumu', 'Sisteminiz diğer yazılımlarla kolayca entegre olur ve birlikte sorunsuz çalışır.', 'M4 7h16M4 12h16M4 17h16M8 3v18M16 3v18', 1),
  ('Çoklu Dil & Çoklu Döviz Modülü', 'Mağazanızı farklı ülkelerde farklı dil ve para birimleriyle rahatça kullanın.', 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 3.8 6 3.8 9s-1.3 6.5-3.8 9', 2),
  ('E-İhracat Danışmanlığı', 'Yurtdışına satış yapmak isteyen işletmelere strateji, operasyon ve pazar desteği sağlanır.', 'M3 21h18M5 21V10l7-5 7 5v11M9 21v-5h6v5', 3),
  ('İlan Açma Haritalandırma Modülü', 'Lokasyon bazlı stoklar için haritalandırma ve harita üzerinde konum belirtme.', 'M12 21s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z', 4)
) as x(title, description, icon_path, sort_order)
where c.slug = 'global-satis';
