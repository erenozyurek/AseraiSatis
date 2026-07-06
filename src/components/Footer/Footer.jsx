import { Link } from 'react-router-dom'
import './Footer.css'

import aseraiLogo from '../../assets/aserai.png'

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
      { label: 'Blog', to: '/referanslar' },
      { label: 'Destek Merkezi', to: '/iletisim' },
      { label: 'KVKK', to: '/iletisim' },
    ],
  },
]

const legalLinks = [
  'Site Haritası',
  'Yasal Uyarı',
  'Kullanım Şartları',
  'KVKK Politikası',
  'Çerezlerin Kullanımı',
  'Gizlilik Politikası',
]

const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20a8 8 0 0116 0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M3 4h2l2.4 12.4a1 1 0 001 .8h9.2a1 1 0 001-.8L21 8H6M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/* Üst şerit: logo + destek + aksiyonlar */}
        <div className="footer__utility">
          <div className="footer__utility-brand">
            <Link to="/" className="footer__logo">
              <img
                src={aseraiLogo}
                alt="Aserai"
                className="footer__logo-image"
                style={{ height: '38px' }}
              />
            </Link>
            <Link to="/iletisim" className="footer__support">
              <span aria-hidden="true">›</span> Destek
            </Link>
          </div>
          <div className="footer__utility-actions">
            <Link to="/giris" className="footer__action">
              <PersonIcon />
              Katıl
            </Link>
            <Link to="/paketler" className="footer__action footer__action--cta">
              <CartIcon />
              E-Ticarete Başla
            </Link>
          </div>
        </div>

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
            {legalLinks.map((label) => (
              <Link key={label} to="/iletisim">
                {label}
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
