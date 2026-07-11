import { createContext, useContext, useEffect, useState } from 'react'
import { pricing } from '../data/pricing.js'
import { getModule } from '../data/modules.js'

const CartContext = createContext(null)
const STORAGE_KEY = 'aserai_cart'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function CartProvider({ children }) {
  // localStorage'dan senkron başlangıç (effect'te yüklemek StrictMode'da veriyi ezer)
  const [packageId, setPackageId] = useState(() => loadCart().packageId ?? null)
  const [moduleIds, setModuleIds] = useState(() => {
    const m = loadCart().moduleIds
    return Array.isArray(m) ? m : []
  })
  const [billing, setBilling] = useState(() => loadCart().billing ?? 'yearly')

  // localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ packageId, moduleIds, billing }),
    )
  }, [packageId, moduleIds, billing])

  const selectPackage = (id, period) => {
    setPackageId(id)
    if (period) setBilling(period)
  }
  const removePackage = () => setPackageId(null)
  const toggleModule = (id) =>
    setModuleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  const clearCart = () => {
    setPackageId(null)
    setModuleIds([])
  }

  const tier = packageId
    ? pricing.aserai.tiers.find((t) => t.id === packageId) ?? null
    : null
  const packagePrice = tier
    ? billing === 'yearly'
      ? tier.yearlyMonthly
      : tier.monthly
    : 0
  const moduleItems = moduleIds.map(getModule).filter(Boolean)
  const modulesTotal = moduleItems.reduce((s, m) => s + m.monthly, 0)
  const total = packagePrice + modulesTotal
  const count = (packageId ? 1 : 0) + moduleIds.length

  const value = {
    packageId,
    tier,
    moduleIds,
    moduleItems,
    billing,
    setBilling,
    selectPackage,
    removePackage,
    toggleModule,
    clearCart,
    packagePrice,
    modulesTotal,
    total,
    count,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart CartProvider içinde kullanılmalı')
  return ctx
}
