import { useState } from 'react'
import Icon from '../../components/Icon/Icon.jsx'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import './Iletisim.css'

const infoCards = [
  {
    title: 'E-posta',
    value: 'merhaba@aserai.com',
    note: 'Genellikle birkaç saat içinde yanıtlıyoruz.',
    iconPath: 'M3 7h18v10H3zM3 7l9 6 9-6',
  },
  {
    title: 'Telefon',
    value: '0850 000 00 00',
    note: 'Hafta içi 09:00 – 18:00 arası ulaşabilirsiniz.',
    iconPath:
      'M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z',
  },
  {
    title: 'Adres',
    value: 'Levent Mah. Büyükdere Cad. No:00',
    note: 'Şişli / İstanbul, Türkiye',
    iconPath: 'M12 21s-7-4.5-7-11a7 7 0 0114 0c0 6.5-7 11-7 11zM12 8a3 3 0 100 6 3 3 0 000-6z',
  },
  {
    title: 'Çalışma Saatleri',
    value: 'Hafta içi 09:00 – 18:00',
    note: 'Hafta sonu e-posta desteği devam eder.',
    iconPath: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 3',
  },
]

const subjects = [
  'Aserai E-Ticaret Altyapısı',
  'Paket ve Fiyatlandırma',
  'Teknik Destek',
  'Diğer',
]

export default function Iletisim() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
      <PageHeader
        eyebrow="İletişim"
        title="Sizi dinlemek için buradayız"
        text="Sorularınız, demo talepleriniz veya iş birliği önerileriniz için ekibimize ulaşın. Size en kısa sürede dönüş yapalım."
      />

      {/* ---------- FORM + BİLGİLER ---------- */}
      <section className="section">
        <div className="container il-grid">
          {/* Form */}
          <div className="il-form-wrap">
            {sent ? (
              <div className="il-success">
                <span className="il-success__icon" aria-hidden="true">
                  ✓
                </span>
                <h2>Mesajınız alındı!</h2>
                <p>
                  En kısa sürede size geri dönüş yapacağız. İlginiz için
                  teşekkür ederiz.
                </p>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setSent(false)}
                >
                  Yeni mesaj gönder
                </button>
              </div>
            ) : (
              <>
                <h2 className="il-form__title">Bize yazın</h2>
                <p className="il-form__sub">
                  Formu doldurun, ekibimiz en kısa sürede sizinle iletişime
                  geçsin.
                </p>
                <form className="il-form" onSubmit={handleSubmit}>
                  <div className="il-field">
                    <label htmlFor="ad">Ad Soyad</label>
                    <input
                      id="ad"
                      type="text"
                      placeholder="Adınız ve soyadınız"
                      required
                    />
                  </div>
                  <div className="il-row">
                    <div className="il-field">
                      <label htmlFor="eposta">E-posta</label>
                      <input
                        id="eposta"
                        type="email"
                        placeholder="ornek@firma.com"
                        required
                      />
                    </div>
                    <div className="il-field">
                      <label htmlFor="telefon">Telefon</label>
                      <input
                        id="telefon"
                        type="tel"
                        placeholder="05XX XXX XX XX"
                      />
                    </div>
                  </div>
                  <div className="il-row">
                    <div className="il-field">
                      <label htmlFor="firma">Firma</label>
                      <input
                        id="firma"
                        type="text"
                        placeholder="Firma adınız"
                      />
                    </div>
                    <div className="il-field">
                      <label htmlFor="konu">İlgilendiğiniz konu</label>
                      <select id="konu" defaultValue="" required>
                        <option value="" disabled>
                          Seçiniz
                        </option>
                        {subjects.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="il-field">
                    <label htmlFor="mesaj">Mesajınız</label>
                    <textarea
                      id="mesaj"
                      rows="5"
                      placeholder="Size nasıl yardımcı olabiliriz?"
                      required
                    />
                  </div>
                  <label className="il-check">
                    <input type="checkbox" required />
                    <span>
                      Kişisel verilerimin işlenmesine ilişkin aydınlatma
                      metnini okudum, onaylıyorum.
                    </span>
                  </label>
                  <button type="submit" className="btn btn--primary btn--block btn--lg">
                    Mesajı Gönder
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Bilgiler */}
          <aside className="il-info">
            {infoCards.map((c) => (
              <article key={c.title} className="il-info__card">
                <span className="il-info__icon">
                  <Icon path={c.iconPath} />
                </span>
                <div>
                  <h3>{c.title}</h3>
                  <p className="il-info__value">{c.value}</p>
                  <p className="il-info__note">{c.note}</p>
                </div>
              </article>
            ))}
            <div className="il-socials">
              <span>Sosyal medya</span>
              <div>
                {['in', 'X', 'f', '◎'].map((s) => (
                  <a key={s} href="/iletisim" className="il-social">
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------- HARİTA ---------- */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Ofisimiz</span>
            <h2>İstanbul’da bizi ziyaret edin</h2>
            <p>
              Levent’teki ofisimize randevu alarak uğrayabilir, ekibimizle yüz
              yüze görüşebilirsiniz.
            </p>
          </div>
          <div className="il-map" role="img" aria-label="Ofis konumu haritası">
            <div className="il-map__grid" aria-hidden="true" />
            <div className="il-map__pin">
              <span className="il-map__dot" />
              <div className="il-map__label">
                <strong>Aserai</strong>
                <small>Levent, Şişli / İstanbul</small>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
