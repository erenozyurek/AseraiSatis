import { Link, useParams } from 'react-router-dom'
import { formatTL } from '../../data/pricing.js'
import { useAdminData } from '../../context/AdminDataContext.jsx'
import '../panel/panel.css'

const orderStatus = { pending: 'Beklemede', paid: 'Ödendi', cancelled: 'İptal' }
const ticketStatus = { open: 'Açık', answered: 'Yanıtlandı', closed: 'Kapalı' }
const licenseLabel = { active: 'Aktif', expired: 'Süresi doldu', cancelled: 'İptal' }

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

const licenseState = (l) => {
  if (l.status === 'cancelled') return 'cancelled'
  return new Date(l.expires_at) < new Date() ? 'expired' : l.status
}

const periodLabel = (p) => (p === 'yearly' ? 'Yıllık' : 'Aylık')

export default function AdminMusteriDetay() {
  const { id } = useParams()
  const { customers, orders, licenses, tickets } = useAdminData()

  if (
    customers === null ||
    orders === null ||
    licenses === null ||
    tickets === null
  ) {
    return <div className="panel-card panel-muted">Yükleniyor…</div>
  }

  const customer = (customers || []).find((c) => c.user_id === id)
  if (!customer) {
    return (
      <div className="panel-card panel-empty">
        <p>Müşteri bulunamadı.</p>
        <Link to="/yonetim/musteriler" className="btn btn--primary">
          Müşterilere Dön
        </Link>
      </div>
    )
  }

  const custOrders = (orders || []).filter((o) => o.user_id === id)
  const custLicenses = (licenses || []).filter((l) => l.user_id === id)
  const custTickets = (tickets || []).filter((t) => t.user_id === id)

  return (
    <>
      <div className="panel-head panel-head--row">
        <div>
          <h1>{customer.full_name || customer.email}</h1>
          <p>{customer.email}</p>
        </div>
        <Link to="/yonetim/musteriler" className="btn btn--ghost">
          ← Müşteriler
        </Link>
      </div>

      <div className="panel-card">
        <div className="panel-license__meta">
          {customer.phone && (
            <span>
              Telefon: <strong>{customer.phone}</strong>
            </span>
          )}
          <span>
            Firma: <strong>{customer.companies || '—'}</strong>
          </span>
          <span>
            Kayıt: <strong>{formatDate(customer.created_at)}</strong>
          </span>
        </div>
      </div>

      <h2 className="panel-subhead">Siparişler ({custOrders.length})</h2>
      {custOrders.length === 0 ? (
        <div className="panel-card panel-muted">Sipariş yok.</div>
      ) : (
        <div className="panel-orders">
          {custOrders.map((o) => (
            <article key={o.id} className="panel-card panel-order">
              <div className="panel-order__top">
                <div>
                  <span className="panel-order-no">
                    #{o.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="panel-order-date">
                    {formatDate(o.created_at)}
                  </span>
                </div>
                <span className={`panel-badge panel-badge--${o.status}`}>
                  {orderStatus[o.status]}
                </span>
              </div>
              <ul className="panel-order__items">
                {(o.order_items || []).map((it) => (
                  <li key={it.id}>
                    <span>{it.name}</span>
                    <span>₺{formatTL(it.unit_price)}</span>
                  </li>
                ))}
              </ul>
              <div className="panel-order__foot">
                <span className="panel-muted">
                  {periodLabel(o.billing_period)}
                </span>
                <span className="panel-order-total">₺{formatTL(o.total)}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      <h2 className="panel-subhead">Lisanslar ({custLicenses.length})</h2>
      {custLicenses.length === 0 ? (
        <div className="panel-card panel-muted">Lisans yok.</div>
      ) : (
        <div className="panel-licenses">
          {custLicenses.map((l) => {
            const st = licenseState(l)
            return (
              <article key={l.id} className="panel-card">
                <div className="panel-license__top">
                  <span className="panel-license__product">{l.product}</span>
                  <span className={`panel-badge panel-badge--${st}`}>
                    {licenseLabel[st]}
                  </span>
                </div>
                <div className="panel-license__meta">
                  <span>
                    Dönem: <strong>{periodLabel(l.billing_period)}</strong>
                  </span>
                  <span>
                    Bitiş: <strong>{formatDate(l.expires_at)}</strong>
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <h2 className="panel-subhead">Destek Talepleri ({custTickets.length})</h2>
      {custTickets.length === 0 ? (
        <div className="panel-card panel-muted">Talep yok.</div>
      ) : (
        <div className="panel-tickets">
          {custTickets.map((t) => (
            <Link
              key={t.id}
              to={`/yonetim/destek/${t.id}`}
              className="panel-card panel-ticket"
            >
              <div className="panel-ticket__main">
                <strong>{t.subject}</strong>
                <span className="panel-ticket__meta">
                  {formatDate(t.updated_at || t.created_at)}
                </span>
              </div>
              <span className={`panel-badge panel-badge--${t.status}`}>
                {ticketStatus[t.status]}
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
