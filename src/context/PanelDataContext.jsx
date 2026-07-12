import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from './AuthContext.jsx'

/* Panel veri önbelleği.
   PanelLayout içinde render edilir; sekmeler (Dashboard/Siparişlerim/Destek/
   Profil) arasında geçerken mount kaldığı için veriler kaybolmaz — ikinci
   ziyaretlerde "Yükleniyor" gösterilmez. Panele her girişte veriler önden
   (paralel) çekilir. null = henüz yüklenmedi. */

const PanelDataContext = createContext(null)

export function PanelDataProvider({ children }) {
  const { user } = useAuth()
  const [orders, setOrders] = useState(null)
  const [tickets, setTickets] = useState(null)
  const [profile, setProfile] = useState(null)
  const [tenants, setTenants] = useState(null)

  const fetchOrders = useCallback(async () => {
    if (!supabase) return
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
    setOrders(data || [])
  }, [])

  const fetchTickets = useCallback(async () => {
    if (!supabase) return
    const { data } = await supabase
      .from('support_tickets')
      .select('*')
      .order('updated_at', { ascending: false })
    setTickets(data || [])
  }, [])

  const fetchProfile = useCallback(async () => {
    if (!supabase || !user) return
    const [{ data: p }, { data: t }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('tenants').select('id, name'),
    ])
    setProfile(p || null)
    setTenants(t || [])
  }, [user])

  // Panele girişte tüm verileri önden (paralel) çek
  useEffect(() => {
    if (!supabase || !user) return
    fetchOrders()
    fetchTickets()
    fetchProfile()
  }, [user, fetchOrders, fetchTickets, fetchProfile])

  const value = {
    orders,
    tickets,
    profile,
    tenants,
    refreshOrders: fetchOrders,
    refreshTickets: fetchTickets,
    refreshProfile: fetchProfile,
  }

  return (
    <PanelDataContext.Provider value={value}>
      {children}
    </PanelDataContext.Provider>
  )
}

export function usePanelData() {
  const ctx = useContext(PanelDataContext)
  if (!ctx) throw new Error('usePanelData PanelDataProvider içinde kullanılmalı')
  return ctx
}
