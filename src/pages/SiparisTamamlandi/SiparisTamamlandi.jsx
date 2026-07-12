import { Link, useLocation } from 'react-router-dom'
import './SiparisTamamlandi.css'

export default function SiparisTamamlandi() {
  const location = useLocation()
  const orderId = location.state?.orderId

  return (
    <section className="section siparis-ok">
      <div className="container">
        <div className="siparis-ok__card">
          <span className="siparis-ok__icon" aria-hidden="true">
            ✓
          </span>
          <h1>Siparişiniz alındı!</h1>
          <p>
            Talebiniz başarıyla oluşturuldu. Ödeme (Havale/EFT) bilgileri ve
            sipariş detayları e-posta adresinize gönderilecektir.
          </p>

          {orderId && (
            <p className="siparis-ok__no">
              Sipariş no: <strong>{orderId}</strong>
            </p>
          )}

          <div className="siparis-ok__actions">
            <Link to="/panel" className="btn btn--primary btn--lg">
              Hesabıma Git
            </Link>
            <Link to="/" className="btn btn--ghost btn--lg">
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
