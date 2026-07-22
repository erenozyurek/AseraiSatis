import { Fragment, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  pricing,
  formatTL,
  yearlySaving,
} from '../../data/pricing.js'
import {
  moduleGroups,
  PACKAGE_MODULE_STATUSES,
} from '../../data/packageModules.js'
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

const Dash = () => (
  <span className="cmp__dash" aria-label="Dahil değil">
    —
  </span>
)

const TIER_IDS = ['baslangic', 'standart', 'profesyonel', 'e-ihracat']
const CATEGORY_ORDER = moduleGroups.map((group) => group.title)

export default function ComparisonTable() {
  const [billing, setBilling] = useState('yearly')
  const [selectedAddons, setSelectedAddons] = useState({})
  const yearly = billing === 'yearly'
  const navigate = useNavigate()
  const { selectPackage } = useCart()
  const { modules, getPackage, getPackageModuleStatus, refresh } = useCatalog()
  const { user, isAdmin } = useAuth()
  const { editMode } = useEditMode()
  const editing = editMode && isAdmin
  const canShop = !user || isAdmin === false
  const [savingSlug, setSavingSlug] = useState(null)

  const handleSelect = (tierId) => {
    if (!canShop) {
      if (isAdmin) navigate('/yonetim')
      return
    }
    selectPackage(tierId, billing, selectedAddons[tierId] || [])
    navigate('/sepet')
  }

  const toggleAddon = (tierId, moduleId) => {
    setSelectedAddons((current) => {
      const active = current[tierId] || []
      const next = active.includes(moduleId)
        ? active.filter((id) => id !== moduleId)
        : [...active, moduleId]
      return { ...current, [tierId]: next }
    })
  }

  const getAddonTotal = (tierId) =>
    (selectedAddons[tierId] || []).reduce((sum, moduleId) => {
      const module = modules.find((item) => item.id === moduleId)
      return sum + (module?.monthly || 0)
    }, 0)

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
  const tiers = TIER_IDS.map(
    (id) => getPackage(id) || pricing.aserai.tiers.find((t) => t.id === id),
  )

  const groupedModules = useMemo(() => {
    const groups = new Map()
    modules
      .filter((module) =>
        TIER_IDS.some((tierId) => getPackageModuleStatus(tierId, module.id)),
      )
      .forEach((module) => {
        const category = module.category || 'Diğer Modüller'
        if (!groups.has(category)) groups.set(category, [])
        groups.get(category).push(module)
      })

    return Array.from(groups.entries())
      .map(([title, rows]) => ({
        title,
        rows: rows
          .slice()
          .sort(
            (a, b) =>
              (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0) ||
              a.name.localeCompare(b.name, 'tr'),
          ),
      }))
      .sort((a, b) => {
        const ai = CATEGORY_ORDER.indexOf(a.title)
        const bi = CATEGORY_ORDER.indexOf(b.title)
        if (ai === -1 && bi === -1) return a.title.localeCompare(b.title, 'tr')
        if (ai === -1) return 1
        if (bi === -1) return -1
        return ai - bi
      })
  }, [modules, getPackageModuleStatus])

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
                const addonsTotal = getAddonTotal(tier.id)
                const packagePrice = yearly ? tier.yearlyMonthly : tier.monthly
                const price = packagePrice + addonsTotal
                const saving = yearlySaving(tier)
                const yearlyTotal = (tier.yearlyMonthly + addonsTotal) * 12
                const selectedCount = selectedAddons[tier.id]?.length || 0
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

                        {selectedCount > 0 && (
                          <span className="cmp__addon-total">
                            {selectedCount} ek modül dahil · +₺
                            {formatTL(addonsTotal)}/ay
                          </span>
                        )}

                        {yearly ? (
                          <span className="cmp__save cmp__save--yes">
                            <s>₺{formatTL(tier.monthly)}/ay</s> yerine · yıllık
                            faturalandırılır
                            <span className="cmp__yearly-total">
                              Yıllık toplam ₺{formatTL(yearlyTotal)}
                            </span>
                            <strong>Yılda ₺{formatTL(saving)} tasarruf</strong>
                          </span>
                        ) : (
                          <span className="cmp__save">
                            Yıllık ödeyin, ayda{' '}
                            <strong>₺{formatTL(tier.yearlyMonthly)}</strong>’ye
                            düşsün
                            <span className="cmp__yearly-total">
                              Yıllık toplam ₺{formatTL(yearlyTotal)}
                            </span>
                          </span>
                        )}

                        {canShop && (
                          <button
                            type="button"
                            onClick={() => handleSelect(tier.id)}
                            className={`btn btn--block ${
                              tier.highlight ? 'btn--dark' : 'btn--ghost'
                            } cmp__col-cta`}
                          >
                            Paketi Seç
                          </button>
                        )}
                      </>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {groupedModules.map((group) => (
              <Fragment key={group.title}>
                <tr className="cmp__group">
                  <th scope="colgroup" colSpan={tiers.length + 1}>
                    {group.title}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.id}>
                    <th scope="row" className="cmp__row-head">
                      <span>{row.name}</span>
                      {row.monthly > 0 && (
                        <small>+₺{formatTL(row.monthly)} / ay</small>
                      )}
                    </th>
                    {tiers.map((tier) => {
                      const status = getPackageModuleStatus(tier.id, row.id)
                      const isAddable =
                        status === PACKAGE_MODULE_STATUSES.ADDABLE && row.monthly > 0
                      const isSelected = selectedAddons[tier.id]?.includes(row.id)
                      return (
                        <td
                          key={tier.id}
                          className={tier.highlight ? 'is-highlight' : ''}
                          data-label={tier.name}
                        >
                          {status === PACKAGE_MODULE_STATUSES.INCLUDED ? (
                            <span className="cmp__status cmp__status--included">
                              Temel Özellik
                            </span>
                          ) : isAddable ? (
                            <button
                              type="button"
                              className={`cmp__status cmp__status--addable ${
                                isSelected ? 'is-selected' : ''
                              }`}
                              onClick={() => toggleAddon(tier.id, row.id)}
                              disabled={!canShop}
                              aria-label={
                                isSelected
                                  ? `${row.name} modülünü sepetten çıkar`
                                  : `${row.name} modülünü sepete ekle`
                              }
                              title={
                                isSelected
                                  ? 'Sepetten çıkar'
                                  : 'Sepete ekle'
                              }
                            >
                              <span aria-hidden="true">
                                {isSelected ? '✓' : '+'}
                              </span>
                            </button>
                          ) : status === PACKAGE_MODULE_STATUSES.ADDABLE ? (
                            <span className="cmp__status cmp__status--addable">
                              <span aria-hidden="true">+</span>
                            </span>
                          ) : (
                            <Dash />
                          )}
                        </td>
                      )
                    })}
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
