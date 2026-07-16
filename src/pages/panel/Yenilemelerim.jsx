import { formatTL } from '../../data/pricing.js'
import { supabase } from '../../lib/supabase.js'
import { usePanelData } from '../../context/PanelDataContext.jsx'
import './panel.css'

const statusLabels = {
  pending: 'Beklemede',
  paid: 'Ödendi',
  cancelled: 'İptal',
}

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—'

const daysLeft = (iso) =>
  Math.ceil((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

export default function Yenilemelerim() {
  const {
    licenses,
    renewals,
    refreshRenewals,
    refreshPayments,
    refreshLicenses,
  } = usePanelData()
  const loading = licenses === null || renewals === null
  const renewalList = renewals || []
  const renewableLicenses = (licenses || [])
    .filter(
      (license) =>
        (license.license_type || 'package') === 'package' &&
        license.status !== 'cancelled' &&
        !license.cancel_at_period_end,
    )
    .sort((a, b) => new Date(a.expires_at) - new Date(b.expires_at))

  const requestRenewal = async (licenseId) => {
    const { error } = await supabase.rpc('request_renewal', {
      p_license_id: licenseId,
    })
    if (!error) {
      await Promise.all([refreshRenewals(), refreshPayments(), refreshLicenses()])
    }
  }

  return (
    <>
      <div className="panel-head">
        <h1>Yenilemelerim</h1>
        <p>Lisans yenileme taleplerinizi ve geçmiş yenilemeleri takip edin.</p>
      </div>

      <h2 className="panel-subhead">Yaklaşan yenilemeler</h2>
      {loading ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : renewableLicenses.length === 0 ? (
        <div className="panel-card panel-muted">Yenilenebilir aktif lisans yok.</div>
      ) : (
        <div className="panel-licenses">
          {renewableLicenses.map((license) => {
            const existing = renewalList.find(
              (renewal) =>
                renewal.license_id === license.id &&
                renewal.status === 'pending',
            )
            const left = daysLeft(license.expires_at)
            return (
              <article key={license.id} className="panel-card">
                <div className="panel-license__top">
                  <span className="panel-license__product">
                    {license.product}
                  </span>
                  <span
                    className={`panel-badge panel-badge--${
                      left <= 0 ? 'expired' : left <= 30 ? 'issued' : 'active'
                    }`}
                  >
                    {left <= 0 ? 'Süresi doldu' : `${left} gün kaldı`}
                  </span>
                </div>
                <div className="panel-license__meta">
                  <span>
                    Dönem:{' '}
                    <strong>
                      {license.billing_period === 'yearly' ? 'Yıllık' : 'Aylık'}
                    </strong>
                  </span>
                  <span>
                    Bitiş: <strong>{formatDate(license.expires_at)}</strong>
                  </span>
                </div>
                <div className="panel-renewal__foot">
                  {existing ? (
                    <span className="panel-muted">
                      Bekleyen yenileme talebiniz var.
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => requestRenewal(license.id)}
                    >
                      Yenileme Talebi Oluştur
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      <h2 className="panel-subhead">Yenileme geçmişi</h2>
      {loading ? null : renewalList.length === 0 ? (
        <div className="panel-card panel-muted">Henüz yenileme kaydı yok.</div>
      ) : (
        <div className="panel-invoices">
          {renewalList.map((renewal) => (
            <article key={renewal.id} className="panel-card panel-invoice">
              <div className="panel-invoice__main">
                <span className="panel-invoice__no">
                  Yenileme #{renewal.id.slice(0, 8).toUpperCase()}
                </span>
                <span className="panel-invoice__date">
                  Talep: {formatDate(renewal.created_at)} · Önceki bitiş:{' '}
                  {formatDate(renewal.previous_expires_at)}
                  {renewal.new_expires_at
                    ? ` · Yeni bitiş: ${formatDate(renewal.new_expires_at)}`
                    : ''}
                </span>
              </div>
              <div className="panel-invoice__right">
                <span className={`panel-badge panel-badge--${renewal.status}`}>
                  {statusLabels[renewal.status] || renewal.status}
                </span>
                <span className="panel-invoice__amount">
                  ₺{formatTL(renewal.amount)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
