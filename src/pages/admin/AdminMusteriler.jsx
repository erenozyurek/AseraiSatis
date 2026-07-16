import { Link } from 'react-router-dom'
import { useAdminData } from '../../context/AdminDataContext.jsx'
import '../panel/panel.css'

const isActiveLicense = (l) =>
  l.status === 'active' && new Date(l.expires_at) > new Date()

const isOpenTicket = (t) => t.status !== 'closed'

export default function AdminMusteriler() {
  const { customers, orders, licenses, tickets } = useAdminData()
  const loading =
    customers === null ||
    orders === null ||
    licenses === null ||
    tickets === null

  // user_id → sayaçlar
  const count = (rows, uid, pred = () => true) =>
    (rows || []).filter((r) => r.user_id === uid && pred(r)).length

  const list = customers || []

  return (
    <>
      <div className="panel-head">
        <h1>Müşteri Yönetimi</h1>
        <p>Kayıtlı müşterileri, firmalarını ve hesap geçmişlerini görüntüleyin.</p>
      </div>

      {loading ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : list.length === 0 ? (
        <div className="panel-card panel-muted">Henüz kayıtlı müşteri yok.</div>
      ) : (
        <div className="panel-customers">
          {list.map((c) => (
            <Link
              key={c.user_id}
              to={`/yonetim/musteriler/${c.user_id}`}
              className="panel-card panel-customer"
            >
              <div className="panel-customer__main">
                <span className="panel-customer__name">
                  {c.full_name || c.email || '—'}
                </span>
                <span className="panel-customer__sub">
                  {c.email}
                  {c.companies ? ` · ${c.companies}` : ''}
                </span>
              </div>
              <div className="panel-customer__stats">
                <span className="panel-chip">
                  {count(orders, c.user_id)} sipariş
                </span>
                <span className="panel-chip">
                  {count(licenses, c.user_id, isActiveLicense)} lisans
                </span>
                <span className="panel-chip">
                  {count(tickets, c.user_id, isOpenTicket)} açık talep
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
