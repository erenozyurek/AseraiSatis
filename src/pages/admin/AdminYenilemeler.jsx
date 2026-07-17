import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { logAdminAction } from '../../lib/auditLog.js'
import { formatTL } from '../../data/pricing.js'
import { useAdminData } from '../../context/AdminDataContext.jsx'
import '../panel/panel.css'

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

const daysLeft = (iso) =>
  Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

const periodLabel = (p) => (p === 'yearly' ? 'Yıllık' : 'Aylık')

export default function AdminYenilemeler() {
  const { renewals, licenses, refreshRenewals, refreshLicenses } = useAdminData()
  const [busy, setBusy] = useState(null)
  const loading = renewals === null || licenses === null

  const licById = new Map((licenses || []).map((l) => [l.id, l]))
  const pending = (renewals || []).filter((r) => r.status === 'pending')

  // Süresi 30 gün içinde dolacak/dolmuş aktif lisanslar
  const expiring = (licenses || [])
    .filter((l) => l.status !== 'cancelled' && daysLeft(l.expires_at) <= 30)
    .sort((a, b) => new Date(a.expires_at) - new Date(b.expires_at))

  const setStatus = async (id, status) => {
    if (!supabase) return
    setBusy(id)
    await supabase.from('renewals').update({ status }).eq('id', id)
    await logAdminAction('renewal.status_update', 'renewal', id, { status })
    await Promise.all([refreshRenewals(), refreshLicenses()])
    setBusy(null)
  }

  return (
    <>
      <div className="panel-head">
        <h1>Yenileme Yönetimi</h1>
        <p>Yenileme taleplerini onaylayın ve süresi dolan lisansları izleyin.</p>
      </div>

      <h2 className="panel-subhead">Yenileme talepleri</h2>
      {loading ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : pending.length === 0 ? (
        <div className="panel-card panel-muted">Bekleyen yenileme talebi yok.</div>
      ) : (
        <div className="panel-licenses">
          {pending.map((r) => {
            const lic = licById.get(r.license_id)
            return (
              <article key={r.id} className="panel-card">
                <div className="panel-license__top">
                  <span className="panel-license__product">
                    {lic?.product || 'Lisans'}
                  </span>
                  <span className="panel-badge panel-badge--pending">
                    Onay bekliyor
                  </span>
                </div>
                <div className="panel-license__meta">
                  <span>
                    Dönem: <strong>{periodLabel(r.billing_period)}</strong>
                  </span>
                  <span>
                    Tutar: <strong>₺{formatTL(r.amount)}</strong>
                  </span>
                  {r.previous_expires_at && (
                    <span>
                      Mevcut bitiş:{' '}
                      <strong>{formatDate(r.previous_expires_at)}</strong>
                    </span>
                  )}
                </div>
                <div className="panel-renewal__foot">
                  <button
                    type="button"
                    className="btn btn--primary"
                    disabled={busy === r.id}
                    onClick={() => setStatus(r.id, 'paid')}
                  >
                    {busy === r.id ? 'İşleniyor…' : 'Onayla (Ödendi)'}
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    disabled={busy === r.id}
                    onClick={() => setStatus(r.id, 'cancelled')}
                  >
                    Reddet
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <h2 className="panel-subhead">Süresi dolan / dolacak lisanslar</h2>
      {loading ? null : expiring.length === 0 ? (
        <div className="panel-card panel-muted">
          30 gün içinde süresi dolacak lisans yok.
        </div>
      ) : (
        <div className="panel-invoices">
          {expiring.map((l) => {
            const left = daysLeft(l.expires_at)
            return (
              <div key={l.id} className="panel-card panel-invoice">
                <div className="panel-invoice__main">
                  <span className="panel-invoice__no">{l.product}</span>
                  <span className="panel-invoice__date">
                    {periodLabel(l.billing_period)} · Bitiş:{' '}
                    {formatDate(l.expires_at)}
                  </span>
                </div>
                <div className="panel-invoice__right">
                  <span
                    className={`panel-badge panel-badge--${
                      left <= 0 ? 'expired' : 'issued'
                    }`}
                  >
                    {left <= 0 ? 'Süresi doldu' : `${left} gün kaldı`}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
