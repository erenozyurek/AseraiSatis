import { Link } from 'react-router-dom'
import './Footer.css'

/* Footer sütunları (2026 dökümanı — 5 kolon) */
const columns = [
  {
    title: 'E-Ticaret Paketleri',
    links: [
      { label: 'Yeni Başlayanlar', to: '/paketler' },
      { label: 'Standart Paketler', to: '/paketler' },
      { label: 'Profesyonel Paketler', to: '/paketler' },
      { label: 'E-İhracat Paketleri', to: '/paketler' },
      { label: 'Kampanyalar', to: '/paketler' },
    ],
  },
  {
    title: 'Modüller',
    links: [
      { label: 'One Page Checkout', to: '/moduller' },
      { label: 'Kampanya & Etiket Yönetimi', to: '/moduller' },
      { label: 'Aserai AI Modülü', to: '/moduller' },
      { label: 'Aserai Tema Editörü', to: '/moduller' },
      { label: 'Çoklu Dil & Para', to: '/moduller' },
      { label: 'Bayi & Tedarikçi', to: '/moduller' },
    ],
  },
  {
    title: 'Tüm Özellikler',
    links: [
      { label: 'Varyantlı Ürün', to: '/ozellikler' },
      { label: 'Smart Price', to: '/ozellikler' },
      { label: 'AI Ürün Açıklaması', to: '/ozellikler' },
      { label: 'Akıllı Filtreleme', to: '/ozellikler' },
      { label: 'SEO Yönetimi', to: '/ozellikler' },
      { label: 'Kargo Yönetimi', to: '/ozellikler' },
    ],
  },
  {
    title: 'Anasayfa',
    links: [
      { label: 'Ana Sayfa', to: '/' },
      { label: 'E-Ticaret Çözümleri', to: '/cozumler' },
      { label: 'Paketler', to: '/paketler' },
      { label: 'Demo Talep Et', to: '/demo' },
      { label: 'Teklif Al', to: '/teklif' },
      { label: 'İletişim', to: '/iletisim' },
      { label: 'Giriş Yap', to: '/giris' },
    ],
  },
  {
    title: 'Kurumsal',
    links: [
      { label: 'Hakkımızda', to: '/hakkimizda' },
      { label: 'Referanslarımız', to: '/referanslar' },
      { label: 'Partner / Bayii', to: '/hakkimizda' },
      { label: 'Kariyer', to: '/hakkimizda' },
      { label: 'Blog', to: '/blog' },
      { label: 'Destek Merkezi', to: '/yardim' },
      { label: 'Hukuki Sayfalar', to: '/kvkk' },
    ],
  },
]

const legalLinks = [
  { label: 'Yasal Uyarı', to: '/yasal-uyari' },
  { label: 'Kullanım Şartları', to: '/kullanim-sartlari' },
  { label: 'Hukuki Sayfalar', to: '/kvkk' },
  { label: 'Çerez Politikası', to: '/cerez-politikasi' },
  { label: 'Gizlilik Politikası', to: '/gizlilik' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/* Sütunlar */}
        <div className="footer__cols">
          {columns.map((col) => (
            <div key={col.title} className="footer__col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Alt şerit */}
        <div className="footer__bottom">
          <div className="footer__legal">
            {legalLinks.map((item) => (
              <Link key={item.label} to={item.to}>
                {item.label}
              </Link>
            ))}
          </div>
          <p className="footer__copy">
            © 2019–2026 Aserai E-Ticaret Sistemleri.
            <br />
            Aserai, bir Dijital Atölyemiz markasıdır. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
