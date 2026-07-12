import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useCatalog } from '../../context/CatalogContext.jsx'
import '../panel/panel.css'

export default function AdminPaketler() {
  const { refresh } = useCatalog()
  const [packages, setPackages] = useState(null)
  const [savingId, setSavingId] = useState(null)
  const [savedId, setSavedId] = useState(null)

  const load = async () => {
    if (!supabase) return
    const { data } = await supabase
      .from('packages')
      .select('*')
      .order('sort_order', { ascending: true })
    setPackages(data || [])
  }

  useEffect(() => {
    load()
  }, [])

  const save = async (pkg, e) => {
    e.preventDefault()
    const f = e.target
    setSavingId(pkg.id)
    setSavedId(null)
    await supabase
      .from('packages')
      .update({
        name: f.name.value,
        summary: f.summary.value,
        monthly: Number(f.monthly.value),
        yearly_monthly: Number(f.yearly_monthly.value),
        badge: f.badge.value.trim() || null,
        highlight: f.highlight.checked,
        is_active: f.is_active.checked,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pkg.id)
    setSavingId(null)
    setSavedId(pkg.id)
    load()
    refresh() // public katalog anında güncellensin
  }

  return (
    <>
      <div className="panel-head">
        <h1>Paket Yönetimi</h1>
        <p>
          Paket adı, fiyat ve vurgu ayarlarını düzenleyin. Değişiklikler public
          sitede anında yansır.
        </p>
      </div>

      {packages === null ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : (
        <div className="admin-edit-list">
          {packages.map((pkg) => (
            <form
              key={pkg.id}
              className="panel-card admin-edit"
              onSubmit={(e) => save(pkg, e)}
            >
              <div className="admin-edit__row">
                <div className="field">
                  <label>Paket adı</label>
                  <input name="name" defaultValue={pkg.name} required />
                </div>
                <div className="field">
                  <label>Rozet (opsiyonel)</label>
                  <input
                    name="badge"
                    defaultValue={pkg.badge || ''}
                    placeholder="ör. En popüler"
                  />
                </div>
              </div>

              <div className="field">
                <label>Açıklama</label>
                <input name="summary" defaultValue={pkg.summary || ''} />
              </div>

              <div className="admin-edit__row">
                <div className="field">
                  <label>Aylık (₺)</label>
                  <input
                    name="monthly"
                    type="number"
                    min="0"
                    defaultValue={pkg.monthly}
                    required
                  />
                </div>
                <div className="field">
                  <label>Yıllıkta aylık (₺)</label>
                  <input
                    name="yearly_monthly"
                    type="number"
                    min="0"
                    defaultValue={pkg.yearly_monthly}
                    required
                  />
                </div>
              </div>

              <div className="admin-edit__foot">
                <label className="admin-check">
                  <input
                    type="checkbox"
                    name="highlight"
                    defaultChecked={pkg.highlight}
                  />
                  Vurgulu
                </label>
                <label className="admin-check">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={pkg.is_active}
                  />
                  Aktif
                </label>
                <div className="admin-edit__actions">
                  {savedId === pkg.id && (
                    <span className="panel-saved">✓ Kaydedildi</span>
                  )}
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={savingId === pkg.id}
                  >
                    {savingId === pkg.id ? 'Kaydediliyor…' : 'Kaydet'}
                  </button>
                </div>
              </div>
            </form>
          ))}
        </div>
      )}
    </>
  )
}
