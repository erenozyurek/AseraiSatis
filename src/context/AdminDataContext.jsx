import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { supabase } from '../lib/supabase.js'

/* Yönetim paneli veri önbelleği (tüm siparişler + tüm destek talepleri).
   AdminLayout içinde render edilir; sekmeler arası geçişte veri kalıcı olur. */

const AdminDataContext = createContext(null)

export function AdminDataProvider({ children }) {
  const [orders, setOrders] = useState(null)
  const [tickets, setTickets] = useState(null)

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

  useEffect(() => {
    fetchOrders()
    fetchTickets()
  }, [fetchOrders, fetchTickets])

  const value = {
    orders,
    tickets,
    refreshOrders: fetchOrders,
    refreshTickets: fetchTickets,
  }

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  )
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData AdminDataProvider içinde kullanılmalı')
  return ctx
}
