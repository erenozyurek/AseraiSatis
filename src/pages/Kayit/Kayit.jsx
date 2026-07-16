import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import '../Giris/Giris.css'

const asideBullets = [
  '14 gün ücretsiz deneme, kredi kartı gerekmez',
  'Mağazanızı dakikalar içinde kurun',
  'Tüm satış kanallarınız tek panelde',
]

export default function Kayit() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const form = e.target
    const password = form.sifre.value
    if (password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır.')
      return
    }
    if (password !== form.sifreTekrar.value) {
      setError('Şifreler birbiriyle eşleşmiyor.')
      return
    }
    setLoading(true)
    const { data, error: err } = await signUp({
      email: form.eposta.value,
      password,
      fullName: form.ad.value,
      phone: form.telefon.value,
      company: form.firma.value,
    })
    setLoading(false)

    if (err) {
      setError(err.message || 'Kayıt sırasında bir hata oluştu.')
      return
    }
    // E-posta doğrulaması açıksa oturum gelmez; kullanıcıyı bilgilendir.
    if (data?.session) {
      navigate('/')
    } else {
      setDone(true)
    }
  }

  return (
    <section className="login">
      <div className="container">
        <div className="login-card">
          <div className="login-form">
            <Link to="/" className="login-logo">
              <span className="login-logo__mark">A</span>
              Aserai
            </Link>

            {done ? (
              <div className="login-note" role="status">
                <h1 style={{ fontSize: '1.4rem', marginBottom: 8 }}>
                  E-postanızı doğrulayın
                </h1>
                <p>
                  Hesabınızı etkinleştirmek için e-posta adresinize gönderdiğimiz
                  bağlantıya tıklayın. Ardından giriş yapabilirsiniz.
                </p>
                <p style={{ marginTop: 12 }}>
                  <Link to="/giris" className="login-link">
                    Giriş sayfasına dön
                  </Link>
                </p>
              </div>
            ) : (
              <>
                <h1>Hesap oluşturun</h1>
                <p className="login-sub">
                  Aserai ile e-ticarete güçlü bir başlangıç yapın.
                </p>

                {error && (
                  <div className="login-note login-note--error" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="field">
                    <label htmlFor="ad">Ad Soyad</label>
                    <input id="ad" name="ad" type="text" required />
                  </div>
                  <div className="field">
                    <label htmlFor="firma">Firma</label>
                    <input id="firma" name="firma" type="text" required />
                  </div>
                  <div className="field">
                    <label htmlFor="eposta">İş e-postası</label>
                    <input
                      id="eposta"
                      name="eposta"
                      type="email"
                      placeholder="ornek@firma.com"
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="telefon">Telefon</label>
                    <input
                      id="telefon"
                      name="telefon"
                      type="tel"
                      placeholder="05XX XXX XX XX"
                    />
                  </div>
                  <div className="field login-pw">
                    <label htmlFor="sifre">Şifre</label>
                    <div className="login-pw__wrap">
                      <input
                        id="sifre"
                        name="sifre"
                        type={showPw ? 'text' : 'password'}
                        placeholder="En az 8 karakter"
                        minLength={8}
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
                  <div className="field login-pw">
                    <label htmlFor="sifreTekrar">Şifre Tekrar</label>
                    <div className="login-pw__wrap">
                      <input
                        id="sifreTekrar"
                        name="sifreTekrar"
                        type={showPw ? 'text' : 'password'}
                        placeholder="Şifrenizi yeniden girin"
                        minLength={8}
                        required
                      />
                    </div>
                  </div>

                  <label className="form-check" style={{ marginBottom: 18 }}>
                    <input type="checkbox" required />
                    <span>
                      <Link to="/kvkk" className="login-link">
                        KVKK
                      </Link>{' '}
                      ve{' '}
                      <Link to="/kullanim-sartlari" className="login-link">
                        Kullanım Şartları
                      </Link>
                      ’nı okudum, onaylıyorum.
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="btn btn--primary btn--block btn--lg"
                    disabled={loading}
                  >
                    {loading ? 'Oluşturuluyor…' : 'Hesap Oluştur'}
                  </button>
                </form>

                <p className="login-foot">
                  Zaten hesabınız var mı?{' '}
                  <Link to="/giris">Giriş yapın</Link>
                </p>
              </>
            )}
          </div>

          <aside className="login-aside">
            <div className="login-aside__glow" aria-hidden="true" />
            <span className="login-aside__eyebrow">Aserai</span>
            <h2>E-ticarette büyümenin en kolay yolu</h2>
            <ul className="login-aside__list">
              {asideBullets.map((b) => (
                <li key={b}>
                  <span aria-hidden="true">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
