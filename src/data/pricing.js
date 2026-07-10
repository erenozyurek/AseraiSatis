/* ============================================================
   Fiyatlandırma verisi — Aserai paketleri (TL / ay)
   (2026 dökümanı: Başlangıç · Standart · Profesyonel · E-İhracat)
   monthly      : aylık ödemede aylık tutar
   yearlyMonthly: yıllık ödemede aya düşen tutar
   * Fiyatlar örnektir, güncellenecektir.
   ============================================================ */

export const pricing = {
  aserai: {
    key: 'aserai',
    label: 'Aserai Paketleri',
    note: 'E-ticaret altyapısı',
    tiers: [
      {
        id: 'baslangic',
        name: 'Başlangıç',
        summary: 'E-ticarete yeni başlayan işletmeler için ideal.',
        monthly: 790,
        yearlyMonthly: 590,
        highlight: false,
        features: [
          '250 ürüne kadar',
          '1 hazır mağaza teması',
          'Temel ödeme entegrasyonu',
          'Ücretsiz SSL sertifikası',
          'E-posta destek',
        ],
      },
      {
        id: 'standart',
        name: 'Standart',
        summary: 'Büyüyen KOBİ’ler için en çok tercih edilen paket.',
        monthly: 1490,
        yearlyMonthly: 1190,
        highlight: true,
        badge: 'En popüler',
        features: [
          'Sınırsız ürün ve kategori',
          'Tüm premium temalar',
          'Tüm ödeme & kargo entegrasyonları',
          'Pazaryeri entegrasyonları',
          'İndirim & kampanya modülü',
          'Öncelikli destek',
        ],
      },
      {
        id: 'profesyonel',
        name: 'Profesyonel',
        summary: 'Yüksek hacimli, büyük ölçekli işletmeler için.',
        monthly: 2990,
        yearlyMonthly: 2390,
        highlight: false,
        features: [
          'Standart paketteki her şey',
          'Çoklu mağaza yönetimi',
          'AI ürün öneri & akıllı fiyatlandırma',
          'API & ERP entegrasyonu',
          'Özel müşteri temsilcisi',
          '7/24 telefon desteği',
        ],
      },
      {
        id: 'e-ihracat',
        name: 'E-İhracat',
        summary: 'Yurt dışına satış yapmak isteyen markalar için.',
        monthly: 4990,
        yearlyMonthly: 3990,
        highlight: false,
        features: [
          'Profesyonel paketteki her şey',
          'Çoklu dil & çoklu döviz',
          'AI otomatik içerik çevirisi',
          'Global pazaryerleri (Amazon, Etsy, eBay…)',
          'E-İhracat danışmanlığı',
          'Gümrük & uluslararası kargo desteği',
        ],
      },
    ],
  },
}

export const productOrder = ['aserai']

/* ============================================================
   Paket karşılaştırma matrisi (ANA GEREKSİNİMLER — "Paket Karşılaştırma" ekranı)
   Sütun sırası pricing.aserai.tiers ile aynı:
   [Başlangıç, Standart, Profesyonel, E-İhracat]
   Değerler: true = dahil · false = dahil değil · "metin" = özel değer
   ============================================================ */
export const comparison = {
  /* Karşılaştırma başlığında kullanılacak paket kimlikleri (tiers ile eşleşir) */
  tierIds: ['baslangic', 'standart', 'profesyonel', 'e-ihracat'],
  groups: [
    {
      title: 'Mağaza & Ürün Yönetimi',
      rows: [
        { label: 'Ürün sayısı', values: ['250 ürün', 'Sınırsız', 'Sınırsız', 'Sınırsız'] },
        { label: 'Hazır mağaza teması', values: ['1 tema', 'Tüm premium temalar', 'Tüm premium temalar', 'Tüm premium temalar'] },
        { label: 'Varyantlı ürün', values: [true, true, true, true] },
        { label: 'Toplu ürün güncelleme', values: [false, true, true, true] },
        { label: 'Çoklu mağaza yönetimi', values: [false, false, true, true] },
      ],
    },
    {
      title: 'Satış & Pazarlama',
      rows: [
        { label: 'Ödeme entegrasyonu', values: ['Temel', 'Tümü', 'Tümü', 'Tümü'] },
        { label: 'Kargo entegrasyonları', values: [false, true, true, true] },
        { label: 'Pazaryeri entegrasyonları', values: [false, true, true, true] },
        { label: 'İndirim & kampanya modülü', values: [false, true, true, true] },
        { label: 'AI ürün öneri & akıllı fiyatlandırma', values: [false, false, true, true] },
      ],
    },
    {
      title: 'Uluslararası & E-İhracat',
      rows: [
        { label: 'Çoklu dil & çoklu döviz', values: [false, false, false, true] },
        { label: 'AI otomatik içerik çevirisi', values: [false, false, false, true] },
        { label: 'Global pazaryerleri (Amazon, Etsy, eBay…)', values: [false, false, false, true] },
        { label: 'Gümrük & uluslararası kargo desteği', values: [false, false, false, true] },
      ],
    },
    {
      title: 'Altyapı & Destek',
      rows: [
        { label: 'Ücretsiz SSL sertifikası', values: [true, true, true, true] },
        { label: 'API & ERP entegrasyonu', values: [false, false, true, true] },
        { label: 'Özel müşteri temsilcisi', values: [false, false, true, true] },
        { label: 'E-İhracat danışmanlığı', values: [false, false, false, true] },
        { label: 'Destek', values: ['E-posta', 'Öncelikli', '7/24 telefon', '7/24 telefon'] },
      ],
    },
  ],
}

export const formatTL = (n) => n.toLocaleString('tr-TR')

/* Yıllık ödemede yıl boyunca yapılan tasarruf */
export const yearlySaving = (tier) =>
  (tier.monthly - tier.yearlyMonthly) * 12
