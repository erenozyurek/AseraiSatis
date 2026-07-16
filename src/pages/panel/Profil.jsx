import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { usePanelData } from '../../context/PanelDataContext.jsx'
import './panel.css'

export default function Profil() {
  const { user, emailVerified } = useAuth()
  const { profile, tenants, refreshProfile } = usePanelData()
  const loading = profile === null
  const tenantList = tenants || []

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async (e) => {
    e.preventDefault()
    setSaved(false)
    setError('')
    setSaving(true)
    const { error: saveError } = await supabase
      .from('profiles')
      .update({
        full_name: e.target.ad.value,
        phone: e.target.telefon.value,
      })
      .eq('id', user.id)
    setSaving(false)
    if (saveError) {
      setError(saveError.message || 'Profil kaydedilemedi.')
      return
    }
    setSaved(true)
    refreshProfile()
  }

  const handleCreateTenant = async (e) => {
    e.preventDefault()
    const name = e.target.firma.value.trim()
    if (!name) return
    setError('')
    setCreating(true)
    const { error } = await supabase.rpc('create_tenant', { tenant_name: name })
    setCreating(false)
    if (!error) {
      e.target.reset()
      refreshProfile()
    } else {
      setError(error.message || 'Firma oluşturulamadı.')
    }
  }

  return (
    <>
      <div className="panel-head">
        <h1>Profilim</h1>
        <p>Kişisel ve firma bilgilerinizi yönetin.</p>
      </div>

      {error && (
        <div className="panel-card panel-note panel-note--error" role="alert">
          {error}
        </div>
      )}

      <div className="panel-card" style={{ marginBottom: 22 }}>
        <h2 className="panel-card__title">Kişisel bilgiler</h2>
        {loading ? (
          <p className="panel-muted">Yükleniyor…</p>
        ) : (
          <form onSubmit={handleSave} className="panel-form">
            <div className="field">
              <label htmlFor="ad">Ad Soyad</label>
              <input
                id="ad"
                name="ad"
                type="text"
                defaultValue={profile?.full_name || ''}
              />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="eposta">
                  E-posta
                  <span
                    className={`panel-badge panel-badge--${
                      emailVerified ? 'active' : 'pending'
                    } profil-mail-badge`}
                  >
                    {emailVerified ? '✓ Doğrulandı' : 'Doğrulanmadı'}
                  </span>
                </label>
                <input
                  id="eposta"
                  type="email"
                  value={user?.email || ''}
                  disabled
                />
              </div>
              <div className="field">
                <label htmlFor="telefon">Telefon</label>
                <input
                  id="telefon"
                  name="telefon"
                  type="tel"
                  defaultValue={profile?.phone || ''}
                />
              </div>
            </div>
            <div className="panel-form__foot">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={saving}
              >
                {saving ? 'Kaydediliyor…' : 'Kaydet'}
              </button>
              {saved && <span className="panel-saved">✓ Kaydedildi</span>}
            </div>
          </form>
        )}
      </div>

      <div className="panel-card">
        <h2 className="panel-card__title">Firmalarım</h2>
        {loading ? (
          <p className="panel-muted">Yükleniyor…</p>
        ) : tenantList.length > 0 ? (
          <ul className="panel-tenants">
            {tenantList.map((t) => (
              <li key={t.id}>{t.name}</li>
            ))}
          </ul>
        ) : (
          <p className="panel-muted">Henüz bir firmanız yok.</p>
        )}

        <form onSubmit={handleCreateTenant} className="panel-form__inline">
          <div className="field">
            <label htmlFor="firma">Yeni firma ekle</label>
            <input
              id="firma"
              name="firma"
              type="text"
              placeholder="Firma adı"
              required
            />
          </div>
          <button type="submit" className="btn btn--ghost" disabled={creating}>
            {creating ? 'Ekleniyor…' : 'Firma Oluştur'}
          </button>
        </form>
      </div>
    </>
  )
}
