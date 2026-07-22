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
import { fallbackPackageModuleRules } from '../data/packageModules.js'

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
  category: r.category || 'Diğer Modüller',
  sortOrder: r.sort_order,
  iconPath: r.icon_path,
  imageUrl: r.image_url,
})

const mapPackageModuleRule = (r) => ({
  packageId: r.package_slug,
  moduleId: r.module_slug,
  status: r.status,
})

export function CatalogProvider({ children }) {
  const [packages, setPackages] = useState(null)
  const [modules, setModules] = useState(null)
  const [packageModuleRules, setPackageModuleRules] = useState(null)

  const load = useCallback(async () => {
    if (!supabase) return
    const [packageResult, moduleResult, ruleResult] = await Promise.allSettled([
      supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('modules')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('sort_order', { ascending: true }),
      supabase
        .from('package_module_rules')
        .select('*'),
    ])
    if (packageResult.status === 'fulfilled' && packageResult.value.data) {
      setPackages(packageResult.value.data.map(mapPackage))
    }
    if (moduleResult.status === 'fulfilled' && moduleResult.value.data) {
      setModules(moduleResult.value.data.map(mapModule))
    }
    if (ruleResult.status === 'fulfilled' && ruleResult.value.data) {
      setPackageModuleRules(ruleResult.value.data.map(mapPackageModuleRule))
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Yüklenene kadar / boşsa statik yedek
  const pkgs = packages && packages.length ? packages : pricing.aserai.tiers
  const mods = modules && modules.length ? modules : addonModules
  const rules =
    packageModuleRules && packageModuleRules.length
      ? packageModuleRules
      : fallbackPackageModuleRules

  const getPackageModuleStatus = useCallback(
    (packageId, moduleId) =>
      rules.find(
        (rule) => rule.packageId === packageId && rule.moduleId === moduleId,
      )?.status || null,
    [rules],
  )

  const value = {
    packages: pkgs,
    modules: mods,
    packageModuleRules: rules,
    loading: packages === null,
    getPackage: (slug) => pkgs.find((p) => p.id === slug) || null,
    getModule: (slug) => mods.find((m) => m.id === slug) || null,
    getPackageModuleStatus,
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
