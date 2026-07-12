import { Link } from 'react-router-dom'
import { formatTL } from '../../data/pricing.js'
import { usePanelData } from '../../context/PanelDataContext.jsx'
import './panel.css'

const statusLabels = {
  pending: 'Beklemede',
  paid: 'Ödendi',
  cancelled: 'İptal',
}

export default function Dashboard() {
  const { orders } = usePanelData()
  const loading = orders === null
  const list = orders || []
  const latest = list[0]

  const stats = [
    { label: 'Toplam Sipariş', value: loading ? '…' : list.length },
    {
      label: 'Son Sipariş',
      value: loading ? '…' : latest ? statusLabels[latest.status] : '—',
    },
    { label: 'Aktif Lisans', value: '0' },
    { label: 'Açık Destek', value: '0' },
  ]

  return (
    <>
      <div className="panel-head">
        <h1>Genel Bakış</h1>
        <p>Hesabınızın özeti ve son hareketleriniz.</p>
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
          <Link to="/panel/siparislerim" className="panel-link">
            Tümünü gör →
          </Link>
        </div>

        {loading ? (
          <p className="panel-muted">Yükleniyor…</p>
        ) : list.length === 0 ? (
          <div className="panel-empty">
            <p>Henüz siparişiniz yok.</p>
            <Link to="/paketler" className="btn btn--primary">
              Paketleri İncele
            </Link>
          </div>
        ) : (
          <ul className="panel-recent__list">
            {list.slice(0, 5).map((o) => (
              <li key={o.id}>
                <span className="panel-order-no">
                  #{o.id.slice(0, 8).toUpperCase()}
                </span>
                <span className={`panel-badge panel-badge--${o.status}`}>
                  {statusLabels[o.status]}
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
