import { Link } from 'react-router-dom'
import { useAdminData } from '../../context/AdminDataContext.jsx'
import '../panel/panel.css'

const statusLabels = { open: 'Açık', answered: 'Yanıtlandı', closed: 'Kapalı' }

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export default function AdminDestek() {
  const { tickets } = useAdminData()
  const loading = tickets === null
  const list = tickets || []

  return (
    <>
      <div className="panel-head">
        <h1>Destek Yönetimi</h1>
        <p>Tüm müşteri taleplerini görüntüleyin ve yanıtlayın.</p>
      </div>

      {loading ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : list.length === 0 ? (
        <div className="panel-card panel-muted">Henüz destek talebi yok.</div>
      ) : (
        <div className="panel-tickets">
          {list.map((t) => (
            <Link
              key={t.id}
              to={`/yonetim/destek/${t.id}`}
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
