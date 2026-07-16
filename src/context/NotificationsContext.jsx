import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from './AuthContext.jsx'

/* Global bildirim/rozet durumu.
   Navbar tüm provider'ların üstünde olduğu için, okunmamış bildirim sayısı
   (müşteri) ve açık destek talebi sayısı (admin) burada tutulur; Navbar,
   panel menüsü ve admin menüsü bu context'ten okur.
   Realtime yerine: girişte + her rota değişiminde hafifçe tazelenir. */

const NotificationsContext = createContext(null)

export function NotificationsProvider({ children }) {
  const { user, isAdmin } = useAuth()
  const location = useLocation()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [supportCount, setSupportCount] = useState(0)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!supabase || !user || isAdmin) {
      setNotifications([])
      setUnreadCount(0)
      return
    }
    const [listResult, countResult] = await Promise.all([
      supabase
        .from('notifications')
        .select('id, title, body, type, link, read_at, created_at')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .is('read_at', null),
    ])
    const nextError = listResult.error || countResult.error
    if (nextError) {
      setError(nextError.message || 'Bildirimler alınamadı.')
      return
    }
    setError('')
    setNotifications(listResult.data || [])
    setUnreadCount(countResult.count || 0)
  }, [user, isAdmin])

  // Admin: yanıt bekleyen (açık) destek talebi sayısı — yeni talep veya
  // müşteri yanıtı geldiğinde durum 'open' olur.
  const refreshSupport = useCallback(async () => {
    if (!supabase || !isAdmin) {
      setSupportCount(0)
      return
    }
    const { count, error: supportError } = await supabase
      .from('support_tickets')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'open')
    if (!supportError) setSupportCount(count || 0)
  }, [isAdmin])

  useEffect(() => {
    refresh()
    refreshSupport()
  }, [user, isAdmin, location.pathname, refresh, refreshSupport])

  const markRead = useCallback(
    async (ids = null) => {
      if (!supabase) return
      const { error: markError } = await supabase.rpc('mark_notifications_read', {
        p_ids: ids,
      })
      if (markError) {
        setError(markError.message || 'Bildirim güncellenemedi.')
        return false
      }
      await refresh()
      return true
    },
    [refresh],
  )

  const value = {
    notifications,
    unreadCount,
    supportCount,
    error,
    refresh,
    refreshSupport,
    markRead,
  }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx)
    throw new Error('useNotifications NotificationsProvider içinde kullanılmalı')
  return ctx
}
