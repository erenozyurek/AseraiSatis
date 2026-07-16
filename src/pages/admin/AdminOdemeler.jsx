import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { formatTL } from '../../data/pricing.js'
import { useAdminData } from '../../context/AdminDataContext.jsx'
import '../panel/panel.css'

const statusLabels = {
  pending: 'Beklemede',
  paid: 'Ödendi',
  failed: 'Başarısız',
  refunded: 'İade',
  cancelled: 'İptal',
}

const statusOptions = Object.keys(statusLabels)

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export default function AdminOdemeler() {
  const { payments, refreshPayments, refreshOrders, refreshRenewals } =
    useAdminData()
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState('')

  const updatePayment = async (payment, event) => {
    event.preventDefault()
    setBusy(payment.id)
    setError('')
    const form = event.target
    const { error: updateError } = await supabase.rpc('admin_update_payment', {
      p_payment_id: payment.id,
      p_status: form.status.value,
      p_provider_ref: form.provider_ref.value,
    })
    if (updateError) {
      setError(updateError.message || 'Ödeme güncellenemedi.')
      setBusy(null)
      return
    }
    await Promise.all([refreshPayments(), refreshOrders(), refreshRenewals()])
    setBusy(null)
  }

  return (
    <>
      <div className="panel-head">
        <h1>Ödeme Yönetimi</h1>
        <p>Havale/EFT ve manuel tahsilat kayıtlarını yönetin.</p>
      </div>

      {error && (
        <div className="panel-card panel-note panel-note--error" role="alert">
          {error}
        </div>
      )}

      {payments === null ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : payments.length === 0 ? (
        <div className="panel-card panel-muted">Henüz ödeme kaydı yok.</div>
      ) : (
        <div className="admin-edit-list">
          {payments.map((payment) => (
            <form
              key={payment.id}
              className="panel-card admin-edit"
              onSubmit={(event) => updatePayment(payment, event)}
            >
              <div className="panel-license__top">
                <div>
                  <span className="panel-license__product">
                    {payment.order_id
                      ? `Sipariş #${payment.order_id.slice(0, 8).toUpperCase()}`
                      : `Yenileme #${payment.renewal_id.slice(0, 8).toUpperCase()}`}
                  </span>
                  <div className="panel-license__meta">
                    <span>{formatDate(payment.created_at)}</span>
                    <span>{payment.method}</span>
                    <span>₺{formatTL(payment.amount)}</span>
                  </div>
                </div>
                <span className={`panel-badge panel-badge--${payment.status}`}>
                  {statusLabels[payment.status] || payment.status}
                </span>
              </div>

              <div className="admin-edit__row">
                <div className="field">
                  <label>Durum</label>
                  <select name="status" defaultValue={payment.status}>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Referans</label>
                  <input
                    name="provider_ref"
                    defaultValue={payment.provider_ref || ''}
                    placeholder="Banka/POS referansı"
                  />
                </div>
              </div>

              <div className="admin-edit__actions">
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={busy === payment.id}
                >
                  {busy === payment.id ? 'Kaydediliyor…' : 'Kaydet'}
                </button>
              </div>
            </form>
          ))}
        </div>
      )}
    </>
  )
}
