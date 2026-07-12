/* ============================================================
   Satın alınabilir ek modüller (paket sepete eklendiğinde eklenebilir)
   Fiyatlar aylık TL — örnektir, güncellenecektir.
   ============================================================ */

export const addonModules = [
  {
    id: 'e-fatura',
    name: 'E-Fatura & E-Arşiv',
    desc: 'GİB entegrasyonuyla otomatik e-fatura/e-arşiv.',
    monthly: 249,
  },
  {
    id: 'pazaryeri',
    name: 'Pazaryeri Entegrasyonu',
    desc: 'Trendyol, Hepsiburada, Amazon ve daha fazlası.',
    monthly: 499,
  },
  {
    id: 'muhasebe',
    name: 'Muhasebe Entegrasyonu',
    desc: 'Satış ve faturaları muhasebe programınıza aktarın.',
    monthly: 299,
  },
  {
    id: 'b2b',
    name: 'B2B Modülü',
    desc: 'Bayi/toptan için özel fiyat listeleri ve cari hesap.',
    monthly: 399,
  },
  {
    id: 'kampanya',
    name: 'Kampanya & Kupon Yönetimi',
    desc: 'İndirim kuponları ve sepet kampanya senaryoları.',
    monthly: 199,
  },
  {
    id: 'raporlama',
    name: 'Gelişmiş Raporlama & Analitik',
    desc: 'Canlı ciro, dönüşüm ve kanal performans raporları.',
    monthly: 299,
  },
]

export const getModule = (id) => addonModules.find((m) => m.id === id)
