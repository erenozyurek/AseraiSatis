import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../context/AuthContext.jsx'
import './panel.css'

export default function Profil() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [creating, setCreating] = useState(false)

  const load = async () => {
    if (!supabase || !user) return
    setLoading(true)
    const [{ data: prof }, { data: tens }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('tenants').select('id, name'),
    ])
    setProfile(prof || null)
    setTenants(tens || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaved(false)
    setSaving(true)
    await supabase
      .from('profiles')
      .update({
        full_name: e.target.ad.value,
        phone: e.target.telefon.value,
      })
      .eq('id', user.id)
    setSaving(false)
    setSaved(true)
    load()
  }

  const handleCreateTenant = async (e) => {
    e.preventDefault()
    const name = e.target.firma.value.trim()
    if (!name) return
    setCreating(true)
    const { error } = await supabase.rpc('create_tenant', { tenant_name: name })
    setCreating(false)
    if (!error) {
      e.target.reset()
      load()
    }
  }

  return (
    <>
      <div className="panel-head">
        <h1>Profilim</h1>
        <p>Kişisel ve firma bilgilerinizi yönetin.</p>
      </div>

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
                <label htmlFor="eposta">E-posta</label>
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
        ) : tenants.length > 0 ? (
          <ul className="panel-tenants">
            {tenants.map((t) => (
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
