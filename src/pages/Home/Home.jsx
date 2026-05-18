import { Link } from 'react-router-dom'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import './Home.css'

const Icon = ({ path }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path
      d={path}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const solutions = [
  {
    tag: 'Aserai',
    to: '/aserai',
    title: 'E-Ticaret Altyapısı',
    desc: 'Kendi markanızla satış yapın. Hazır temalar, mobil uyumlu mağaza, ödeme ve kargo entegrasyonlarıyla dakikalar içinde yayında olun.',
    points: [
      'Sınırsız ürün ve kategori',
      'Mobil uyumlu hazır temalar',
      'Ödeme & kargo entegrasyonları',
    ],
    iconPath:
      'M3 9l1.5-5h15L21 9M3 9h18M3 9v10a1 1 0 001 1h16a1 1 0 001-1V9M9 13h6',
  },
  {
    tag: 'Iberai',
    to: '/iberai',
    title: 'Pazaryeri Entegrasyonu',
    desc: 'Trendyol, Hepsiburada, Amazon ve daha fazlasını tek panelden yönetin. Stok ve fiyatlarınız her kanalda otomatik senkron.',
    points: [
      '20+ pazaryeri bağlantısı',
      'Otomatik stok & fiyat senkronu',
      'Toplu ürün ve sipariş yönetimi',
    ],
    iconPath:
      'M4 7h16M4 12h16M4 17h16M8 3v18M16 3v18',
  },
]

const features = [
  {
    title: 'Tek Panelden Yönetim',
    desc: 'Mağazanızı, siparişlerinizi ve tüm pazaryeri kanallarınızı tek ekrandan kontrol edin.',
    iconPath: 'M4 5h16v6H4zM4 15h7v4H4zM15 15h5v4h-5z',
  },
  {
    title: 'Otomatik Senkronizasyon',
    desc: 'Stok, fiyat ve sipariş bilgileri tüm kanallarda anlık ve hatasız güncellenir.',
    iconPath: 'M4 12a8 8 0 0114-5M20 12a8 8 0 01-14 5M17 4v3h-3M7 20v-3h3',
  },
  {
    title: 'Hazır & Özel Temalar',
    desc: 'Sektörünüze uygun şık temalardan seçin ya da markanıza özel tasarım oluşturun.',
    iconPath: 'M3 5h18v4H3zM3 11h10v8H3zM15 11h6v8h-6z',
  },
  {
    title: 'Detaylı Satış Raporları',
    desc: 'Ciro, dönüşüm ve kanal performansını canlı grafiklerle takip edin.',
    iconPath: 'M5 19V9M12 19V5M19 19v-7M3 21h18',
  },
  {
    title: 'Güvenli Ödeme Altyapısı',
    desc: 'PCI-DSS uyumlu altyapı ve tüm sanal POS sağlayıcılarıyla tam uyum.',
    iconPath:
      'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  },
  {
    title: '7/24 Uzman Desteği',
    desc: 'Kurulumdan büyümeye kadar her adımda size özel destek ekibi yanınızda.',
    iconPath:
      'M21 15a2 2 0 01-2 2H8l-4 4V5a2 2 0 012-2h13a2 2 0 012 2zM9 9h6M9 12h4',
  },
]

const steps = [
  {
    no: '01',
    title: 'Paketinizi Seçin',
    desc: 'Aserai, Iberai ya da ikisini birden kapsayan paketlerden işinize uygun olanı belirleyin.',
  },
  {
    no: '02',
    title: 'Mağazanızı Kurun',
    desc: 'Hazır temalarla mağazanızı oluşturun, pazaryeri hesaplarınızı tek tıkla bağlayın.',
  },
  {
    no: '03',
    title: 'Satışa Başlayın',
    desc: 'Tüm kanallarda yayına geçin, siparişleri tek panelden yönetip büyümeyi izleyin.',
  },
]

const pricePreview = [
  {
    name: 'Aserai',
    sub: 'E-ticaret altyapısı',
    monthly: 1490,
    yearlyMonthly: 1190,
    featured: false,
  },
  {
    name: 'Aserai + Iberai',
    sub: 'Tam kapsamlı paket',
    monthly: 1990,
    yearlyMonthly: 1590,
    featured: true,
  },
  {
    name: 'Iberai',
    sub: 'Pazaryeri entegrasyonu',
    monthly: 990,
    yearlyMonthly: 790,
    featured: false,
  },
]

const stats = [
  { value: '12.000+', label: 'Aktif işletme' },
  { value: '20+', label: 'Pazaryeri entegrasyonu' },
  { value: '%99,9', label: 'Sistem erişilebilirliği' },
  { value: '7/24', label: 'Teknik destek' },
]

const formatTL = (n) => n.toLocaleString('tr-TR')

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="hero__glow" aria-hidden="true" />
        <div className="container hero__inner">
          <div className="hero__content fade-up">
            <span className="eyebrow eyebrow--invert">
              E-Ticaret &amp; Pazaryeri Çözümleri
            </span>
            <h1>
              İşletmenizi her kanalda <span>büyüten</span> tek platform
            </h1>
            <p>
              Aserai ile kendi e-ticaret mağazanızı kurun, Iberai ile tüm
              pazaryerlerini tek panelden yönetin. Altyapı, entegrasyon ve
              destek tek pakette.
            </p>
            <div className="hero__actions">
              <Link to="/paketler" className="btn btn--invert btn--lg">
                Paketleri İncele
              </Link>
              <Link to="/demo" className="btn btn--outline-invert btn--lg">
                Ücretsiz Demo
              </Link>
            </div>
            <ul className="hero__points">
              <li>Kurulum ücreti yok</li>
              <li>14 gün ücretsiz deneme</li>
              <li>İstediğiniz an iptal</li>
            </ul>
          </div>

          <div className="hero__visual fade-up">
            <div className="mock">
              <div className="mock__bar">
                <span />
                <span />
                <span />
              </div>
              <div className="mock__body">
                <div className="mock__row">
                  <div>
                    <p className="mock__label">Bugünkü ciro</p>
                    <p className="mock__big">₺ 84.250</p>
                  </div>
                  <span className="mock__pill">▲ %18</span>
                </div>
                <div className="mock__chart" aria-hidden="true">
                  {[42, 60, 38, 72, 54, 88, 66].map((h, i) => (
                    <span key={i} style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="mock__channels">
                  {['Trendyol', 'Hepsiburada', 'Amazon'].map((c) => (
                    <div key={c} className="mock__channel">
                      <span className="mock__dot" />
                      {c}
                      <strong>Bağlı</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mock-float mock-float--order">
              <span className="mock-float__icon">✓</span>
              <div>
                <strong>Yeni sipariş</strong>
                <small>Iberai · Trendyol</small>
              </div>
            </div>
            <div className="mock-float mock-float--sync">
              <span className="mock-float__icon mock-float__icon--blue">⟳</span>
              <div>
                <strong>Stok senkron</strong>
                <small>1.480 ürün güncellendi</small>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ---------- İSTATİSTİK ŞERİDİ ---------- */}
      <section className="hero-stats">
        <div className="container hero-stats__grid">
          {stats.map((s) => (
            <div key={s.label} className="hero-stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- LOGO ŞERİDİ ---------- */}
      <section className="logos">
        <div className="container">
          <p className="logos__title">
            Türkiye'nin önde gelen markaları Aserai &amp; Iberai kullanıyor
          </p>
          <div className="logos__row">
            {['Moda Vitrin', 'TeknoMarket', 'EvBahçe', 'Lezzet Co.', 'SporZone', 'Kozmika'].map(
              (b) => (
                <span key={b} className="logos__item">
                  {b}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ---------- ÇÖZÜMLER ---------- */}
      <section className="section" id="cozumler">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">İki ürün, tek ekosistem</span>
            <h2>Aserai ve Iberai ile uçtan uca satış</h2>
            <p>
              İster kendi mağazanızı kurun, ister pazaryerlerinde satış yapın —
              ikisini birlikte kullanın, tüm operasyonu tek yerden yönetin.
            </p>
          </div>
          <div className="solutions">
            {solutions.map((s) => (
              <article key={s.tag} className="solution-card">
                <div className="solution-card__head">
                  <span className="solution-card__icon">
                    <Icon path={s.iconPath} />
                  </span>
                  <span className="solution-card__tag">{s.tag}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <ul className="solution-card__list">
                  {s.points.map((p) => (
                    <li key={p}>
                      <span className="check" aria-hidden="true">
                        ✓
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                <Link to={s.to} className="text-link">
                  {s.tag} detaylarını gör
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ÖZELLİKLER ---------- */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Neden Aserai &amp; Iberai?</span>
            <h2>Büyümeniz için ihtiyacınız olan her şey</h2>
            <p>
              Satışı kolaylaştıran, operasyonu hızlandıran ve sizi rakiplerin
              önüne taşıyan güçlü özellikler.
            </p>
          </div>
          <div className="features">
            {features.map((f) => (
              <article key={f.title} className="feature-card">
                <span className="feature-card__icon">
                  <Icon path={f.iconPath} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- NASIL ÇALIŞIR ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">3 adımda yayında</span>
            <h2>Başlamak çok kolay</h2>
            <p>
              Teknik bilgi gerektirmez. Paketinizi seçin, kurulumu yapın ve
              satışa başlayın.
            </p>
          </div>
          <div className="steps">
            {steps.map((step) => (
              <article key={step.no} className="step-card">
                <span className="step-card__no">{step.no}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FİYAT ÖNİZLEME ---------- */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Şeffaf fiyatlandırma</span>
            <h2>İşinize uygun paketi seçin</h2>
            <p>
              Aylık ya da yıllık ödeyin. Yıllık planlarda aylık maliyetiniz
              belirgin şekilde düşer.
            </p>
          </div>
          <div className="price-preview">
            {pricePreview.map((p) => (
              <article
                key={p.name}
                className={`price-card ${p.featured ? 'price-card--featured' : ''}`}
              >
                {p.featured && (
                  <span className="price-card__badge">En popüler</span>
                )}
                <h3>{p.name}</h3>
                <p className="price-card__sub">{p.sub}</p>
                <div className="price-card__amount">
                  <span className="price-card__currency">₺</span>
                  <span className="price-card__value">
                    {formatTL(p.monthly)}
                  </span>
                  <span className="price-card__period">/ ay</span>
                </div>
                <p className="price-card__yearly">
                  Yıllık ödemede{' '}
                  <strong>₺{formatTL(p.yearlyMonthly)}/ay</strong>'a kadar düşer
                </p>
                <Link
                  to="/paketler"
                  className={`btn btn--block ${
                    p.featured ? 'btn--primary' : 'btn--ghost'
                  }`}
                >
                  Paketi seç
                </Link>
              </article>
            ))}
          </div>
          <p className="price-preview__note">
            Tüm paketler, aylık/yıllık karşılaştırma ve özellik detayları{' '}
            <Link to="/paketler" className="text-link">
              Paketler sayfasında
              <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      {/* ---------- CTA ŞERİDİ ---------- */}
      <CtaBand />
    </>
  )
}
