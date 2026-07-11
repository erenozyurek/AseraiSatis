import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import '../Giris/Giris.css'

export default function SifreYenile() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()

  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const password = e.target.sifre.value
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır.')
      return
    }
    setLoading(true)
    const { error: err } = await updatePassword(password)
    setLoading(false)
    if (err) {
      setError(
        err.message ||
          'Şifre güncellenemedi. Bağlantının süresi dolmuş olabilir.',
      )
      return
    }
    setDone(true)
    setTimeout(() => navigate('/giris'), 2000)
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

            {done ? (
              <div className="login-note" role="status">
                Şifreniz güncellendi. Giriş sayfasına yönlendiriliyorsunuz…
              </div>
            ) : (
              <>
                <h1>Yeni şifre belirleyin</h1>
                <p className="login-sub">
                  Hesabınız için yeni bir şifre oluşturun.
                </p>

                {error && (
                  <div className="login-note login-note--error" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="field login-pw">
                    <label htmlFor="sifre">Yeni şifre</label>
                    <div className="login-pw__wrap">
                      <input
                        id="sifre"
                        name="sifre"
                        type={showPw ? 'text' : 'password'}
                        placeholder="En az 6 karakter"
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
                  <button
                    type="submit"
                    className="btn btn--primary btn--block btn--lg"
                    disabled={loading}
                  >
                    {loading ? 'Güncelleniyor…' : 'Şifreyi Güncelle'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
