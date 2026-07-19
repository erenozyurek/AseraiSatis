-- ============================================================
-- Aserai - Yardim Merkezi makaleleri
-- Yardim kategorilerine bagli, blog ve akademiden bagimsiz makale katmani.
-- 0028_help_center_content.sql sonrasinda calistirilir.
-- ============================================================

create table if not exists public.help_articles (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid not null references public.help_categories (id) on delete cascade,
  slug          text not null unique,
  title         text not null,
  excerpt       text not null,
  content       text not null,
  sort_order    integer not null default 0,
  is_active     boolean not null default true,
  created_by    uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint help_articles_slug_format
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) between 3 and 180),
  constraint help_articles_title_length
    check (char_length(btrim(title)) between 3 and 180),
  constraint help_articles_excerpt_length
    check (char_length(btrim(excerpt)) between 10 and 600),
  constraint help_articles_content_length
    check (char_length(btrim(content)) between 10 and 30000)
);

create index if not exists idx_help_articles_category_sort
  on public.help_articles (category_id, is_active, sort_order);

drop trigger if exists set_help_center_audit_fields on public.help_articles;
create trigger set_help_center_audit_fields
before insert or update on public.help_articles
for each row execute function public.set_help_center_audit_fields();

alter table public.help_articles enable row level security;

drop policy if exists "help_articles_select_public" on public.help_articles;
drop policy if exists "help_articles_admin_all" on public.help_articles;

create policy "help_articles_select_public"
  on public.help_articles for select
  to anon, authenticated
  using (is_active or public.is_platform_admin());

create policy "help_articles_admin_all"
  on public.help_articles for all
  to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

revoke all on public.help_articles from anon, authenticated;
grant select on public.help_articles to anon, authenticated;
grant insert, update, delete on public.help_articles to authenticated;

insert into public.help_articles (
  category_id,
  slug,
  title,
  excerpt,
  content,
  sort_order
)
select
  category.id,
  article.slug,
  article.title,
  article.excerpt,
  article.content,
  article.sort_order
from public.help_categories category
join (
  values
    (
      'baslangic-rehberi',
      'hesap-olusturma-ve-ilk-giris',
      'Hesap oluşturma ve ilk giriş',
      'Aserai hesabınızı oluşturduktan sonra panelde ilk kontrol etmeniz gereken temel alanlar.',
      'Hesabınızı oluşturduktan sonra e-posta doğrulamasını tamamlayın ve Profilim alanındaki firma bilgilerini güncelleyin.

İlk girişte aktif paket, lisans durumu ve destek kanallarını kontrol etmek sonraki kurulum adımlarını kolaylaştırır.',
      1
    ),
    (
      'baslangic-rehberi',
      'magaza-kurulum-kontrol-listesi',
      'Mağaza kurulum kontrol listesi',
      'Yayına çıkmadan önce tema, ödeme, kargo ve temel içerik ayarlarını gözden geçirin.',
      'Mağazanızı yayına almadan önce logo, iletişim bilgileri, ödeme yöntemleri ve kargo ayarlarını tamamlayın.

Ürün yükleme öncesinde kategori yapısını sade tutmak, müşterinin aradığı ürüne daha hızlı ulaşmasını sağlar.',
      2
    ),
    (
      'urun-stok',
      'tekil-urun-yukleme',
      'Tekil ürün yükleme',
      'Ürün adı, açıklama, fiyat, stok ve görsel alanlarıyla hızlı ürün yayınlama akışı.',
      'Ürün eklerken başlık, açıklama, SKU, fiyat ve stok alanlarını eksiksiz girin.

Görsellerin aynı oranlarda hazırlanması vitrin kalitesini artırır ve ürün kartlarının düzenli görünmesini sağlar.',
      1
    ),
    (
      'urun-stok',
      'stok-guncelleme-adimlari',
      'Stok güncelleme adımları',
      'Stok değişikliklerini satış kanallarına doğru yansıtmak için temel kontrol noktaları.',
      'Stok güncellemesi yapmadan önce açık siparişleri ve bekleyen kanal senkronlarını kontrol edin.

Kritik stok seviyelerini düzenli takip etmek, satışta olmayan ürünlerin müşteriye görünmesini engeller.',
      2
    ),
    (
      'siparis-kargo',
      'siparis-durumu-takibi',
      'Sipariş durumu takibi',
      'Siparişleri ödeme, hazırlık, kargo ve teslimat aşamalarında izleme yöntemi.',
      'Sipariş ekranında ödeme durumu, ürün kalemleri ve müşteri bilgilerini kontrol ederek işleme başlayın.

Kargo bilgisi oluşturulduğunda takip numarasını müşteriye görünür hale getirmek destek taleplerini azaltır.',
      1
    ),
    (
      'siparis-kargo',
      'kargo-entegrasyonu-kontrolu',
      'Kargo entegrasyonu kontrolü',
      'Kargo firması bağlantıları, teslimat seçenekleri ve takip bilgilerinin kontrolü.',
      'Kargo entegrasyonunda firma hesap bilgileri, gönderi şablonları ve teslimat bölgeleri uyumlu olmalıdır.

Test gönderisi oluşturmak, canlı sipariş akışına geçmeden önce bağlantı sorunlarını görmenizi sağlar.',
      2
    ),
    (
      'odeme-fatura',
      'odeme-kaydi-kontrolu',
      'Ödeme kaydı kontrolü',
      'Bekleyen, onaylanan ve başarısız ödeme kayıtlarını panelden takip etme.',
      'Ödeme kayıtlarında sipariş numarası, tutar ve durum alanlarını birlikte değerlendirin.

Havale veya EFT akışlarında yönetim onayı sonrası lisans ve fatura kayıtları otomatik olarak güncellenir.',
      1
    ),
    (
      'odeme-fatura',
      'fatura-goruntuleme',
      'Fatura görüntüleme',
      'Müşteri panelinde fatura detaylarını görüntüleme, yazdırma ve PDF akışı.',
      'Faturalarım ekranından ilgili fatura kaydını açarak ürün kalemleri, tutar ve tarih bilgilerini inceleyebilirsiniz.

PDF dosyası yüklenmişse aynı ekrandan görüntüleme bağlantısı da kullanılabilir.',
      2
    ),
    (
      'hesap-guvenlik',
      'profil-bilgilerini-guncelleme',
      'Profil bilgilerini güncelleme',
      'Firma, kullanıcı ve iletişim bilgilerini güncel tutmak için izlenecek adımlar.',
      'Profilim ekranında firma adı, yetkili kişi, telefon ve e-posta alanlarını düzenli olarak güncel tutun.

Doğru iletişim bilgileri bildirim, destek ve fatura süreçlerinin kesintisiz ilerlemesini sağlar.',
      1
    ),
    (
      'hesap-guvenlik',
      'api-anahtari-guvenligi',
      'API anahtarı güvenliği',
      'API anahtarlarını oluşturma, saklama ve kullanılmayan anahtarları iptal etme rehberi.',
      'API anahtarları yalnızca oluşturulduğu anda tam olarak görüntülenir. Bu nedenle anahtarı güvenli bir parola kasasında saklayın.

Kullanılmayan veya paylaşıldığından şüphelenilen anahtarları iptal edip yeni anahtar oluşturun.',
      2
    ),
    (
      'entegrasyonlar',
      'pazaryeri-baglantisi',
      'Pazaryeri bağlantısı',
      'Pazaryeri hesabınızı Aserai operasyon akışına bağlamadan önce yapılacak kontroller.',
      'Pazaryeri bağlantısı için mağaza yetki bilgileri, kategori eşleşmeleri ve stok kuralları hazır olmalıdır.

Bağlantı sonrası ürün, fiyat ve sipariş senkronlarını küçük bir ürün setiyle test etmek daha güvenli bir başlangıç sağlar.',
      1
    ),
    (
      'entegrasyonlar',
      'erp-ve-muhasebe-aktarimi',
      'ERP ve muhasebe aktarımı',
      'Sipariş, fatura ve tahsilat verilerinin harici sistemlere aktarımında dikkat edilecekler.',
      'ERP veya muhasebe aktarımında müşteri, ürün kodu, vergi ve para birimi alanlarının iki sistemde de aynı anlamı taşıması gerekir.

Aktarım öncesi test kayıtlarıyla eşleşme doğrulaması yapmak canlı veride hata riskini azaltır.',
      2
    )
) as article (
  category_slug,
  slug,
  title,
  excerpt,
  content,
  sort_order
) on article.category_slug = category.slug
on conflict (slug) do nothing;
