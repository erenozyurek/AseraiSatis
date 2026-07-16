import { Link, NavLink, Navigate, useParams } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import './Akademi.css'

const academySections = [
  {
    slug: 'kullanim-kilavuzu',
    label: 'Kullanım Kılavuzu',
    eyebrow: 'Başlangıç',
    title: 'Aserai Kullanım Kılavuzu',
    intro:
      'Aserai panelinde mağaza kurulumu, günlük operasyon ve yönetim ekranları için temel çalışma akışı.',
    steps: [
      'Hesabınızı oluşturun ve firma bilgilerinizi Profilim ekranından tamamlayın.',
      'Paketinizi seçip ödeme talebinizi oluşturun; onay sonrası lisansınız panelde görünür.',
      'Lisanslarım ekranından aktif paket, modül ve yenileme durumlarını takip edin.',
      'Destek Taleplerim üzerinden sorularınızı ek dosyalarla birlikte iletin.',
    ],
    notes: [
      'Yönetim kullanıcıları müşteri gibi alışveriş yapamaz; yönetim panelinden operasyon yürütür.',
      'Fatura ve ödeme kayıtları panelde ayrı ekranlardan izlenir.',
    ],
  },
  {
    slug: 'urun-yukleme',
    label: 'Ürün Yükleme',
    eyebrow: 'Katalog',
    title: 'Ürün Yükleme Akışı',
    intro:
      'Ürünlerinizi Aserai’ye tekil giriş, toplu dosya veya entegrasyon kaynaklarıyla hazırlamak için izlenecek temel adımlar.',
    steps: [
      'Ürün adını, açıklamasını ve kategori bilgisini netleştirin.',
      'Fiyat, stok, KDV ve varyant alanlarını eksiksiz doldurun.',
      'Görselleri aynı oran ve kaliteli dosyalarla yükleyin.',
      'Önizleme yapın, eksik alan uyarılarını giderin ve ürünü yayına alın.',
    ],
    notes: [
      'Toplu aktarımda SKU değerlerinin benzersiz olması gerekir.',
      'Eksik görsel veya varyant bilgisi satış kanallarında yayın sorununa yol açabilir.',
    ],
  },
  {
    slug: 'urun-silme',
    label: 'Ürün Silme',
    eyebrow: 'Katalog',
    title: 'Ürün Silme ve Pasife Alma',
    intro:
      'Yayındaki ürünleri kalıcı olarak silmeden önce pasife alma ve geçmiş sipariş etkilerini kontrol etme rehberi.',
    steps: [
      'Ürünün açık siparişlerde kullanılıp kullanılmadığını kontrol edin.',
      'Satışı durdurmak için önce ürünü pasife alın.',
      'Pazaryeri veya kanal eşleşmelerini kaldırın.',
      'Geçmiş raporlama gerekiyorsa kalıcı silme yerine arşivlemeyi tercih edin.',
    ],
    notes: [
      'Kalıcı silme geçmiş entegrasyon kayıtlarında kopukluğa neden olabilir.',
      'Silme işleminden önce ürün dışa aktarımı almak iyi bir güvenlik adımıdır.',
    ],
  },
  {
    slug: 'api-hesaplari',
    label: 'API Hesapları Oluşturma',
    eyebrow: 'Entegrasyon',
    title: 'API Anahtarı Oluşturma',
    intro:
      'Harici sistemlerin Aserai verilerine erişmesi için güvenli API anahtarı oluşturma ve iptal etme akışı.',
    steps: [
      'Müşteri panelinde API Anahtarlarım ekranını açın.',
      'Anahtar için anlaşılır bir ad girin ve gerekiyorsa firma seçin.',
      'Oluşturulan anahtarı yalnızca ilk gösterimde güvenli bir yerde saklayın.',
      'Kullanılmayan anahtarları aynı ekrandan iptal edin.',
    ],
    notes: [
      'API anahtarının tam değeri daha sonra tekrar görüntülenmez.',
      'Her entegrasyon için ayrı anahtar kullanmak erişim takibini kolaylaştırır.',
    ],
  },
  {
    slug: 'sss',
    label: 'SSS',
    eyebrow: 'Yardım',
    title: 'Sık Sorulan Sorular',
    intro:
      'Aserai kurulumu, lisanslar, ödemeler ve destek süreçleri hakkında en sık karşılaşılan sorular.',
    qa: [
      {
        q: 'Lisansım ne zaman aktif olur?',
        a: 'Sipariş durumu ödendi olarak onaylandığında lisans otomatik oluşur ve Lisanslarım ekranında görünür.',
      },
      {
        q: 'Faturamı nereden alırım?',
        a: 'Faturalarım ekranından fatura detayını açabilir, yazdır/PDF çıktısı alabilir veya yüklenmiş PDF dosyasını görüntüleyebilirsiniz.',
      },
      {
        q: 'Destek talebine dosya ekleyebilir miyim?',
        a: 'Evet. Destek talebi oluştururken veya yanıt yazarken PDF, görsel veya metin dosyası ekleyebilirsiniz.',
      },
    ],
  },
  {
    slug: 'yol-haritasi',
    label: 'Yol Haritaları',
    eyebrow: 'Plan',
    title: 'Ürün Yol Haritası',
    intro:
      'Aserai satış platformunun operasyonel gelişim başlıkları ve planlanan iyileştirme alanları.',
    roadmap: [
      { phase: 'Kısa vade', text: 'Panel ekranlarının kullanım metrikleri ve destek içerikleriyle zenginleştirilmesi.' },
      { phase: 'Orta vade', text: 'Canlı ödeme ve e-fatura servis bağlantılarının devreye alınması.' },
      { phase: 'Uzun vade', text: 'Akademi içeriklerinin video, doküman ve sürüm notlarıyla CMS üzerinden yönetilmesi.' },
    ],
  },
  {
    slug: 'video-icerikleri',
    label: 'Video İçerikleri',
    eyebrow: 'Eğitim',
    title: 'Video İçerikleri',
    intro:
      'Panel kullanımını adım adım anlatacak kısa eğitim videoları için önerilen içerik dizisi.',
    videos: [
      'İlk giriş ve profil/firma bilgilerini tamamlama',
      'Paket seçimi, sepet ve ödeme talebi oluşturma',
      'Lisans yönetimi ve modül ekleme',
      'Fatura, ödeme ve yenileme takibi',
      'Destek talebi oluşturma ve dosya ekleme',
    ],
  },
  {
    slug: 'hatalar-ve-cozumler',
    label: 'Hatalar ve Çözümler',
    eyebrow: 'Destek',
    title: 'Hatalar ve Çözümler',
    intro:
      'Kullanım sırasında karşılaşılabilecek yaygın durumlar ve hızlı çözüm adımları.',
    issues: [
      {
        issue: 'Ödeme kaydı beklemede görünüyor',
        solution:
          'Havale/EFT dekontunun yönetim tarafından onaylanması gerekir. Onay sonrası lisans ve fatura kayıtları güncellenir.',
      },
      {
        issue: 'API anahtarı tekrar görüntülenemiyor',
        solution:
          'Güvenlik nedeniyle anahtar yalnızca oluşturulduğu anda gösterilir. Gerekirse yeni anahtar oluşturup eski anahtarı iptal edin.',
      },
      {
        issue: 'Destek ek dosyası yüklenemiyor',
        solution:
          'Dosya boyutunun 10 MB altında ve PDF, JPG, PNG, WebP veya TXT formatında olduğundan emin olun.',
      },
    ],
  },
  {
    slug: 'hata-kodlari',
    label: 'Hata Kodları',
    eyebrow: 'Referans',
    title: 'Hata Kodları',
    intro:
      'Destek ve entegrasyon süreçlerinde kullanılabilecek örnek hata kodları ve anlamları.',
    codes: [
      { code: 'AUTH-401', text: 'Oturum doğrulanamadı. Kullanıcının tekrar giriş yapması gerekir.' },
      { code: 'PAY-202', text: 'Ödeme onay bekliyor. Yönetim panelinde ödeme durumu kontrol edilir.' },
      { code: 'LIC-409', text: 'Lisans için bekleyen işlem var. Yenileme veya modül talebi tamamlanmalıdır.' },
      { code: 'API-403', text: 'API anahtarı iptal edilmiş veya yetkisiz firma için kullanılıyor.' },
      { code: 'SUP-415', text: 'Destek ekinde desteklenmeyen dosya türü gönderildi.' },
    ],
  },
]

const defaultSlug = academySections[0].slug

export default function Akademi() {
  const { slug } = useParams()
  const activeSlug = slug || defaultSlug
  const active = academySections.find((section) => section.slug === activeSlug)

  if (!active) return <Navigate to="/akademi" replace />

  return (
    <>
      <PageHeader
        eyebrow="Aserai Akademi"
        title="Aserai kullanım kılavuzu ve eğitim merkezi"
        text="Kullanım adımları, sık sorulan sorular, yol haritası, video içerikleri ve hata çözüm rehberleri tek yerde."
      />

      <section className="section akademi-section">
        <div className="container akademi-layout">
          <aside className="akademi-side" aria-label="Aserai Akademi başlıkları">
            <span className="akademi-side__title">Başlıklar</span>
            <nav>
              {academySections.map((section) => (
                <NavLink
                  key={section.slug}
                  to={`/akademi/${section.slug}`}
                  className="akademi-side__link"
                >
                  <span>{section.label}</span>
                </NavLink>
              ))}
            </nav>
          </aside>

          <article className="akademi-content">
            <span className="eyebrow">{active.eyebrow}</span>
            <h1>{active.title}</h1>
            <p className="akademi-lead">{active.intro}</p>

            {active.steps && (
              <div className="akademi-block">
                <h2>Adım adım</h2>
                <ol className="akademi-steps">
                  {active.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            )}

            {active.notes && (
              <div className="akademi-note">
                <h2>Dikkat edilmesi gerekenler</h2>
                <ul>
                  {active.notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>
            )}

            {active.qa && (
              <div className="akademi-list">
                {active.qa.map((item) => (
                  <section key={item.q} className="akademi-card">
                    <h2>{item.q}</h2>
                    <p>{item.a}</p>
                  </section>
                ))}
              </div>
            )}

            {active.roadmap && (
              <div className="akademi-list">
                {active.roadmap.map((item) => (
                  <section key={item.phase} className="akademi-card">
                    <span>{item.phase}</span>
                    <p>{item.text}</p>
                  </section>
                ))}
              </div>
            )}

            {active.videos && (
              <div className="akademi-video-grid">
                {active.videos.map((video, index) => (
                  <div key={video} className="akademi-video">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{video}</strong>
                  </div>
                ))}
              </div>
            )}

            {active.issues && (
              <div className="akademi-list">
                {active.issues.map((item) => (
                  <section key={item.issue} className="akademi-card">
                    <h2>{item.issue}</h2>
                    <p>{item.solution}</p>
                  </section>
                ))}
              </div>
            )}

            {active.codes && (
              <div className="akademi-codes">
                {active.codes.map((item) => (
                  <div key={item.code} className="akademi-code">
                    <code>{item.code}</code>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="akademi-next">
              <span>Aradığınız içerik yok mu?</span>
              <Link to="/panel/destek" className="btn btn--primary">
                Destek Talebi Oluştur
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
