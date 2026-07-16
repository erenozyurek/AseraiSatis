import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { uploadSupportAttachment } from '../../lib/fileUpload.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { usePanelData } from '../../context/PanelDataContext.jsx'
import './panel.css'

const statusLabels = {
  open: 'Açık',
  answered: 'Yanıtlandı',
  closed: 'Kapalı',
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export default function DestekTaleplerim() {
  const { user } = useAuth()
  const { tickets, refreshTickets } = usePanelData()
  const navigate = useNavigate()
  const loading = tickets === null
  const list = tickets || []

  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    const subject = e.target.konu.value.trim()
    const body = e.target.mesaj.value.trim()
    if (!subject || !body) return

    setSubmitting(true)
    const { data: ticketId, error: tErr } = await supabase.rpc(
      'create_support_ticket',
      { p_subject: subject, p_body: body },
    )

    if (tErr) {
      setSubmitting(false)
      setError(tErr.message || 'Talep oluşturulamadı.')
      return
    }

    const file = e.target.dosya.files?.[0]
    if (file) {
      try {
        const fileUrl = await uploadSupportAttachment(user.id, ticketId, file)
        await supabase.rpc('register_support_attachment', {
          p_ticket_id: ticketId,
          p_message_id: null,
          p_file_name: file.name,
          p_file_url: fileUrl,
          p_file_size: file.size,
          p_mime_type: file.type,
        })
      } catch (fileError) {
        setSubmitting(false)
        setError(fileError.message || 'Dosya yüklenemedi.')
        return
      }
    }

    setSubmitting(false)
    await refreshTickets()
    navigate(`/panel/destek/${ticketId}`)
  }

  return (
    <>
      <div className="panel-head panel-head--row">
        <div>
          <h1>Destek Taleplerim</h1>
          <p>Sorularınızı iletin, ekibimiz en kısa sürede yanıtlasın.</p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Vazgeç' : 'Yeni Talep'}
        </button>
      </div>

      {showForm && (
        <div className="panel-card" style={{ marginBottom: 22 }}>
          <h2 className="panel-card__title">Yeni destek talebi</h2>
          {error && (
            <div className="login-note login-note--error" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleCreate} className="panel-form">
            <div className="field">
              <label htmlFor="konu">Konu</label>
              <input id="konu" name="konu" type="text" required />
            </div>
            <div className="field">
              <label htmlFor="mesaj">Mesajınız</label>
              <textarea id="mesaj" name="mesaj" rows="4" required />
            </div>
            <div className="field">
              <label htmlFor="dosya">Dosya eki (opsiyonel)</label>
              <input
                id="dosya"
                name="dosya"
                type="file"
                accept="application/pdf,image/jpeg,image/png,image/webp,text/plain"
              />
            </div>
            <div className="panel-form__foot">
              <button
                type="submit"
                className="btn btn--primary"
                disabled={submitting}
              >
                {submitting ? 'Gönderiliyor…' : 'Talebi Oluştur'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : list.length === 0 ? (
        <div className="panel-card panel-empty">
          <p>Henüz destek talebiniz yok.</p>
          {!showForm && (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setShowForm(true)}
            >
              İlk Talebi Oluştur
            </button>
          )}
        </div>
      ) : (
        <div className="panel-tickets">
          {list.map((t) => (
            <Link
              key={t.id}
              to={`/panel/destek/${t.id}`}
              className="panel-card panel-ticket"
            >
              <div className="panel-ticket__main">
                <strong>{t.subject}</strong>
                <span className="panel-ticket__meta">
                  #{t.id.slice(0, 8).toUpperCase()} · {formatDate(t.updated_at)}
                </span>
              </div>
              <span className={`panel-badge panel-badge--${t.status}`}>
                {statusLabels[t.status]}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
