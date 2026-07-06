import Icon from '../../components/Icon/Icon.jsx'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import './Hakkimizda.css'

const storyStats = [
  { value: '2019', label: 'Kuruluş yılı' },
  { value: '500+', label: 'Aktif marka' },
  { value: '1M+', label: 'Tamamlanan sipariş' },
  { value: '7/24', label: 'Uzman destek' },
]

const locations = [
  {
    title: 'Genel Merkez',
    place: 'Gaziantep Üniversitesi Teknopark (GAÜ Teknopark)',
    iconPath: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 11h.01M15 11h.01',
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
    desc: 'Ürünlerimizi her hafta düzenli güncellemelerle daha iyi hale getiririz.',
    iconPath: 'M4 12a8 8 0 0114-5M20 12a8 8 0 01-14 5M17 4v3h-3M7 20v-3h3',
  },
  {
    title: 'Güvenilirlik',
    desc: '%99,9 erişilebilirlik ve güçlü güvenlik altyapısıyla her zaman yanınızdayız.',
    iconPath: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  },
]

const milestones = [
  {
    year: '2019',
    title: 'Aserai kuruldu',
    desc: 'Küçük bir ekiple, işletmelere kolay bir e-ticaret altyapısı sunma hedefiyle yola çıktık.',
  },
  {
    year: '2021',
    title: '1.000 aktif mağaza',
    desc: 'Aserai altyapısı binden fazla işletmenin online satış adresi oldu.',
  },
  {
    year: '2023',
    title: 'Pazaryeri entegrasyonları',
    desc: 'Trendyol, Hepsiburada, Amazon ve daha fazlasıyla tek panelden satışı mümkün kıldık.',
  },
  {
    year: '2024',
    title: 'Yapay zekâ modülleri',
    desc: 'AI destekli içerik, öneri ve akıllı fiyatlandırma özelliklerini platforma ekledik.',
  },
  {
    year: '2026',
    title: '500+ marka',
    desc: 'Bugün beş yüzden fazla marka Aserai ile satış operasyonunu tek platformdan yönetiyor.',
  },
]

const team = [
  { name: 'Elif Demir', role: 'Kurucu & CEO' },
  { name: 'Mert Kaya', role: 'Kurucu Ortak & CTO' },
  { name: 'Zeynep Arslan', role: 'Ürün Direktörü' },
  { name: 'Can Yıldız', role: 'Müşteri Başarı Lideri' },
]

const initials = (name) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')

export default function Hakkimizda() {
  return (
    <>
      <PageHeader
        eyebrow="Hakkımızda"
        title="Türkiye’nin satış altyapısını birlikte kuruyoruz"
        text="Aserai’nin arkasındaki ekip, her ölçekten işletmenin teknolojiye takılmadan büyümesi için çalışıyor."
      />

      {/* ---------- HİKAYE ---------- */}
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
              Aserai ile başladık; kısa sürede yüzlerce marka bize güvendi.
              Ardından satışın tek kanaldan ibaret olmadığını gördük ve
              pazaryeri entegrasyonlarını, yapay zekâ modüllerini platforma
              ekledik.
            </p>
            <p>
              Bugün Aserai, beş yüzden fazla markanın satış operasyonunu tek
              platformdan yönetmesini sağlıyor; GAÜ Teknopark merkezli ekibimiz
              büyümeye devam ediyor.
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

      {/* ---------- MİSYON & VİZYON ---------- */}
      <section className="section section--soft">
        <div className="container hk-mv">
          <article className="hk-mv__card">
            <span className="hk-mv__icon">
              <Icon path="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.2l5.9-.9z" />
            </span>
            <h3>Misyonumuz</h3>
            <p>
              Her ölçekten işletmenin, teknolojiyle uğraşmadan kendi
              mağazasını kurup tüm satış kanallarını tek panelden
              yönetebilmesini sağlamak.
            </p>
          </article>
          <article className="hk-mv__card">
            <span className="hk-mv__icon">
              <Icon path="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 9a3 3 0 100 6 3 3 0 000-6z" />
            </span>
            <h3>Vizyonumuz</h3>
            <p>
              Türkiye’nin ve bölgenin en güvenilen, en kolay kullanılan
              e-ticaret ve pazaryeri altyapısı olmak; satışı herkes için
              erişilebilir kılmak.
            </p>
          </article>
        </div>
      </section>

      {/* ---------- DEĞERLER ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Değerlerimiz</span>
            <h2>Bizi biz yapan ilkeler</h2>
            <p>
              Her gün verdiğimiz kararların ve geliştirdiğimiz ürünlerin
              arkasındaki değerler.
            </p>
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

      {/* ---------- KİLOMETRE TAŞLARI ---------- */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Yolculuğumuz</span>
            <h2>Kilometre taşlarımız</h2>
          </div>
          <div className="hk-timeline">
            {milestones.map((m) => (
              <div key={m.year} className="hk-milestone">
                <div className="hk-milestone__marker">
                  <span className="hk-milestone__dot" />
                </div>
                <div className="hk-milestone__body">
                  <span className="hk-milestone__year">{m.year}</span>
                  <h3>{m.title}</h3>
                  <p>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- EKİP ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Ekibimiz</span>
            <h2>Yönetim ekibiyle tanışın</h2>
            <p>
              Aserai’yi her gün daha iyi hale getiren ekibin arkasındaki
              isimler.
            </p>
          </div>
          <div className="hk-team">
            {team.map((p) => (
              <article key={p.name} className="hk-member">
                <span className="hk-member__avatar">{initials(p.name)}</span>
                <h3>{p.name}</h3>
                <p>{p.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- KONUMLAR & İŞ BİRLİKLERİ ---------- */}
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
