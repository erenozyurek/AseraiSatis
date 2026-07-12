import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/* Yönetim paneli koruması: giriş + platform admin yetkisi gerektirir. */
export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading || (user && isAdmin === null)) {
    return (
      <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <span style={{ color: 'var(--c-text-muted)' }}>Yükleniyor…</span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/giris" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}
