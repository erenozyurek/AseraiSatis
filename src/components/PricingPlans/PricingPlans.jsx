import { useState } from 'react'
import { pricing } from '../../data/pricing.js'
import BillingToggle from '../BillingToggle/BillingToggle.jsx'
import PricingCard from '../PricingCard/PricingCard.jsx'
import './PricingPlans.css'

export default function PricingPlans({ productKeys, showTabs = false }) {
  const [billing, setBilling] = useState('yearly')
  const [active, setActive] = useState(productKeys[0])

  const product = pricing[active]

  if (!product) return null

  return (
    <div className="plans">
      {showTabs && (
        <div className="plans__tabs" role="tablist" aria-label="Ürün seçimi">
          {productKeys.map((key) => {
            const p = pricing[key]
            return (
              <button
                key={key}
                role="tab"
                aria-selected={active === key}
                className={`plans__tab ${active === key ? 'is-active' : ''}`}
                onClick={() => setActive(key)}
              >
                <span className="plans__tab-label">{p.label}</span>
                <span className="plans__tab-note">{p.note}</span>
                {key === 'paket' && (
                  <span className="plans__tab-flag">Avantajlı</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      <BillingToggle billing={billing} onChange={setBilling} />

      <div className="plans__grid">
        {product.tiers.map((tier) => (
          <PricingCard key={tier.id} tier={tier} billing={billing} />
        ))}
      </div>

      <p className="plans__foot">
        Tüm paketlerde KDV hariç fiyatlandırma geçerlidir · 14 gün ücretsiz
        deneme · İstediğiniz an iptal
      </p>
    </div>
  )
}
