import { useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import './Demo.css'

const benefits = [
  'Aserai’nin canlı kullanımı',
  'İşletmenize özel kurulum senaryosu',
  'Pazaryeri entegrasyon akışının gösterimi',
  'Size en uygun paket ve fiyat önerisi',
  'Tüm sorularınıza birebir yanıt',
]

const steps = [
  {
    no: '01',
    title: 'Talebinizi iletin',
    desc: 'Formu doldurun, ekibimiz aynı gün içinde sizinle iletişime geçsin.',
  },
  {
    no: '02',
    title: 'Zamanı birlikte belirleyelim',
    desc: 'Size uygun bir gün ve saat için planlama yapalım.',
  },
  {
    no: '03',
    title: 'Canlı demoyu izleyin',
    desc: 'Ürünleri işletmenize göre uyarlanmış şekilde, birebir görün.',
  },
  {
    no: '04',
    title: 'Size özel teklifi alın',
    desc: 'İhtiyacınıza en uygun paketi ve fiyatı birlikte belirleyelim.',
  },
]

const employeeRanges = ['1 - 10', '11 - 50', '51 - 200', '200+']
const products = [
  'Başlangıç Paketi',
  'Standart Paket',
  'Profesyonel Paket',
  'E-İhracat Paketi',
  'Henüz emin değilim',
]

export default function Demo() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
      <PageHeader
        eyebrow="Ücretsiz Demo"
        title="Aserai’yi canlı keşfedin"
        text="Uzman ekibimiz, ürünleri işletmenize özel bir senaryoyla göstersin. Yaklaşık 30 dakikalık, tamamen ücretsiz birebir görüşme."
      />

      {/* ---------- FORM + AVANTAJLAR ---------- */}
      <section className="section">
        <div className="container demo-grid">
          {/* Form */}
          <div className="demo-form-wrap">
            {sent ? (
              <div className="demo-success">
                <span className="demo-success__icon" aria-hidden="true">
                  ✓
                </span>
                <h2>Demo formu önizlemesi tamamlandı</h2>
                <p>
                  Bu demo sürümünde bilgileriniz herhangi bir yere
                  gönderilmedi.
                </p>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setSent(false)}
                >
                  Yeni talep oluştur
                </button>
              </div>
            ) : (
              <>
                <h2 className="demo-form__title">Demo talep formu</h2>
                <p className="demo-form__sub">
                  Bilgilerinizi paylaşın, size en kısa sürede dönelim.
                </p>
                <form className="demo-form" onSubmit={handleSubmit}>
                  <div className="field">
                    <label htmlFor="ad">Ad Soyad</label>
                    <input
                      id="ad"
                      type="text"
                      placeholder="Adınız ve soyadınız"
                      required
                    />
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="eposta">İş e-postası</label>
                      <input
                        id="eposta"
                        type="email"
                        placeholder="ornek@firma.com"
                        required
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="telefon">Telefon</label>
                      <input
                        id="telefon"
                        type="tel"
                        placeholder="05XX XXX XX XX"
                      />
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="firma">Firma</label>
                      <input
                        id="firma"
                        type="text"
                        placeholder="Firma adınız"
                        required
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="calisan">Çalışan sayısı</label>
                      <select id="calisan" defaultValue="">
                        <option value="" disabled>
                          Seçiniz
                        </option>
                        {employeeRanges.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="urun">İlgilendiğiniz ürün</label>
                    <select id="urun" defaultValue="" required>
                      <option value="" disabled>
                        Seçiniz
                      </option>
                      {products.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="mesaj">Eklemek istedikleriniz</label>
                    <textarea
                      id="mesaj"
                      rows="4"
                      placeholder="İşletmeniz ve beklentileriniz hakkında kısa bilgi (isteğe bağlı)"
                    />
                  </div>
                  <label className="form-check">
                    <input type="checkbox" required />
                    <span>
                      Kişisel verilerimin işlenmesine ilişkin aydınlatma
                      metnini okudum, onaylıyorum.
                    </span>
                  </label>
                  <button
                    type="submit"
                    className="btn btn--primary btn--block btn--lg"
                  >
                    Demo Talebini Gönder
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Avantajlar */}
          <aside className="demo-aside">
            <div className="demo-benefits">
              <h3>Demoda neler göreceksiniz?</h3>
              <ul>
                {benefits.map((b) => (
                  <li key={b}>
                    <span className="demo-check" aria-hidden="true">
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="demo-highlight">
              <div className="demo-highlight__item">
                <strong>~30 dk</strong>
                <span>Görüşme süresi</span>
              </div>
              <div className="demo-highlight__item">
                <strong>Online</strong>
                <span>Birebir görüşme</span>
              </div>
              <div className="demo-highlight__item">
                <strong>Ücretsiz</strong>
                <span>Yükümlülük yok</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ---------- DEMO NASIL İLERLER ---------- */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Süreç</span>
            <h2>Demo nasıl ilerler?</h2>
            <p>Talebinizden teklife kadar dört basit adım.</p>
          </div>
          <div className="demo-steps">
            {steps.map((s) => (
              <article key={s.no} className="demo-step">
                <span className="demo-step__no">{s.no}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
