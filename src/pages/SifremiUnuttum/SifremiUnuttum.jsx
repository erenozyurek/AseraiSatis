import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import '../Giris/Giris.css'

export default function SifremiUnuttum() {
  const { resetPassword } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await resetPassword(e.target.email.value)
    setLoading(false)
    if (err) {
      setError(err.message || 'Bir hata oluştu.')
      return
    }
    setSent(true)
  }

  return (
    <section className="login">
      <div className="container">
        <div className="login-card login-card--single">
          <div className="login-form">
            <Link to="/" className="login-logo">
              <span className="login-logo__mark">A</span>
              Aserai
            </Link>

            {sent ? (
              <div className="login-note" role="status">
                <h1 style={{ fontSize: '1.4rem', marginBottom: 8 }}>
                  E-postanızı kontrol edin
                </h1>
                <p>
                  Şifre sıfırlama bağlantısını e-posta adresinize gönderdik.
                  Bağlantıya tıklayarak yeni şifrenizi belirleyebilirsiniz.
                </p>
                <p style={{ marginTop: 12 }}>
                  <Link to="/giris" className="login-link">
                    Giriş sayfasına dön
                  </Link>
                </p>
              </div>
            ) : (
              <>
                <h1>Şifrenizi mi unuttunuz?</h1>
                <p className="login-sub">
                  E-posta adresinizi girin, sıfırlama bağlantısını gönderelim.
                </p>

                {error && (
                  <div className="login-note login-note--error" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label htmlFor="email">E-posta</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="ornek@firma.com"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn--primary btn--block btn--lg"
                    disabled={loading}
                  >
                    {loading ? 'Gönderiliyor…' : 'Sıfırlama Bağlantısı Gönder'}
                  </button>
                </form>

                <p className="login-foot">
                  <Link to="/giris">Giriş sayfasına dön</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
