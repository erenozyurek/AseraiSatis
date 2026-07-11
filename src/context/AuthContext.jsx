import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'

const AuthContext = createContext(null)

const notConfigured = {
  error: {
    message:
      'Supabase yapılandırılmamış. .env.local dosyasına anahtarları ekleyin.',
  },
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    isConfigured: isSupabaseConfigured,

    signUp: ({ email, password, fullName, phone, company }) =>
      isSupabaseConfigured
        ? supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName, phone, company },
              emailRedirectTo: `${window.location.origin}/giris`,
            },
          })
        : Promise.resolve(notConfigured),

    signIn: ({ email, password }) =>
      isSupabaseConfigured
        ? supabase.auth.signInWithPassword({ email, password })
        : Promise.resolve(notConfigured),

    signOut: () =>
      isSupabaseConfigured ? supabase.auth.signOut() : Promise.resolve({}),

    resetPassword: (email) =>
      isSupabaseConfigured
        ? supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/sifre-yenile`,
          })
        : Promise.resolve(notConfigured),

    updatePassword: (password) =>
      isSupabaseConfigured
        ? supabase.auth.updateUser({ password })
        : Promise.resolve(notConfigured),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth AuthProvider içinde kullanılmalı')
  return ctx
}
