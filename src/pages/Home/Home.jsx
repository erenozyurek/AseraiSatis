import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

import mokupImg from '../../assets/mokup.png'
import avatarImg from '../../assets/avatar.png'
import mattImg from '../../assets/matt.png'

const Icon = ({ path }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path
      d={path}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const solutions = [
  {
    tag: 'Aserai',
    to: '/aserai',
    title: 'E-Ticaret Altyapısı',
    desc: 'Kendi markanızla satış yapın. Hazır temalar, mobil uyumlu mağaza, ödeme ve kargo entegrasyonlarıyla dakikalar içinde yayında olun.',
    points: [
      'Sınırsız ürün ve kategori',
      'Mobil uyumlu hazır temalar',
      'Ödeme & kargo entegrasyonları',
    ],
    iconPath:
      'M3 9l1.5-5h15L21 9M3 9h18M3 9v10a1 1 0 001 1h16a1 1 0 001-1V9M9 13h6',
  },
  {
    tag: 'Iberai',
    to: '/iberai',
    title: 'Pazaryeri Entegrasyonu',
    desc: 'Trendyol, Hepsiburada, Amazon ve daha fazlasını tek panelden yönetin. Stok ve fiyatlarınız her kanalda otomatik senkron.',
    points: [
      '20+ pazaryeri bağlantısı',
      'Otomatik stok & fiyat senkronu',
      'Toplu ürün ve sipariş yönetimi',
    ],
    iconPath:
      'M4 7h16M4 12h16M4 17h16M8 3v18M16 3v18',
  },
]

const features = [
  {
    title: 'Tek Panelden Yönetim',
    desc: 'Mağazanızı, siparişlerinizi ve tüm pazaryeri kanallarınızı tek ekrandan kontrol edin.',
    iconPath: 'M4 5h16v6H4zM4 15h7v4H4zM15 15h5v4h-5z',
  },
  {
    title: 'Otomatik Senkronizasyon',
    desc: 'Stok, fiyat ve sipariş bilgileri tüm kanallarda anlık ve hatasız güncellenir.',
    iconPath: 'M4 12a8 8 0 0114-5M20 12a8 8 0 01-14 5M17 4v3h-3M7 20v-3h3',
  },
  {
    title: 'Hazır & Özel Temalar',
    desc: 'Sektörünüze uygun şık temalardan seçin ya da markanıza özel tasarım oluşturun.',
    iconPath: 'M3 5h18v4H3zM3 11h10v8H3zM15 11h6v8h-6z',
  },
  {
    title: 'Detaylı Satış Raporları',
    desc: 'Ciro, dönüşüm ve kanal performansını canlı grafiklerle takip edin.',
    iconPath: 'M5 19V9M12 19V5M19 19v-7M3 21h18',
  },
  {
    title: 'Güvenli Ödeme Altyapısı',
    desc: 'PCI-DSS uyumlu altyapı ve tüm sanal POS sağlayıcılarıyla tam uyum.',
    iconPath:
      'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  },
  {
    title: '7/24 Uzman Desteği',
    desc: 'Kurulumdan büyümeye kadar her adımda size özel destek ekibi yanınızda.',
    iconPath:
      'M21 15a2 2 0 01-2 2H8l-4 4V5a2 2 0 012-2h13a2 2 0 012 2zM9 9h6M9 12h4',
  },
]

const steps = [
  {
    no: '01',
    title: 'Paketinizi Seçin',
    desc: 'İhtiyacınıza uygun Aserai paketini seçin; dilerseniz ek modüllerle kapsamını genişletin.',
  },
  {
    no: '02',
    title: 'Mağazanızı Kurun',
    desc: 'Hazır temalarla mağazanızı oluşturun, pazaryeri hesaplarınızı tek tıkla bağlayın.',
  },
  {
    no: '03',
    title: 'Satışa Başlayın',
    desc: 'Tüm kanallarda yayına geçin, siparişleri tek panelden yönetip büyümeyi izleyin.',
  },
]

const pricePreview = [
  {
    name: 'Başlangıç',
    sub: 'Yeni başlayanlar için',
    monthly: 790,
    yearlyMonthly: 590,
    featured: false,
  },
  {
    name: 'Standart',
    sub: 'KOBİ’ler için',
    monthly: 1490,
    yearlyMonthly: 1190,
    featured: true,
  },
  {
    name: 'Profesyonel',
    sub: 'Büyük ölçekli işletmeler',
    monthly: 2990,
    yearlyMonthly: 2390,
    featured: false,
  },
]

const stats = [
  { value: '500+', label: 'Aktif Marka' },
  { value: '1M+', label: 'Tamamlanan Sipariş' },
  { value: '%99,9', label: 'Kesintisiz Hizmet' },
  { value: '7/24', label: 'Uzman Destek' },
]

const formatTL = (n) => n.toLocaleString('tr-TR')

/* Laptop mockup altındaki 4 onay özelliği (şablon) */
const heroChecks = [
  {
    title: 'Temanı Seç — Kendi Web Siteni Kur',
    desc: 'Hazır ve özelleştirilebilir temalarla dakikalar içinde kendi mağazanı kur, markanı yansıt.',
  },
  {
    title: 'İstediğin Yerde Satış Yap',
    desc: 'Kendi siten, pazaryerleri ve sosyal kanallar — tüm satış noktalarını tek yerden yönet.',
  },
  {
    title: 'Müşterilere Odaklan — Analiz Yap',
    desc: 'Ciro, dönüşüm ve müşteri davranışını canlı raporlarla takip et, doğru kararlar al.',
  },
  {
    title: 'İşletmeni Yönet — Ödeme Al',
    desc: 'Sipariş, kargo, muhasebe ve güvenli ödeme altyapısını tek panelden yönet.',
  },
]

/* "MADE FOR COMMERCE" bloğu sekmeleri */
const commerceTabs = [
  {
    key: 'kontrol',
    label: 'Kontrol',
    title: 'Kontrol tamamen sizde.',
    text: 'Aserai ile mağazanıza ve tüm verilerinize eksiksiz sahip olursunuz. İşinizi teknolojinin sınırlaması değil, büyütmesi gerektiğine inanıyoruz.',
  },
  {
    key: 'ozellestirme',
    label: 'Özelleştirme',
    title: 'Sınırsız özelleştirme.',
    text: 'Sürükle-bırak editör ve esnek temalarla mağazanızı baştan sona markanıza göre tasarlayın; kod bilmeden istediğiniz her detayı değiştirin.',
  },
  {
    key: 'olcek',
    label: 'Ölçeklenme',
    title: 'Büyümeye hazır altyapı.',
    text: 'Binlerce ürün ve yoğun trafikte bile hızlı kalan, ölçeklenebilir bulut altyapısıyla işletmenizle birlikte büyüyün.',
  },
  {
    key: 'destek',
    label: 'Destek',
    title: '7/24 yanınızdayız.',
    text: 'Kurulumdan büyümeye kadar her adımda Türkiye’nin en yüksek müşteri memnuniyetine sahip destek ekibi sizinle.',
  },
]

/* 6 entegrasyon kartı (şablon) — turuncu ikonlar */
const integrations = [
  {
    title: 'Pazaryeri',
    sub: 'Entegrasyonları',
    iconPath: 'M3 7h18M5 7l1 12a1 1 0 001 1h10a1 1 0 001-1l1-12M9 7V5a3 3 0 016 0v2',
  },
  {
    title: 'E-Ticaret',
    sub: 'Entegrasyonları',
    iconPath: 'M4 4h16v13H4zM4 20h16M9 8l3 3 5-5',
  },
  {
    title: 'BuyBox',
    sub: 'Rekabet Analizi',
    iconPath: 'M5 19V10M10 19V5M15 19v-7M20 19v-4M3 21h18',
  },
  {
    title: 'Muhasebe',
    sub: 'Entegrasyonları',
    iconPath: 'M6 3h12v18H6zM9 7h6M9 11h6M9 15h3',
  },
  {
    title: 'Kargo',
    sub: 'Entegrasyonları',
    iconPath: 'M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10',
  },
  {
    title: 'E-Fatura',
    sub: 'Entegrasyonları',
    iconPath: 'M6 3h9l3 3v15H6zM14 3v4h4M9 12h6M9 16h6',
  },
]

/* "Sahip Olmanız Gereken E-Ticaret Sitesi Özellikleri" — 2x2 madde grubu */
const featureGroups = [
  [
    'Modüler Entegrasyon Uyumu',
    'Sınırsız Ürün Sayısı',
    'Özelleştirilebilir Tema / Katalog-Vitrin',
  ],
  [
    'AI Otomatik İçerik Çevirisi',
    'AI Tabanlı Ürün Öneri Motoru',
    'Akıllı Fiyatlandırma Algoritması',
  ],
  [
    'Güçlü SEO Altyapısı',
    'Sepet Kampanya Senaryoları',
    'Çoklu Dil & Çoklu Döviz',
  ],
  [
    'Bayii Rolü',
    'E-İhracat Danışmanlığı',
    'Teklif ile Yayın Özelliği',
  ],
]

/* "Aserai ile 4 Adımda E-Ticaret Sitesi Nasıl Kurulur?" akordeon */
const setupSteps = [
  {
    title: '1. Ürünlerinizi Yükleyin',
    desc: 'Ürünlerinizi pazaryerlerinden tek tıkla veya toplu olarak yükleyerek mağazanızı hızlıca oluşturun. Görselleri ve açıklamaları düzenleyin, kullanıcı dostu arayüzle mağazanızı dakikalar içinde hazır hale getirin.',
  },
  {
    title: '2. Temanızı Düzenleyin',
    desc: 'Hazır temalardan birini seçin, sürükle-bırak editörle renkleri, yazıları ve bölümleri markanıza göre özelleştirin. Kod bilmeden profesyonel bir vitrin oluşturun.',
  },
  {
    title: '3. Sanal POS ve Kargo Ayarlarınızı Yapın',
    desc: 'Sanal POS sağlayıcınızı ve kargo firmalarınızı birkaç adımda bağlayın. Ödeme ve gönderim süreçlerinizi otomatikleştirerek satışa hazır olun.',
  },
  {
    title: '4. Aserai Pazarlama ile Satışlarınızı Artırın',
    desc: 'Kampanyalar, indirim kuponları ve entegre pazarlama araçlarıyla daha fazla müşteriye ulaşın; satışlarınızı ve dönüşüm oranlarınızı artırın.',
  },
]

/* Şablon galerisi kartları (gerçek görseller sonra eklenebilir) */
const templateCards = [
  { name: 'Divine', cat: 'Moda & Kozmetik', grad: 'linear-gradient(135deg, #1c3444, #3a5769)' },
  { name: 'Cielo', cat: 'Spor & Fitness', grad: 'linear-gradient(135deg, #343c3c, #6b7580)' },
  { name: 'Prickles & Co', cat: 'Ev & Bahçe', grad: 'linear-gradient(135deg, #2c3b34, #6b7d72)' },
  { name: 'Aurora', cat: 'Takı & Aksesuar', grad: 'linear-gradient(135deg, #3a3340, #7a7183)' },
  { name: 'Terra', cat: 'Gıda & Market', grad: 'linear-gradient(135deg, #6b5540, #b79a7c)' },
  { name: 'Nova', cat: 'Teknoloji', grad: 'linear-gradient(135deg, #14262f, #34505f)' },
]

/* Referans / partner logoları (gerçek görsel eklenince otomatik değişir) */
const refLogos = [
  'Teknopark Gaziantep',
  'CMB Global',
  'aracımauygun.com',
  'iyisiyizoto',
  'Mert Yangın',
  'bioMacht',
]

/* 3 avantaj kartı */
const advantages = [
  {
    title: 'Sınırsız E-İhracat',
    desc: 'Sınırsız dil ve para birimleriyle satış yapın, ödeme alın ve tüm dünyaya mikro-ihracat yapın.',
    variant: 'export',
  },
  {
    title: '7/24 Teknik Destek',
    desc: 'Türkiye’nin en yüksek müşteri memnuniyetine sahip e-ticaret altyapısı her zaman yanınızda.',
    variant: 'support',
  },
  {
    title: 'Geçişi Dert Etmeyin',
    desc: 'Başka bir altyapıdan Aserai’ye geçmek istediğinizde, destek ekibimiz sizinle beraber.',
    variant: 'migrate',
  },
]

/* Ücretsiz e-kitap kartları */
const ebooks = [
  {
    title: 'Sıfırdan E-Ticarete Başlama Rehberi',
    desc: 'E-Ticaretle Tanışmak İsteyenlerin El Klavuzu Bu Dosyada',
  },
  {
    title: 'Kolay E-İhracat Rehberi',
    desc: 'En Pratik E-İhracat Süreçleri Bu Dosyada',
  },
  {
    title: 'Türkiye ve Dünyadan E-Ticaret Raporları',
    desc: 'E-Ticaretin En Güncel Raporu Bu Dosyada',
  },
  {
    title: 'Satışları Artıran, Müşteri Mıknatısı Kılavuz',
    desc: 'Ürünlerinizin Gerçek Alıcılarına Ulaşması için En Etkili Pazarlama Araçları Bu Dosyada',
  },
]

/* Entegrasyon / pazaryeri isimleri (xlsx dökümanı) */
const marketplaces = [
  'Trendyol',
  'Hepsiburada',
  'N11',
  'Amazon',
  'Çiçeksepeti',
  'e-PttAvm',
  'Pazarama',
  'Akakçe',
  'Etsy',
  'Shopify',
  'AliExpress',
  'eBay',
]

/* Sektörler (LANDING PAGE UI_2026) */
const industries = [
  {
    title: 'Yedek Parça',
    desc: 'OEM/OES kodları, araç uyumluluğu ve geniş katalog yönetimi.',
    iconPath: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',
  },
  {
    title: 'Moda & Giyim',
    desc: 'Beden/renk varyantları, asorti ürünler ve sezon koleksiyonları.',
    iconPath: 'M8 3l4 3 4-3 4 4-3 3v8H7v-8L4 7z',
  },
  {
    title: 'Ev & Yaşam',
    desc: 'Hacimli ürünler için desi bazlı kargo ve set ürün satışı.',
    iconPath: 'M3 11l9-7 9 7M5 10v10h14V10M9 20v-6h6v6',
  },
  {
    title: 'Kozmetik & Kişisel Bakım',
    desc: 'SKT takibi, abonelik ve kampanya senaryolarıyla tekrar satış.',
    iconPath: 'M9 3h6v4l2 3v10a1 1 0 01-1 1H8a1 1 0 01-1-1V10l2-3zM9 13h6',
  },
  {
    title: 'Teknoloji & Elektronik',
    desc: 'Yüksek trafik, hızlı arama ve BuyBox rekabet analizi.',
    iconPath: 'M4 5h16v10H4zM2 19h20M9 9h6',
  },
  {
    title: 'B2B & Toptan',
    desc: 'Bayi rolü, özel fiyat listeleri ve sipariş eşiği yönetimi.',
    iconPath: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 11h.01M15 11h.01',
  },
]

/* Müşteri yorumları (slider) */
const homeTestimonials = [
  {
    quote:
      'Aserai ile mağazamızı iki günde açtık. Teknik ekibimiz yok ama her şeyi kendimiz yönetebiliyoruz.',
    name: 'Ahmet Yılmaz',
    company: 'Moda Vitrin · Kurucu',
  },
  {
    quote:
      'Pazaryeri entegrasyonları sayesinde altı kanalı tek ekrandan yönetiyoruz. Stoklar artık hiç uyumsuz değil.',
    name: 'Selin Acar',
    company: 'TeknoMarket · E-ticaret Müdürü',
  },
  {
    quote:
      'Yapay zekâ önerileri ve akıllı fiyatlandırma dönüşüm oranımızı belirgin şekilde artırdı.',
    name: 'Burak Şahin',
    company: 'EvBahçe · Operasyon Lideri',
  },
  {
    quote:
      'Destek ekibi gerçekten ulaşılabilir. Sorularımıza dakikalar içinde Türkçe yanıt alıyoruz.',
    name: 'Deniz Korkmaz',
    company: 'SporZone · Mağaza Sahibi',
  },
  {
    quote:
      'Raporlar sayesinde hangi kanalın ne kadar kâr getirdiğini net görüyoruz. Kararlarımız artık veriye dayalı.',
    name: 'Emre Doğan',
    company: 'KitapEvi · Genel Müdür',
  },
]

const homeInitials = (name) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('')

export default function Home() {
  const [activeTab, setActiveTab] = useState(0)
  const [openStep, setOpenStep] = useState(0)
  const [formSent, setFormSent] = useState(false)
  const tab = commerceTabs[activeTab]

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormSent(true)
  }

  return (
    <>
      {/* ---------- HERO: LAPTOP MOCKUP ---------- */}
      <section className="lhero">
        <div className="container lhero__inner">
          <img
            src={mokupImg}
            alt="Aserai e-ticaret mağaza önizlemesi"
            className="lhero__img fade-up"
          />
        </div>
      </section>

      {/* ---------- 4 ONAY ÖZELLİĞİ ---------- */}
      <section className="checks">
        <div className="container checks__grid">
          {heroChecks.map((c) => (
            <div key={c.title} className="check-item">
              <span className="check-item__mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="30" height="30">
                  <path
                    d="M4 12.5l5 5L20 6.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- GÜVEN METRİKLERİ ---------- */}
      <section className="section section--soft metrics">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Rakamlarla Aserai</span>
            <h2>Büyüyen Markaların Güvendiği Ticaret Altyapısı</h2>
          </div>
          <div className="metrics__grid">
            {stats.map((s) => (
              <div key={s.label} className="hero-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- MADE FOR COMMERCE ---------- */}
      <section className="mfc">
        <div className="container mfc__inner">
          <div className="mfc__left">
            <h2 className="mfc__display">
              MADE FOR
              <br />
              COMMERCE.
              <br />
              BUILT FOR
              <br />
              SUCCESS.
            </h2>

            <div className="mfc__tabs" role="tablist">
              {commerceTabs.map((t, i) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={i === activeTab}
                  className={`mfc__tab ${i === activeTab ? 'is-active' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mfc__panel">
              <h3>{tab.title}</h3>
              <p>{tab.text}</p>
            </div>

            <Link to="/paketler" className="btn btn--dark btn--lg mfc__cta">
              GET STARTED
              <span aria-hidden="true">▸</span>
            </Link>
          </div>

          <div className="mfc__right" aria-hidden="true">
            <span className="mfc__store-tag">Your_Store</span>
            <svg
              className="mfc__store"
              viewBox="0 0 320 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 150 L300 40 L300 280 L20 280 Z"
                stroke="var(--c-navy)"
                strokeWidth="2.4"
                strokeLinejoin="round"
              />
              <path
                d="M300 40 L292 58"
                stroke="var(--c-navy)"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M20 210 L300 210"
                stroke="var(--c-border-strong)"
                strokeWidth="2"
                strokeDasharray="6 8"
              />
              <rect
                x="52"
                y="176"
                width="70"
                height="54"
                rx="6"
                stroke="var(--c-border-strong)"
                strokeWidth="2"
              />
              <rect
                x="150"
                y="150"
                width="70"
                height="54"
                rx="6"
                stroke="var(--c-border-strong)"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* ---------- MASKOT BANDI ---------- */}
      <section className="mascot">
        <div className="container mascot__inner">
          <div className="mascot__figure">
            <img src={avatarImg} alt="Aserai maskotu" className="mascot__img" />
          </div>
          <div className="mascot__content">
            <h2 className="mascot__title">
              E-TİCARETİNİZ
              <br />
              <span>MARKANIZ</span>
              <br />
              KURALLARINIZ
            </h2>
            <Link to="/paketler" className="btn btn--outline-dark btn--lg mascot__cta">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M3 4h2l2.4 12.4a1 1 0 001 .8h9.2a1 1 0 001-.8L21 8H6M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              E-Ticarete Başla
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- KİŞİ GÖRSELİ + ÜRÜN LİSTESİ ---------- */}
      <section className="showcase">
        <div className="container">
          <div className="showcase__frame">
            <img
              src={mattImg}
              alt="Aserai ile satış yapan işletme sahibi"
              className="showcase__img"
            />
          </div>
        </div>
      </section>

      {/* ---------- ENTEGRASYON KARTLARI ---------- */}
      <section className="section integrations">
        <div className="container">
          <div className="int-grid">
            {integrations.map((it) => (
              <article key={it.title} className="int-card">
                <span className="int-card__icon" aria-hidden="true">
                  <Icon path={it.iconPath} />
                </span>
                <h3>
                  {it.title}
                  <span>{it.sub}</span>
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PAZARYERİ / ENTEGRASYON LOGOLARI ---------- */}
      <section className="section section--soft mkt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Entegrasyonlar</span>
            <h2>Kullandığınız Tüm Sistemlerle Uyum İçinde Çalışır</h2>
            <p>
              Türkiye’nin ve dünyanın önde gelen pazaryerleri, kargo, muhasebe,
              e-fatura ve ödeme sistemleriyle sorunsuz entegrasyon.
            </p>
          </div>
          <div className="mkt-grid">
            {marketplaces.map((m) => (
              <span key={m} className="mkt-logo">
                {m}
              </span>
            ))}
          </div>
          <p className="mkt-note">
            Pazaryeri entegrasyonları Aserai’ye entegre Iberai çözümüyle
            sağlanır —{' '}
            <a
              href="https://www.iberai.com.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              iberai.com.tr
              <span aria-hidden="true">↗</span>
            </a>
          </p>
        </div>
      </section>

      {/* ---------- SAHİP OLMANIZ GEREKEN ÖZELLİKLER ---------- */}
      <section className="section site-features">
        <div className="container">
          <h2 className="site-features__title">
            Sahip Olmanız Gereken E-Ticaret Sitesi Özellikleri
          </h2>
          <div className="site-features__grid">
            {featureGroups.map((group, gi) => (
              <ul key={gi} className="site-features__list">
                {group.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ))}
          </div>
          <Link to="/paketler" className="text-link site-features__link">
            Tüm Özellikleri Keşfet
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* ---------- SEKTÖRLER ---------- */}
      <section className="section section--soft industries">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Sektörler</span>
            <h2>Her Sektöre Uygun Ticaret Çözümleri</h2>
            <p>
              İşinizin ihtiyaçlarına göre uyarlanabilen esnek altyapıyla her
              sektörde satışa hazır olun.
            </p>
          </div>
          <div className="ind-grid">
            {industries.map((it) => (
              <article key={it.title} className="ind-card">
                <span className="ind-card__icon" aria-hidden="true">
                  <Icon path={it.iconPath} />
                </span>
                <h3>{it.title}</h3>
                <p>{it.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 4 ADIMDA NASIL KURULUR (AKORDEON) ---------- */}
      <section className="section setup">
        <div className="container setup__inner">
          <div className="setup__visual" aria-hidden="true">
            <div className="setup__browser">
              <div className="setup__browser-bar">
                <span />
                <span />
                <span />
                <em>aserai.com/magazam</em>
              </div>
              <div className="setup__browser-body">
                <div className="setup__tile setup__tile--a" />
                <div className="setup__tile setup__tile--b" />
                <div className="setup__upload">⟳</div>
                <div className="setup__card">
                  <span className="setup__card-name">Deri Çanta</span>
                  <span className="setup__card-color">Turuncu</span>
                  <strong className="setup__card-price">₺2.998</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="setup__content">
            <h2 className="setup__title">
              Aserai ile 4 Adımda E-Ticaret Sitesi Nasıl Kurulur?
            </h2>
            <div className="accordion">
              {setupSteps.map((step, i) => {
                const isOpen = i === openStep
                return (
                  <div
                    key={step.title}
                    className={`accordion__item ${isOpen ? 'is-open' : ''}`}
                  >
                    <button
                      className="accordion__head"
                      aria-expanded={isOpen}
                      onClick={() => setOpenStep(isOpen ? -1 : i)}
                    >
                      <span>{step.title}</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                        <path
                          d="M3 5l5 5 5-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    <div className="accordion__panel">
                      <p>{step.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- ŞABLON GALERİSİ ---------- */}
      <section className="section section--soft gallery">
        <div className="container">
          <div className="section-head">
            <h2>Hayal Ettiğin E-Ticaret Sitesini Tasarlamak için Şimdi Başla</h2>
            <p>
              Etkileyici tasarımlardan istediğiniz e-ticaret sitesi şablonunu
              seçin ve özelleştirerek kendinize ait bir e-ticaret sitesi haline
              getirin.
            </p>
            <Link to="/paketler" className="text-link gallery__discover">
              E-Ticaret Sitesi Şablonlarını Keşfet
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="gallery__track">
            {templateCards.map((t) => (
              <article key={t.name} className="tpl-card">
                <div className="tpl-card__thumb" style={{ background: t.grad }}>
                  <span className="tpl-card__badge">{t.cat}</span>
                </div>
                <div className="tpl-card__foot">
                  <h3>{t.name}</h3>
                  <Link to="/demo" className="tpl-card__link">
                    Önizle →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- REFERANS LOGOLARI ---------- */}
      <section className="reflogos">
        <div className="container reflogos__row">
          {refLogos.map((name) => (
            <div key={name} className="reflogo">
              <span>{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 3 AVANTAJ KARTI ---------- */}
      <section className="section advantages">
        <div className="container">
          <div className="adv-grid">
            {advantages.map((a) => (
              <article key={a.title} className="adv-card">
                <h3>{a.title}</h3>
                <p>{a.desc}</p>
                <div className={`adv-card__visual adv-card__visual--${a.variant}`}>
                  {a.variant === 'export' && (
                    <>
                      <span className="adv-badge">🇹🇷 woodgoods.co/tr</span>
                      <span className="adv-globe" />
                    </>
                  )}
                  {a.variant === 'support' && (
                    <div className="adv-chat">
                      <span className="adv-chat__av" />
                      <div className="adv-chat__bubble">
                        İyi akşamlar! Size nasıl yardımcı olabilirim?
                        <em>Pazar, 01:29</em>
                      </div>
                    </div>
                  )}
                  {a.variant === 'migrate' && <span className="adv-bolt">⚡</span>}
                </div>
                <Link to="/iletisim" className="btn btn--ghost btn--block adv-card__btn">
                  Keşfet
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- MÜŞTERİ YORUMLARI (SLIDER) ---------- */}
      <section className="section reviews">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Referanslar</span>
            <h2>Müşterilerimiz Ne Diyor?</h2>
          </div>
          <div className="reviews__track">
            {homeTestimonials.map((t) => (
              <article key={t.name} className="review-card">
                <div className="review-card__stars" aria-label="5 üzerinden 5">
                  ★★★★★
                </div>
                <p className="review-card__text">“{t.quote}”</p>
                <div className="review-card__author">
                  <span className="review-card__avatar">
                    {homeInitials(t.name)}
                  </span>
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

      {/* ---------- İLETİŞİM FORMU ---------- */}
      <section className="section section--soft callme">
        <div className="container callme__inner">
          <div className="callme__intro">
            <h2>
              Detaylı bilgi için
              <br />
              sizi arayalım!
            </h2>
            <span className="callme__badge">
              <span aria-hidden="true">🕑</span> 7 / 24 Yanınızdayız
            </span>
          </div>

          {formSent ? (
            <div className="callme__done">
              <span className="callme__done-mark">✓</span>
              <h3>Talebiniz alındı!</h3>
              <p>Ekibimiz en kısa sürede sizi arayacak. Teşekkürler.</p>
            </div>
          ) : (
            <form className="callme__form" onSubmit={handleSubmit}>
              <div className="callme__row">
                <input type="text" placeholder="Ad" required aria-label="Ad" />
                <input type="text" placeholder="Soyad" required aria-label="Soyad" />
              </div>
              <div className="callme__row">
                <input
                  type="email"
                  placeholder="E-Posta"
                  required
                  aria-label="E-Posta"
                />
                <div className="callme__phone">
                  <span>🇹🇷 +90</span>
                  <input
                    type="tel"
                    placeholder="5xx xxx xx xx"
                    required
                    aria-label="Telefon"
                  />
                </div>
              </div>
              <div className="callme__foot">
                <label className="callme__check">
                  <input type="checkbox" required />
                  <span>
                    Kullanıcı Sözleşmesi’ni okudum, onaylıyorum.
                  </span>
                </label>
                <button type="submit" className="btn btn--dark callme__submit">
                  GÖNDER
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ---------- ÜCRETSİZ E-KİTAPLAR ---------- */}
      <section className="section ebooks">
        <div className="container">
          <div className="section-head">
            <h2>Sıfırdan E-Ticaret E-Kitapları</h2>
            <p>
              E-Ticarette hedeflerine daha hızlı ve daha karlı ulaşmak
              isteyenlerin ücretsiz el kılavuzları bu dosyalarda.
            </p>
          </div>
          <div className="ebook-grid">
            {ebooks.map((b) => (
              <article key={b.title} className="ebook-card">
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
                <span className="ebook-card__icon" aria-hidden="true" />
                <a href="/iletisim" className="ebook-card__btn">
                  FREE DOWNLOAD
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
