import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useAdminData } from '../../context/AdminDataContext.jsx'
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
  const [ticket, setTicket] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const load = async () => {
    if (!supabase) return
    const [{ data: t }, { data: msgs }] = await Promise.all([
      supabase.from('support_tickets').select('*').eq('id', id).single(),
      supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', id)
        .order('created_at', { ascending: true }),
    ])
    setTicket(t || null)
    setMessages(msgs || [])
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
    await supabase.from('ticket_messages').insert({
      ticket_id: id,
      author_id: user.id,
      is_staff: true,
      body,
    })
    await supabase
      .from('support_tickets')
      .update({ status: 'answered', updated_at: new Date().toISOString() })
      .eq('id', id)
    e.target.reset()
    setSending(false)
    load()
    refreshTickets()
  }

  const closeTicket = async () => {
    await supabase.from('support_tickets').update({ status: 'closed' }).eq('id', id)
    load()
    refreshTickets()
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

        <form onSubmit={handleReply} className="panel-reply">
          <textarea
            name="mesaj"
            rows="3"
            placeholder="Yanıtınızı yazın…"
            required
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
