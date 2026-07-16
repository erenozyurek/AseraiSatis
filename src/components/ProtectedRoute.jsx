import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/* Oturum yoksa /giris'e yönlendirir; giriş sonrası geri döner. */
export default function ProtectedRoute({ children, allowAdmin = true }) {
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

  if (!allowAdmin && isAdmin) {
    return <Navigate to="/yonetim" replace />
  }

  return children
}
