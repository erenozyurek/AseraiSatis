import { useState } from 'react'
import Icon from '../../components/Icon/Icon.jsx'
import Faq from '../../components/Faq/Faq.jsx'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import './Yardim.css'

const categories = [
  {
    title: 'Başlangıç Rehberi',
    desc: 'Hesap oluşturma, mağaza kurulumu ve ilk ürün yükleme adımları.',
    count: 12,
    iconPath: 'M12 3l9 4-9 4-9-4 9-4zM3 12l9 4 9-4M3 17l9 4 9-4',
  },
  {
    title: 'Ürün & Stok',
    desc: 'Ürün ekleme, varyant yönetimi, toplu güncelleme ve stok takibi.',
    count: 18,
    iconPath: 'M20 7l-8-4-8 4v10l8 4 8-4V7zM4 7l8 4 8-4M12 11v10',
  },
  {
    title: 'Sipariş & Kargo',
    desc: 'Sipariş yönetimi, kargo entegrasyonu ve teslimat süreçleri.',
    count: 15,
    iconPath: 'M3 7h11v8H3zM14 10h4l3 3v2h-7zM7 19a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z',
  },
  {
    title: 'Ödeme & Fatura',
    desc: 'Sanal POS, ödeme yöntemleri, fatura ve abonelik işlemleri.',
    count: 9,
    iconPath: 'M3 6h18v12H3zM3 10h18M7 15h4',
  },
  {
    title: 'Hesap & Güvenlik',
    desc: 'Profil ayarları, kullanıcı rolleri ve güvenlik seçenekleri.',
    count: 8,
    iconPath: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  },
  {
    title: 'Entegrasyonlar',
    desc: 'Pazaryeri, ERP, muhasebe ve e-fatura entegrasyon ayarları.',
    count: 21,
    iconPath: 'M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1',
  },
]

const faq = [
  {
    q: 'Aserai ile mağazamı ne kadar sürede kurabilirim?',
    a: 'Hazır temalar ve toplu ürün yükleme sayesinde temel bir mağazayı birkaç saat içinde yayına alabilirsiniz. Kurulum sihirbazı her adımda size yol gösterir.',
  },
  {
    q: 'Ürünlerimi pazaryerlerinden toplu olarak aktarabilir miyim?',
    a: 'Evet. Excel, XML, API veya bağlantı ile toplu ürün aktarımı yapabilir; stok ve fiyatları tüm kanallarda otomatik senkron tutabilirsiniz.',
  },
  {
    q: 'Ödeme altyapısı için ne gerekiyor?',
    a: 'Anlaşmalı sanal POS sağlayıcınızı birkaç adımda bağlayabilirsiniz. Kurulumda destek ekibimiz size yardımcı olur.',
  },
  {
    q: 'Başka bir altyapıdan Aserai’ye nasıl geçerim?',
    a: 'Geçiş sürecinde destek ekibimiz ürün, müşteri ve sipariş verilerinizin aktarımında size eşlik eder; veri kaybı yaşamazsınız.',
  },
  {
    q: 'Destek ekibine nasıl ulaşırım?',
    a: 'Panel içinden destek talebi oluşturabilir, canlı destek hattını kullanabilir veya iletişim sayfamızdaki kanallardan bize ulaşabilirsiniz.',
  },
]

export default function Yardim() {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR')
  const includesQuery = (...values) =>
    !normalizedQuery ||
    values.some((value) =>
      String(value || '')
        .toLocaleLowerCase('tr-TR')
        .includes(normalizedQuery),
    )
  const visibleCategories = categories.filter((category) =>
    includesQuery(category.title, category.desc),
  )
  const visibleFaq = faq.filter((item) => includesQuery(item.q, item.a))

  return (
    <>
      {/* ---------- HERO + ARAMA ---------- */}
      <section className="yardim-hero">
        <div className="yardim-hero__glow" aria-hidden="true" />
        <div className="container yardim-hero__inner">
          <span className="eyebrow">Yardım Merkezi</span>
          <h1>Size nasıl yardımcı olabiliriz?</h1>
          <p>
            Aklınıza takılan her şeyin yanıtı burada. Bir konu arayın ya da
            aşağıdaki kategorilerden ilerleyin.
          </p>
          <form
            className="yardim-search"
            onSubmit={(e) => e.preventDefault()}
            role="search"
          >
            <span className="yardim-search__icon" aria-hidden="true">
              <Icon path="M11 4a7 7 0 105 12l4 4M11 4a7 7 0 015 12" />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Örneğin: ürün yükleme, kargo entegrasyonu…"
              aria-label="Yardım konusu ara"
            />
            <button type="submit" className="btn btn--primary">
              Ara
            </button>
          </form>
        </div>
      </section>

      {/* ---------- KATEGORİLER ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Kategoriler</span>
            <h2>Konu başlığına göre keşfedin</h2>
            <p>İhtiyacınıza en uygun başlığı seçin, ilgili rehberlere ulaşın.</p>
          </div>
          <div className="yardim-cats">
            {visibleCategories.map((c) => (
              <button
                key={c.title}
                type="button"
                className="yardim-cat"
                onClick={() => setQuery(c.title)}
              >
                <span className="yardim-cat__icon">
                  <Icon path={c.iconPath} />
                </span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <span className="yardim-cat__count">{c.count} makale</span>
              </button>
            ))}
          </div>
          {visibleCategories.length === 0 && (
            <p className="yardim-empty" role="status">
              Bu aramayla eşleşen yardım kategorisi bulunamadı.
            </p>
          )}
        </div>
      </section>

      {/* ---------- POPÜLER SORULAR ---------- */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Sık Sorulanlar</span>
            <h2>En çok merak edilenler</h2>
          </div>
          {visibleFaq.length > 0 ? (
            <Faq items={visibleFaq} />
          ) : (
            <p className="yardim-empty" role="status">
              Bu aramayla eşleşen sık sorulan soru bulunamadı.
            </p>
          )}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <CtaBand
        title="Aradığınızı bulamadınız mı?"
        text="Destek ekibimiz sorularınızı yanıtlamak için hazır. Bize ulaşın, en kısa sürede dönelim."
        primaryLabel="Destek Talebi Oluştur"
        primaryTo="/iletisim"
        secondaryLabel="Demo Talep Et"
        secondaryTo="/demo"
      />
    </>
  )
}
