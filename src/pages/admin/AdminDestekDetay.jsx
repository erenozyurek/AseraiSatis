import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { uploadSupportAttachment } from '../../lib/fileUpload.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useAdminData } from '../../context/AdminDataContext.jsx'
import { useNotifications } from '../../context/NotificationsContext.jsx'
import '../panel/panel.css'

const statusLabels = { open: 'Açık', answered: 'Yanıtlandı', closed: 'Kapalı' }

const formatTime = (iso) =>
  new Date(iso).toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })

export default function AdminDestekDetay() {
  const { id } = useParams()
  const { user } = useAuth()
  const { refreshTickets } = useAdminData()
  const { refreshSupport } = useNotifications()
  const [ticket, setTicket] = useState(null)
  const [messages, setMessages] = useState([])
  const [attachments, setAttachments] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    if (!supabase) return
    const [
      { data: t, error: ticketError },
      { data: msgs, error: messageError },
      { data: files, error: attachmentError },
    ] =
      await Promise.all([
      supabase.from('support_tickets').select('*').eq('id', id).single(),
      supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', id)
        .order('created_at', { ascending: true }),
      supabase
        .from('support_attachments')
        .select('*')
        .eq('ticket_id', id)
        .order('created_at', { ascending: true }),
      ])
    setError(
      ticketError?.message ||
        messageError?.message ||
        attachmentError?.message ||
        '',
    )
    setTicket(t || null)
    setMessages(msgs || [])
    setAttachments(files || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleReply = async (e) => {
    e.preventDefault()
    const body = e.target.mesaj.value.trim()
    if (!body) return
    setSending(true)
    setError('')
    const { data: messageId, error: replyError } = await supabase.rpc(
      'admin_reply_support_ticket',
      {
        p_ticket_id: id,
        p_body: body,
      },
    )
    if (replyError) {
      setError(replyError.message || 'Yanıt gönderilemedi.')
      setSending(false)
      return
    }
    const file = e.target.dosya.files?.[0]
    if (file) {
      try {
        const fileUrl = await uploadSupportAttachment(user.id, id, file)
        await supabase.rpc('register_support_attachment', {
          p_ticket_id: id,
          p_message_id: messageId,
          p_file_name: file.name,
          p_file_url: fileUrl,
          p_file_size: file.size,
          p_mime_type: file.type,
        })
      } catch (fileError) {
        setError(fileError.message || 'Dosya yüklenemedi.')
        setSending(false)
        return
      }
    }
    e.target.reset()
    setSending(false)
    load()
    refreshTickets()
    refreshSupport()
  }

  const closeTicket = async () => {
    setError('')
    const { error: closeError } = await supabase
      .from('support_tickets')
      .update({ status: 'closed', updated_at: new Date().toISOString() })
      .eq('id', id)
    if (closeError) {
      setError(closeError.message || 'Talep kapatılamadı.')
      return
    }
    load()
    refreshTickets()
    refreshSupport()
  }

  if (loading) return <div className="panel-card panel-muted">Yükleniyor…</div>
  if (!ticket) {
    return (
      <div className="panel-card panel-muted">
        Talep bulunamadı.{' '}
        <Link to="/yonetim/destek" className="panel-link">
          Geri dön
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="panel-head">
        <Link to="/yonetim/destek" className="panel-link">
          ← Destek Yönetimi
        </Link>
        <div className="panel-ticket__head">
          <h1>{ticket.subject}</h1>
          <span className={`panel-badge panel-badge--${ticket.status}`}>
            {statusLabels[ticket.status]}
          </span>
        </div>
        <p>#{ticket.id.slice(0, 8).toUpperCase()}</p>
      </div>

      <div className="panel-card">
        {error && (
          <div className="login-note login-note--error" role="alert">
            {error}
          </div>
        )}
        <div className="panel-thread">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`panel-msg ${m.is_staff ? 'panel-msg--me' : 'panel-msg--staff'}`}
            >
              <div className="panel-msg__bubble">{m.body}</div>
              <span className="panel-msg__meta">
                {m.is_staff ? 'Aserai Destek' : 'Müşteri'} ·{' '}
                {formatTime(m.created_at)}
              </span>
            </div>
          ))}
        </div>

        {attachments.length > 0 && (
          <div className="panel-attachments">
            <h2>Dosya ekleri</h2>
            {attachments.map((file) => (
              <a
                key={file.id}
                href={file.file_url}
                target="_blank"
                rel="noreferrer"
                className="panel-attachment"
              >
                <span>{file.file_name}</span>
                <small>
                  {Math.ceil(Number(file.file_size || 0) / 1024)} KB
                </small>
              </a>
            ))}
          </div>
        )}

        <form onSubmit={handleReply} className="panel-reply">
          <textarea
            name="mesaj"
            rows="3"
            placeholder="Yanıtınızı yazın…"
            required
          />
          <input
            name="dosya"
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/webp,text/plain"
          />
          <div className="admin-reply-actions">
            {ticket.status !== 'closed' && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={closeTicket}
              >
                Talebi Kapat
              </button>
            )}
            <button
              type="submit"
              className="btn btn--primary"
              disabled={sending}
            >
              {sending ? 'Gönderiliyor…' : 'Yanıtla'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
