import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useEditMode } from '../../context/EditModeContext.jsx'
import { useCatalog } from '../../context/CatalogContext.jsx'
import { logAdminAction } from '../../lib/auditLog.js'
import { moduleGroups, packageModuleTierIds } from '../../data/packageModules.js'
import './Moduller.css'

const Icon = ({ path }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
    <path
      d={path}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const PencilIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path
      d="M4 20h4L18 10l-4-4L4 16v4zM14 6l4 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const DEFAULT_ICON = 'M4 5h16v14H4zM4 9h16M9 9v10'
const CATEGORY_OPTIONS = [...moduleGroups.map((group) => group.title), 'Diğer Modüller']

export default function Moduller() {
  const { isAdmin } = useAuth()
  const { editMode } = useEditMode()
  const { modules, getPackageModuleStatus, refresh } = useCatalog()
  const editing = editMode && isAdmin

  const [editingId, setEditingId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')

  const list = useMemo(
    () =>
      modules.filter((module) =>
        packageModuleTierIds.some((packageId) =>
          getPackageModuleStatus(packageId, module.id),
        ),
      ),
    [modules, getPackageModuleStatus],
  )

  const openEdit = (module) => {
    setActionError('')
    setEditingId(module.id)
  }

  const saveModule = async (module, e) => {
    e.preventDefault()
    if (!supabase) {
      setActionError('Veritabanı bağlantısı bulunamadı.')
      return
    }
    const f = e.target
    setActionError('')
    setBusy(true)
    const { error } = await supabase
      .from('modules')
      .update({
        name: f.elements.title.value.trim(),
        description: f.elements.description.value.trim(),
        category: f.elements.category.value,
        monthly: Number(f.elements.monthly.value),
        updated_at: new Date().toISOString(),
      })
      .eq('slug', module.id)
    setBusy(false)
    if (error) {
      setActionError(error.message || 'Modül kaydedilemedi.')
      return
    }
    await logAdminAction('module.update', 'module', module.id, {
      name: f.elements.title.value.trim(),
    })
    setEditingId(null)
    await refresh()
  }

  const deleteModule = async (module) => {
    if (!supabase) {
      setActionError('Veritabanı bağlantısı bulunamadı.')
      return
    }
    setBusy(true)
    setActionError('')
    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('slug', module.id)
    setBusy(false)
    if (error) {
      setActionError(error.message || 'Modül silinemedi.')
      return
    }
    await logAdminAction('module.delete', 'module', module.id, {
      name: module.name,
    })
    setEditingId(null)
    await refresh()
  }

  const addModule = async () => {
    if (!supabase) {
      setActionError('Veritabanı bağlantısı bulunamadı.')
      return
    }
    setBusy(true)
    setActionError('')

    const slug = `yeni-modul-${Date.now().toString(36)}`
    const payload = {
      slug,
      name: 'Yeni Modül',
      description: 'Açıklama ekleyin',
      category: CATEGORY_OPTIONS[0] || 'Diğer Modüller',
      monthly: 0,
      sort_order: list.length + 1,
      is_active: true,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('modules').insert(payload)

    if (!error) {
      const { error: ruleError } = await supabase.from('package_module_rules').insert(
        packageModuleTierIds.map((packageSlug) => ({
          package_slug: packageSlug,
          module_slug: slug,
          status: 'addable',
        })),
      )
      if (ruleError) {
        setBusy(false)
        setActionError(ruleError.message || 'Modül paket karşılaştırmasına eklenemedi.')
        return
      }
    }

    setBusy(false)
    if (error) {
      setActionError(error.message || 'Modül eklenemedi.')
      return
    }
    await logAdminAction('module.create', 'module', slug, {
      name: 'Yeni Modül',
    })
    await refresh()
    setEditingId(slug)
  }

  return (
    <>
      <PageHeader
        eyebrow="Modüller"
        title="İşletmenizi büyüten modüller"
        text="E-ticaret operasyonunuzun her adımı için hazır entegrasyon ve modüller. İhtiyacınız olanları etkinleştirin, tek panelden yönetin."
      />

      <section className="section">
        <div className="container">
          <div className="mod-grid">
            {list.map((m) => {
              const isEditingCard = editing && editingId === m.id && m.id
              return (
                <article
                  key={m.id || m.title}
                  className={`mod-card ${editing ? 'is-editable' : ''} ${
                    isEditingCard ? 'is-editing' : ''
                  }`}
                >
                  {isEditingCard ? (
                    <form
                      className="mod-card__edit"
                      onSubmit={(e) => saveModule(m, e)}
                    >
                      <input
                        name="title"
                        defaultValue={m.name}
                        className="mod-edit-in mod-edit-in--title"
                        required
                      />
                      <textarea
                        name="description"
                        defaultValue={m.desc || ''}
                        rows="3"
                        className="mod-edit-in"
                      />
                      <div className="mod-edit-row">
                        <select
                          name="category"
                          defaultValue={m.category || CATEGORY_OPTIONS[0]}
                          className="mod-edit-in"
                        >
                          {CATEGORY_OPTIONS.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        <input
                          name="monthly"
                          type="number"
                          min="0"
                          defaultValue={m.monthly || 0}
                          className="mod-edit-in"
                          required
                        />
                      </div>
                      {actionError && (
                        <span className="panel-error" role="alert">
                          {actionError}
                        </span>
                      )}
                      <div className="mod-card__edit-actions">
                        <button
                          type="button"
                          className="mod-card__del"
                          onClick={() => deleteModule(m)}
                          disabled={busy}
                        >
                          Sil
                        </button>
                        <button
                          type="button"
                          className="btn btn--ghost"
                          onClick={() => setEditingId(null)}
                        >
                          Vazgeç
                        </button>
                        <button
                          type="submit"
                          className="btn btn--primary"
                          disabled={busy}
                        >
                          Kaydet
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      {editing && m.id && (
                        <button
                          type="button"
                          className="mod-card__pencil"
                          onClick={() => openEdit(m)}
                          aria-label="Kartı düzenle"
                        >
                          <PencilIcon />
                        </button>
                      )}
                      {m.imageUrl ? (
                        <span className="mod-card__img">
                          <img src={m.imageUrl} alt={m.name} loading="lazy" />
                        </span>
                      ) : (
                        <span className="mod-card__icon" aria-hidden="true">
                          <Icon path={m.iconPath || DEFAULT_ICON} />
                        </span>
                      )}
                      {m.category && (
                        <span className="mod-card__category">{m.category}</span>
                      )}
                      <h3>{m.name}</h3>
                      <p>{m.desc}</p>
                    </>
                  )}
                </article>
              )
            })}

            {editing && (
              <button
                type="button"
                className="mod-card mod-card--add"
                onClick={addModule}
                disabled={busy}
              >
                <span className="mod-card__plus" aria-hidden="true">
                  +
                </span>
                <span>Yeni modül ekle</span>
              </button>
            )}
          </div>

          {editing && actionError && !editingId && (
            <div className="mod-error" role="alert">
              {actionError}
            </div>
          )}

          <p className="mod-note">
            Aradığınız modülü bulamadınız mı?{' '}
            <Link to="/teklif" className="text-link">
              İhtiyacınız olan modüller için talep oluşturun
              <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      <CtaBand
        title="İhtiyacınız olan modüller için talep oluşturun"
        text="Mağazanıza özel modül veya geliştirme ihtiyacınızı paylaşın; ekibimiz size uygun çözümü hazırlasın."
        primaryLabel="Talep Oluştur"
        primaryTo="/teklif"
        secondaryLabel="İletişime Geç"
        secondaryTo="/iletisim"
      />
    </>
  )
}
