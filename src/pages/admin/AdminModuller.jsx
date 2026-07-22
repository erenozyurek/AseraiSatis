import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { logAdminAction } from '../../lib/auditLog.js'
import { useCatalog } from '../../context/CatalogContext.jsx'
import { moduleGroups, packageModuleTierIds } from '../../data/packageModules.js'
import '../panel/panel.css'

const CATEGORY_OPTIONS = [...moduleGroups.map((group) => group.title), 'Diğer Modüller']

export default function AdminModuller() {
  const { refresh } = useCatalog()
  const [modules, setModules] = useState(null)
  const [savingId, setSavingId] = useState(null)
  const [savedId, setSavedId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const slugify = (value) =>
    value
      .trim()
      .toLocaleLowerCase('tr-TR')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const uniqueSlug = (name) => {
    const base = slugify(name) || `modul-${Date.now()}`
    const existing = new Set((modules || []).map((mod) => mod.slug))
    if (!existing.has(base)) return base

    let index = 2
    while (existing.has(`${base}-${index}`)) index += 1
    return `${base}-${index}`
  }

  const load = async () => {
    if (!supabase) {
      setModules([])
      setError('Veritabanı bağlantısı bulunamadı.')
      return
    }
    const { data, error: loadError } = await supabase
      .from('modules')
      .select('*')
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true })
    if (loadError) {
      setError(loadError.message || 'Modüller yüklenemedi.')
      setModules([])
      return
    }
    setModules(data || [])
  }

  useEffect(() => {
    load()
  }, [])

  const save = async (mod, e) => {
    e.preventDefault()
    if (!supabase) {
      setError('Veritabanı bağlantısı bulunamadı.')
      return
    }
    const f = e.target
    setSavingId(mod.id)
    setSavedId(null)
    setMessage('')
    setError('')
    const payload = {
      name: f.elements.name.value,
      description: f.elements.description.value,
      category: f.elements.category.value,
      monthly: Number(f.elements.monthly.value),
      is_active: f.elements.is_active.checked,
      updated_at: new Date().toISOString(),
    }
    const { error: updateError } = await supabase
      .from('modules')
      .update(payload)
      .eq('id', mod.id)
    if (updateError) {
      setError(updateError.message || 'Modül kaydedilemedi.')
      setSavingId(null)
      return
    }
    await logAdminAction('module.update', 'module', mod.id, {
      name: payload.name,
      category: payload.category,
      monthly: payload.monthly,
      is_active: payload.is_active,
    })
    setSavingId(null)
    setSavedId(mod.id)
    load()
    refresh()
  }

  const createModule = async (e) => {
    e.preventDefault()
    if (!supabase) {
      setError('Veritabanı bağlantısı bulunamadı.')
      return
    }
    const f = e.target
    setCreating(true)
    setSavedId(null)
    setMessage('')
    setError('')

    const name = f.elements.name.value.trim()
    const payload = {
      slug: uniqueSlug(name),
      name,
      description: f.elements.description.value.trim(),
      category: f.elements.category.value,
      monthly: Number(f.elements.monthly.value),
      is_active: f.elements.is_active.checked,
      sort_order:
        (modules || []).reduce(
          (max, mod) => Math.max(max, Number(mod.sort_order) || 0),
          0,
        ) + 1,
      updated_at: new Date().toISOString(),
    }

    const { error: insertError } = await supabase
      .from('modules')
      .insert(payload)

    if (insertError) {
      setError(insertError.message || 'Modül eklenemedi.')
      setCreating(false)
      return
    }

    const { error: ruleError } = await supabase.from('package_module_rules').insert(
      packageModuleTierIds.map((packageSlug) => ({
        package_slug: packageSlug,
        module_slug: payload.slug,
        status: 'addable',
      })),
    )

    if (ruleError) {
      setError(ruleError.message || 'Modül paket karşılaştırmasına eklenemedi.')
      setCreating(false)
      return
    }

    const { data: createdModule } = await supabase
      .from('modules')
      .select('id, slug')
      .eq('slug', payload.slug)
      .maybeSingle()

    await logAdminAction('module.create', 'module', createdModule?.id || payload.slug, {
      name: payload.name,
      slug: payload.slug,
      category: payload.category,
      monthly: payload.monthly,
      is_active: payload.is_active,
    })
    f.reset()
    f.elements.is_active.checked = true
    setCreating(false)
    setMessage('Yeni modül eklendi.')
    await load()
    refresh()
  }

  const deleteModule = async (mod) => {
    if (!supabase) {
      setError('Veritabanı bağlantısı bulunamadı.')
      return
    }
    setDeletingId(mod.id)
    setMessage('')
    setError('')
    const { error: deleteError } = await supabase
      .from('modules')
      .delete()
      .eq('id', mod.id)

    if (deleteError) {
      setError(
        deleteError.message ||
          'Modül silinemedi. Bu modül sipariş veya lisans kayıtlarında kullanılıyor olabilir.',
      )
      setDeletingId(null)
      return
    }

    await logAdminAction('module.delete', 'module', mod.id, {
      name: mod.name,
      slug: mod.slug,
      monthly: mod.monthly,
    })
    setDeletingId(null)
    setDeleteId(null)
    setMessage('Modül silindi.')
    await load()
    refresh()
  }

  return (
    <>
      <div className="panel-head">
        <h1>Modül Yönetimi</h1>
        <p>Ek modüllerin adı, açıklaması ve fiyatını yönetin.</p>
      </div>

      {message && (
        <div className="panel-card panel-note panel-note--success" role="status">
          {message}
        </div>
      )}

      {error && (
        <div className="panel-card panel-note panel-note--error" role="alert">
          {error}
        </div>
      )}

      {modules === null ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : (
        <div className="admin-edit-list">
          <form className="panel-card admin-edit" onSubmit={createModule}>
            <h2 className="panel-card__title">Yeni modül ekle</h2>
            <div className="admin-edit__row">
              <div className="field">
                <label>Modül adı</label>
                <input name="name" placeholder="Örn. Gelişmiş SEO Modülü" required />
              </div>
              <div className="field admin-field--sm">
                <label>Aylık (₺)</label>
                <input name="monthly" type="number" min="0" defaultValue="0" required />
              </div>
            </div>

            <div className="field">
              <label>Açıklama</label>
              <input
                name="description"
                placeholder="Modülün müşteriye görünecek kısa açıklaması"
              />
            </div>

            <div className="field">
              <label>Kategori</label>
              <select name="category" defaultValue={CATEGORY_OPTIONS[0]}>
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-edit__foot">
              <label className="admin-check">
                <input type="checkbox" name="is_active" defaultChecked />
                Aktif
              </label>
              <div className="admin-edit__actions">
                <button type="submit" className="btn btn--primary" disabled={creating}>
                  {creating ? 'Ekleniyor…' : 'Yeni modül ekle'}
                </button>
              </div>
            </div>
          </form>

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

              <div className="field">
                <label>Kategori</label>
                <select
                  name="category"
                  defaultValue={mod.category || CATEGORY_OPTIONS[0]}
                >
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
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
                  {deleteId === mod.id ? (
                    <div className="admin-delete-confirm">
                      <span>Silinsin mi?</span>
                      <button
                        type="button"
                        className="btn admin-danger"
                        disabled={deletingId === mod.id}
                        onClick={() => deleteModule(mod)}
                      >
                        {deletingId === mod.id ? 'Siliniyor…' : 'Evet, sil'}
                      </button>
                      <button
                        type="button"
                        className="btn"
                        disabled={deletingId === mod.id}
                        onClick={() => setDeleteId(null)}
                      >
                        Vazgeç
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn admin-danger"
                      disabled={savingId === mod.id}
                      onClick={() => setDeleteId(mod.id)}
                    >
                      Sil
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={savingId === mod.id || deletingId === mod.id}
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
