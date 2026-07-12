import { createContext, useContext, useState } from 'react'

/* Site üzerinde inline (yerinde) düzenleme modu.
   Yalnızca admin, Mac-dock üzerinden açıp kapatır. Açıkken sayfalardaki
   düzenlenebilir yüzeyler (paket tablosu, modül kartları) düzenlenebilir olur. */

const EditModeContext = createContext(null)

export function EditModeProvider({ children }) {
  const [editMode, setEditMode] = useState(false)

  const value = {
    editMode,
    setEditMode,
    toggle: () => setEditMode((v) => !v),
  }

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  )
}

export function useEditMode() {
  const ctx = useContext(EditModeContext)
  if (!ctx) throw new Error('useEditMode EditModeProvider içinde kullanılmalı')
  return ctx
}
