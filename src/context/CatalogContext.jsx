import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import { supabase } from '../lib/supabase.js'
import { pricing } from '../data/pricing.js'
import { addonModules } from '../data/modules.js'

/* Katalog (paketler + ek modüller) DB'den okunur; yüklenene kadar veya boşsa
   statik veri (pricing.js / modules.js) yedek olarak kullanılır. Böylece public
   site hiçbir zaman boş fiyat göstermez. */

const CatalogContext = createContext(null)

const mapPackage = (r) => ({
  id: r.slug,
  slug: r.slug,
  name: r.name,
  summary: r.summary,
  monthly: Number(r.monthly),
  yearlyMonthly: Number(r.yearly_monthly),
  highlight: r.highlight,
  badge: r.badge || undefined,
})

const mapModule = (r) => ({
  id: r.slug,
  slug: r.slug,
  name: r.name,
  desc: r.description,
  monthly: Number(r.monthly),
})

export function CatalogProvider({ children }) {
  const [packages, setPackages] = useState(null)
  const [modules, setModules] = useState(null)

  const load = useCallback(async () => {
    if (!supabase) return
    const [{ data: pk }, { data: md }] = await Promise.all([
      supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('modules')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
    ])
    if (pk) setPackages(pk.map(mapPackage))
    if (md) setModules(md.map(mapModule))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Yüklenene kadar / boşsa statik yedek
  const pkgs = packages && packages.length ? packages : pricing.aserai.tiers
  const mods = modules && modules.length ? modules : addonModules

  const value = {
    packages: pkgs,
    modules: mods,
    loading: packages === null,
    getPackage: (slug) => pkgs.find((p) => p.id === slug) || null,
    getModule: (slug) => mods.find((m) => m.id === slug) || null,
    refresh: load,
  }

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  )
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog CatalogProvider içinde kullanılmalı')
  return ctx
}
