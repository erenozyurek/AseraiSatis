import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useNotifications } from '../../context/NotificationsContext.jsx'
import { AdminDataProvider } from '../../context/AdminDataContext.jsx'
import '../PanelLayout/PanelLayout.css'

const activeItems = [
  { to: '/yonetim', label: 'Dashboard', end: true },
  { to: '/yonetim/siparisler', label: 'Sipariş Yönetimi' },
  { to: '/yonetim/yenilemeler', label: 'Yenileme Yönetimi' },
  { to: '/yonetim/musteriler', label: 'Müşteri Yönetimi' },
  { to: '/yonetim/bildirimler', label: 'Bildirim Yönetimi' },
  { to: '/yonetim/paketler', label: 'Paket Yönetimi' },
  { to: '/yonetim/moduller', label: 'Modül Yönetimi' },
  { to: '/yonetim/destek', label: 'Destek Yönetimi' },
]

const soonItems = ['CMS', 'Ayarlar']

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const { supportCount } = useNotifications()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [instantActivePath, setInstantActivePath] = useState(pathname)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  useEffect(() => {
    setInstantActivePath(pathname)
  }, [pathname])

  const isActivePath = (item) => {
    if (item.end) return instantActivePath === item.to
    return (
      instantActivePath === item.to ||
      instantActivePath.startsWith(`${item.to}/`)
    )
  }

  const markActive = (event, item) => {
    if (
      event.button > 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    setInstantActivePath(item.to)
  }

  return (
    <section className="section panel-section">
      <div className="container panel">
        <aside className="panel__side">
          <div className="panel__user">
            <span className="panel__avatar" aria-hidden="true">
              ⚙
            </span>
            <div className="panel__user-info">
              <strong>Yönetim Paneli</strong>
              <small>{user?.email}</small>
            </div>
          </div>

          <nav className="panel__nav" aria-label="Yönetim paneli">
            {activeItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onPointerDown={(event) => markActive(event, item)}
                onClick={(event) => markActive(event, item)}
                className={({ isActive }) =>
                  `panel__nav-link ${
                    isActive || isActivePath(item) ? 'is-active' : ''
                  }`
                }
              >
                {item.label}
                {item.to === '/yonetim/destek' && supportCount > 0 && (
                  <span className="panel__nav-badge">{supportCount}</span>
                )}
              </NavLink>
            ))}
            {soonItems.map((label) => (
              <span key={label} className="panel__nav-link is-soon">
                {label}
                <span className="panel__soon">Yakında</span>
              </span>
            ))}
          </nav>

          <button
            type="button"
            className="btn btn--ghost btn--block panel__logout"
            onClick={handleLogout}
          >
            Çıkış Yap
          </button>
        </aside>

        <main className="panel__main">
          <AdminDataProvider>
            <Outlet />
          </AdminDataProvider>
        </main>
      </div>
    </section>
  )
}
