import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { logAdminAction } from '../../lib/auditLog.js'
import { useCatalog } from '../../context/CatalogContext.jsx'
import '../panel/panel.css'

export default function AdminModuller() {
  const { refresh } = useCatalog()
  const [modules, setModules] = useState(null)
  const [savingId, setSavingId] = useState(null)
  const [savedId, setSavedId] = useState(null)

  const load = async () => {
    if (!supabase) return
    const { data } = await supabase
      .from('modules')
      .select('*')
      .order('sort_order', { ascending: true })
    setModules(data || [])
  }

  useEffect(() => {
    load()
  }, [])

  const save = async (mod, e) => {
    e.preventDefault()
    const f = e.target
    setSavingId(mod.id)
    setSavedId(null)
    const payload = {
      name: f.name.value,
      description: f.description.value,
      monthly: Number(f.monthly.value),
      is_active: f.is_active.checked,
      updated_at: new Date().toISOString(),
    }
    await supabase
      .from('modules')
      .update(payload)
      .eq('id', mod.id)
    await logAdminAction('module.update', 'module', mod.id, {
      name: payload.name,
      monthly: payload.monthly,
      is_active: payload.is_active,
    })
    setSavingId(null)
    setSavedId(mod.id)
    load()
    refresh()
  }

  return (
    <>
      <div className="panel-head">
        <h1>Modül Yönetimi</h1>
        <p>Ek modüllerin adı, açıklaması ve fiyatını düzenleyin.</p>
      </div>

      {modules === null ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : (
        <div className="admin-edit-list">
          {modules.map((mod) => (
            <form
              key={mod.id}
              className="panel-card admin-edit"
              onSubmit={(e) => save(mod, e)}
            >
              <div className="admin-edit__row">
                <div className="field">
                  <label>Modül adı</label>
                  <input name="name" defaultValue={mod.name} required />
                </div>
                <div className="field admin-field--sm">
                  <label>Aylık (₺)</label>
                  <input
                    name="monthly"
                    type="number"
                    min="0"
                    defaultValue={mod.monthly}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>Açıklama</label>
                <input name="description" defaultValue={mod.description || ''} />
              </div>

              <div className="admin-edit__foot">
                <label className="admin-check">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={mod.is_active}
                  />
                  Aktif
                </label>
                <div className="admin-edit__actions">
                  {savedId === mod.id && (
                    <span className="panel-saved">✓ Kaydedildi</span>
                  )}
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={savingId === mod.id}
                  >
                    {savingId === mod.id ? 'Kaydediliyor…' : 'Kaydet'}
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
