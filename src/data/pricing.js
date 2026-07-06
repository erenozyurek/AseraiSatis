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

export const formatTL = (n) => n.toLocaleString('tr-TR')

/* Yıllık ödemede yıl boyunca yapılan tasarruf */
export const yearlySaving = (tier) =>
  (tier.monthly - tier.yearlyMonthly) * 12
