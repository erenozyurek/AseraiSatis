import { Link } from 'react-router-dom'
import { formatTL } from '../../data/pricing.js'
import { usePanelData } from '../../context/PanelDataContext.jsx'
import './panel.css'

const statusLabels = {
  pending: 'Beklemede',
  paid: 'Ödendi',
  failed: 'Başarısız',
  refunded: 'İade',
  cancelled: 'İptal',
}

const methodLabels = {
  havale: 'Havale/EFT',
  kart: 'Kredi Kartı',
  manual: 'Manuel',
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export default function Odemelerim() {
  const { payments, orders, renewals } = usePanelData()
  const loading = payments === null
  const orderById = new Map((orders || []).map((o) => [o.id, o]))
  const renewalById = new Map((renewals || []).map((r) => [r.id, r]))
  const list = payments || []

  return (
    <>
      <div className="panel-head">
        <h1>Ödemelerim</h1>
        <p>Bekleyen, onaylanan ve iptal edilen ödeme kayıtlarınızı izleyin.</p>
      </div>

      {loading ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : list.length === 0 ? (
        <div className="panel-card panel-empty">
          <p>Henüz ödeme kaydınız bulunmuyor.</p>
          <Link to="/paketler" className="btn btn--primary">
            Paketleri İncele
          </Link>
        </div>
      ) : (
        <div className="panel-invoices">
          {list.map((payment) => {
            const order = orderById.get(payment.order_id)
            const renewal = renewalById.get(payment.renewal_id)
            const title = order
              ? `Sipariş #${order.id.slice(0, 8).toUpperCase()}`
              : renewal
                ? `Yenileme #${renewal.id.slice(0, 8).toUpperCase()}`
                : 'Ödeme kaydı'
            return (
              <article key={payment.id} className="panel-card panel-invoice">
                <div className="panel-invoice__main">
                  <span className="panel-invoice__no">{title}</span>
                  <span className="panel-invoice__date">
                    {formatDate(payment.created_at)} ·{' '}
                    {methodLabels[payment.method] || payment.method}
                    {payment.provider_ref ? ` · Ref: ${payment.provider_ref}` : ''}
                  </span>
                </div>
                <div className="panel-invoice__right">
                  <span className={`panel-badge panel-badge--${payment.status}`}>
                    {statusLabels[payment.status] || payment.status}
                  </span>
                  <span className="panel-invoice__amount">
                    ₺{formatTL(payment.amount)}
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </>
  )
}
