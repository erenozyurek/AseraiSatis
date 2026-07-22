import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useEditMode } from '../../context/EditModeContext.jsx'
import { useNotifications } from '../../context/NotificationsContext.jsx'
import './Navbar.css'

import aseraiLogo from '../../assets/aserai.png'

const simpleLinks = [
  { label: 'Paketler', to: '/paketler' },
  { label: 'Kurumsal', to: '/kurumsal' },
  { label: 'Akademi', to: '/akademi' },
]

const megaMenuColumns = [
  {
    title: 'E-Ticaret Çözümleri',
    items: [
      {
        to: '/aserai',
        name: 'Aserai B2C E-Ticaret',
        desc: 'Mağaza, ödeme, kargo ve kampanya altyapısı',
      },
      {
        to: '/cozumler',
        name: 'Uçtan Uca Çözümler',
        desc: 'Aserai ve Iberai ekosistemini birlikte yönetin',
      },
      {
        name: 'İberai Ticari Entegrasyon Platformu',
        desc: 'Stok, fiyat ve sipariş senkronizasyonu',
        status: 'Yakında',
        disabled: true,
      },
      {
        to: '/paketler',
        name: 'Paketler ve Fiyatlandırma',
        desc: 'İşinize uygun paketi karşılaştırın',
      },
      {
        to: '/',
        name: 'Ana Sayfa',
        desc: 'Aserai ana sayfa akışına dönün',
      },
    ],
  },
  {
    title: 'Modüller',
    items: [
      {
        to: '/moduller',
        name: 'E-Fatura & E-Arşiv',
        desc: 'Fatura süreçlerini otomatik yönetin',
      },
      {
        to: '/moduller',
        name: 'Kargo Takip & Entegrasyon',
        desc: 'Gönderi ve takip kodlarını tek panelde toplayın',
      },
      {
        to: '/moduller',
        name: 'Pazaryeri Entegrasyonu',
        desc: 'Kanallar arası ürün, stok ve sipariş akışı',
      },
      {
        to: '/moduller',
        name: 'B2B Modülü',
        desc: 'Bayi ve toptan satış operasyonları',
      },
      {
        to: '/moduller',
        name: 'CRM & Müşteri Yönetimi',
        desc: 'Segment, iletişim ve satın alma geçmişi',
      },
    ],
  },
  {
    title: 'Tüm Özellikler',
    items: [
      {
        to: '/ozellikler',
        name: 'Yapay Zeka & Otomasyon',
        desc: 'İçerik, öneri ve fiyatlandırma araçları',
      },
      {
        to: '/ozellikler',
        name: 'Ürün & Katalog Yönetimi',
        desc: 'Sınırsız ürün, varyant ve vitrin yönetimi',
      },
      {
        to: '/ozellikler',
        name: 'Satış & Pazarlama',
        desc: 'SEO, kampanya ve bayi araçları',
      },
      {
        to: '/ozellikler',
        name: 'Global Satış & Entegrasyon',
        desc: 'Çoklu dil, döviz ve e-ihracat desteği',
      },
    ],
  },
  {
    title: 'Büyüme ve Destek',
    items: [
      {
        to: '/demo',
        name: 'Demo Talep Et',
        desc: 'Aserai panelini işletmeniz için inceleyin',
      },
      {
        to: '/teklif',
        name: 'Teklif Al',
        desc: 'Paket ve modüller için özel teklif isteyin',
      },
      {
        to: '/akademi',
        name: 'Aserai Akademi',
        desc: 'E-ticaret rehberleri ve eğitim içerikleri',
      },
      {
        to: '/iletisim',
        name: 'Uzmanla Görüşün',
        desc: 'Kurulum ve büyüme sorularınızı iletin',
      },
    ],
  },
]

const megaFooterLinks = [
  { to: '/cozumler', label: 'Tüm çözümleri gör' },
  { to: '/moduller', label: 'Modül kataloğu' },
  { to: '/ozellikler', label: 'Özellik listesi' },
  { to: '/demo', label: 'Demo talep et' },
]

function Logo() {
  return (
    <Link to="/" className="nav-logo" aria-label="Aserai anasayfa">
      <img
        src={aseraiLogo}
        alt="Aserai"
        className="nav-logo-image"
        style={{ height: '60px' }}
      />
    </Link>
  )
}

/* İkonlar */
const PersonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
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
)

const Caret = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
    <path
      d="M2 4l4 4 4-4"
      stroke="currentColor"
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const EditPencil = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M4 20h4L18 10l-4-4L4 16v4zM14 6l4 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function MegaMenu({ active, setActive, currentPath }) {
  const isOpen = active === 'solutions'
  const isActive = [
    '/cozumler',
    '/moduller',
    '/ozellikler',
    '/aserai',
    '/iberai',
  ].some((path) => currentPath.startsWith(path))

  return (
    <div
      className="nav__mega-wrap"
      onMouseEnter={() => setActive('solutions')}
      onMouseLeave={() => setActive(null)}
      onFocus={() => setActive('solutions')}
    >
      <button
        type="button"
        className={`nav__link nav__link--has-caret ${
          isActive ? 'is-active' : ''
        }`}
        aria-expanded={isOpen}
        onClick={() => setActive(isOpen ? null : 'solutions')}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setActive(null)
        }}
      >
        E-Ticaret Çözümleri
        <Caret />
      </button>
      <div className={`nav__mega ${isOpen ? 'is-open' : ''}`}>
        <div className="nav__mega-inner">
          <div className="nav__mega-grid">
            {megaMenuColumns.map((column) => (
              <div key={column.title} className="nav__mega-col">
                <h2>{column.title}</h2>
                <div className="nav__mega-items">
                  {column.items.map((item) =>
                    item.disabled ? (
                      <span
                        key={`${column.title}-${item.name}`}
                        className="nav__mega-item nav__mega-item--disabled"
                        aria-disabled="true"
                      >
                        <strong>
                          {item.name}
                          {item.status ? (
                            <em className="nav__mega-status">{item.status}</em>
                          ) : null}
                        </strong>
                        <span>{item.desc}</span>
                      </span>
                    ) : (
                      <Link
                        key={`${column.title}-${item.name}`}
                        to={item.to}
                        className="nav__mega-item"
                      >
                        <strong>{item.name}</strong>
                        <span>{item.desc}</span>
                      </Link>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="nav__mega-foot">
            {megaFooterLinks.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAdmin, signOut } = useAuth()
  const { count } = useCart()
  const { editMode, toggle: toggleEdit } = useEditMode()
  const { unreadCount, supportCount } = useNotifications()
  const accountTo = isAdmin ? '/yonetim' : '/panel'
  // Admin için yanıt bekleyen destek talebi; müşteri için okunmamış bildirim.
  const accountBadge = isAdmin ? supportCount : unreadCount
  const canShop = !user || isAdmin === false

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setActiveMenu(null)
  }, [location])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <Logo />

        <nav className="nav__links" aria-label="Ana menü">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `nav__link ${isActive ? 'is-active' : ''}`
            }
          >
            Ana Sayfa
          </NavLink>
          <MegaMenu
            active={activeMenu}
            setActive={setActiveMenu}
            currentPath={location.pathname}
          />
          {simpleLinks.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className="nav__link"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          {isAdmin && (
            <button
              type="button"
              className={`nav__edit ${editMode ? 'is-active' : ''}`}
              onClick={toggleEdit}
              title={editMode ? 'Düzenleme modunu kapat' : 'Düzenleme modu'}
              aria-pressed={editMode}
            >
              <EditPencil />
            </button>
          )}
          {canShop && (
            <Link to="/sepet" className="nav__cart" aria-label="Sepet">
              <CartIcon />
              {count > 0 && <span className="nav__cart-badge">{count}</span>}
            </Link>
          )}
          {user ? (
            <>
              <Link to={accountTo} className="nav__login" title={user.email}>
                <PersonIcon />
                {isAdmin ? 'Yönetim' : 'Hesabım'}
                {accountBadge > 0 && (
                  <span className="nav__notif-badge">{accountBadge}</span>
                )}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="nav__cta nav__cta--logout"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/giris" className="nav__login">
                <PersonIcon />
                Giriş Yap
              </Link>
              <Link to="/kayit" className="nav__cta">
                <CartIcon />
                E-Ticarete Başla
              </Link>
            </>
          )}
        </div>

        <button
          className={`nav__burger ${open ? 'is-open' : ''}`}
          aria-label="Menüyü aç/kapat"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`nav__mobile ${open ? 'is-open' : ''}`}>
        <div className="nav__mobile-group">E-Ticaret Çözümleri</div>
        {megaMenuColumns.map((column) => (
          <div key={column.title} className="nav__mobile-section">
            <span className="nav__mobile-section-title">{column.title}</span>
            {column.items.map((item) =>
              item.disabled ? (
                <span
                  key={`${column.title}-${item.name}`}
                  className="nav__mobile-link nav__mobile-link--sub nav__mobile-link--disabled"
                  aria-disabled="true"
                >
                  {item.name}
                  {item.status ? (
                    <small className="nav__mobile-status">{item.status}</small>
                  ) : null}
                </span>
              ) : (
                <NavLink
                  key={`${column.title}-${item.name}`}
                  to={item.to}
                  className="nav__mobile-link nav__mobile-link--sub"
                >
                  {item.name}
                </NavLink>
              ),
            )}
          </div>
        ))}
        <div className="nav__mobile-group">Genel Menü</div>
        {simpleLinks.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className="nav__mobile-link"
          >
            {item.label}
          </NavLink>
        ))}
        {user ? (
          <>
            <NavLink to={accountTo} className="nav__mobile-link">
              {isAdmin ? 'Yönetim' : 'Hesabım'}
              {accountBadge > 0 && (
                <span className="nav__notif-badge nav__notif-badge--inline">
                  {accountBadge}
                </span>
              )}
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="btn btn--dark btn--block nav__mobile-cta"
            >
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <NavLink to="/giris" className="nav__mobile-link">
              Giriş Yap
            </NavLink>
            <Link
              to="/kayit"
              className="btn btn--dark btn--block nav__mobile-cta"
            >
              E-Ticarete Başla
            </Link>
          </>
        )}
      </div>

      <div
        className={`nav__overlay ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
    </header>
  )
}
