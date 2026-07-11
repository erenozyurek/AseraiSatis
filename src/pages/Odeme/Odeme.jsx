import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import { formatTL } from '../../data/pricing.js'
import { supabase } from '../../lib/supabase.js'
import { useCart } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import './Odeme.css'

export default function Odeme() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    tier,
    billing,
    moduleItems,
    packagePrice,
    total,
    clearCart,
  } = useCart()

  const [method, setMethod] = useState('havale')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Sepet boşsa sepete dön
  if (!tier) return <Navigate to="/sepet" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const items = [
      {
        item_type: 'package',
        item_id: tier.id,
        name: `${tier.name} Paketi`,
        unit_price: packagePrice,
        qty: 1,
      },
      ...moduleItems.map((m) => ({
        item_type: 'module',
        item_id: m.id,
        name: m.name,
        unit_price: m.monthly,
        qty: 1,
      })),
    ]

    const contact = {
      name: e.target.ad.value,
      email: e.target.eposta.value,
      phone: e.target.telefon.value,
      company: e.target.firma.value,
    }

    setLoading(true)
    const { data, error: err } = await supabase.rpc('create_order', {
      p_billing: billing,
      p_payment_method: method,
      p_contact: contact,
      p_items: items,
    })
    setLoading(false)

    if (err) {
      setError(err.message || 'Sipariş oluşturulurken bir hata oluştu.')
      return
    }

    clearCart()
    navigate('/siparis-tamamlandi', { state: { orderId: data } })
  }

  return (
    <>
      <PageHeader
        eyebrow="Ödeme"
        title="Siparişi tamamla"
        text="Fatura bilgilerinizi girin ve ödeme yönteminizi seçin."
      />

      <section className="section">
        <div className="container odeme">
          {/* Form */}
          <form className="odeme__form" onSubmit={handleSubmit}>
            <div className="odeme__block">
              <h2>Fatura bilgileri</h2>
              {error && (
                <div className="login-note login-note--error" role="alert">
                  {error}
                </div>
              )}
              <div className="field">
                <label htmlFor="ad">Ad Soyad</label>
                <input
                  id="ad"
                  name="ad"
                  type="text"
                  defaultValue={user?.user_metadata?.full_name || ''}
                  required
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="eposta">E-posta</label>
                  <input
                    id="eposta"
                    name="eposta"
                    type="email"
                    defaultValue={user?.email || ''}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="telefon">Telefon</label>
                  <input
                    id="telefon"
                    name="telefon"
                    type="tel"
                    defaultValue={user?.user_metadata?.phone || ''}
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="firma">Firma</label>
                <input
                  id="firma"
                  name="firma"
                  type="text"
                  defaultValue={user?.user_metadata?.company || ''}
                  required
                />
              </div>
            </div>

            <div className="odeme__block">
              <h2>Ödeme yöntemi</h2>
              <label
                className={`odeme__method ${method === 'havale' ? 'is-active' : ''}`}
              >
                <input
                  type="radio"
                  name="method"
                  value="havale"
                  checked={method === 'havale'}
                  onChange={() => setMethod('havale')}
                />
                <span>
                  <strong>Havale / EFT</strong>
                  <small>
                    Sipariş sonrası banka bilgileri e-postanıza gönderilir.
                  </small>
                </span>
              </label>
              <label className="odeme__method is-disabled">
                <input type="radio" name="method" value="kart" disabled />
                <span>
                  <strong>Kredi Kartı (Sanal POS)</strong>
                  <small>Yakında — PayTR / İyzico entegrasyonu ile.</small>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn--primary btn--block btn--lg"
              disabled={loading}
            >
              {loading ? 'Sipariş oluşturuluyor…' : 'Siparişi Oluştur'}
            </button>
          </form>

          {/* Özet */}
          <aside className="odeme__summary">
            <h2>Sipariş özeti</h2>
            <div className="odeme__row">
              <span>{tier.name} Paketi</span>
              <span>₺{formatTL(packagePrice)}</span>
            </div>
            {moduleItems.map((m) => (
              <div key={m.id} className="odeme__row odeme__row--sub">
                <span>{m.name}</span>
                <span>₺{formatTL(m.monthly)}</span>
              </div>
            ))}
            <div className="odeme__row odeme__row--total">
              <span>Aylık toplam</span>
              <span>₺{formatTL(total)}</span>
            </div>
            <p className="odeme__vat">
              {billing === 'yearly' ? 'Yıllık ödeme · ' : 'Aylık ödeme · '}
              Fiyatlara KDV dahil değildir.
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}
