import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './PanelLayout.css'

const activeItems = [
  { to: '/panel', label: 'Dashboard', end: true },
  { to: '/panel/siparislerim', label: 'Siparişlerim' },
  { to: '/panel/profil', label: 'Profilim' },
]

const soonItems = ['Faturalarım', 'Lisanslarım', 'Destek Taleplerim']

export default function PanelLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const name = user?.user_metadata?.full_name || user?.email

  return (
    <section className="section panel-section">
      <div className="container panel">
        <aside className="panel__side">
          <div className="panel__user">
            <span className="panel__avatar" aria-hidden="true">
              {(name || 'A').charAt(0).toUpperCase()}
            </span>
            <div className="panel__user-info">
              <strong>{name}</strong>
              <small>{user?.email}</small>
            </div>
          </div>

          <nav className="panel__nav" aria-label="Müşteri paneli">
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
          <Outlet />
        </main>
      </div>
    </section>
  )
}
