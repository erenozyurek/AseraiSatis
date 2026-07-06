import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import './Cozumler.css'

const Icon = ({ path }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
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
    title: 'E-Ticaret Altyapısı',
    desc: 'Kendi markanızla satış yapmanız için ihtiyacınız olan her şey. Hazır ve özelleştirilebilir temalar, mobil uyumlu mağaza, güvenli ödeme ve kargo entegrasyonlarıyla dakikalar içinde yayında olun.',
    points: [
      'Sürükle-bırak editör ile özelleştirilebilir temalar',
      'Sınırsız ürün, kategori ve esnek varyant tanımlama',
      'Güvenli ödeme altyapısı ve sanal POS entegrasyonu',
      'Kargo entegrasyonları ve otomatik gönderim',
      'Çoklu dil ve çoklu döviz ile global satış',
    ],
    to: '/aserai',
    iconPath:
      'M3 9l1.5-5h15L21 9M3 9h18M3 9v10a1 1 0 001 1h16a1 1 0 001-1V9M9 13h6',
  },
  {
    tag: 'Iberai',
    title: 'Pazaryeri Entegrasyonu',
    desc: 'Trendyol, Hepsiburada, Amazon ve daha fazlasını tek panelden yönetin. Stok, fiyat ve siparişleriniz tüm kanallarda otomatik senkronize olur. Iberai, Aserai ekosistemine entegre pazaryeri çözümüdür — detaylar iberai.com.tr’de.',
    points: [
      '20+ pazaryeri ile tek panelden entegrasyon',
      'Otomatik stok ve fiyat senkronizasyonu',
      'Toplu ürün yükleme ve sipariş yönetimi',
      'BuyBox rekabet analizi ve fiyat takibi',
      'Muhasebe ve e-fatura entegrasyonları',
    ],
    to: 'https://www.iberai.com.tr',
    external: true,
    cta: 'iberai.com.tr’yi ziyaret et',
    iconPath: 'M4 7h16M4 12h16M4 17h16M8 3v18M16 3v18',
  },
]

const packages = [
  {
    name: 'Başlangıç',
    sub: 'Yeni başlayanlar',
    monthly: 790,
    yearlyMonthly: 590,
    featured: false,
    features: [
      '250 ürüne kadar',
      '1 hazır mağaza teması',
      'Temel ödeme entegrasyonu',
      'E-posta destek',
    ],
  },
  {
    name: 'Standart',
    sub: 'KOBİ’ler için',
    monthly: 1490,
    yearlyMonthly: 1190,
    featured: true,
    features: [
      'Sınırsız ürün ve kategori',
      'Tüm premium temalar',
      'Pazaryeri & kargo entegrasyonları',
      'İndirim & kampanya modülü',
      'Öncelikli destek',
    ],
  },
  {
    name: 'Profesyonel',
    sub: 'Büyük ölçek',
    monthly: 2990,
    yearlyMonthly: 2390,
    featured: false,
    features: [
      'Standart paketteki her şey',
      'Çoklu mağaza yönetimi',
      'AI öneri & akıllı fiyatlandırma',
      'API & ERP entegrasyonu',
    ],
  },
  {
    name: 'E-İhracat',
    sub: 'Yurt dışı satış',
    monthly: 4990,
    yearlyMonthly: 3990,
    featured: false,
    features: [
      'Profesyonel paketteki her şey',
      'Çoklu dil & çoklu döviz',
      'Global pazaryerleri',
      'E-İhracat danışmanlığı',
    ],
  },
]

const formatTL = (n) => n.toLocaleString('tr-TR')

export default function Cozumler() {
  return (
    <>
      <PageHeader
        eyebrow="E-Ticaret Çözümleri"
        title="Aserai ile uçtan uca satış"
        text="Kendi mağazanızı kurun, tüm pazaryerlerini tek panelden yönetin. Aserai’ye entegre Iberai çözümüyle altyapı, entegrasyon ve destek tek ekosistemde."
      />

      {/* ---------- ÇÖZÜMLER ---------- */}
      <section className="section">
        <div className="container">
          <div className="cz-grid">
            {solutions.map((s) => (
              <article key={s.tag} className="cz-card">
                <div className="cz-card__head">
                  <span className="cz-card__icon">
                    <Icon path={s.iconPath} />
                  </span>
                  <span className="cz-card__tag">{s.tag}</span>
                </div>
                <h2>{s.title}</h2>
                <p className="cz-card__desc">{s.desc}</p>
                <ul className="cz-card__list">
                  {s.points.map((p) => (
                    <li key={p}>
                      <span className="cz-check" aria-hidden="true">
                        ✓
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
                {s.external ? (
                  <a
                    href={s.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--dark cz-card__btn"
                  >
                    {s.cta}
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <Link to={s.to} className="btn btn--dark cz-card__btn">
                    {s.tag} detaylarını gör
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- NEDEN BİRLİKTE ---------- */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Tek ekosistem</span>
            <h2>Birlikte kullanın, her kanalda büyüyün</h2>
            <p>
              Aserai ile kendi mağazanızda, entegre Iberai çözümüyle
              pazaryerlerinde satış yapın. Stok, sipariş ve raporların tamamı
              tek panelde toplanır.
            </p>
          </div>
          <div className="cz-benefits">
            {[
              {
                t: 'Tek panel',
                d: 'Mağaza ve tüm pazaryeri kanallarınızı tek ekrandan yönetin.',
              },
              {
                t: 'Otomatik senkron',
                d: 'Stok, fiyat ve sipariş bilgileri tüm kanallarda anlık güncellenir.',
              },
              {
                t: '7/24 destek',
                d: 'Kurulumdan büyümeye kadar her adımda uzman ekip yanınızda.',
              },
            ].map((b) => (
              <div key={b.t} className="cz-benefit">
                <h3>{b.t}</h3>
                <p>{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FİYATLANDIRMA & PAKETLER ---------- */}
      <section className="section" id="fiyatlandirma">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Fiyatlandırma</span>
            <h2>İşinize uygun paketi seçin</h2>
            <p>
              Aylık ya da yıllık ödeyin. Yıllık planlarda aya düşen maliyetiniz
              belirgin şekilde azalır.
            </p>
          </div>
          <div className="cz-prices">
            {packages.map((p) => (
              <article
                key={p.name}
                className={`cz-price ${p.featured ? 'cz-price--featured' : ''}`}
              >
                {p.featured && <span className="cz-price__badge">En popüler</span>}
                <h3>{p.name}</h3>
                <p className="cz-price__sub">{p.sub}</p>
                <div className="cz-price__amount">
                  <span className="cz-price__currency">₺</span>
                  <span className="cz-price__value">{formatTL(p.monthly)}</span>
                  <span className="cz-price__period">/ ay</span>
                </div>
                <p className="cz-price__yearly">
                  Yıllık ödemede <strong>₺{formatTL(p.yearlyMonthly)}/ay</strong>
                </p>
                <ul className="cz-price__list">
                  {p.features.map((f) => (
                    <li key={f}>
                      <span className="cz-check" aria-hidden="true">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/paketler"
                  className={`btn btn--block ${
                    p.featured ? 'btn--dark' : 'btn--ghost'
                  }`}
                >
                  Paketi seç
                </Link>
              </article>
            ))}
          </div>
          <p className="cz-prices__note">
            Tüm paketleri, aylık/yıllık karşılaştırmayı ve özellik detaylarını{' '}
            <Link to="/paketler" className="text-link">
              Paketler sayfasında
              <span aria-hidden="true">→</span>
            </Link>{' '}
            inceleyebilirsiniz.
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
