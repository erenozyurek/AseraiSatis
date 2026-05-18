import Icon from '../../components/Icon/Icon.jsx'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import './Hakkimizda.css'

const storyStats = [
  { value: '2019', label: 'Kuruluş yılı' },
  { value: '12.000+', label: 'Aktif işletme' },
  { value: '85', label: 'Kişilik ekip' },
  { value: '3', label: 'Ülkede hizmet' },
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
    title: 'Iberai yayında',
    desc: 'Pazaryeri entegrasyon ürünümüz Iberai’yi tüm müşterilerimizin kullanımına açtık.',
  },
  {
    year: '2024',
    title: '20+ pazaryeri entegrasyonu',
    desc: 'Türkiye’nin tüm büyük pazaryerleriyle tek panelden satış mümkün hale geldi.',
  },
  {
    year: '2026',
    title: '12.000+ işletme',
    desc: 'Bugün üç ülkede on iki binden fazla işletme Aserai ve Iberai ile büyüyor.',
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
        text="Aserai ve Iberai’nin arkasındaki ekip, her ölçekten işletmenin teknolojiye takılmadan büyümesi için çalışıyor."
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
              Aserai ile başladık; kısa sürede binlerce işletme bize güvendi.
              Ardından satışın artık tek bir kanaldan ibaret olmadığını
              gördük ve pazaryeri entegrasyon ürünümüz Iberai’yi geliştirdik.
            </p>
            <p>
              Bugün Aserai ve Iberai, üç ülkede on iki binden fazla işletmenin
              satış operasyonunu tek platformdan yönetmesini sağlıyor.
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
              Aserai ve Iberai’yi her gün daha iyi hale getiren ekibin
              arkasındaki isimler.
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
