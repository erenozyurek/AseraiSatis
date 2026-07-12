import { Link } from 'react-router-dom'
import { formatTL } from '../../data/pricing.js'
import { usePanelData } from '../../context/PanelDataContext.jsx'
import './panel.css'

const statusLabels = {
  pending: 'Beklemede',
  paid: 'Ödendi',
  cancelled: 'İptal',
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export default function Siparislerim() {
  const { orders } = usePanelData()
  const loading = orders === null
  const list = orders || []

  return (
    <>
      <div className="panel-head">
        <h1>Siparişlerim</h1>
        <p>Tüm sipariş ve taleplerinizi buradan takip edin.</p>
      </div>

      {loading ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : list.length === 0 ? (
        <div className="panel-card panel-empty">
          <p>Henüz siparişiniz yok.</p>
          <Link to="/paketler" className="btn btn--primary">
            Paketleri İncele
          </Link>
        </div>
      ) : (
        <div className="panel-orders">
          {list.map((o) => (
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
                  {statusLabels[o.status]}
                </span>
              </div>

              <ul className="panel-order__items">
                {(o.order_items || []).map((it) => (
                  <li key={it.id}>
                    <span>
                      {it.name}
                      {it.item_type === 'module' && (
                        <span className="panel-tag">Modül</span>
                      )}
                    </span>
                    <span>₺{formatTL(it.unit_price)}</span>
                  </li>
                ))}
              </ul>

              <div className="panel-order__foot">
                <span className="panel-muted">
                  {o.billing_period === 'yearly' ? 'Yıllık' : 'Aylık'} ·{' '}
                  {o.payment_method === 'havale' ? 'Havale/EFT' : o.payment_method}
                </span>
                <span className="panel-order-total">
                  Aylık ₺{formatTL(o.total)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
