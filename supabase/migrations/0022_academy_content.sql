-- ============================================================
-- Aserai — Akademi sayfası inline düzenleme mimarisi
-- Sağ üst kalem modu ile düzenlenen üst başlık, sol menü sayfaları,
-- alt başlıklar, metin blokları ve görseller bu tablolarda saklanır.
-- ============================================================

create table if not exists public.academy_settings (
  key         text primary key,
  eyebrow     text,
  title       text not null,
  description text,
  updated_at  timestamptz not null default now()
);

create table if not exists public.academy_pages (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid references public.academy_pages (id) on delete set null,
  slug        text not null unique,
  label       text not null,
  eyebrow     text,
  title       text not null,
  intro       text,
  image_url   text,
  content     jsonb not null default '{}'::jsonb,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  updated_at  timestamptz not null default now(),
  constraint academy_pages_content_object
    check (pg_catalog.jsonb_typeof(content) = 'object'),
  constraint academy_pages_not_own_parent
    check (parent_id is null or parent_id <> id)
);

alter table public.academy_pages
  add column if not exists parent_id uuid references public.academy_pages (id) on delete set null;

alter table public.academy_pages
  drop constraint if exists academy_pages_not_own_parent;

alter table public.academy_pages
  add constraint academy_pages_not_own_parent
  check (parent_id is null or parent_id <> id);

create index if not exists idx_academy_pages_parent_sort
  on public.academy_pages (parent_id, is_active, sort_order);
create index if not exists idx_academy_pages_sort
  on public.academy_pages (is_active, sort_order);

alter table public.academy_settings enable row level security;
alter table public.academy_pages enable row level security;

drop policy if exists "academy_settings_select_public" on public.academy_settings;
create policy "academy_settings_select_public" on public.academy_settings
  for select using (true);
drop policy if exists "academy_settings_admin_all" on public.academy_settings;
create policy "academy_settings_admin_all" on public.academy_settings
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());

drop policy if exists "academy_pages_select_public" on public.academy_pages;
create policy "academy_pages_select_public" on public.academy_pages
  for select using (true);
drop policy if exists "academy_pages_admin_all" on public.academy_pages;
create policy "academy_pages_admin_all" on public.academy_pages
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());

insert into public.academy_settings (key, eyebrow, title, description)
values (
  'main',
  'Aserai Akademi',
  'Aserai kullanım kılavuzu ve eğitim merkezi',
  'Kullanım adımları, sık sorulan sorular, yol haritası, video içerikleri ve hata çözüm rehberleri tek yerde.'
)
on conflict (key) do nothing;

insert into public.academy_pages
  (slug, label, eyebrow, title, intro, content, sort_order)
values
  (
    'kullanim-kilavuzu',
    'Kullanım Kılavuzu',
    'Başlangıç',
    'Aserai Kullanım Kılavuzu',
    'Aserai panelinde mağaza kurulumu, günlük operasyon ve yönetim ekranları için temel çalışma akışı.',
    '{"steps":["Hesabınızı oluşturun ve firma bilgilerinizi Profilim ekranından tamamlayın.","Paketinizi seçip ödeme talebinizi oluşturun; onay sonrası lisansınız panelde görünür.","Lisanslarım ekranından aktif paket, modül ve yenileme durumlarını takip edin.","Destek Taleplerim üzerinden sorularınızı ek dosyalarla birlikte iletin."],"notes":["Yönetim kullanıcıları müşteri gibi alışveriş yapamaz; yönetim panelinden operasyon yürütür.","Fatura ve ödeme kayıtları panelde ayrı ekranlardan izlenir."]}'::jsonb,
    1
  ),
  (
    'urun-yukleme',
    'Ürün Yükleme',
    'Katalog',
    'Ürün Yükleme Akışı',
    'Ürünlerinizi Aserai’ye tekil giriş, toplu dosya veya entegrasyon kaynaklarıyla hazırlamak için izlenecek temel adımlar.',
    '{"steps":["Ürün adını, açıklamasını ve kategori bilgisini netleştirin.","Fiyat, stok, KDV ve varyant alanlarını eksiksiz doldurun.","Görselleri aynı oran ve kaliteli dosyalarla yükleyin.","Önizleme yapın, eksik alan uyarılarını giderin ve ürünü yayına alın."],"notes":["Toplu aktarımda SKU değerlerinin benzersiz olması gerekir.","Eksik görsel veya varyant bilgisi satış kanallarında yayın sorununa yol açabilir."]}'::jsonb,
    2
  ),
  (
    'urun-silme',
    'Ürün Silme',
    'Katalog',
    'Ürün Silme ve Pasife Alma',
    'Yayındaki ürünleri kalıcı olarak silmeden önce pasife alma ve geçmiş sipariş etkilerini kontrol etme rehberi.',
    '{"steps":["Ürünün açık siparişlerde kullanılıp kullanılmadığını kontrol edin.","Satışı durdurmak için önce ürünü pasife alın.","Pazaryeri veya kanal eşleşmelerini kaldırın.","Geçmiş raporlama gerekiyorsa kalıcı silme yerine arşivlemeyi tercih edin."],"notes":["Kalıcı silme geçmiş entegrasyon kayıtlarında kopukluğa neden olabilir.","Silme işleminden önce ürün dışa aktarımı almak iyi bir güvenlik adımıdır."]}'::jsonb,
    3
  ),
  (
    'api-hesaplari',
    'API Hesapları Oluşturma',
    'Entegrasyon',
    'API Anahtarı Oluşturma',
    'Harici sistemlerin Aserai verilerine erişmesi için güvenli API anahtarı oluşturma ve iptal etme akışı.',
    '{"steps":["Müşteri panelinde API Anahtarlarım ekranını açın.","Anahtar için anlaşılır bir ad girin ve gerekiyorsa firma seçin.","Oluşturulan anahtarı yalnızca ilk gösterimde güvenli bir yerde saklayın.","Kullanılmayan anahtarları aynı ekrandan iptal edin."],"notes":["API anahtarının tam değeri daha sonra tekrar görüntülenmez.","Her entegrasyon için ayrı anahtar kullanmak erişim takibini kolaylaştırır."]}'::jsonb,
    4
  ),
  (
    'sss',
    'SSS',
    'Yardım',
    'Sık Sorulan Sorular',
    'Aserai kurulumu, lisanslar, ödemeler ve destek süreçleri hakkında en sık karşılaşılan sorular.',
    '{"qa":[{"q":"Lisansım ne zaman aktif olur?","a":"Sipariş durumu ödendi olarak onaylandığında lisans otomatik oluşur ve Lisanslarım ekranında görünür."},{"q":"Faturamı nereden alırım?","a":"Faturalarım ekranından fatura detayını açabilir, yazdır/PDF çıktısı alabilir veya yüklenmiş PDF dosyasını görüntüleyebilirsiniz."},{"q":"Destek talebine dosya ekleyebilir miyim?","a":"Evet. Destek talebi oluştururken veya yanıt yazarken PDF, görsel veya metin dosyası ekleyebilirsiniz."}]}'::jsonb,
    5
  ),
  (
    'yol-haritasi',
    'Yol Haritaları',
    'Plan',
    'Ürün Yol Haritası',
    'Aserai satış platformunun operasyonel gelişim başlıkları ve planlanan iyileştirme alanları.',
    '{"roadmap":[{"phase":"Kısa vade","text":"Panel ekranlarının kullanım metrikleri ve destek içerikleriyle zenginleştirilmesi."},{"phase":"Orta vade","text":"Canlı ödeme ve e-fatura servis bağlantılarının devreye alınması."},{"phase":"Uzun vade","text":"Akademi içeriklerinin video, doküman ve sürüm notlarıyla CMS üzerinden yönetilmesi."}]}'::jsonb,
    6
  ),
  (
    'video-icerikleri',
    'Video İçerikleri',
    'Eğitim',
    'Video İçerikleri',
    'Panel kullanımını adım adım anlatacak kısa eğitim videoları için önerilen içerik dizisi.',
    '{"videos":[{"title":"İlk giriş ve profil/firma bilgilerini tamamlama"},{"title":"Paket seçimi, sepet ve ödeme talebi oluşturma"},{"title":"Lisans yönetimi ve modül ekleme"},{"title":"Fatura, ödeme ve yenileme takibi"},{"title":"Destek talebi oluşturma ve dosya ekleme"}]}'::jsonb,
    7
  ),
  (
    'hatalar-ve-cozumler',
    'Hatalar ve Çözümler',
    'Destek',
    'Hatalar ve Çözümler',
    'Kullanım sırasında karşılaşılabilecek yaygın durumlar ve hızlı çözüm adımları.',
    '{"issues":[{"issue":"Ödeme kaydı beklemede görünüyor","solution":"Havale/EFT dekontunun yönetim tarafından onaylanması gerekir. Onay sonrası lisans ve fatura kayıtları güncellenir."},{"issue":"API anahtarı tekrar görüntülenemiyor","solution":"Güvenlik nedeniyle anahtar yalnızca oluşturulduğu anda gösterilir. Gerekirse yeni anahtar oluşturup eski anahtarı iptal edin."},{"issue":"Destek ek dosyası yüklenemiyor","solution":"Dosya boyutunun 10 MB altında ve PDF, JPG, PNG, WebP veya TXT formatında olduğundan emin olun."}]}'::jsonb,
    8
  ),
  (
    'hata-kodlari',
    'Hata Kodları',
    'Referans',
    'Hata Kodları',
    'Destek ve entegrasyon süreçlerinde kullanılabilecek örnek hata kodları ve anlamları.',
    '{"codes":[{"code":"AUTH-401","text":"Oturum doğrulanamadı. Kullanıcının tekrar giriş yapması gerekir."},{"code":"PAY-202","text":"Ödeme onay bekliyor. Yönetim panelinde ödeme durumu kontrol edilir."},{"code":"LIC-409","text":"Lisans için bekleyen işlem var. Yenileme veya modül talebi tamamlanmalıdır."},{"code":"API-403","text":"API anahtarı iptal edilmiş veya yetkisiz firma için kullanılıyor."},{"code":"SUP-415","text":"Destek ekinde desteklenmeyen dosya türü gönderildi."}]}'::jsonb,
    9
  )
on conflict (slug) do nothing;
