import { Link } from 'react-router-dom'
import { formatTL, yearlySaving } from '../../data/pricing.js'
import './PricingCard.css'

export default function PricingCard({ tier, billing }) {
  const yearly = billing === 'yearly'
  const price = yearly ? tier.yearlyMonthly : tier.monthly
  const saving = yearlySaving(tier)

  return (
    <article
      className={`pcard ${tier.highlight ? 'pcard--highlight' : ''}`}
    >
      {tier.badge && <span className="pcard__badge">{tier.badge}</span>}

      <div className="pcard__head">
        <h3>{tier.name}</h3>
        <p className="pcard__summary">{tier.summary}</p>
      </div>

      <div className="pcard__price">
        <div className="pcard__amount">
          <span className="pcard__currency">₺</span>
          <span className="pcard__value">{formatTL(price)}</span>
          <span className="pcard__period">/ ay</span>
        </div>
        {yearly ? (
          <p className="pcard__hint pcard__hint--save">
            <s>₺{formatTL(tier.monthly)}/ay</s> yerine · yıllık faturalandırılır
            <strong> Yılda ₺{formatTL(saving)} tasarruf</strong>
          </p>
        ) : (
          <p className="pcard__hint">
            Yıllık ödeyin, ayda{' '}
            <strong>₺{formatTL(tier.yearlyMonthly)}</strong>’ye düşsün
          </p>
        )}
      </div>

      <Link
        to="/iletisim"
        className={`btn btn--block ${
          tier.highlight ? 'btn--primary' : 'btn--ghost'
        }`}
      >
        Paketi Seç
      </Link>

      <ul className="pcard__features">
        {tier.features.map((f) => (
          <li key={f}>
            <span className="pcard__check" aria-hidden="true">
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
    </article>
  )
}
