import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import './Referanslar.css'

const stats = [
  { value: '12.000+', label: 'Aktif işletme' },
  { value: '4,8 / 5', label: 'Ortalama memnuniyet puanı' },
  { value: '%98', label: 'Müşteri memnuniyeti' },
  { value: '50M+', label: 'İşlenen sipariş' },
]

const logos = [
  'Moda Vitrin',
  'TeknoMarket',
  'EvBahçe',
  'Lezzet Co.',
  'SporZone',
  'Kozmika',
  'Pati Dünyası',
  'Yeşil Market',
  'UrbanStyle',
  'BebeShop',
  'KitapEvi',
  'AromaCafe',
]

const cases = [
  {
    metric: '%140',
    label: 'ciro artışı',
    company: 'TeknoMarket',
    desc: 'Iberai ile 8 pazaryerine aynı anda açıldılar; stok senkronu sayesinde fazla satış sorunu tamamen ortadan kalktı.',
  },
  {
    metric: '3 kat',
    label: 'sipariş hacmi',
    company: 'EvBahçe',
    desc: 'Aserai mağazası ve pazaryeri entegrasyonunu birlikte kullanarak bir yılda sipariş hacmini üçe katladılar.',
  },
  {
    metric: '%60',
    label: 'daha az operasyon',
    company: 'Lezzet Co.',
    desc: 'Tüm kanalları tek panelden yöneterek sipariş ve stok operasyonuna ayırdıkları süreyi yarıdan fazla azalttılar.',
  },
]

const testimonials = [
  {
    quote:
      'Aserai ile mağazamızı iki günde açtık. Teknik bir ekibimiz yok ama her şeyi kendimiz yönetebiliyoruz.',
    name: 'Ahmet Yılmaz',
    company: 'Moda Vitrin · Kurucu',
  },
  {
    quote:
      'Iberai sayesinde altı farklı pazaryerini tek ekrandan yönetiyoruz. Stoklar artık hiçbir zaman uyumsuz değil.',
    name: 'Selin Acar',
    company: 'TeknoMarket · E-ticaret Müdürü',
  },
  {
    quote:
      'Paket halinde almak hem maliyeti düşürdü hem de iki ürünün tek panelde olması işimizi çok kolaylaştırdı.',
    name: 'Burak Şahin',
    company: 'EvBahçe · Operasyon Lideri',
  },
  {
    quote:
      'Destek ekibi gerçekten ulaşılabilir. Sorularımıza dakikalar içinde Türkçe yanıt alıyoruz.',
    name: 'Deniz Korkmaz',
    company: 'SporZone · Mağaza Sahibi',
  },
  {
    quote:
      'Yıllık pakete geçtiğimizde aylık maliyetimiz belirgin şekilde düştü. Fiyatlandırma tamamen şeffaf.',
    name: 'Gamze Aydın',
    company: 'Kozmika · Kurucu Ortak',
  },
  {
    quote:
      'Raporlar sayesinde hangi kanalın ne kadar kâr getirdiğini net görüyoruz. Kararlarımız artık veriye dayalı.',
    name: 'Emre Doğan',
    company: 'KitapEvi · Genel Müdür',
  },
]

const initials = (name) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')

export default function Referanslar() {
  return (
    <>
      <PageHeader
        eyebrow="Referanslar"
        title="Binlerce işletme Aserai ve Iberai ile büyüyor"
        text="Farklı sektörlerden on iki binden fazla işletme satışlarını platformumuz üzerinden yönetiyor. İşte bazı hikayeleri."
      />

      {/* ---------- İSTATİSTİK ---------- */}
      <section className="section ref-stats-section">
        <div className="container ref-stats">
          {stats.map((s) => (
            <div key={s.label} className="ref-stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- LOGOLAR ---------- */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Bize güvenenler</span>
            <h2>Her sektörden markalar</h2>
            <p>
              Moda, teknoloji, gıda, yayıncılık ve daha pek çok sektörden
              işletme platformumuzu tercih ediyor.
            </p>
          </div>
          <div className="ref-logos">
            {logos.map((name) => (
              <span key={name} className="ref-logo">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- VAKA ÖZETLERİ ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Başarı hikayeleri</span>
            <h2>Sonuçlar kendini gösteriyor</h2>
            <p>
              Müşterilerimizin Aserai ve Iberai ile elde ettiği somut
              kazanımlardan bazıları.
            </p>
          </div>
          <div className="ref-cases">
            {cases.map((c) => (
              <article key={c.company} className="ref-case">
                <div className="ref-case__metric">
                  <strong>{c.metric}</strong>
                  <span>{c.label}</span>
                </div>
                <p className="ref-case__desc">{c.desc}</p>
                <span className="ref-case__company">{c.company}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- MÜŞTERİ YORUMLARI ---------- */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Müşteri yorumları</span>
            <h2>Kullanıcılarımız ne diyor?</h2>
          </div>
          <div className="ref-quotes">
            {testimonials.map((t) => (
              <article key={t.name} className="ref-quote">
                <div className="ref-quote__stars" aria-label="5 üzerinden 5">
                  {'★★★★★'}
                </div>
                <p className="ref-quote__text">“{t.quote}”</p>
                <div className="ref-quote__author">
                  <span className="ref-quote__avatar">
                    {initials(t.name)}
                  </span>
                  <span>
                    <strong>{t.name}</strong>
                    <small>{t.company}</small>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Siz de bu hikayeye katılın"
        text="14 gün ücretsiz deneyin, işletmenizin nasıl büyüdüğünü görün."
        primaryLabel="Ücretsiz Dene"
        primaryTo="/demo"
        secondaryLabel="Paketleri Gör"
        secondaryTo="/paketler"
      />
    </>
  )
}
