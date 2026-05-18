/* ============================================================
   Fiyatlandırma verisi — rastgele örnek fiyatlar (TL / ay)
   monthly      : aylık ödemede aylık tutar
   yearlyMonthly: yıllık ödemede aya düşen tutar
   ============================================================ */

export const pricing = {
  aserai: {
    key: 'aserai',
    label: 'Aserai',
    note: 'E-ticaret altyapısı',
    tiers: [
      {
        id: 'aserai-baslangic',
        name: 'Başlangıç',
        summary: 'Yeni açılan e-ticaret mağazaları için ideal.',
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
        id: 'aserai-profesyonel',
        name: 'Profesyonel',
        summary: 'Büyüyen markalar için en çok tercih edilen paket.',
        monthly: 1490,
        yearlyMonthly: 1190,
        highlight: true,
        badge: 'En popüler',
        features: [
          'Sınırsız ürün ve kategori',
          'Tüm premium temalar',
          'Tüm ödeme & kargo entegrasyonları',
          'İndirim & kampanya modülü',
          'Detaylı satış raporları',
          'Öncelikli destek',
        ],
      },
      {
        id: 'aserai-kurumsal',
        name: 'Kurumsal',
        summary: 'Yüksek hacimli, çok mağazalı işletmeler için.',
        monthly: 2990,
        yearlyMonthly: 2390,
        highlight: false,
        features: [
          'Profesyonel paketteki her şey',
          'Çoklu mağaza yönetimi',
          'Markanıza özel tema tasarımı',
          'API & ERP entegrasyonu',
          'Özel müşteri temsilcisi',
          '7/24 telefon desteği',
        ],
      },
    ],
  },

  iberai: {
    key: 'iberai',
    label: 'Iberai',
    note: 'Pazaryeri entegrasyonu',
    tiers: [
      {
        id: 'iberai-baslangic',
        name: 'Başlangıç',
        summary: 'İlk pazaryeri satışlarına başlayanlar için.',
        monthly: 490,
        yearlyMonthly: 390,
        highlight: false,
        features: [
          '3 pazaryeri bağlantısı',
          '1.000 ürüne kadar',
          'Stok & fiyat senkronizasyonu',
          'Sipariş aktarımı',
          'E-posta destek',
        ],
      },
      {
        id: 'iberai-profesyonel',
        name: 'Profesyonel',
        summary: 'Çok kanallı satışı büyütenler için en avantajlı seçim.',
        monthly: 990,
        yearlyMonthly: 790,
        highlight: true,
        badge: 'En popüler',
        features: [
          'Sınırsız pazaryeri bağlantısı',
          'Sınırsız ürün',
          'Otomatik stok & fiyat senkronu',
          'Toplu ürün düzenleme',
          'Komisyon & karlılık raporu',
          'Öncelikli destek',
        ],
      },
      {
        id: 'iberai-kurumsal',
        name: 'Kurumsal',
        summary: 'Çok markalı ve yüksek sipariş hacimli ekipler için.',
        monthly: 1890,
        yearlyMonthly: 1490,
        highlight: false,
        features: [
          'Profesyonel paketteki her şey',
          'Çoklu mağaza & marka yönetimi',
          'XML / API ile ürün aktarımı',
          'Depo & fatura entegrasyonu',
          'Özel müşteri temsilcisi',
          '7/24 telefon desteği',
        ],
      },
    ],
  },

  paket: {
    key: 'paket',
    label: 'Aserai + Iberai',
    note: 'Tam kapsamlı paket',
    tiers: [
      {
        id: 'paket-baslangic',
        name: 'Başlangıç',
        summary: 'Mağaza ve pazaryeri satışına birlikte başlayın.',
        monthly: 1190,
        yearlyMonthly: 890,
        highlight: false,
        features: [
          'Aserai e-ticaret mağazası',
          'Iberai · 3 pazaryeri bağlantısı',
          '500 ürüne kadar',
          'Tek panelden yönetim',
          'E-posta destek',
        ],
      },
      {
        id: 'paket-profesyonel',
        name: 'Profesyonel',
        summary: 'Tüm kanallarda satışı büyütmek için tam paket.',
        monthly: 1990,
        yearlyMonthly: 1590,
        highlight: true,
        badge: 'En avantajlı',
        features: [
          'Aserai Profesyonel + Iberai Profesyonel',
          'Sınırsız ürün ve pazaryeri',
          'Tüm ödeme, kargo ve pazaryeri entegrasyonları',
          'Birleşik satış & karlılık raporları',
          'Tek faturada paket avantajı',
          'Öncelikli destek',
        ],
      },
      {
        id: 'paket-kurumsal',
        name: 'Kurumsal',
        summary: 'Kurumsal ölçekte uçtan uca satış altyapısı.',
        monthly: 3990,
        yearlyMonthly: 2990,
        highlight: false,
        features: [
          'Aserai Kurumsal + Iberai Kurumsal',
          'Çoklu mağaza & marka yönetimi',
          'Özel tema + API / ERP entegrasyonu',
          'Özel müşteri temsilcisi',
          'Kurulum & veri taşıma desteği',
          '7/24 telefon desteği',
        ],
      },
    ],
  },
}

export const productOrder = ['aserai', 'iberai', 'paket']

export const formatTL = (n) => n.toLocaleString('tr-TR')

/* Yıllık ödemede yıl boyunca yapılan tasarruf */
export const yearlySaving = (tier) =>
  (tier.monthly - tier.yearlyMonthly) * 12
