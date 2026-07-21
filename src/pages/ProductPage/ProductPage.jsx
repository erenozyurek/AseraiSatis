import { Link } from 'react-router-dom'
import { productContent } from '../../data/products.js'
import ComparisonTable from '../../components/ComparisonTable/ComparisonTable.jsx'
import Icon from '../../components/Icon/Icon.jsx'
import Faq from '../../components/Faq/Faq.jsx'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import './ProductPage.css'

function StoreVisual() {
  const items = [
    { n: 'Sırt Çantası', p: '₺ 1.240' },
    { n: 'Spor Ayakkabı', p: '₺ 2.180' },
    { n: 'Kablosuz Kulaklık', p: '₺ 990' },
    { n: 'Akıllı Saat', p: '₺ 3.450' },
  ]
  return (
    <div className="pp-visual">
      <div className="pp-store">
        <div className="pp-store__bar">
          <span />
          <span />
          <span />
          <em>magazaniz.com</em>
        </div>
        <div className="pp-store__banner">
          <span className="pp-store__banner-tag">Yeni Sezon</span>
          <strong>%40’a varan indirim</strong>
        </div>
        <div className="pp-store__grid">
          {items.map((it) => (
            <div key={it.n} className="pp-store__item">
              <div className="pp-store__thumb" />
              <p className="pp-store__name">{it.n}</p>
              <p className="pp-store__price">{it.p}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="pp-float pp-float--a">
        <span className="pp-float__icon">₺</span>
        <div>
          <strong>Satış tamamlandı</strong>
          <small>Sepet tutarı ₺2.180</small>
        </div>
      </div>
    </div>
  )
}

function ChannelsVisual() {
  const channels = [
    { n: 'Trendyol', s: 'Senkron', ok: true },
    { n: 'Hepsiburada', s: 'Senkron', ok: true },
    { n: 'Amazon', s: 'Senkron', ok: true },
    { n: 'N11', s: 'Güncelleniyor', ok: false },
  ]
  return (
    <div className="pp-visual">
      <div className="pp-channels">
        <div className="pp-channels__head">
          <p>Pazaryeri kanalları</p>
          <span className="pp-channels__count">4 aktif</span>
        </div>
        {channels.map((c) => (
          <div key={c.n} className="pp-channels__row">
            <span className="pp-channels__logo">{c.n[0]}</span>
            <span className="pp-channels__name">{c.n}</span>
            <span
              className={`pp-channels__status ${
                c.ok ? 'is-ok' : 'is-sync'
              }`}
            >
              {c.s}
            </span>
          </div>
        ))}
        <div className="pp-channels__foot">
          Bugün senkronlanan ürün <strong>2.430</strong>
        </div>
      </div>
      <div className="pp-float pp-float--b">
        <span className="pp-float__icon pp-float__icon--blue">⟳</span>
        <div>
          <strong>Stok güncellendi</strong>
          <small>Tüm kanallarda</small>
        </div>
      </div>
    </div>
  )
}

export default function ProductPage({ slug }) {
  const data = productContent[slug]

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="phero">
        <div className="phero__glow" aria-hidden="true" />
        <div className="container phero__inner">
          <div className="phero__content fade-up">
            <span className="eyebrow eyebrow--invert">{data.eyebrow}</span>
            <h1>
              {data.heroTitle} <span>{data.heroHighlight}</span>{' '}
              {data.heroTitleEnd}
            </h1>
            <p className="phero__text">{data.heroText}</p>
            <div className="phero__actions">
              <Link to="/demo" className="btn btn--invert btn--lg">
                Ücretsiz Demo Talep Et
              </Link>
              <a href="#fiyatlandirma" className="btn btn--outline-invert btn--lg">
                Paketleri Gör
              </a>
            </div>
            <ul className="phero__bullets">
              {data.heroBullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
          <div className="phero__visual fade-up">
            {slug === 'aserai' ? <StoreVisual /> : <ChannelsVisual />}
          </div>
        </div>
      </section>

      {/* ---------- İSTATİSTİK ---------- */}
      <section className="pp-stats-wrap">
        <div className="container pp-stats">
          {data.stats.map((s) => (
            <div key={s.label} className="pp-stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- ÖZELLİKLER ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Özellikler</span>
            <h2>{data.name} ile neler yapabilirsiniz?</h2>
            <p>
              Satışı kolaylaştıran, operasyonu hızlandıran tüm araçlar tek
              pakette.
            </p>
          </div>
          <div className="pp-features">
            {data.features.map((f) => (
              <article key={f.title} className="pp-feature">
                <span className="pp-feature__icon">
                  <Icon path={f.iconPath} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ENTEGRASYONLAR ---------- */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Entegrasyonlar</span>
            <h2>{data.integrationsTitle}</h2>
            <p>{data.integrationsText}</p>
          </div>
          <div className="pp-integrations">
            {data.integrations.map((name) => (
              <span key={name} className="pp-integration">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FİYATLANDIRMA ---------- */}
      <section className="section" id="fiyatlandirma">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Fiyatlandırma</span>
            <h2>{data.pricingTitle}</h2>
            <p>{data.pricingText}</p>
          </div>
          {slug === 'aserai' ? (
            <ComparisonTable />
          ) : (
            <div className="pp-pricing-fallback">
              <p>
                Iberai paketleri ve güncel fiyatlandırma ayrı ürün sayfasında
                yayınlanmaktadır.
              </p>
              <a
                href="https://www.iberai.com.tr"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--primary btn--lg"
              >
                Iberai Paketlerini İncele
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ---------- SSS ---------- */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">SSS</span>
            <h2>{data.faqTitle}</h2>
          </div>
          <Faq items={data.faq} />
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <CtaBand title={data.ctaTitle} text={data.ctaText} />
    </>
  )
}
