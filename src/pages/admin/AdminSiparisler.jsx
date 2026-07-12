import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { formatTL } from '../../data/pricing.js'
import { useAdminData } from '../../context/AdminDataContext.jsx'
import '../panel/panel.css'

const statusLabels = { pending: 'Beklemede', paid: 'Ödendi', cancelled: 'İptal' }
const statusOptions = ['pending', 'paid', 'cancelled']

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export default function AdminSiparisler() {
  const { orders, refreshOrders } = useAdminData()
  const loading = orders === null
  const list = orders || []
  const [updating, setUpdating] = useState(null)

  const changeStatus = async (id, status) => {
    setUpdating(id)
    await supabase.from('orders').update({ status }).eq('id', id)
    await refreshOrders()
    setUpdating(null)
  }

  return (
    <>
      <div className="panel-head">
        <h1>Sipariş Yönetimi</h1>
        <p>Tüm siparişleri görüntüleyin ve durumlarını güncelleyin.</p>
      </div>

      {loading ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : list.length === 0 ? (
        <div className="panel-card panel-muted">Henüz sipariş yok.</div>
      ) : (
        <div className="panel-orders">
          {list.map((o) => (
            <article key={o.id} className="panel-card panel-order">
              <div className="panel-order__top">
                <div>
                  <span className="panel-order-no">
                    {o.contact_name || o.contact_email || '—'}
                  </span>
                  <span className="panel-order-date">
                    #{o.id.slice(0, 8).toUpperCase()} · {formatDate(o.created_at)}
                    {o.contact_email ? ` · ${o.contact_email}` : ''}
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
                <label className="admin-status">
                  Durum:
                  <select
                    value={o.status}
                    disabled={updating === o.id}
                    onChange={(e) => changeStatus(o.id, e.target.value)}
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {statusLabels[s]}
                      </option>
                    ))}
                  </select>
                </label>
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
