import { createContext, useContext, useEffect, useState } from 'react'
import { useCatalog } from './CatalogContext.jsx'
import { useAuth } from './AuthContext.jsx'

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
  const { getPackage, getModule, getPackageModuleStatus } = useCatalog()
  const { isAdmin } = useAuth()
  const shoppingDisabled = isAdmin === true
  // localStorage'dan senkron başlangıç (effect'te yüklemek StrictMode'da veriyi ezer)
  const [packageId, setPackageId] = useState(() => loadCart().packageId ?? null)
  const [moduleIds, setModuleIds] = useState(() => {
    const m = loadCart().moduleIds
    return Array.isArray(m) ? m : []
  })
  const [billing, setBilling] = useState(() => loadCart().billing ?? 'yearly')

  useEffect(() => {
    if (!shoppingDisabled) return
    localStorage.removeItem(STORAGE_KEY)
    setPackageId(null)
    setModuleIds([])
  }, [shoppingDisabled])

  // localStorage'a kaydet
  useEffect(() => {
    if (shoppingDisabled) {
      localStorage.removeItem(STORAGE_KEY)
      return
    }
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ packageId, moduleIds, billing }),
    )
  }, [packageId, moduleIds, billing, shoppingDisabled])

  const selectPackage = (id, period, selectedModuleIds) => {
    if (shoppingDisabled) return
    setPackageId(id)
    if (period) setBilling(period)
    if (Array.isArray(selectedModuleIds)) setModuleIds(selectedModuleIds)
  }
  const setCartBilling = (period) => {
    if (!shoppingDisabled) setBilling(period)
  }
  const removePackage = () => {
    if (!shoppingDisabled) setPackageId(null)
  }
  const toggleModule = (id) => {
    if (shoppingDisabled) return
    if (packageId && getPackageModuleStatus(packageId, id) === 'included') return
    setModuleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }
  const clearCart = () => {
    setPackageId(null)
    setModuleIds([])
  }

  const activePackageId = shoppingDisabled ? null : packageId
  const activeModuleIds = shoppingDisabled
    ? []
    : moduleIds.filter(
        (id) => !activePackageId || getPackageModuleStatus(activePackageId, id) === 'addable',
      )
  const tier = activePackageId ? getPackage(activePackageId) : null
  const packagePrice = tier
    ? billing === 'yearly'
      ? tier.yearlyMonthly
      : tier.monthly
    : 0
  const moduleItems = activeModuleIds.map(getModule).filter(Boolean)
  const modulesTotal = moduleItems.reduce((s, m) => s + m.monthly, 0)
  const total = packagePrice + modulesTotal
  const count = (activePackageId ? 1 : 0) + activeModuleIds.length

  const value = {
    packageId: activePackageId,
    tier,
    moduleIds: activeModuleIds,
    moduleItems,
    billing,
    setBilling: setCartBilling,
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
