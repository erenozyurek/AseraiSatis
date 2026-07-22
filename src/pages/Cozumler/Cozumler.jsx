import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import ComparisonTable from '../../components/ComparisonTable/ComparisonTable.jsx'
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
    title: 'Aserai B2C E-Ticaret',
    desc: 'Kendi markanızla doğrudan son kullanıcıya satış yapmanız için ihtiyacınız olan her şey. Hazır temalar, mobil uyumlu mağaza, güvenli ödeme ve kargo entegrasyonlarıyla dakikalar içinde yayında olun.',
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
    tag: 'Aserai',
    status: 'Yakında',
    title: 'Aserai B2B E-Ticaret',
    desc: 'Bayi, toptan satış ve kurumsal müşteri operasyonlarını Aserai ekosistemi içinde yönetmek için hazırlanıyor. Özel fiyatlandırma, rol bazlı erişim ve sipariş akışları tek yapıda toplanacak.',
    points: [
      'Bayi ve kurumsal müşteri hesap yönetimi',
      'Müşteri grubuna özel fiyat ve iskonto yapısı',
      'Toplu sipariş ve teklif akışı',
      'Rol bazlı yetkilendirme',
      'B2C mağaza altyapısıyla uyumlu çalışma',
    ],
    iconPath: 'M4 6h16v12H4zM8 6v12M16 6v12M4 10h16M4 14h16',
  },
  {
    tag: 'İberai',
    status: 'Yakında',
    title: 'İberai Ticari Entegrasyon Platformu',
    desc: 'Pazaryeri, muhasebe, e-dönüşüm, ödeme, kargo ve CRM entegrasyonlarını tek platformda birleştirecek ticari entegrasyon katmanı olarak konumlandırılıyor.',
    points: [
      '20+ pazaryeri ile tek panelden entegrasyon',
      'Otomatik stok ve fiyat senkronizasyonu',
      'Toplu ürün yükleme ve sipariş yönetimi',
      'Muhasebe ve e-fatura entegrasyonları',
      'Kargo, ödeme ve CRM bağlantıları',
    ],
    to: 'https://www.iberai.com.tr',
    external: true,
    cta: 'iberai.com.tr’yi ziyaret et',
    iconPath: 'M4 7h16M4 12h16M4 17h16M8 3v18M16 3v18',
  },
  {
    tag: 'Aserai',
    status: 'Yakında',
    title: 'Aserai CRM',
    desc: 'Müşteri ilişkileri, satış fırsatları ve destek süreçlerini e-ticaret operasyonuyla birlikte yönetmek için Aserai ekosistemine CRM çözümü eklenecek.',
    points: [
      'Müşteri kartı ve iletişim geçmişi',
      'Satış fırsatı ve teklif takibi',
      'Segmentasyon ve müşteri grupları',
      'Destek talepleriyle entegre müşteri görünümü',
      'Raporlama ve performans takibi',
    ],
    iconPath:
      'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0M18 8h3M19.5 6.5v3',
  },
  {
    tag: 'Aserai',
    status: 'Yakında',
    title: 'Aserai Influencer Kampanya Yazılımı',
    desc: 'Influencer iş birliklerini, kampanya kodlarını ve dönüşüm performansını satış verileriyle birlikte takip etmek için planlanan kampanya yönetimi çözümü.',
    points: [
      'Influencer ve kampanya kayıtları',
      'Kişiye özel kupon ve takip bağlantıları',
      'Satış ve dönüşüm performansı',
      'Komisyon ve hakediş takibi',
      'Kampanya raporları',
    ],
    iconPath: 'M4 10v4l4 2 8-8v12l-8-8-4-2zM18 9l3-3M19 13h3M18 17l3 3',
  },
  {
    tag: 'Aserai',
    status: 'Yakında',
    title: 'Aserai Workflow Yazılımı',
    desc: 'Operasyonel iş akışlarını, görevleri ve onay süreçlerini tek panelden yönetmek için Aserai ekosistemine eklenecek workflow çözümü.',
    points: [
      'Görev ve süreç akışı oluşturma',
      'Onay mekanizmaları',
      'Departman bazlı iş takibi',
      'Bildirim ve hatırlatma akışları',
      'Operasyon raporları',
    ],
    iconPath: 'M5 6h6v6H5zM13 8h6M13 16h6M5 18h6v-6H5zM11 9h2M11 15h2',
  },
]

export default function Cozumler() {
  return (
    <>
      <PageHeader
        eyebrow="E-Ticaret Çözümleri"
        title="Aserai ile uçtan uca satış ekosistemi"
        text="Aserai B2C E-Ticaret ve Aserai B2B E-Ticaret’ten İberai Ticari Entegrasyon Platformu’na, Aserai CRM’den kampanya ve workflow yönetimine kadar Dijital Atölyemiz yazılım çözümlerini tek ekosistemde keşfedin."
      />

      {/* ---------- ÇÖZÜMLER ---------- */}
      <section className="section">
        <div className="container">
          <div className="cz-grid">
            {solutions.map((s) => (
              <article key={`${s.tag}-${s.title}`} className="cz-card">
                <div className="cz-card__head">
                  <span className="cz-card__icon">
                    <Icon path={s.iconPath} />
                  </span>
                  <span className="cz-card__tag">{s.tag}</span>
                  {s.status ? (
                    <span className="cz-card__status">{s.status}</span>
                  ) : null}
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
                {s.status ? (
                  <span className="btn btn--dark cz-card__btn cz-card__btn--soon">
                    Yakında
                  </span>
                ) : s.external ? (
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
            <h2>Dijital Atölyemiz yazılım çözümleri tek yapıda buluşur</h2>
            <p>
              E-ticaret ekosisteminizde satış, entegrasyon, müşteri ilişkileri,
              kampanya ve operasyon yönetimini birbirini tamamlayan yazılımlarla
              büyütün.
            </p>
          </div>
          <div className="cz-benefits">
            {[
              {
                t: 'B2C satış vitrini',
                d: 'Aserai B2C E-Ticaret ile markanıza ait online mağazayı kurun, ödeme ve kargo akışını hazır altyapıyla yönetin.',
              },
              {
                t: 'B2B büyüme kanalı',
                d: 'Aserai B2B E-Ticaret ile bayi, toptan satış ve kurumsal müşteri süreçlerini ayrı fiyat ve yetki yapısıyla planlayın.',
              },
              {
                t: 'Ticari entegrasyon gücü',
                d: 'İberai Ticari Entegrasyon Platformu ile pazaryeri, muhasebe, e-dönüşüm, ödeme ve kargo bağlantılarını tek akışta toplayın.',
              },
              {
                t: 'Müşteri ilişkileri yönetimi',
                d: 'Aserai CRM ile müşteri kartlarını, satış fırsatlarını, segmentleri ve destek temaslarını satış verileriyle birlikte izleyin.',
              },
              {
                t: 'Influencer kampanya takibi',
                d: 'Aserai Influencer Kampanya Yazılımı ile iş birliklerini, kuponları, satış dönüşümlerini ve hakedişleri ölçülebilir hale getirin.',
              },
              {
                t: 'Operasyonel iş akışı',
                d: 'Aserai Workflow Yazılımı ile görev, onay, departman ve takip süreçlerini e-ticaret operasyonunuzla uyumlu yönetin.',
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
          <ComparisonTable />
        </div>
      </section>

      <CtaBand
        primaryLabel="Ücretsiz Danışmanlık Al"
        primaryTo="/iletisim"
        secondaryLabel="Demo Talep Et"
        secondaryTo="/demo"
      />
    </>
  )
}
