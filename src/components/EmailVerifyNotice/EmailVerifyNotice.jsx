import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import './EmailVerifyNotice.css'

/* Yumuşak e-posta doğrulama uyarısı (B4).
   Doğrulanmamış müşteriye panelde gösterilir; giriş engellenmez.
   Akış: "Doğrula" → Supabase e-posta OTP kodu gönderilir → kullanıcı kodu
   girer → verifyOtp başarılıysa profiles.email_verified true olur. */

export default function EmailVerifyNotice() {
  const { user, emailVerified, sendEmailOtp, verifyEmailOtp } = useAuth()
  const [phase, setPhase] = useState('idle') // idle | code | done
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!user || emailVerified) return null

  const sendCode = async () => {
    setBusy(true)
    setError('')
    const { error: err } = await sendEmailOtp()
    setBusy(false)
    if (err) {
      setError(err.message || 'Kod gönderilemedi. Lütfen tekrar deneyin.')
    } else {
      setPhase('code')
    }
  }

  const verify = async (e) => {
    e.preventDefault()
    const clean = code.trim()
    if (!clean) return
    setBusy(true)
    setError('')
    const { error: err } = await verifyEmailOtp(clean)
    setBusy(false)
    if (err) {
      setError(err.message || 'Kod doğrulanamadı. Kodu kontrol edin.')
    }
    // Başarılıysa emailVerified true olur → bileşen otomatik gizlenir.
  }

  return (
    <div className="email-verify" role="status">
      <span className="email-verify__icon" aria-hidden="true">
        ✉
      </span>
      <div className="email-verify__body">
        <strong>E-posta adresinizi doğrulayın.</strong>
        {phase === 'idle' ? (
          <span>
            {user.email} adresini doğrulayın. Bazı işlemler doğrulanmış e-posta
            gerektirir.
          </span>
        ) : (
          <span>
            {user.email} adresine gönderdiğimiz 6 haneli kodu girin.
          </span>
        )}
        {error && <span className="email-verify__error">{error}</span>}
      </div>

      {phase === 'idle' ? (
        <button
          type="button"
          className="btn btn--ghost email-verify__btn"
          onClick={sendCode}
          disabled={busy}
        >
          {busy ? 'Gönderiliyor…' : 'Doğrula'}
        </button>
      ) : (
        <form className="email-verify__form" onSubmit={verify}>
          <input
            className="email-verify__input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            maxLength={8}
          />
          <button
            type="submit"
            className="btn btn--primary email-verify__btn"
            disabled={busy}
          >
            {busy ? 'Doğrulanıyor…' : 'Onayla'}
          </button>
          <button
            type="button"
            className="email-verify__resend"
            onClick={sendCode}
            disabled={busy}
          >
            Tekrar gönder
          </button>
        </form>
      )}
    </div>
  )
}
