import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Navbar.css'

import aseraiLogo from '../../assets/aserai.png'

const navItems = [
  { label: 'Anasayfa', to: '/' },
  { label: 'Paketler', to: '/paketler' },
  { label: 'Hakkımızda', to: '/hakkimizda' },
  { label: 'Referanslar', to: '/referanslar' },
  { label: 'İletişim', to: '/iletisim' },
]

const solutions = [
  {
    to: '/aserai',
    name: 'Aserai',
    desc: 'E-ticaret altyapısı',
  },
  {
    to: '/iberai',
    name: 'Iberai',
    desc: 'Pazaryeri entegrasyonu',
  },
]

function Logo() {
  return (
    <Link to="/" className="nav-logo" aria-label="Aserai anasayfa">
      <img src={aseraiLogo} alt="Aserai Logo" className="nav-logo-image" style={{ height: '40px' }} />
    </Link>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setSolutionsOpen(false)
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
          <NavLink to="/" end className="nav__link">
            Anasayfa
          </NavLink>

          <div
            className="nav__dropdown"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button
              className="nav__link nav__link--has-caret"
              aria-expanded={solutionsOpen}
            >
              Çözümler
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
            </button>
            <div className={`nav__menu ${solutionsOpen ? 'is-open' : ''}`}>
              {solutions.map((s) => (
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

          {navItems.slice(1).map((item) => (
            <NavLink key={item.to} to={item.to} className="nav__link">
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <Link to="/giris" className="nav__login">
            Giriş Yap
          </Link>
          <Link to="/demo" className="btn btn--primary nav__cta">
            Demo Talep Et
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
        <NavLink to="/" end className="nav__mobile-link">
          Anasayfa
        </NavLink>
        <span className="nav__mobile-group">Çözümler</span>
        {solutions.map((s) => (
          <NavLink
            key={s.to}
            to={s.to}
            className="nav__mobile-link nav__mobile-link--sub"
          >
            {s.name} — {s.desc}
          </NavLink>
        ))}
        {navItems.slice(1).map((item) => (
          <NavLink key={item.to} to={item.to} className="nav__mobile-link">
            {item.label}
          </NavLink>
        ))}
        <NavLink to="/giris" className="nav__mobile-link">
          Giriş Yap
        </NavLink>
        <Link to="/demo" className="btn btn--primary btn--block nav__mobile-cta">
          Demo Talep Et
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
