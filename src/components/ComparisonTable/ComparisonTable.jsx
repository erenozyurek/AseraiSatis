import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  pricing,
  comparison,
  formatTL,
  yearlySaving,
} from '../../data/pricing.js'
import BillingToggle from '../BillingToggle/BillingToggle.jsx'
import './ComparisonTable.css'

/* ANA GEREKSİNİMLER — "Paket Karşılaştırma" ekranı.
   Kart tarzı zengin paket başlıkları (isim · fiyat · tasarruf · "Paketi Seç")
   ile altındaki özellik karşılaştırma satırlarını tek tabloda birleştirir.
   Standart sütunu vurgulanır. Aylık/Yıllık geçişi fiyatları günceller. */

const CheckMark = () => (
  <span className="cmp__check" aria-label="Dahil">
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M5 12.5l4.2 4.2L19 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
)

const Dash = () => (
  <span className="cmp__dash" aria-label="Dahil değil">
    —
  </span>
)

function Cell({ value }) {
  if (value === true) return <CheckMark />
  if (value === false) return <Dash />
  return <span className="cmp__text">{value}</span>
}

export default function ComparisonTable() {
  const [billing, setBilling] = useState('yearly')
  const yearly = billing === 'yearly'

  const tiers = comparison.tierIds.map((id) =>
    pricing.aserai.tiers.find((t) => t.id === id),
  )

  return (
    <div className="cmp" role="region" aria-label="Paket karşılaştırma tablosu">
      <BillingToggle billing={billing} onChange={setBilling} />

      <div className="cmp__scroll">
        <table className="cmp__table">
          <thead>
            <tr>
              <th className="cmp__corner" scope="col">
                <span className="cmp__corner-title">Paketler</span>
                <span className="cmp__corner-sub">
                  Tüm özellikleri karşılaştırın
                </span>
              </th>
              {tiers.map((tier) => {
                const price = yearly ? tier.yearlyMonthly : tier.monthly
                const saving = yearlySaving(tier)
                return (
                  <th
                    key={tier.id}
                    scope="col"
                    className={`cmp__col-head ${
                      tier.highlight ? 'is-highlight' : ''
                    }`}
                  >
                    {tier.badge && (
                      <span className="cmp__col-badge">{tier.badge}</span>
                    )}
                    <span className="cmp__col-name">{tier.name}</span>
                    <span className="cmp__col-summary">{tier.summary}</span>

                    <span className="cmp__price">
                      <span className="cmp__price-cur">₺</span>
                      <span className="cmp__price-val">{formatTL(price)}</span>
                      <span className="cmp__price-per">/ ay</span>
                    </span>

                    {yearly ? (
                      <span className="cmp__save cmp__save--yes">
                        <s>₺{formatTL(tier.monthly)}/ay</s> yerine · yıllık
                        faturalandırılır
                        <strong>Yılda ₺{formatTL(saving)} tasarruf</strong>
                      </span>
                    ) : (
                      <span className="cmp__save">
                        Yıllık ödeyin, ayda{' '}
                        <strong>₺{formatTL(tier.yearlyMonthly)}</strong>’ye
                        düşsün
                      </span>
                    )}

                    <Link
                      to="/iletisim"
                      className={`btn btn--block ${
                        tier.highlight ? 'btn--dark' : 'btn--ghost'
                      } cmp__col-cta`}
                    >
                      Paketi Seç
                    </Link>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {comparison.groups.map((group) => (
              <Fragment key={group.title}>
                <tr className="cmp__group">
                  <th scope="colgroup" colSpan={tiers.length + 1}>
                    {group.title}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="cmp__row-head">
                      {row.label}
                    </th>
                    {row.values.map((value, i) => (
                      <td
                        key={tiers[i].id}
                        className={tiers[i].highlight ? 'is-highlight' : ''}
                        data-label={tiers[i].name}
                      >
                        <Cell value={value} />
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <p className="cmp__note">
        Tüm paketlerde KDV hariç fiyatlandırma geçerlidir · 14 gün ücretsiz deneme
        · İstediğiniz an üst pakete geçiş
      </p>
    </div>
  )
}
