import { Link, useParams } from 'react-router-dom'
import { formatTL } from '../../data/pricing.js'
import { usePanelData } from '../../context/PanelDataContext.jsx'
import './panel.css'

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

const statusLabels = {
  issued: 'Düzenlendi',
  paid: 'Ödendi',
  void: 'İptal',
}

const eInvoiceLabels = {
  not_sent: 'Gönderilmedi',
  queued: 'Kuyrukta',
  sent: 'Gönderildi',
  accepted: 'Kabul edildi',
  rejected: 'Reddedildi',
  cancelled: 'İptal',
}

const itemTypeLabels = {
  package: 'Paket',
  module: 'Modül',
}

export default function FaturaDetay() {
  const { id } = useParams()
  const { invoices, orders } = usePanelData()

  if (invoices === null || orders === null) {
    return <div className="panel-card panel-muted">Yükleniyor…</div>
  }

  const invoice = (invoices || []).find((i) => i.id === id)
  if (!invoice) {
    return (
      <div className="panel-card panel-empty">
        <p>Fatura bulunamadı.</p>
        <Link to="/panel/faturalarim" className="btn btn--primary">
          Faturalarıma Dön
        </Link>
      </div>
    )
  }

  const order = (orders || []).find((o) => o.id === invoice.order_id)
  // Sipariş kalemleri (ilk satın alma) veya yenileme faturasında tek satır.
  const items =
    order?.order_items && order.order_items.length > 0
      ? order.order_items
      : [
          {
            id: invoice.id,
            name: invoice.renewal_id
              ? `${invoice.product || 'Lisans'} — Yenileme`
              : invoice.product || 'Aserai',
            item_type: 'package',
            qty: 1,
            unit_price: invoice.amount,
          },
        ]
  const periodLabel =
    invoice.billing_period === 'yearly' ? 'Yıllık' : 'Aylık'
  const buyerName = order?.contact_name || 'Müşteri'
  const buyerCompany = order?.company || 'Belirtilmedi'
  const buyerEmail = order?.contact_email || 'Belirtilmedi'
  const buyerPhone = order?.contact_phone || 'Belirtilmedi'
  const paymentMethod =
    order?.payment_method === 'havale'
      ? 'Havale / EFT'
      : order?.payment_method || '—'

  return (
    <div className="invoice-doc">
      <div className="invoice-doc__actions">
        <Link to="/panel/faturalarim" className="btn btn--ghost">
          ← Faturalarım
        </Link>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => window.print()}
        >
          Yazdır / PDF
        </button>
        {invoice.pdf_url && (
          <a
            href={invoice.pdf_url}
            target="_blank"
            rel="noreferrer"
            className="btn btn--ghost"
          >
            PDF Dosyasını Aç
          </a>
        )}
      </div>

      <div className="panel-card invoice-doc__paper">
        <div className="invoice-doc__head">
          <div className="invoice-doc__brand-block">
            <div className="invoice-doc__brand">Aserai</div>
            <span>Dijital Atölyemiz</span>
            <small>E-ticaret altyapısı hizmet faturası</small>
          </div>
          <div className="invoice-doc__no">
            <span>FATURA</span>
            <strong>{invoice.number}</strong>
          </div>
        </div>

        <div className="invoice-doc__info-grid">
          <section className="invoice-doc__box">
            <h2>Fatura Bilgileri</h2>
            <dl className="invoice-doc__details">
              <div>
                <dt>Fatura tarihi</dt>
                <dd>{formatDate(invoice.issued_at)}</dd>
              </div>
              <div>
                <dt>Dönem</dt>
                <dd>{periodLabel}</dd>
              </div>
              <div>
                <dt>Durum</dt>
                <dd>{statusLabels[invoice.status] || invoice.status}</dd>
              </div>
              <div>
                <dt>Ödeme yöntemi</dt>
                <dd>{paymentMethod}</dd>
              </div>
              <div>
                <dt>E-fatura</dt>
                <dd>
                  {eInvoiceLabels[invoice.e_invoice_status] ||
                    invoice.e_invoice_status ||
                    'Gönderilmedi'}
                </dd>
              </div>
              {invoice.e_invoice_uuid && (
                <div>
                  <dt>UUID</dt>
                  <dd>{invoice.e_invoice_uuid}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="invoice-doc__box">
            <h2>Alıcı Bilgileri</h2>
            <dl className="invoice-doc__details">
              <div>
                <dt>Alıcı</dt>
                <dd>{buyerName}</dd>
              </div>
              <div>
                <dt>Firma</dt>
                <dd>{buyerCompany}</dd>
              </div>
              <div>
                <dt>E-posta</dt>
                <dd>{buyerEmail}</dd>
              </div>
              <div>
                <dt>Telefon</dt>
                <dd>{buyerPhone}</dd>
              </div>
            </dl>
          </section>
        </div>

        {items.length > 0 && (
          <div className="invoice-doc__table-wrap">
            <table className="invoice-doc__table">
              <thead>
                <tr>
                  <th>Kalem</th>
                  <th>Tür</th>
                  <th>Adet</th>
                  <th>Birim</th>
                  <th>Tutar</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => {
                  const qty = Number(it.qty || 1)
                  const unitPrice = Number(it.unit_price || 0)
                  return (
                    <tr key={it.id}>
                      <td>
                        <strong>{it.name}</strong>
                      </td>
                      <td>{itemTypeLabels[it.item_type] || 'Hizmet'}</td>
                      <td>{qty}</td>
                      <td>₺{formatTL(unitPrice)}</td>
                      <td>₺{formatTL(unitPrice * qty)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="invoice-doc__summary">
          <div className="invoice-doc__note">
            <strong>Not</strong>
            <span>
              Bu belge Aserai müşteri paneli üzerinden sistem tarafından
              oluşturulmuştur.
            </span>
          </div>
          <div className="invoice-doc__total">
            <span>Genel toplam</span>
            <strong>₺{formatTL(invoice.amount)}</strong>
            <small>{periodLabel} hizmet bedeli</small>
          </div>
        </div>
      </div>
    </div>
  )
}
