import { useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import './Teklif.css'

const packages = [
  'Başlangıç Paketi',
  'Standart Paket',
  'Profesyonel Paket',
  'E-İhracat Paketi',
  'Henüz emin değilim',
]

const sectors = [
  'Yedek Parça',
  'Moda & Giyim',
  'Ev & Yaşam',
  'Kozmetik & Kişisel Bakım',
  'Teknoloji & Elektronik',
  'B2B & Toptan',
  'Diğer',
]

const orderVolumes = [
  'Aylık 0 - 100 sipariş',
  'Aylık 100 - 1.000 sipariş',
  'Aylık 1.000 - 10.000 sipariş',
  'Aylık 10.000+ sipariş',
]

const promises = [
  'İşletmenize özel fiyatlandırma',
  'İhtiyacınıza göre paket + modül önerisi',
  'Entegrasyon ve kurulum yol haritası',
  'Yükümlülük olmadan net bir teklif',
]

export default function Teklif() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
      <PageHeader
        eyebrow="Teklif Al"
        title="İşletmenize özel teklif alın"
        text="İhtiyaçlarınızı paylaşın; ekibimiz size en uygun paket, modül ve fiyatlandırmayı içeren özel bir teklif hazırlasın."
      />

      {/* ---------- FORM + AVANTAJLAR ---------- */}
      <section className="section">
        <div className="container teklif-grid">
          {/* Form */}
          <div className="teklif-form-wrap">
            {sent ? (
              <div className="teklif-success">
                <span className="teklif-success__icon" aria-hidden="true">
                  ✓
                </span>
                <h2>Teklif formu önizlemesi tamamlandı</h2>
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
                <h2 className="teklif-form__title">Teklif talep formu</h2>
                <p className="teklif-form__sub">
                  Bilgilerinizi paylaşın, size özel teklifimizle dönelim.
                </p>
                <form className="teklif-form" onSubmit={handleSubmit}>
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
                        required
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
                      <label htmlFor="sektor">Sektör</label>
                      <select id="sektor" defaultValue="">
                        <option value="" disabled>
                          Seçiniz
                        </option>
                        {sectors.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="field-row">
                    <div className="field">
                      <label htmlFor="paket">İlgilendiğiniz paket</label>
                      <select id="paket" defaultValue="" required>
                        <option value="" disabled>
                          Seçiniz
                        </option>
                        {packages.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="hacim">Aylık sipariş hacmi</label>
                      <select id="hacim" defaultValue="">
                        <option value="" disabled>
                          Seçiniz
                        </option>
                        {orderVolumes.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="detay">İhtiyaç detayı</label>
                    <textarea
                      id="detay"
                      rows="4"
                      placeholder="İşletmeniz, ihtiyaçlarınız ve beklediğiniz özellikler hakkında kısa bilgi"
                    />
                  </div>
                  <label className="form-check">
                    <input type="checkbox" required />
                    <span>
                      Kişisel verilerimin işlenmesine ilişkin aydınlatma metnini
                      okudum, onaylıyorum.
                    </span>
                  </label>
                  <button
                    type="submit"
                    className="btn btn--primary btn--block btn--lg"
                  >
                    Teklif Talebini Gönder
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Avantajlar */}
          <aside className="teklif-aside">
            <div className="teklif-promise">
              <h3>Teklifinizde neler olacak?</h3>
              <ul>
                {promises.map((p) => (
                  <li key={p}>
                    <span className="teklif-check" aria-hidden="true">
                      ✓
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="teklif-highlight">
              <div className="teklif-highlight__item">
                <strong>24 saat</strong>
                <span>İçinde dönüş</span>
              </div>
              <div className="teklif-highlight__item">
                <strong>Ücretsiz</strong>
                <span>Yükümlülük yok</span>
              </div>
              <div className="teklif-highlight__item">
                <strong>Size özel</strong>
                <span>Net fiyatlandırma</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
