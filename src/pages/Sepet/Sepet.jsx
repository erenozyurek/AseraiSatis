import { Link, Navigate, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import BillingToggle from '../../components/BillingToggle/BillingToggle.jsx'
import { formatTL } from '../../data/pricing.js'
import { useCatalog } from '../../context/CatalogContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import './Sepet.css'

export default function Sepet() {
  const navigate = useNavigate()
  const { modules: addonModules } = useCatalog()
  const { user, isAdmin, loading } = useAuth()
  const {
    tier,
    billing,
    setBilling,
    moduleIds,
    toggleModule,
    removePackage,
    packagePrice,
    modulesTotal,
    total,
  } = useCart()

  if (loading || (user && isAdmin === null)) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <span style={{ color: 'var(--c-text-muted)' }}>Yükleniyor…</span>
      </div>
    )
  }

  if (isAdmin) {
    return <Navigate to="/yonetim" replace />
  }

  if (!tier) {
    return (
      <>
        <PageHeader eyebrow="Sepet" title="Sepetiniz boş" />
        <section className="section">
          <div className="container sepet-empty">
            <p>Henüz bir paket seçmediniz.</p>
            <Link to="/paketler" className="btn btn--primary btn--lg">
              Paketleri İncele
            </Link>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Sepet"
        title="Siparişinizi tamamlayın"
        text="Paketinizi gözden geçirin, dilerseniz ek modüller ekleyin ve ödemeye geçin."
      />

      <section className="section">
        <div className="container sepet">
          {/* Sol: içerik */}
          <div className="sepet__main">
            <div className="sepet__billing">
              <BillingToggle billing={billing} onChange={setBilling} />
            </div>

            {/* Seçilen paket */}
            <div className="sepet__block">
              <h2>Seçilen paket</h2>
              <div className="sepet__pkg">
                <div>
                  <strong>{tier.name} Paketi</strong>
                  <span className="sepet__muted">{tier.summary}</span>
                </div>
                <div className="sepet__pkg-right">
                  <span className="sepet__price">
                    ₺{formatTL(packagePrice)}
                    <small> / ay</small>
                  </span>
                  <button
                    type="button"
                    className="sepet__remove"
                    onClick={removePackage}
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            </div>

            {/* Ek modüller */}
            <div className="sepet__block">
              <h2>Ek modüller</h2>
              <p className="sepet__muted sepet__hint">
                İhtiyacınıza göre modül ekleyin; dilediğiniz an çıkarabilirsiniz.
              </p>
              <ul className="sepet__modules">
                {addonModules.map((m) => {
                  const active = moduleIds.includes(m.id)
                  return (
                    <li
                      key={m.id}
                      className={`sepet__module ${active ? 'is-active' : ''}`}
                    >
                      <label>
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleModule(m.id)}
                        />
                        <span className="sepet__module-info">
                          <strong>{m.name}</strong>
                          <small>{m.desc}</small>
                        </span>
                      </label>
                      <span className="sepet__module-price">
                        +₺{formatTL(m.monthly)} / ay
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Sağ: özet */}
          <aside className="sepet__summary">
            <h2>Özet</h2>
            <div className="sepet__row">
              <span>{tier.name} Paketi</span>
              <span>₺{formatTL(packagePrice)}</span>
            </div>
            {moduleIds.length > 0 && (
              <div className="sepet__row">
                <span>Ek modüller ({moduleIds.length})</span>
                <span>₺{formatTL(modulesTotal)}</span>
              </div>
            )}
            <div className="sepet__row sepet__row--total">
              <span>Aylık toplam</span>
              <span>₺{formatTL(total)}</span>
            </div>
            <p className="sepet__vat">Fiyatlara KDV dahil değildir.</p>
            <button
              type="button"
              className="btn btn--primary btn--block btn--lg"
              onClick={() => navigate('/odeme')}
            >
              Ödemeye Geç
            </button>
            <Link to="/paketler" className="sepet__back">
              ← Paketlere dön
            </Link>
          </aside>
        </div>
      </section>
    </>
  )
}
