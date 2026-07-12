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
  const [licenses, setLicenses] = useState(null)
  const [renewals, setRenewals] = useState(null)
  const [customers, setCustomers] = useState(null)
  const [errors, setErrors] = useState({})

  const fetchOrders = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
    setErrors((current) => ({ ...current, orders: error?.message || '' }))
    setOrders(data || [])
  }, [])

  const fetchTickets = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('updated_at', { ascending: false })
    setErrors((current) => ({ ...current, tickets: error?.message || '' }))
    setTickets(data || [])
  }, [])

  // Tablo henüz oluşturulmadıysa (0008/0009) sorgu boş listeye düşer, kırılmaz.
  const fetchLicenses = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .order('expires_at', { ascending: true })
    setErrors((current) => ({ ...current, licenses: error?.message || '' }))
    setLicenses(data || [])
  }, [])

  const fetchRenewals = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('renewals')
      .select('*')
      .order('created_at', { ascending: false })
    setErrors((current) => ({ ...current, renewals: error?.message || '' }))
    setRenewals(data || [])
  }, [])

  // admin_list_customers RPC (0010). Yoksa boş listeye düşer, kırılmaz.
  const fetchCustomers = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase.rpc('admin_list_customers')
    setErrors((current) => ({ ...current, customers: error?.message || '' }))
    setCustomers(data || [])
  }, [])

  useEffect(() => {
    fetchOrders()
    fetchTickets()
    fetchLicenses()
    fetchRenewals()
    fetchCustomers()
  }, [fetchOrders, fetchTickets, fetchLicenses, fetchRenewals, fetchCustomers])

  const value = {
    orders,
    tickets,
    licenses,
    renewals,
    customers,
    refreshOrders: fetchOrders,
    refreshTickets: fetchTickets,
    refreshLicenses: fetchLicenses,
    refreshRenewals: fetchRenewals,
    refreshCustomers: fetchCustomers,
  }
  const errorMessage = Object.values(errors).find(Boolean)

  return (
    <AdminDataContext.Provider value={value}>
      {errorMessage && (
        <div className="panel-card panel-note panel-note--error" role="alert">
          Yönetim verileri alınamadı: {errorMessage}
        </div>
      )}
      {children}
    </AdminDataContext.Provider>
  )
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext)
  if (!ctx) throw new Error('useAdminData AdminDataProvider içinde kullanılmalı')
  return ctx
}
