import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Giris.css'

const asideBullets = [
  'E-ticaret mağazanız ve pazaryerleriniz tek panelde',
  'Stok ve siparişler her kanalda otomatik senkron',
  'Canlı satış raporları ve karlılık analizi',
]

export default function Giris() {
  const [showPw, setShowPw] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="login">
      <div className="container">
        <div className="login-card">
          {/* Form tarafı */}
          <div className="login-form">
            <Link to="/" className="login-logo">
              <span className="login-logo__mark">A</span>
              Aserai<span className="login-logo__amp">&amp;</span>Iberai
            </Link>
            <h1>Tekrar hoş geldiniz</h1>
            <p className="login-sub">
              Satış panelinize ulaşmak için hesabınıza giriş yapın.
            </p>

            {submitted && (
              <div className="login-note" role="status">
                Giriş bilgileriniz kontrol ediliyor. Bu bir tasarım
                şablonudur; gerçek bir oturum açılmaz.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="email">E-posta</label>
                <input
                  id="email"
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
                <Link to="/giris" className="login-link">
                  Şifremi unuttum?
                </Link>
              </div>

              <button
                type="submit"
                className="btn btn--primary btn--block btn--lg"
              >
                Giriş Yap
              </button>
            </form>

            <div className="login-divider">
              <span>veya</span>
            </div>

            <button type="button" className="btn btn--ghost btn--block login-sso">
              <span className="login-sso__icon">G</span>
              Google ile devam et
            </button>

            <p className="login-foot">
              Hesabınız yok mu?{' '}
              <Link to="/demo">Ücretsiz demo talep edin</Link>
            </p>
          </div>

          {/* Tanıtım tarafı */}
          <aside className="login-aside">
            <div className="login-aside__glow" aria-hidden="true" />
            <span className="login-aside__eyebrow">Aserai &amp; Iberai</span>
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
