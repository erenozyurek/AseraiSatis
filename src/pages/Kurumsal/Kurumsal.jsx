import { useState } from 'react'
import Icon from '../../components/Icon/Icon.jsx'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import './Kurumsal.css'
import '../Hakkimizda/Hakkimizda.css'
import '../Referanslar/Referanslar.css'
import '../Iletisim/Iletisim.css'

/* ---------- Hakkımızda ---------- */
const storyStats = [
  { value: '2019', label: 'Kuruluş yılı' },
  { value: '500+', label: 'Aktif marka' },
  { value: '1M+', label: 'Tamamlanan sipariş' },
  { value: '7/24', label: 'Uzman destek' },
]

const values = [
  {
    title: 'Müşteri Odaklılık',
    desc: 'Her kararı, müşterilerimizin işini büyütüp büyütmediğine bakarak alırız.',
    iconPath: 'M12 21s-7-4.5-9.5-9A5 5 0 0112 5a5 5 0 019.5 7c-2.5 4.5-9.5 9-9.5 9z',
  },
  {
    title: 'Şeffaflık',
    desc: 'Fiyatlarımız, süreçlerimiz ve iletişimimiz açık ve anlaşılırdır.',
    iconPath: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 9a3 3 0 100 6 3 3 0 000-6z',
  },
  {
    title: 'Sürekli Gelişim',
    desc: 'Ürünlerimizi düzenli güncellemeler ve yapay zekâ modülleriyle geliştiririz.',
    iconPath: 'M4 12a8 8 0 0114-5M20 12a8 8 0 01-14 5M17 4v3h-3M7 20v-3h3',
  },
  {
    title: 'Güvenilirlik',
    desc: '%99,9 erişilebilirlik ve güçlü güvenlik altyapısıyla her zaman yanınızdayız.',
    iconPath: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  },
]

const locations = [
  {
    title: 'Genel Merkez',
    place: 'Gaziantep Üniversitesi Teknopark (GAÜ Teknopark)',
    iconPath: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6',
  },
  {
    title: 'İrtibat Ofisi',
    place: 'ESOGÜ Teknoloji Transfer Ofisi (OGÜ TTO), Eskişehir',
    iconPath: 'M12 21s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  },
  {
    title: 'İstanbul Ofisi',
    place: 'İstanbul İrtibat Ofisi',
    iconPath: 'M4 21V9l8-6 8 6v12M4 21h16M9 21v-6h6v6',
  },
]

const partners = [
  'Milli Teknoloji Hamlesi',
  'Tekno Girişim',
  'OGÜ Dijital Dönüşüm Partneri',
  'Google Partner',
]

/* ---------- Referanslar ---------- */
const refStats = [
  { value: '500+', label: 'Aktif marka' },
  { value: '4,8 / 5', label: 'Ortalama memnuniyet puanı' },
  { value: '%98', label: 'Müşteri memnuniyeti' },
  { value: '1M+', label: 'İşlenen sipariş' },
]

const logos = [
  'Teknopark Gaziantep',
  'CMB Global',
  'aracımauygun.com',
  'iyisiyizoto',
  'Mert Yangın',
  'bioMacht',
  'Seyyah Sepet',
  'UrbanStyle',
]

const testimonials = [
  {
    quote:
      'Aserai ile mağazamızı iki günde açtık. Teknik bir ekibimiz yok ama her şeyi kendimiz yönetebiliyoruz.',
    name: 'Ahmet Yılmaz',
    company: 'Moda Vitrin · Kurucu',
  },
  {
    quote:
      'Pazaryeri entegrasyonları sayesinde altı farklı kanalı tek ekrandan yönetiyoruz. Stoklar artık hiçbir zaman uyumsuz değil.',
    name: 'Selin Acar',
    company: 'TeknoMarket · E-ticaret Müdürü',
  },
  {
    quote:
      'Yapay zekâ destekli öneriler ve akıllı fiyatlandırma dönüşüm oranımızı belirgin şekilde artırdı.',
    name: 'Burak Şahin',
    company: 'EvBahçe · Operasyon Lideri',
  },
  {
    quote:
      'Destek ekibi gerçekten ulaşılabilir. Sorularımıza dakikalar içinde Türkçe yanıt alıyoruz.',
    name: 'Deniz Korkmaz',
    company: 'SporZone · Mağaza Sahibi',
  },
]

/* ---------- İletişim ---------- */
const infoCards = [
  {
    title: 'E-posta',
    value: 'merhaba@aserai.com.tr',
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
    title: 'Genel Merkez',
    value: 'GAÜ Teknopark, Gaziantep',
    note: 'İstanbul irtibat ofisi ile de hizmet veriyoruz.',
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
  'Demo Talebi',
  'Paket & Fiyatlandırma',
  'Teknik Destek',
  'İş Birliği / Bayilik',
  'Diğer',
]

const initials = (name) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')

export default function Kurumsal() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
      <PageHeader
        eyebrow="Kurumsal"
        title="Aserai’yi yakından tanıyın"
        text="Hikayemiz, değerlerimiz, bize güvenen markalar ve iletişim bilgilerimiz — hepsi tek sayfada."
      />

      {/* ================= HAKKIMIZDA ================= */}
      <section className="section">
        <div className="container hk-story">
          <div className="hk-story__text">
            <span className="eyebrow">Hikayemiz</span>
            <h2>Küçük bir fikirden büyük bir ekosisteme</h2>
            <p>
              2019 yılında, e-ticarete başlamak isteyen işletmelerin teknik
              engellere takıldığını gördük. Amacımız netti: satış yapmak
              isteyen herkesin, kod yazmadan kendi mağazasını açabilmesi.
            </p>
            <p>
              Bugün Aserai, beş yüzden fazla markanın satış operasyonunu tek
              platformdan yönetmesini sağlıyor; GAÜ Teknopark merkezli ekibimiz
              yapay zekâ modülleri ve pazaryeri entegrasyonlarıyla büyümeye
              devam ediyor.
            </p>
          </div>
          <div className="hk-story__panel">
            {storyStats.map((s) => (
              <div key={s.label} className="hk-story__stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container hk-mv">
          <article className="hk-mv__card">
            <span className="hk-mv__icon">
              <Icon path="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9z" />
            </span>
            <h3>Misyonumuz</h3>
            <p>
              Her ölçekten işletmenin, teknolojiyle uğraşmadan kendi mağazasını
              kurup tüm satış kanallarını tek panelden yönetebilmesini sağlamak.
            </p>
          </article>
          <article className="hk-mv__card">
            <span className="hk-mv__icon">
              <Icon path="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 9a3 3 0 100 6 3 3 0 000-6z" />
            </span>
            <h3>Vizyonumuz</h3>
            <p>
              Türkiye’nin ve bölgenin en güvenilen, en kolay kullanılan
              e-ticaret altyapısı olmak; satışı herkes için erişilebilir kılmak.
            </p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Değerlerimiz</span>
            <h2>Bizi biz yapan ilkeler</h2>
          </div>
          <div className="hk-values">
            {values.map((v) => (
              <article key={v.title} className="hk-value">
                <span className="hk-value__icon">
                  <Icon path={v.iconPath} />
                </span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Konumlarımız & İş Birliklerimiz</span>
            <h2>Teknopark merkezli, güçlü ortaklıklarla</h2>
            <p>
              Üniversite iş birlikleri ve teknopark ekosistemiyle geliştirilen
              yerli bir teknoloji markasıyız.
            </p>
          </div>
          <div className="hk-locations">
            {locations.map((l) => (
              <article key={l.title} className="hk-location">
                <span className="hk-location__icon">
                  <Icon path={l.iconPath} />
                </span>
                <div>
                  <h3>{l.title}</h3>
                  <p>{l.place}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="hk-partners">
            {partners.map((p) => (
              <span key={p} className="hk-partner">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= REFERANSLAR ================= */}
      <section className="section ref-stats-section">
        <div className="container ref-stats">
          {refStats.map((s) => (
            <div key={s.label} className="ref-stat">
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Bize güvenenler</span>
            <h2>Her sektörden markalar</h2>
            <p>
              Farklı sektörlerden yüzlerce işletme satışlarını platformumuz
              üzerinden yönetiyor.
            </p>
          </div>
          <div className="ref-logos">
            {logos.map((name) => (
              <span key={name} className="ref-logo">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Müşteri yorumları</span>
            <h2>Kullanıcılarımız ne diyor?</h2>
          </div>
          <div className="ref-quotes">
            {testimonials.map((t) => (
              <article key={t.name} className="ref-quote">
                <div className="ref-quote__stars" aria-label="5 üzerinden 5">
                  ★★★★★
                </div>
                <p className="ref-quote__text">“{t.quote}”</p>
                <div className="ref-quote__author">
                  <span className="ref-quote__avatar">{initials(t.name)}</span>
                  <span>
                    <strong>{t.name}</strong>
                    <small>{t.company}</small>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= İLETİŞİM ================= */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">İletişim</span>
            <h2>Sizi dinlemek için buradayız</h2>
            <p>
              Sorularınız, demo talepleriniz veya iş birliği önerileriniz için
              ekibimize ulaşın.
            </p>
          </div>
          <div className="il-grid">
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
                      <input id="ad" type="text" placeholder="Adınız ve soyadınız" required />
                    </div>
                    <div className="il-row">
                      <div className="il-field">
                        <label htmlFor="eposta">E-posta</label>
                        <input id="eposta" type="email" placeholder="ornek@firma.com" required />
                      </div>
                      <div className="il-field">
                        <label htmlFor="telefon">Telefon</label>
                        <input id="telefon" type="tel" placeholder="05XX XXX XX XX" />
                      </div>
                    </div>
                    <div className="il-row">
                      <div className="il-field">
                        <label htmlFor="firma">Firma</label>
                        <input id="firma" type="text" placeholder="Firma adınız" />
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
                      <textarea id="mesaj" rows="5" placeholder="Size nasıl yardımcı olabiliriz?" required />
                    </div>
                    <label className="il-check">
                      <input type="checkbox" required />
                      <span>
                        Kişisel verilerimin işlenmesine ilişkin aydınlatma
                        metnini okudum, onaylıyorum.
                      </span>
                    </label>
                    <button type="submit" className="btn btn--dark btn--block btn--lg">
                      Mesajı Gönder
                    </button>
                  </form>
                </>
              )}
            </div>

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
            </aside>
          </div>
        </div>
      </section>

      <CtaBand
        title="Ekibimizle tanışmak ister misiniz?"
        text="İşletmeniz için en doğru çözümü birlikte planlayalım."
        primaryLabel="Demo Talep Et"
        primaryTo="/demo"
        secondaryLabel="Paketleri Gör"
        secondaryTo="/paketler"
      />
    </>
  )
}
