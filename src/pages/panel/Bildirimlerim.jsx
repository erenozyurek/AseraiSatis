import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../../context/NotificationsContext.jsx'
import { getSafeInternalPath } from '../../lib/navigation.js'
import './panel.css'

const formatDateTime = (iso) =>
  new Date(iso).toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export default function Bildirimlerim() {
  const { notifications, unreadCount, markRead, error } = useNotifications()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const list = notifications || []
  const unread = unreadCount

  const markAll = async () => {
    setBusy(true)
    await markRead(null)
    setBusy(false)
  }

  const openNotification = async (n) => {
    if (!n.read_at) await markRead([n.id])
    const safePath = getSafeInternalPath(n.link)
    if (safePath) navigate(safePath)
  }

  return (
    <>
      <div className="panel-head panel-head--row">
        <div>
          <h1>Bildirimlerim</h1>
          <p>
            {unread > 0
              ? `${unread} okunmamış bildiriminiz var.`
              : 'Tüm bildirimleriniz okundu.'}
          </p>
        </div>
        {unread > 0 && (
          <button
            type="button"
            className="btn btn--ghost"
            disabled={busy}
            onClick={markAll}
          >
            Tümünü okundu işaretle
          </button>
        )}
      </div>

      {error && (
        <div className="panel-card panel-note panel-note--error" role="alert">
          {error}
        </div>
      )}

      {list.length === 0 ? (
        <div className="panel-card panel-muted">Henüz bildiriminiz yok.</div>
      ) : (
        <div className="panel-notifs">
          {list.map((n) => (
            <button
              key={n.id}
              type="button"
              className={`panel-card panel-notif ${n.read_at ? '' : 'is-unread'} ${
                n.link ? 'is-link' : ''
              }`}
              onClick={() => openNotification(n)}
            >
              <span className="panel-notif__dot" aria-hidden="true" />
              <span className="panel-notif__main">
                <span className="panel-notif__title">{n.title}</span>
                {n.body && <span className="panel-notif__body">{n.body}</span>}
                <span className="panel-notif__date">
                  {formatDateTime(n.created_at)}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}
