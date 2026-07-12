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
  const [licenses, setLicenses] = useState(null)
  const [invoices, setInvoices] = useState(null)
  const [renewals, setRenewals] = useState(null)
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

  // Tablo henüz oluşturulmadıysa (0008 çalıştırılmadıysa) sorgu hata döner;
  // boş listeye düşerek sayfaları kırmayız (mevcut fallback disiplini).
  const fetchLicenses = useCallback(async () => {
    if (!supabase) return
    // Dönem sonuna ulaşan planlı iptalleri lisanslar okunmadan önce sonuçlandır.
    // 0018 henüz çalışmadıysa RPC hatası sorgunun kendisini engellemez.
    await supabase.rpc('finalize_due_customer_cancellations')
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .order('created_at', { ascending: false })
    setErrors((current) => ({ ...current, licenses: error?.message || '' }))
    setLicenses(data || [])
  }, [])

  const fetchInvoices = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('issued_at', { ascending: false })
    setErrors((current) => ({ ...current, invoices: error?.message || '' }))
    setInvoices(data || [])
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

  const fetchTickets = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .order('updated_at', { ascending: false })
    setErrors((current) => ({ ...current, tickets: error?.message || '' }))
    setTickets(data || [])
  }, [])

  const fetchProfile = useCallback(async () => {
    if (!supabase || !user) return
    const [profileResult, tenantResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('tenants').select('id, name'),
    ])
    setErrors((current) => ({
      ...current,
      profile: profileResult.error?.message || tenantResult.error?.message || '',
    }))
    setProfile(profileResult.data || null)
    setTenants(tenantResult.data || [])
  }, [user])

  // Panele girişte tüm verileri önden (paralel) çek
  useEffect(() => {
    if (!supabase || !user) return
    fetchOrders()
    fetchTickets()
    fetchProfile()
    fetchLicenses()
    fetchInvoices()
    fetchRenewals()
  }, [
    user,
    fetchOrders,
    fetchTickets,
    fetchProfile,
    fetchLicenses,
    fetchInvoices,
    fetchRenewals,
  ])

  const value = {
    orders,
    tickets,
    profile,
    tenants,
    licenses,
    invoices,
    renewals,
    refreshOrders: fetchOrders,
    refreshTickets: fetchTickets,
    refreshProfile: fetchProfile,
    refreshLicenses: fetchLicenses,
    refreshInvoices: fetchInvoices,
    refreshRenewals: fetchRenewals,
  }
  const errorMessage = Object.values(errors).find(Boolean)

  return (
    <PanelDataContext.Provider value={value}>
      {errorMessage && (
        <div className="panel-card panel-note panel-note--error" role="alert">
          Veriler alınamadı: {errorMessage}
        </div>
      )}
      {children}
    </PanelDataContext.Provider>
  )
}

export function usePanelData() {
  const ctx = useContext(PanelDataContext)
  if (!ctx) throw new Error('usePanelData PanelDataProvider içinde kullanılmalı')
  return ctx
}
