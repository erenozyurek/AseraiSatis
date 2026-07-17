import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { logAdminAction } from '../../lib/auditLog.js'
import { useAdminData } from '../../context/AdminDataContext.jsx'
import '../panel/panel.css'

const statusLabels = {
  active: 'Aktif',
  expired: 'Süresi doldu',
  cancelled: 'İptal',
}

const statusOptions = Object.keys(statusLabels)

const toDateInput = (iso) => {
  if (!iso) return ''
  return new Date(iso).toISOString().slice(0, 10)
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export default function AdminLisanslar() {
  const { licenses, refreshLicenses } = useAdminData()
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState('')

  const saveLicense = async (license, event) => {
    event.preventDefault()
    setBusy(license.id)
    setError('')
    const form = event.target
    const expires = form.expires_at.value
      ? new Date(`${form.expires_at.value}T23:59:59`).toISOString()
      : license.expires_at
    const { error: updateError } = await supabase
      .from('licenses')
      .update({
        status: form.status.value,
        expires_at: expires,
        activation_note: form.activation_note.value.trim() || null,
      })
      .eq('id', license.id)
    if (updateError) {
      setError(updateError.message || 'Lisans güncellenemedi.')
      setBusy(null)
      return
    }
    await logAdminAction('license.update', 'license', license.id, {
      status: form.status.value,
      expires_at: expires,
      product: license.product,
    })
    await refreshLicenses()
    setBusy(null)
  }

  return (
    <>
      <div className="panel-head">
        <h1>Lisans Yönetimi</h1>
        <p>Lisans durumlarını, bitiş tarihlerini ve aktivasyon notlarını yönetin.</p>
      </div>

      {error && (
        <div className="panel-card panel-note panel-note--error" role="alert">
          {error}
        </div>
      )}

      {licenses === null ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : licenses.length === 0 ? (
        <div className="panel-card panel-muted">Henüz lisans yok.</div>
      ) : (
        <div className="admin-edit-list">
          {licenses.map((license) => (
            <form
              key={license.id}
              className="panel-card admin-edit"
              onSubmit={(event) => saveLicense(license, event)}
            >
              <div className="panel-license__top">
                <div>
                  <span className="panel-license__product">
                    {license.product}
                  </span>
                  <div className="panel-license__meta">
                    <span>
                      {license.license_type === 'module' ? 'Modül' : 'Paket'}
                    </span>
                    <span>Bitiş: {formatDate(license.expires_at)}</span>
                    {license.user_id && (
                      <span>Kullanıcı: {license.user_id.slice(0, 8)}</span>
                    )}
                  </div>
                </div>
                <span className={`panel-badge panel-badge--${license.status}`}>
                  {statusLabels[license.status] || license.status}
                </span>
              </div>

              <div className="admin-edit__row">
                <div className="field">
                  <label>Durum</label>
                  <select name="status" defaultValue={license.status}>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Bitiş tarihi</label>
                  <input
                    name="expires_at"
                    type="date"
                    defaultValue={toDateInput(license.expires_at)}
                  />
                </div>
              </div>

              <div className="field">
                <label>Aktivasyon notu</label>
                <input
                  name="activation_note"
                  defaultValue={license.activation_note || ''}
                  placeholder="Aktivasyon, askıya alma veya iç operasyon notu"
                />
              </div>

              <div className="admin-edit__actions">
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={busy === license.id}
                >
                  {busy === license.id ? 'Kaydediliyor…' : 'Kaydet'}
                </button>
              </div>
            </form>
          ))}
        </div>
      )}
    </>
  )
}
