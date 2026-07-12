import { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  pricing,
  comparison,
  formatTL,
  yearlySaving,
} from '../../data/pricing.js'
import { useCart } from '../../context/CartContext.jsx'
import { useCatalog } from '../../context/CatalogContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useEditMode } from '../../context/EditModeContext.jsx'
import { supabase } from '../../lib/supabase.js'
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
  const navigate = useNavigate()
  const { selectPackage } = useCart()
  const { getPackage, refresh } = useCatalog()
  const { isAdmin } = useAuth()
  const { editMode } = useEditMode()
  const editing = editMode && isAdmin
  const [savingSlug, setSavingSlug] = useState(null)

  const handleSelect = (tierId) => {
    selectPackage(tierId, billing)
    navigate('/sepet')
  }

  const savePackage = async (slug, e) => {
    e.preventDefault()
    const f = e.target
    setSavingSlug(slug)
    await supabase
      .from('packages')
      .update({
        name: f.name.value,
        summary: f.summary.value,
        monthly: Number(f.monthly.value),
        yearly_monthly: Number(f.yearly_monthly.value),
        badge: f.badge.value.trim() || null,
        highlight: f.highlight.checked,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug)
    await refresh()
    setSavingSlug(null)
  }

  // Sütunlar sabit karşılaştırma sırasında; paket bilgisi DB katalogundan gelir
  // (bulunamazsa statik veriye düşer, matris hizası korunur).
  const tiers = comparison.tierIds.map(
    (id) => getPackage(id) || pricing.aserai.tiers.find((t) => t.id === id),
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
                    } ${editing ? 'is-editing' : ''}`}
                  >
                    {editing ? (
                      <form
                        className="cmp__edit"
                        onSubmit={(e) => savePackage(tier.id, e)}
                      >
                        <input
                          name="name"
                          defaultValue={tier.name}
                          className="cmp__edit-in cmp__edit-in--name"
                          required
                        />
                        <input
                          name="summary"
                          defaultValue={tier.summary || ''}
                          className="cmp__edit-in"
                          placeholder="Açıklama"
                        />
                        <div className="cmp__edit-prices">
                          <label>
                            Aylık ₺
                            <input
                              name="monthly"
                              type="number"
                              min="0"
                              defaultValue={tier.monthly}
                              required
                            />
                          </label>
                          <label>
                            Yıllık ₺
                            <input
                              name="yearly_monthly"
                              type="number"
                              min="0"
                              defaultValue={tier.yearlyMonthly}
                              required
                            />
                          </label>
                        </div>
                        <input
                          name="badge"
                          defaultValue={tier.badge || ''}
                          className="cmp__edit-in cmp__edit-in--sm"
                          placeholder="Rozet (ör. En popüler)"
                        />
                        <label className="cmp__edit-check">
                          <input
                            type="checkbox"
                            name="highlight"
                            defaultChecked={tier.highlight}
                          />
                          Vurgulu sütun
                        </label>
                        <button
                          type="submit"
                          className="btn btn--primary btn--block"
                          disabled={savingSlug === tier.id}
                        >
                          {savingSlug === tier.id ? 'Kaydediliyor…' : 'Kaydet'}
                        </button>
                      </form>
                    ) : (
                      <>
                        {tier.badge && (
                          <span className="cmp__col-badge">{tier.badge}</span>
                        )}
                        <span className="cmp__col-name">{tier.name}</span>
                        <span className="cmp__col-summary">{tier.summary}</span>

                        <span className="cmp__price">
                          <span className="cmp__price-cur">₺</span>
                          <span className="cmp__price-val">
                            {formatTL(price)}
                          </span>
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

                        <button
                          type="button"
                          onClick={() => handleSelect(tier.id)}
                          className={`btn btn--block ${
                            tier.highlight ? 'btn--dark' : 'btn--ghost'
                          } cmp__col-cta`}
                        >
                          Paketi Seç
                        </button>
                      </>
                    )}
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
