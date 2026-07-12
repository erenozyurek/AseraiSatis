import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { useEditMode } from '../../context/EditModeContext.jsx'
import { useNotifications } from '../../context/NotificationsContext.jsx'
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
          {simpleLinks.map((item) => (
            <NavLink key={item.label} to={item.to} className="nav__link">
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
        {simpleLinks.map((item) => (
          <NavLink key={item.label} to={item.to} className="nav__mobile-link">
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
