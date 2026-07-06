import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Navbar.css'

import aseraiLogo from '../../assets/aserai.png'

/* Şablon menüsü: E-Ticaret Çözümleri · Modüller · Tüm Özellikler · Kurumsal */
const corporate = [
  { to: '/hakkimizda', name: 'Hakkımızda', desc: 'Bizi tanıyın' },
  { to: '/referanslar', name: 'Referanslar', desc: 'Bize güvenenler' },
  { to: '/iletisim', name: 'İletişim', desc: 'Bize ulaşın' },
]

const simpleLinks = [
  { label: 'Ana Sayfa', to: '/', end: true },
  { label: 'E-Ticaret Çözümleri', to: '/cozumler' },
  { label: 'Modüller', to: '/moduller' },
  { label: 'Tüm Özellikler', to: '/ozellikler' },
  { label: 'Kurumsal', to: '/kurumsal' },
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

function Dropdown({ label, items, openKey, active, setActive }) {
  const isOpen = active === openKey
  return (
    <div
      className="nav__dropdown"
      onMouseEnter={() => setActive(openKey)}
      onMouseLeave={() => setActive(null)}
    >
      <button className="nav__link nav__link--has-caret" aria-expanded={isOpen}>
        {label}
        <Caret />
      </button>
      <div className={`nav__menu ${isOpen ? 'is-open' : ''}`}>
        {items.map((s) => (
          <Link key={s.to} to={s.to} className="nav__menu-item">
            <span className="nav__menu-mark">{s.name[0]}</span>
            <span>
              <strong>{s.name}</strong>
              <small>{s.desc}</small>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const location = useLocation()

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
          {simpleLinks.map((item) => (
            <NavLink key={item.label} to={item.to} className="nav__link">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <Link to="/giris" className="nav__login">
            <PersonIcon />
            Katıl
          </Link>
          <Link to="/paketler" className="nav__cta">
            <CartIcon />
            E-Ticarete Başla
          </Link>
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
        {simpleLinks.map((item) => (
          <NavLink key={item.label} to={item.to} className="nav__mobile-link">
            {item.label}
          </NavLink>
        ))}
        <NavLink to="/giris" className="nav__mobile-link">
          Katıl
        </NavLink>
        <Link
          to="/paketler"
          className="btn btn--dark btn--block nav__mobile-cta"
        >
          E-Ticarete Başla
        </Link>
      </div>

      <div
        className={`nav__overlay ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
    </header>
  )
}
