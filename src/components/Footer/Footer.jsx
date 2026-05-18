import { Link } from 'react-router-dom'
import './Footer.css'

import aseraiLogo from '../../assets/aserai.png'

const columns = [
  {
    title: 'Çözümler',
    links: [
      { label: 'Aserai E-Ticaret', to: '/aserai' },
      { label: 'Iberai Pazaryeri', to: '/iberai' },
      { label: 'Paketler', to: '/paketler' },
      { label: 'Fiyatlandırma', to: '/paketler' },
    ],
  },
  {
    title: 'Kurumsal',
    links: [
      { label: 'Hakkımızda', to: '/hakkimizda' },
      { label: 'Referanslar', to: '/referanslar' },
      { label: 'İletişim', to: '/iletisim' },
      { label: 'Demo Talep Et', to: '/demo' },
    ],
  },
  {
    title: 'Destek',
    links: [
      { label: 'Yardım Merkezi', to: '/iletisim' },
      { label: 'Sıkça Sorulanlar', to: '/iletisim' },
      { label: 'Kullanım Koşulları', to: '/iletisim' },
      { label: 'Gizlilik Politikası', to: '/iletisim' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <img src={aseraiLogo} alt="Aserai Logo" className="footer__logo-image" style={{ height: '40px' }} />
            </Link>
            <p className="footer__tagline">
              E-ticaret altyapısı ve pazaryeri entegrasyonunu tek panelden
              yönetin. İşletmenizi her kanalda büyütün.
            </p>
            <div className="footer__socials" aria-label="Sosyal medya">
              {['in', 'X', 'f', '◎'].map((s) => (
                <a key={s} href="/iletisim" className="footer__social">
                  {s}
                </a>
              ))}
            </div>
          </div>

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

          <div className="footer__col footer__contact">
            <h4>İletişim</h4>
            <ul>
              <li>
                <span>E-posta</span>
                <a href="mailto:merhaba@aseraiiberai.com">
                  merhaba@aseraiiberai.com
                </a>
              </li>
              <li>
                <span>Telefon</span>
                <a href="tel:+908500000000">0850 000 00 00</a>
              </li>
              <li>
                <span>Adres</span>
                Levent, İstanbul
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} Aserai &amp; Iberai. Tüm hakları saklıdır.</p>
          <div className="footer__bottom-links">
            <Link to="/iletisim">Gizlilik</Link>
            <Link to="/iletisim">Koşullar</Link>
            <Link to="/iletisim">Çerezler</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
