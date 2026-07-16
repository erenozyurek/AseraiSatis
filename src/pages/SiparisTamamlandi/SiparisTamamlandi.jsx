import { Link, useLocation } from 'react-router-dom'
import './SiparisTamamlandi.css'

export default function SiparisTamamlandi() {
  const location = useLocation()
  const orderId = location.state?.orderId

  if (!orderId) {
    return (
      <section className="section siparis-ok">
        <div className="container">
          <div className="siparis-ok__card">
            <h1>Sipariş bilgisi bulunamadı</h1>
            <p>
              Bu sayfa yalnızca demo sipariş akışı tamamlandığında
              görüntülenebilir.
            </p>
            <div className="siparis-ok__actions">
              <Link to="/paketler" className="btn btn--primary btn--lg">
                Paketlere Dön
              </Link>
              <Link to="/panel" className="btn btn--ghost btn--lg">
                Hesabıma Git
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section siparis-ok">
      <div className="container">
        <div className="siparis-ok__card">
          <span className="siparis-ok__icon" aria-hidden="true">
            ✓
          </span>
          <h1>Demo siparişiniz oluşturuldu</h1>
          <p>
            Bu kayıt demo akışını göstermek içindir. Canlı ödeme ve otomatik
            e-posta gönderimi daha sonra ödeme sağlayıcısıyla etkinleştirilecek.
          </p>

          <p className="siparis-ok__no">
            Sipariş no: <strong>{orderId}</strong>
          </p>

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
