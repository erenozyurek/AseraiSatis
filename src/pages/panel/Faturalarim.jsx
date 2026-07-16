import { Link } from 'react-router-dom'
import { formatTL } from '../../data/pricing.js'
import { usePanelData } from '../../context/PanelDataContext.jsx'
import './panel.css'

const statusLabels = {
  issued: 'Düzenlendi',
  paid: 'Ödendi',
  void: 'İptal',
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export default function Faturalarim() {
  const { invoices } = usePanelData()
  const loading = invoices === null
  const list = invoices || []

  return (
    <>
      <div className="panel-head">
        <h1>Faturalarım</h1>
        <p>Ödemelerinize ait faturaları görüntüleyin ve indirin.</p>
      </div>

      {loading ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : list.length === 0 ? (
        <div className="panel-card panel-empty">
          <p>Henüz faturanız yok. Bir siparişiniz onaylandığında faturanız
            otomatik oluşur.</p>
          <Link to="/paketler" className="btn btn--primary">
            Paketleri İncele
          </Link>
        </div>
      ) : (
        <div className="panel-invoices">
          {list.map((inv) => (
            <Link
              key={inv.id}
              to={`/panel/faturalarim/${inv.id}`}
              className="panel-card panel-invoice"
            >
              <div className="panel-invoice__main">
                <span className="panel-invoice__no">{inv.number}</span>
                <span className="panel-invoice__date">
                  {formatDate(inv.issued_at)}
                </span>
              </div>
              <div className="panel-invoice__right">
                <span className={`panel-badge panel-badge--${inv.status}`}>
                  {statusLabels[inv.status]}
                </span>
                <span className="panel-invoice__amount">
                  ₺{formatTL(inv.amount)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
