import { Link } from 'react-router-dom'
import { formatTL } from '../../data/pricing.js'
import { useAdminData } from '../../context/AdminDataContext.jsx'
import '../panel/panel.css'

const orderStatus = { pending: 'Beklemede', paid: 'Ödendi', cancelled: 'İptal' }

export default function AdminDashboard() {
  const { orders, tickets } = useAdminData()
  const loading = orders === null || tickets === null
  const orderList = orders || []
  const ticketList = tickets || []

  const pending = orderList.filter((o) => o.status === 'pending').length
  const openTickets = ticketList.filter((t) => t.status !== 'closed').length
  const revenue = orderList
    .filter((o) => o.status === 'paid')
    .reduce((s, o) => s + Number(o.total || 0), 0)

  const stats = [
    { label: 'Toplam Sipariş', value: loading ? '…' : orderList.length },
    { label: 'Bekleyen Sipariş', value: loading ? '…' : pending },
    { label: 'Açık Talep', value: loading ? '…' : openTickets },
    { label: 'Aylık Ciro (Ödenen)', value: loading ? '…' : `₺${formatTL(revenue)}` },
  ]

  return (
    <>
      <div className="panel-head">
        <h1>Yönetim — Genel Bakış</h1>
        <p>Platform genelindeki sipariş ve destek özeti.</p>
      </div>

      <div className="panel-stats">
        {stats.map((s) => (
          <div key={s.label} className="panel-stat">
            <span className="panel-stat__value">{s.value}</span>
            <span className="panel-stat__label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="panel-card panel-recent">
        <div className="panel-recent__head">
          <h2>Son siparişler</h2>
          <Link to="/yonetim/siparisler" className="panel-link">
            Tümünü gör →
          </Link>
        </div>
        {loading ? (
          <p className="panel-muted">Yükleniyor…</p>
        ) : orderList.length === 0 ? (
          <p className="panel-muted">Henüz sipariş yok.</p>
        ) : (
          <ul className="panel-recent__list">
            {orderList.slice(0, 6).map((o) => (
              <li key={o.id}>
                <span className="panel-order-no">
                  {o.contact_name || o.contact_email || '—'}
                </span>
                <span className={`panel-badge panel-badge--${o.status}`}>
                  {orderStatus[o.status]}
                </span>
                <span className="panel-order-total">₺{formatTL(o.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
