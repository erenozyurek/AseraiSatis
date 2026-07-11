import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './Giris.css'

const asideBullets = [
  'E-ticaret mağazanız ve pazaryerleriniz tek panelde',
  'Stok ve siparişler her kanalda otomatik senkron',
  'Canlı satış raporları ve karlılık analizi',
]

export default function Giris() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signIn({
      email: e.target.email.value,
      password: e.target.sifre.value,
    })
    setLoading(false)

    if (err) {
      const msg =
        err.message === 'Invalid login credentials'
          ? 'E-posta veya şifre hatalı.'
          : err.message === 'Email not confirmed'
            ? 'E-posta adresiniz henüz doğrulanmamış. Lütfen e-postanızı kontrol edin.'
            : err.message || 'Giriş sırasında bir hata oluştu.'
      setError(msg)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <section className="login">
      <div className="container">
        <div className="login-card">
          {/* Form tarafı */}
          <div className="login-form">
            <Link to="/" className="login-logo">
              <span className="login-logo__mark">A</span>
              Aserai
            </Link>
            <h1>Tekrar hoş geldiniz</h1>
            <p className="login-sub">
              Satış panelinize ulaşmak için hesabınıza giriş yapın.
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
              <div className="field login-pw">
                <label htmlFor="sifre">Şifre</label>
                <div className="login-pw__wrap">
                  <input
                    id="sifre"
                    name="sifre"
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="login-pw__toggle"
                    onClick={() => setShowPw((v) => !v)}
                  >
                    {showPw ? 'Gizle' : 'Göster'}
                  </button>
                </div>
              </div>

              <div className="login-row">
                <label className="form-check">
                  <input type="checkbox" />
                  <span>Beni hatırla</span>
                </label>
                <Link to="/sifremi-unuttum" className="login-link">
                  Şifremi unuttum?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--block btn--lg"
                disabled={loading}
              >
                {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
              </button>
            </form>

            <p className="login-foot">
              Hesabınız yok mu? <Link to="/kayit">Ücretsiz hesap oluşturun</Link>
            </p>
          </div>

          {/* Tanıtım tarafı */}
          <aside className="login-aside">
            <div className="login-aside__glow" aria-hidden="true" />
            <span className="login-aside__eyebrow">Aserai</span>
            <h2>Satışın tamamı tek ekranda</h2>
            <ul className="login-aside__list">
              {asideBullets.map((b) => (
                <li key={b}>
                  <span aria-hidden="true">✓</span>
                  {b}
                </li>
              ))}
            </ul>
            <blockquote className="login-aside__quote">
              “Tüm satış operasyonumuzu tek panelden yönetiyoruz.”
              <cite>— Selin A., TeknoMarket</cite>
            </blockquote>
          </aside>
        </div>
      </div>
    </section>
  )
}
