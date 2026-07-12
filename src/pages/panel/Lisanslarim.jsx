import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatTL } from '../../data/pricing.js'
import { supabase } from '../../lib/supabase.js'
import { useCatalog } from '../../context/CatalogContext.jsx'
import { usePanelData } from '../../context/PanelDataContext.jsx'
import './panel.css'

const statusLabels = {
  active: 'Aktif',
  scheduled: 'İptal Planlandı',
  expired: 'Süresi doldu',
  cancelled: 'İptal',
}

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

// Depodaki durum 'active' olsa bile bitiş tarihi geçmişse "süresi doldu"
// olarak gösterilir (yenileme akışı Adım 2'de gelecek).
const displayStatus = (lic) => {
  if (lic.status === 'cancelled') return 'cancelled'
  if (new Date(lic.expires_at) < new Date()) return 'expired'
  if (lic.cancel_at_period_end) return 'scheduled'
  return lic.status
}

const daysLeft = (iso) => {
  const diff = new Date(iso).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function Lisanslarim() {
  const { modules } = useCatalog()
  const {
    licenses,
    orders,
    refreshOrders,
    refreshLicenses,
    refreshInvoices,
    refreshRenewals,
  } = usePanelData()
  const [openLicenseId, setOpenLicenseId] = useState(null)
  const [addingModule, setAddingModule] = useState(null)
  const [cancelTargetId, setCancelTargetId] = useState(null)
  const [cancellingLicense, setCancellingLicense] = useState(null)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const loading = licenses === null
  const list = licenses || []
  const packageLicenses = list.filter(
    (lic) => (lic.license_type || 'package') === 'package',
  )
  const moduleLicenses = list.filter((lic) => lic.license_type === 'module')
  const pendingModuleOrders = (orders || []).filter(
    (o) => o.status === 'pending' && o.parent_license_id,
  )

  const modulesForLicense = (licenseId) =>
    moduleLicenses.filter((lic) => lic.parent_license_id === licenseId)

  const pendingForLicense = (licenseId) =>
    pendingModuleOrders.filter((o) => o.parent_license_id === licenseId)

  const availableModulesFor = (licenseId) => {
    const activeModuleIds = new Set(
      modulesForLicense(licenseId)
        .filter((lic) => lic.status !== 'cancelled')
        .map((lic) => lic.module_id),
    )
    const pendingModuleIds = new Set(
      pendingForLicense(licenseId).flatMap((o) =>
        (o.order_items || [])
          .filter((it) => it.item_type === 'module')
          .map((it) => it.item_id),
      ),
    )
    return modules.filter(
      (m) => !activeModuleIds.has(m.id) && !pendingModuleIds.has(m.id),
    )
  }

  const requestModule = async (licenseId, moduleId) => {
    setAddingModule(`${licenseId}:${moduleId}`)
    setNotice('')
    setError('')

    const { error: err } = await supabase.rpc('request_license_module', {
      p_license_id: licenseId,
      p_module_id: moduleId,
    })

    if (err) {
      setError(err.message || 'Modül siparişi oluşturulamadı.')
    } else {
      setNotice(
        'Modül siparişi oluşturuldu. Ödeme onaylandığında modül lisansınıza eklenecek.',
      )
      await Promise.all([refreshOrders(), refreshLicenses(), refreshInvoices()])
    }

    setAddingModule(null)
  }

  const cancelLicense = async (license) => {
    setCancellingLicense(license.id)
    setNotice('')
    setError('')

    try {
      const { error: err } = await supabase.rpc('cancel_customer_license', {
        p_license_id: license.id,
      })

      if (err) throw err

      await Promise.all([
        refreshOrders(),
        refreshLicenses(),
        refreshRenewals(),
      ])
      setCancelTargetId(null)
      setOpenLicenseId(null)
      setNotice(
        `Paket iptaliniz ${formatDate(license.expires_at)} için planlandı. Bu tarihe kadar paket ve modülleri kullanmaya devam edebilirsiniz.`,
      )
    } catch (err) {
      setError(err.message || 'Paket iptali planlanamadı.')
    } finally {
      setCancellingLicense(null)
    }
  }

  return (
    <>
      <div className="panel-head">
        <h1>Lisanslarım</h1>
        <p>Aktif lisanslarınızı ve geçerlilik sürelerini görüntüleyin.</p>
      </div>

      {loading ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : packageLicenses.length === 0 ? (
        <div className="panel-card panel-empty">
          <p>Henüz lisansınız yok. Bir siparişiniz onaylandığında lisansınız
            otomatik oluşur.</p>
          <Link to="/paketler" className="btn btn--primary">
            Paketleri İncele
          </Link>
        </div>
      ) : (
        <div className="panel-licenses">
          {notice && (
            <div
              className="panel-card panel-note panel-note--success"
              role="status"
            >
              {notice}
            </div>
          )}
          {error && (
            <div
              className="panel-card panel-note panel-note--error"
              role="alert"
            >
              {error}
            </div>
          )}
          {packageLicenses.map((lic) => {
            const status = displayStatus(lic)
            const left = daysLeft(lic.expires_at)
            const attachedModules = modulesForLicense(lic.id)
            const pendingModules = pendingForLicense(lic.id)
            const availableModules = availableModulesFor(lic.id)
            const canAddModule = status === 'active'
            const canCancel = status === 'active'
            const isCancelling = cancellingLicense === lic.id
            return (
              <article key={lic.id} className="panel-card">
                <div className="panel-license__top">
                  <span className="panel-license__product">{lic.product}</span>
                  <span className={`panel-badge panel-badge--${status}`}>
                    {statusLabels[status]}
                  </span>
                </div>
                <div className="panel-license__meta">
                  <span>
                    Dönem:{' '}
                    <strong>
                      {lic.billing_period === 'yearly' ? 'Yıllık' : 'Aylık'}
                    </strong>
                  </span>
                  <span>
                    Başlangıç: <strong>{formatDate(lic.starts_at)}</strong>
                  </span>
                  <span>
                    Bitiş: <strong>{formatDate(lic.expires_at)}</strong>
                  </span>
                  {(status === 'active' || status === 'scheduled') && (
                    <span>
                      Kalan: <strong>{left} gün</strong>
                    </span>
                  )}
                </div>

                {(attachedModules.length > 0 || pendingModules.length > 0) && (
                  <div className="panel-license__addons">
                    {attachedModules.length > 0 && (
                      <div>
                        <h2>Pakete Dahil Modüller</h2>
                        <div className="panel-addon-list">
                          {attachedModules.map((modLic) => {
                            const modStatus = displayStatus(modLic)
                            return (
                              <div
                                key={modLic.id}
                                className="panel-addon panel-addon--active"
                              >
                                <div>
                                  <strong>{modLic.product}</strong>
                                  <span>
                                    Bitiş: {formatDate(modLic.expires_at)}
                                  </span>
                                </div>
                                <span
                                  className={`panel-badge panel-badge--${modStatus}`}
                                >
                                  {statusLabels[modStatus]}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {pendingModules.length > 0 && (
                      <div>
                        <h2>Ödeme Onayı Bekleyen Modüller</h2>
                        <div className="panel-addon-list">
                          {pendingModules.map((order) => {
                            const item = (order.order_items || []).find(
                              (it) => it.item_type === 'module',
                            )
                            return (
                              <div key={order.id} className="panel-addon">
                                <div>
                                  <strong>{item?.name || 'Modül'}</strong>
                                  <span>
                                    Sipariş #{order.id.slice(0, 8).toUpperCase()}
                                  </span>
                                </div>
                                <span className="panel-addon__price">
                                  ₺{formatTL(order.total)}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="panel-license__module-actions">
                  <div className="panel-license__action-buttons">
                    <button
                      type="button"
                      className="btn btn--ghost"
                      disabled={!canAddModule || isCancelling}
                      aria-expanded={openLicenseId === lic.id}
                      onClick={() => {
                        setCancelTargetId(null)
                        setOpenLicenseId((current) =>
                          current === lic.id ? null : lic.id,
                        )
                      }}
                    >
                      Yeni Modül Ekle
                    </button>
                    {canCancel && (
                      <button
                        type="button"
                        className="btn panel-license__cancel-button"
                        disabled={isCancelling}
                        aria-expanded={cancelTargetId === lic.id}
                        onClick={() => {
                          setOpenLicenseId(null)
                          setCancelTargetId((current) =>
                            current === lic.id ? null : lic.id,
                          )
                        }}
                      >
                        Dönem Sonunda İptal Et
                      </button>
                    )}
                  </div>
                  {status === 'scheduled' ? (
                    <span className="panel-license__scheduled-note">
                      {formatDate(
                        lic.cancellation_effective_at || lic.expires_at,
                      )}{' '}
                      tarihine kadar kullanabilirsiniz.
                    </span>
                  ) : !canAddModule ? (
                    <span className="panel-muted">
                      Yalnızca aktif lisanslara modül eklenebilir.
                    </span>
                  ) : null}
                </div>

                {cancelTargetId === lic.id && canCancel && (
                  <div className="panel-license-cancel" role="alert">
                    <div className="panel-license-cancel__copy">
                      <h2>Paket iptalini dönem sonuna planlayın</h2>
                      <p>
                        Paketiniz {formatDate(lic.expires_at)} tarihine kadar
                        aktif kalır. Bu tarihten sonra paket ve bağlı modüller
                        kullanıma kapanır; yeni dönem yenilemesi yapılmaz.
                        Fatura ve sipariş geçmişiniz korunur.
                      </p>
                    </div>
                    <div className="panel-license-cancel__actions">
                      <button
                        type="button"
                        className="btn btn--ghost"
                        disabled={isCancelling}
                        onClick={() => setCancelTargetId(null)}
                      >
                        Vazgeç
                      </button>
                      <button
                        type="button"
                        className="btn panel-license-cancel__confirm"
                        disabled={isCancelling}
                        onClick={() => cancelLicense(lic)}
                      >
                        {isCancelling ? 'Planlanıyor…' : 'İptali Planla'}
                      </button>
                    </div>
                  </div>
                )}

                {openLicenseId === lic.id && canAddModule && (
                  <div className="panel-module-picker">
                    {availableModules.length === 0 ? (
                      <div className="panel-muted">
                        Eklenebilecek yeni modül kalmadı.
                      </div>
                    ) : (
                      availableModules.map((m) => {
                        const key = `${lic.id}:${m.id}`
                        return (
                          <div key={m.id} className="panel-module-option">
                            <div>
                              <strong>{m.name}</strong>
                              <span>{m.desc}</span>
                            </div>
                            <div className="panel-module-option__action">
                              <span>₺{formatTL(m.monthly)} / ay</span>
                              <button
                                type="button"
                                className="btn btn--primary"
                                disabled={addingModule === key}
                                onClick={() => requestModule(lic.id, m.id)}
                              >
                                {addingModule === key
                                  ? 'Ekleniyor…'
                                  : 'Modül Siparişi Oluştur'}
                              </button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </>
  )
}
