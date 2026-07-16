import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { usePanelData } from '../../context/PanelDataContext.jsx'
import './panel.css'

const statusLabels = {
  active: 'Aktif',
  revoked: 'İptal',
}

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—'

export default function ApiAnahtarlari() {
  const { tenants } = usePanelData()
  const [keys, setKeys] = useState(null)
  const [newKey, setNewKey] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    if (!supabase) return
    const { data, error: loadError } = await supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false })
    setError(loadError?.message || '')
    setKeys(data || [])
  }

  useEffect(() => {
    load()
  }, [])

  const createKey = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setNewKey('')
    const tenantId = e.target.tenant.value || null
    const { data, error: createError } = await supabase.rpc('create_api_key', {
      p_name: e.target.name.value,
      p_tenant_id: tenantId,
    })
    setBusy(false)

    if (createError) {
      setError(createError.message || 'API anahtarı oluşturulamadı.')
      return
    }

    const created = Array.isArray(data) ? data[0] : data
    setNewKey(created?.api_key || '')
    e.target.reset()
    load()
  }

  const revokeKey = async (id) => {
    setBusy(true)
    setError('')
    const { error: revokeError } = await supabase.rpc('revoke_api_key', {
      p_key_id: id,
    })
    setBusy(false)
    if (revokeError) {
      setError(revokeError.message || 'Anahtar iptal edilemedi.')
      return
    }
    load()
  }

  return (
    <>
      <div className="panel-head">
        <h1>API Anahtarlarım</h1>
        <p>Harici entegrasyonlar için erişim anahtarlarınızı yönetin.</p>
      </div>

      {error && (
        <div className="panel-card panel-note panel-note--error" role="alert">
          {error}
        </div>
      )}

      {newKey && (
        <div className="panel-card panel-note panel-note--success" role="status">
          Yeni anahtarınız: <code>{newKey}</code>. Bu değer yalnızca şimdi
          gösterilir.
        </div>
      )}

      <div className="panel-card" style={{ marginBottom: 22 }}>
        <h2 className="panel-card__title">Yeni anahtar oluştur</h2>
        <form onSubmit={createKey} className="panel-form">
          <div className="field-row">
            <div className="field">
              <label htmlFor="name">Anahtar adı</label>
              <input id="name" name="name" type="text" minLength="3" required />
            </div>
            <div className="field">
              <label htmlFor="tenant">Firma</label>
              <select id="tenant" name="tenant">
                <option value="">Genel hesap</option>
                {(tenants || []).map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="panel-form__foot">
            <button type="submit" className="btn btn--primary" disabled={busy}>
              {busy ? 'Oluşturuluyor…' : 'Anahtar Oluştur'}
            </button>
          </div>
        </form>
      </div>

      {keys === null ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : keys.length === 0 ? (
        <div className="panel-card panel-muted">Henüz API anahtarı yok.</div>
      ) : (
        <div className="panel-invoices">
          {keys.map((key) => (
            <article key={key.id} className="panel-card panel-invoice">
              <div className="panel-invoice__main">
                <span className="panel-invoice__no">{key.name}</span>
                <span className="panel-invoice__date">
                  {key.key_prefix}… · Oluşturma: {formatDate(key.created_at)} ·
                  Son kullanım: {formatDate(key.last_used_at)}
                </span>
              </div>
              <div className="panel-invoice__right">
                <span className={`panel-badge panel-badge--${key.status}`}>
                  {statusLabels[key.status] || key.status}
                </span>
                {key.status === 'active' && (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => revokeKey(key.id)}
                    disabled={busy}
                  >
                    İptal Et
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
