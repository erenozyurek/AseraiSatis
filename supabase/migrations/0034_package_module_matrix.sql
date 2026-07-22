-- Package/module comparison matrix.
-- Adds every module once, updates existing slugs, and marks each package cell.

alter table public.modules
  add column if not exists category text not null default 'Diğer Modüller';

create table if not exists public.package_module_rules (
  package_slug text not null references public.packages (slug) on update cascade on delete cascade,
  module_slug  text not null references public.modules (slug) on update cascade on delete cascade,
  status       text not null check (status in ('included', 'addable')),
  updated_at   timestamptz not null default now(),
  primary key (package_slug, module_slug)
);

alter table public.package_module_rules enable row level security;

drop policy if exists "package_module_rules_select_public" on public.package_module_rules;
drop policy if exists "package_module_rules_admin_all" on public.package_module_rules;

create policy "package_module_rules_select_public"
  on public.package_module_rules for select
  to anon, authenticated
  using (true);

create policy "package_module_rules_admin_all"
  on public.package_module_rules for all
  to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

insert into public.modules (slug, name, description, monthly, category, sort_order, is_active)
values
  ('one-page-checkout', 'One Page Checkout (Hızlı ve Güvenli Ödeme)', 'Tek sayfada hızlı ve güvenli ödeme akışı.', 0, 'Satış ve Pazarlama', 1, true),
  ('kampanya', 'Kampanya ve Etiket Yönetimi', 'Kampanya, indirim ve ürün etiketi senaryoları.', 199, 'Satış ve Pazarlama', 2, true),
  ('promosyon', 'Promosyon Modülü', 'Sepet ve ürün bazlı promosyon kuralları.', 199, 'Satış ve Pazarlama', 3, true),
  ('kombin-satis', 'Kombin Satış Modülleri', 'Birlikte satılabilecek ürün kombinleri.', 249, 'Satış ve Pazarlama', 4, true),
  ('iliskili-urun', 'İlişkili Ürün Bağlama Modülü', 'Tamamlayıcı ve ilişkili ürün önerileri.', 199, 'Satış ve Pazarlama', 5, true),
  ('e-fatura', 'E-Fatura & E-Arşiv', 'GİB entegrasyonuyla otomatik fatura süreçleri.', 249, 'Satış ve Pazarlama', 6, true),
  ('e-ihracat-modulu', 'E-İhracat Modülü', 'Yurt dışı satış süreçleri için operasyon altyapısı.', 699, 'Satış ve Pazarlama', 7, true),
  ('influencer-is-birlikleri', 'Influencer İş Birlikleri Modülü (Yakında)', 'Influencer kampanya ve iş birliği takibi.', 299, 'Satış ve Pazarlama', 8, true),
  ('abonelik', 'Abonelik Modülü (Yakında)', 'Tekrarlayan sipariş ve abonelik yönetimi.', 299, 'Satış ve Pazarlama', 9, true),
  ('buybox', 'BuyBox Rekabet Analizi (Yakında)', 'Pazaryeri rekabet ve fiyat avantajı analizi.', 399, 'Satış ve Pazarlama', 10, true),
  ('aserai-tema-editoru', 'Aserai Tema Editörü', 'Mağaza görünümünü panelden düzenleme.', 299, 'Mağaza ve İçerik Yönetimi', 1, true),
  ('koleksiyon', 'Koleksiyon Modülü', 'Ürün koleksiyonları ve vitrin kurguları.', 199, 'Mağaza ve İçerik Yönetimi', 2, true),
  ('coklu-dil-tr-2-dil', 'Çoklu Dil Modülü - Türkçe + 2 Dil', 'Mağazayı Türkçe dışında iki dilde yayınlama.', 299, 'Mağaza ve İçerik Yönetimi', 3, true),
  ('coklu-dil-tr-ve-2-diger-diller', 'Çoklu Dil Modülü - Türkçe ve 2+ Diğer Diller', 'Geniş çoklu dil yönetimi.', 449, 'Mağaza ve İçerik Yönetimi', 4, true),
  ('coklu-doviz-tl-2-doviz', 'Çoklu Döviz/Para Modülü TL + 2 Döviz', 'TL dışında iki dövizle satış altyapısı.', 299, 'Mağaza ve İçerik Yönetimi', 5, true),
  ('coklu-doviz-tl-ve-2-diger-dovizler', 'Çoklu Döviz/Para Modülü TL ve 2+ Diğer Dövizler', 'Geniş çoklu para birimi yönetimi.', 449, 'Mağaza ve İçerik Yönetimi', 6, true),
  ('cok-dilli-seo-meta', 'Çok Dilli SEO Meta Modülü', 'Dil bazlı SEO başlık ve açıklama yönetimi.', 249, 'Mağaza ve İçerik Yönetimi', 7, true),
  ('crm-musteri', 'CRM & Müşteri Yönetimi (Yakında)', 'Müşteri ilişkileri ve segment yönetimi.', 399, 'Operasyon ve Yönetim', 1, true),
  ('b2b', 'Bayi (Lite) Modülü', 'Bayi ve toptan müşteri yönetimi.', 399, 'Operasyon ve Yönetim', 2, true),
  ('tedarikci-stok', 'Tedarikçi / Stok Modülü', 'Tedarikçi ve stok operasyonlarını yönetme.', 299, 'Operasyon ve Yönetim', 3, true),
  ('haritalandirma', 'Haritalandırma Seçeneği', 'Kategori, alan ve veri eşleştirme süreçleri.', 249, 'Operasyon ve Yönetim', 4, true),
  ('site-ip-guvenlik', 'Site IP Güvenlik Modülü', 'IP bazlı erişim ve güvenlik kontrolleri.', 0, 'Operasyon ve Yönetim', 5, true),
  ('yetkili-islem-kayit-takip', 'Yetkili İşlem Kayıt Takip Modülü', 'Yönetici işlemlerini kayıt altına alma.', 299, 'Operasyon ve Yönetim', 6, true),
  ('aserai-yapay-zeka', 'Aserai Yapay Zeka Modülü', 'AI destekli içerik ve operasyon otomasyonları.', 399, 'Yapay Zeka ve Analitik', 1, true),
  ('canli-ziyaretci-izleme', 'Canlı Ziyaretçi İzleme Modülü', 'Mağaza ziyaretçilerini canlı takip etme.', 249, 'Yapay Zeka ve Analitik', 2, true),
  ('reklam-donusum-roi', 'Reklam Dönüşüm (ROI) Modülü', 'Reklam performansı ve dönüşüm takibi.', 299, 'Yapay Zeka ve Analitik', 3, true),
  ('blog-metin-uretici', 'Blog Metin Üretici Modülü', 'Blog içerik üretimi için AI destekli metin aracı.', 249, 'Yapay Zeka ve Analitik', 4, true),
  ('istatistik-siparis', 'İstatistik Modülü > Sipariş İstatistik Modülü', 'Sipariş performansı ve satış istatistikleri.', 199, 'Yapay Zeka ve Analitik', 5, true),
  ('istatistik-uye', 'İstatistik Modülü > Üye İstatistik Modülü', 'Üye kazanımı ve müşteri istatistikleri.', 199, 'Yapay Zeka ve Analitik', 6, true),
  ('istatistik-urun-skor', 'İstatistik Modülü > Ürün Skor İstatistiği Modülü', 'Ürün performans skoru ve görünürlük analizi.', 199, 'Yapay Zeka ve Analitik', 7, true),
  ('istatistik-site-ici-arama', 'İstatistik Modülü > Site İçi Arama İstatistik Modülü', 'Site içi arama davranışlarını analiz etme.', 199, 'Yapay Zeka ve Analitik', 8, true)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  monthly = excluded.monthly,
  category = excluded.category,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();

insert into public.package_module_rules (package_slug, module_slug, status)
values
  ('baslangic', 'one-page-checkout', 'included'), ('standart', 'one-page-checkout', 'included'), ('profesyonel', 'one-page-checkout', 'included'), ('e-ihracat', 'one-page-checkout', 'included'),
  ('baslangic', 'kampanya', 'included'), ('standart', 'kampanya', 'included'), ('profesyonel', 'kampanya', 'included'), ('e-ihracat', 'kampanya', 'included'),
  ('baslangic', 'promosyon', 'addable'), ('standart', 'promosyon', 'addable'), ('profesyonel', 'promosyon', 'included'), ('e-ihracat', 'promosyon', 'included'),
  ('baslangic', 'kombin-satis', 'addable'), ('standart', 'kombin-satis', 'addable'), ('profesyonel', 'kombin-satis', 'included'), ('e-ihracat', 'kombin-satis', 'included'),
  ('baslangic', 'iliskili-urun', 'addable'), ('standart', 'iliskili-urun', 'addable'), ('profesyonel', 'iliskili-urun', 'included'), ('e-ihracat', 'iliskili-urun', 'included'),
  ('baslangic', 'e-fatura', 'addable'), ('standart', 'e-fatura', 'included'), ('profesyonel', 'e-fatura', 'included'), ('e-ihracat', 'e-fatura', 'included'),
  ('baslangic', 'e-ihracat-modulu', 'addable'), ('standart', 'e-ihracat-modulu', 'addable'), ('profesyonel', 'e-ihracat-modulu', 'addable'), ('e-ihracat', 'e-ihracat-modulu', 'included'),
  ('baslangic', 'influencer-is-birlikleri', 'addable'), ('standart', 'influencer-is-birlikleri', 'addable'), ('profesyonel', 'influencer-is-birlikleri', 'addable'), ('e-ihracat', 'influencer-is-birlikleri', 'addable'),
  ('baslangic', 'abonelik', 'addable'), ('standart', 'abonelik', 'addable'), ('profesyonel', 'abonelik', 'addable'), ('e-ihracat', 'abonelik', 'addable'),
  ('baslangic', 'buybox', 'addable'), ('standart', 'buybox', 'addable'), ('profesyonel', 'buybox', 'addable'), ('e-ihracat', 'buybox', 'included'),
  ('baslangic', 'aserai-tema-editoru', 'addable'), ('standart', 'aserai-tema-editoru', 'addable'), ('profesyonel', 'aserai-tema-editoru', 'included'), ('e-ihracat', 'aserai-tema-editoru', 'included'),
  ('baslangic', 'koleksiyon', 'addable'), ('standart', 'koleksiyon', 'addable'), ('profesyonel', 'koleksiyon', 'included'), ('e-ihracat', 'koleksiyon', 'included'),
  ('baslangic', 'coklu-dil-tr-2-dil', 'addable'), ('standart', 'coklu-dil-tr-2-dil', 'addable'), ('profesyonel', 'coklu-dil-tr-2-dil', 'included'), ('e-ihracat', 'coklu-dil-tr-2-dil', 'included'),
  ('baslangic', 'coklu-dil-tr-ve-2-diger-diller', 'addable'), ('standart', 'coklu-dil-tr-ve-2-diger-diller', 'addable'), ('profesyonel', 'coklu-dil-tr-ve-2-diger-diller', 'addable'), ('e-ihracat', 'coklu-dil-tr-ve-2-diger-diller', 'included'),
  ('baslangic', 'coklu-doviz-tl-2-doviz', 'addable'), ('standart', 'coklu-doviz-tl-2-doviz', 'addable'), ('profesyonel', 'coklu-doviz-tl-2-doviz', 'included'), ('e-ihracat', 'coklu-doviz-tl-2-doviz', 'included'),
  ('baslangic', 'coklu-doviz-tl-ve-2-diger-dovizler', 'addable'), ('standart', 'coklu-doviz-tl-ve-2-diger-dovizler', 'addable'), ('profesyonel', 'coklu-doviz-tl-ve-2-diger-dovizler', 'addable'), ('e-ihracat', 'coklu-doviz-tl-ve-2-diger-dovizler', 'included'),
  ('baslangic', 'cok-dilli-seo-meta', 'addable'), ('standart', 'cok-dilli-seo-meta', 'addable'), ('profesyonel', 'cok-dilli-seo-meta', 'included'), ('e-ihracat', 'cok-dilli-seo-meta', 'included'),
  ('baslangic', 'crm-musteri', 'addable'), ('standart', 'crm-musteri', 'addable'), ('profesyonel', 'crm-musteri', 'addable'), ('e-ihracat', 'crm-musteri', 'addable'),
  ('baslangic', 'b2b', 'addable'), ('standart', 'b2b', 'addable'), ('profesyonel', 'b2b', 'included'), ('e-ihracat', 'b2b', 'included'),
  ('baslangic', 'tedarikci-stok', 'addable'), ('standart', 'tedarikci-stok', 'included'), ('profesyonel', 'tedarikci-stok', 'included'), ('e-ihracat', 'tedarikci-stok', 'included'),
  ('baslangic', 'haritalandirma', 'addable'), ('standart', 'haritalandirma', 'addable'), ('profesyonel', 'haritalandirma', 'included'), ('e-ihracat', 'haritalandirma', 'included'),
  ('baslangic', 'site-ip-guvenlik', 'included'), ('standart', 'site-ip-guvenlik', 'included'), ('profesyonel', 'site-ip-guvenlik', 'included'), ('e-ihracat', 'site-ip-guvenlik', 'included'),
  ('baslangic', 'yetkili-islem-kayit-takip', 'addable'), ('standart', 'yetkili-islem-kayit-takip', 'addable'), ('profesyonel', 'yetkili-islem-kayit-takip', 'included'), ('e-ihracat', 'yetkili-islem-kayit-takip', 'included'),
  ('baslangic', 'aserai-yapay-zeka', 'addable'), ('standart', 'aserai-yapay-zeka', 'addable'), ('profesyonel', 'aserai-yapay-zeka', 'included'), ('e-ihracat', 'aserai-yapay-zeka', 'included'),
  ('baslangic', 'canli-ziyaretci-izleme', 'addable'), ('standart', 'canli-ziyaretci-izleme', 'addable'), ('profesyonel', 'canli-ziyaretci-izleme', 'included'), ('e-ihracat', 'canli-ziyaretci-izleme', 'included'),
  ('baslangic', 'reklam-donusum-roi', 'addable'), ('standart', 'reklam-donusum-roi', 'addable'), ('profesyonel', 'reklam-donusum-roi', 'included'), ('e-ihracat', 'reklam-donusum-roi', 'included'),
  ('baslangic', 'blog-metin-uretici', 'addable'), ('standart', 'blog-metin-uretici', 'addable'), ('profesyonel', 'blog-metin-uretici', 'included'), ('e-ihracat', 'blog-metin-uretici', 'included'),
  ('baslangic', 'istatistik-siparis', 'addable'), ('standart', 'istatistik-siparis', 'addable'), ('profesyonel', 'istatistik-siparis', 'included'), ('e-ihracat', 'istatistik-siparis', 'included'),
  ('baslangic', 'istatistik-uye', 'addable'), ('standart', 'istatistik-uye', 'addable'), ('profesyonel', 'istatistik-uye', 'included'), ('e-ihracat', 'istatistik-uye', 'included'),
  ('baslangic', 'istatistik-urun-skor', 'addable'), ('standart', 'istatistik-urun-skor', 'addable'), ('profesyonel', 'istatistik-urun-skor', 'included'), ('e-ihracat', 'istatistik-urun-skor', 'included'),
  ('baslangic', 'istatistik-site-ici-arama', 'addable'), ('standart', 'istatistik-site-ici-arama', 'addable'), ('profesyonel', 'istatistik-site-ici-arama', 'included'), ('e-ihracat', 'istatistik-site-ici-arama', 'included')
on conflict (package_slug, module_slug) do update set
  status = excluded.status,
  updated_at = now();
