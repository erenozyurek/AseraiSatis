import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { AdminDataProvider } from '../../context/AdminDataContext.jsx'
import '../PanelLayout/PanelLayout.css'

const activeItems = [
  { to: '/yonetim', label: 'Dashboard', end: true },
  { to: '/yonetim/siparisler', label: 'Sipariş Yönetimi' },
  { to: '/yonetim/paketler', label: 'Paket Yönetimi' },
  { to: '/yonetim/moduller', label: 'Modül Yönetimi' },
  { to: '/yonetim/destek', label: 'Destek Yönetimi' },
]

const soonItems = [
  'Tenant Yönetimi',
  'Fatura Yönetimi',
  'Lisans Yönetimi',
  'CMS',
  'Ayarlar',
]

export default function AdminLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
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
                className={({ isActive }) =>
                  `panel__nav-link ${isActive ? 'is-active' : ''}`
                }
              >
                {item.label}
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
