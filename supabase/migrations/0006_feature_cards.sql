-- ============================================================
-- Aserai — Modüller sayfası tanıtım kartları (inline düzenleme)
-- ============================================================

create table if not exists public.feature_cards (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  icon_path   text,
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  updated_at  timestamptz not null default now()
);

alter table public.feature_cards enable row level security;

create policy "feature_cards_select_public" on public.feature_cards
  for select using (is_active or public.is_platform_admin());
create policy "feature_cards_admin_all" on public.feature_cards
  for all using (public.is_platform_admin())
  with check (public.is_platform_admin());

insert into public.feature_cards (title, description, icon_path, sort_order) values
('E-Fatura & E-Arşiv', 'Faturalarınızı otomatik oluşturun, GİB entegrasyonuyla e-fatura ve e-arşiv süreçlerini tek tıkla yönetin.', 'M6 3h9l3 3v15H6zM14 3v4h4M9 12h6M9 16h6', 1),
('Kargo Takip & Entegrasyon', 'Anlaşmalı kargo firmalarını bağlayın; gönderi oluşturun, takip numarasını ve durumunu otomatik güncelleyin.', 'M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10', 2),
('Pazaryeri Entegrasyonu', 'Trendyol, Hepsiburada, Amazon ve daha fazlasını tek panelden yönetin; ürün, stok ve siparişleri senkronize edin.', 'M4 7h16M4 12h16M4 17h16M8 3v18M16 3v18', 3),
('Muhasebe Entegrasyonu', 'Satış, fatura ve tahsilat verilerinizi muhasebe programınıza otomatik aktarın, mutabakatı kolaylaştırın.', 'M6 3h12v18H6zM9 7h6M9 11h6M9 15h3', 4),
('Sanal POS & Ödeme', 'Tüm sanal POS sağlayıcılarıyla tam uyum, taksit seçenekleri ve PCI-DSS uyumlu güvenli ödeme altyapısı.', 'M3 6h18v12H3zM3 10h18M7 15h4', 5),
('BuyBox Rekabet Analizi', 'Pazaryerlerinde rakip fiyatlarını izleyin, BuyBox kazanma oranınızı artıracak akıllı fiyatlandırma yapın.', 'M5 19V10M10 19V5M15 19v-7M20 19v-4M3 21h18', 6),
('Stok & Depo Yönetimi', 'Çoklu depo desteğiyle stokları tek yerden yönetin; kritik stok uyarıları ve otomatik senkron alın.', 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10', 7),
('Toplu Ürün Yükleme', 'Binlerce ürünü Excel veya pazaryerlerinden tek tıkla toplu yükleyin; görsel ve açıklamaları hızlıca düzenleyin.', 'M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2', 8),
('Sipariş Yönetimi', 'Tüm kanallardan gelen siparişleri tek ekrandan görün; durum güncellemelerini ve iadeleri kolayca yönetin.', 'M9 3h6a1 1 0 011 1v1h2v16H6V5h2V4a1 1 0 011-1zM9 11l1.5 1.5L14 9', 9),
('B2B Modülü', 'Bayi ve toptan müşterileriniz için özel fiyat listeleri, cari hesap ve sipariş akışı oluşturun.', 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 11h.01M15 11h.01', 10),
('E-İhracat', 'Sınırsız dil ve para birimiyle satış yapın; gümrük ve uluslararası kargo süreçlerini kolaylaştırın.', 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 3.8 6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-6-3.8-9s1.3-6.5 3.8-9z', 11),
('CRM & Müşteri Yönetimi', 'Müşteri segmentleri oluşturun, satın alma geçmişini takip edin ve kişiye özel iletişim kurun.', 'M16 20a4 4 0 00-8 0M12 12a4 4 0 100-8 4 4 0 000 8M20 20a3 3 0 00-4-2.8M4 20a3 3 0 014-2.8', 12),
('Kampanya & Kupon Yönetimi', 'İndirim kuponları, sepet kampanyaları ve otomatik promosyon kurallarıyla dönüşümü artırın.', 'M20 12l-8 8-9-9V4h7l10 10-1 1zM7.5 7.5h.01M9 15l6-6', 13),
('Raporlama & Analitik', 'Ciro, dönüşüm ve kanal performansını canlı grafiklerle izleyin; veriye dayalı kararlar alın.', 'M4 4v16h16M8 16v-4M12 16V8M16 16v-6', 14),
('Çoklu Dil & Çoklu Döviz', 'Mağazanızı birden fazla dil ve para biriminde yayınlayarak global müşterilere ulaşın.', 'M3 5h12M9 3v2m1.5 0c0 5-3 9-6.5 11M5 9c0 3 2.5 5.5 6 6.5M14 20l4-9 4 9M15.5 17h5', 15)
on conflict do nothing;
