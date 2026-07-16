import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { uploadInvoicePdf } from '../../lib/fileUpload.js'
import { formatTL } from '../../data/pricing.js'
import { useAdminData } from '../../context/AdminDataContext.jsx'
import '../panel/panel.css'

const eInvoiceLabels = {
  not_sent: 'Gönderilmedi',
  queued: 'Kuyrukta',
  sent: 'Gönderildi',
  accepted: 'Kabul edildi',
  rejected: 'Reddedildi',
  cancelled: 'İptal',
}

const eInvoiceOptions = Object.keys(eInvoiceLabels)

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

export default function AdminFaturalar() {
  const { invoices, refreshInvoices } = useAdminData()
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState('')

  const saveInvoice = async (invoice, event) => {
    event.preventDefault()
    setBusy(invoice.id)
    setError('')
    const form = event.target
    let pdfUrl = form.pdf_url.value.trim() || null
    const file = form.pdf_file.files?.[0]

    try {
      if (file) pdfUrl = await uploadInvoicePdf(invoice.id, file)
      const { error: updateError } = await supabase.rpc(
        'admin_update_invoice_ops',
        {
          p_invoice_id: invoice.id,
          p_pdf_url: pdfUrl,
          p_e_invoice_status: form.e_invoice_status.value,
          p_e_invoice_uuid: form.e_invoice_uuid.value,
          p_e_invoice_error: form.e_invoice_error.value,
        },
      )
      if (updateError) throw updateError
      await refreshInvoices()
    } catch (err) {
      setError(err.message || 'Fatura güncellenemedi.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <>
      <div className="panel-head">
        <h1>Fatura Yönetimi</h1>
        <p>Fatura PDF dosyalarını ve EDM e-fatura durumlarını yönetin.</p>
      </div>

      {error && (
        <div className="panel-card panel-note panel-note--error" role="alert">
          {error}
        </div>
      )}

      {invoices === null ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : invoices.length === 0 ? (
        <div className="panel-card panel-muted">Henüz fatura yok.</div>
      ) : (
        <div className="admin-edit-list">
          {invoices.map((invoice) => (
            <form
              key={invoice.id}
              className="panel-card admin-edit"
              onSubmit={(event) => saveInvoice(invoice, event)}
            >
              <div className="panel-license__top">
                <div>
                  <span className="panel-license__product">
                    {invoice.number}
                  </span>
                  <div className="panel-license__meta">
                    <span>{formatDate(invoice.issued_at)}</span>
                    <span>₺{formatTL(invoice.amount)}</span>
                  </div>
                </div>
                <span
                  className={`panel-badge panel-badge--${
                    invoice.e_invoice_status === 'accepted'
                      ? 'paid'
                      : invoice.e_invoice_status === 'rejected'
                        ? 'cancelled'
                        : 'issued'
                  }`}
                >
                  {eInvoiceLabels[invoice.e_invoice_status] ||
                    invoice.e_invoice_status}
                </span>
              </div>

              <div className="admin-edit__row">
                <div className="field">
                  <label>PDF URL</label>
                  <input name="pdf_url" defaultValue={invoice.pdf_url || ''} />
                </div>
                <div className="field">
                  <label>PDF Yükle</label>
                  <input name="pdf_file" type="file" accept="application/pdf" />
                </div>
              </div>

              <div className="admin-edit__row">
                <div className="field">
                  <label>E-fatura durumu</label>
                  <select
                    name="e_invoice_status"
                    defaultValue={invoice.e_invoice_status || 'not_sent'}
                  >
                    {eInvoiceOptions.map((status) => (
                      <option key={status} value={status}>
                        {eInvoiceLabels[status]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>EDM / GİB UUID</label>
                  <input
                    name="e_invoice_uuid"
                    defaultValue={invoice.e_invoice_uuid || ''}
                  />
                </div>
              </div>

              <div className="field">
                <label>E-fatura hata notu</label>
                <input
                  name="e_invoice_error"
                  defaultValue={invoice.e_invoice_error || ''}
                />
              </div>

              <div className="admin-edit__actions">
                {invoice.pdf_url && (
                  <a
                    className="btn btn--ghost"
                    href={invoice.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    PDF Aç
                  </a>
                )}
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={busy === invoice.id}
                >
                  {busy === invoice.id ? 'Kaydediliyor…' : 'Kaydet'}
                </button>
              </div>
            </form>
          ))}
        </div>
      )}
    </>
  )
}
