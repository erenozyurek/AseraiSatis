export const PACKAGE_MODULE_STATUSES = {
  INCLUDED: 'included',
  ADDABLE: 'addable',
}

export const moduleGroups = [
  {
    title: 'Satış ve Pazarlama',
    modules: [
      {
        id: 'one-page-checkout',
        name: 'One Page Checkout (Hızlı ve Güvenli Ödeme)',
        desc: 'Tek sayfada hızlı ve güvenli ödeme akışı.',
        monthly: 0,
        statuses: ['included', 'included', 'included', 'included'],
      },
      {
        id: 'kampanya',
        name: 'Kampanya ve Etiket Yönetimi',
        desc: 'Kampanya, indirim ve ürün etiketi senaryoları.',
        monthly: 199,
        statuses: ['included', 'included', 'included', 'included'],
      },
      {
        id: 'promosyon',
        name: 'Promosyon Modülü',
        desc: 'Sepet ve ürün bazlı promosyon kuralları.',
        monthly: 199,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
      {
        id: 'kombin-satis',
        name: 'Kombin Satış Modülleri',
        desc: 'Birlikte satılabilecek ürün kombinleri.',
        monthly: 249,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
      {
        id: 'iliskili-urun',
        name: 'İlişkili Ürün Bağlama Modülü',
        desc: 'Tamamlayıcı ve ilişkili ürün önerileri.',
        monthly: 199,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
      {
        id: 'e-fatura',
        name: 'E-Fatura & E-Arşiv',
        desc: 'GİB entegrasyonuyla otomatik fatura süreçleri.',
        monthly: 249,
        statuses: ['addable', 'included', 'included', 'included'],
      },
      {
        id: 'e-ihracat-modulu',
        name: 'E-İhracat Modülü',
        desc: 'Yurt dışı satış süreçleri için operasyon altyapısı.',
        monthly: 699,
        statuses: ['addable', 'addable', 'addable', 'included'],
      },
      {
        id: 'influencer-is-birlikleri',
        name: 'Influencer İş Birlikleri Modülü (Yakında)',
        desc: 'Influencer kampanya ve iş birliği takibi.',
        monthly: 299,
        statuses: ['addable', 'addable', 'addable', 'addable'],
      },
      {
        id: 'abonelik',
        name: 'Abonelik Modülü (Yakında)',
        desc: 'Tekrarlayan sipariş ve abonelik yönetimi.',
        monthly: 299,
        statuses: ['addable', 'addable', 'addable', 'addable'],
      },
      {
        id: 'buybox',
        name: 'BuyBox Rekabet Analizi (Yakında)',
        desc: 'Pazaryeri rekabet ve fiyat avantajı analizi.',
        monthly: 399,
        statuses: ['addable', 'addable', 'addable', 'included'],
      },
    ],
  },
  {
    title: 'Mağaza ve İçerik Yönetimi',
    modules: [
      {
        id: 'aserai-tema-editoru',
        name: 'Aserai Tema Editörü',
        desc: 'Mağaza görünümünü panelden düzenleme.',
        monthly: 299,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
      {
        id: 'koleksiyon',
        name: 'Koleksiyon Modülü',
        desc: 'Ürün koleksiyonları ve vitrin kurguları.',
        monthly: 199,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
      {
        id: 'coklu-dil-tr-2-dil',
        name: 'Çoklu Dil Modülü - Türkçe + 2 Dil',
        desc: 'Mağazayı Türkçe dışında iki dilde yayınlama.',
        monthly: 299,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
      {
        id: 'coklu-dil-tr-ve-2-diger-diller',
        name: 'Çoklu Dil Modülü - Türkçe ve 2+ Diğer Diller',
        desc: 'Geniş çoklu dil yönetimi.',
        monthly: 449,
        statuses: ['addable', 'addable', 'addable', 'included'],
      },
      {
        id: 'coklu-doviz-tl-2-doviz',
        name: 'Çoklu Döviz/Para Modülü TL + 2 Döviz',
        desc: 'TL dışında iki dövizle satış altyapısı.',
        monthly: 299,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
      {
        id: 'coklu-doviz-tl-ve-2-diger-dovizler',
        name: 'Çoklu Döviz/Para Modülü TL ve 2+ Diğer Dövizler',
        desc: 'Geniş çoklu para birimi yönetimi.',
        monthly: 449,
        statuses: ['addable', 'addable', 'addable', 'included'],
      },
      {
        id: 'cok-dilli-seo-meta',
        name: 'Çok Dilli SEO Meta Modülü',
        desc: 'Dil bazlı SEO başlık ve açıklama yönetimi.',
        monthly: 249,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
    ],
  },
  {
    title: 'Operasyon ve Yönetim',
    modules: [
      {
        id: 'crm-musteri',
        name: 'CRM & Müşteri Yönetimi (Yakında)',
        desc: 'Müşteri ilişkileri ve segment yönetimi.',
        monthly: 399,
        statuses: ['addable', 'addable', 'addable', 'addable'],
      },
      {
        id: 'b2b',
        name: 'Bayi (Lite) Modülü',
        desc: 'Bayi ve toptan müşteri yönetimi.',
        monthly: 399,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
      {
        id: 'tedarikci-stok',
        name: 'Tedarikçi / Stok Modülü',
        desc: 'Tedarikçi ve stok operasyonlarını yönetme.',
        monthly: 299,
        statuses: ['addable', 'included', 'included', 'included'],
      },
      {
        id: 'haritalandirma',
        name: 'Haritalandırma Seçeneği',
        desc: 'Kategori, alan ve veri eşleştirme süreçleri.',
        monthly: 249,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
      {
        id: 'site-ip-guvenlik',
        name: 'Site IP Güvenlik Modülü',
        desc: 'IP bazlı erişim ve güvenlik kontrolleri.',
        monthly: 0,
        statuses: ['included', 'included', 'included', 'included'],
      },
      {
        id: 'yetkili-islem-kayit-takip',
        name: 'Yetkili İşlem Kayıt Takip Modülü',
        desc: 'Yönetici işlemlerini kayıt altına alma.',
        monthly: 299,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
    ],
  },
  {
    title: 'Yapay Zeka ve Analitik',
    modules: [
      {
        id: 'aserai-yapay-zeka',
        name: 'Aserai Yapay Zeka Modülü',
        desc: 'AI destekli içerik ve operasyon otomasyonları.',
        monthly: 399,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
      {
        id: 'canli-ziyaretci-izleme',
        name: 'Canlı Ziyaretçi İzleme Modülü',
        desc: 'Mağaza ziyaretçilerini canlı takip etme.',
        monthly: 249,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
      {
        id: 'reklam-donusum-roi',
        name: 'Reklam Dönüşüm (ROI) Modülü',
        desc: 'Reklam performansı ve dönüşüm takibi.',
        monthly: 299,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
      {
        id: 'blog-metin-uretici',
        name: 'Blog Metin Üretici Modülü',
        desc: 'Blog içerik üretimi için AI destekli metin aracı.',
        monthly: 249,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
      {
        id: 'istatistik-siparis',
        name: 'İstatistik Modülü > Sipariş İstatistik Modülü',
        desc: 'Sipariş performansı ve satış istatistikleri.',
        monthly: 199,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
      {
        id: 'istatistik-uye',
        name: 'İstatistik Modülü > Üye İstatistik Modülü',
        desc: 'Üye kazanımı ve müşteri istatistikleri.',
        monthly: 199,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
      {
        id: 'istatistik-urun-skor',
        name: 'İstatistik Modülü > Ürün Skor İstatistiği Modülü',
        desc: 'Ürün performans skoru ve görünürlük analizi.',
        monthly: 199,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
      {
        id: 'istatistik-site-ici-arama',
        name: 'İstatistik Modülü > Site İçi Arama İstatistik Modülü',
        desc: 'Site içi arama davranışlarını analiz etme.',
        monthly: 199,
        statuses: ['addable', 'addable', 'included', 'included'],
      },
    ],
  },
]

export const packageModuleTierIds = [
  'baslangic',
  'standart',
  'profesyonel',
  'e-ihracat',
]

export const fallbackModules = moduleGroups.flatMap((group) =>
  group.modules.map((module, index) => ({
    ...module,
    category: group.title,
    sortOrder: index + 1,
  })),
)

export const fallbackPackageModuleRules = moduleGroups.flatMap((group) =>
  group.modules.flatMap((module) =>
    packageModuleTierIds.map((packageId, index) => ({
      packageId,
      moduleId: module.id,
      status: module.statuses[index],
    })),
  ),
)
