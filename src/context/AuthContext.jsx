import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from 'react'
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
  const [isAdmin, setIsAdmin] = useState(null) // null = henüz kontrol edilmedi
  const [emailVerified, setEmailVerified] = useState(false)

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

  // Platform admin kontrolü — yalnızca kullanıcı DEĞİŞTİĞİNDE (giriş/çıkış).
  // token yenileme gibi olaylarda tekrar sıfırlanmasını (flicker) önler.
  const userId = session?.user?.id
  useEffect(() => {
    if (!isSupabaseConfigured || !userId) {
      setIsAdmin(false)
      return
    }
    setIsAdmin(null) // kontrol edilene kadar bilinmiyor
    supabase.rpc('is_platform_admin').then(({ data }) => {
      setIsAdmin(Boolean(data))
    })
  }, [userId])

  // E-posta doğrulama bayrağı (kendi profiles.email_verified alanımız — B4).
  const refreshEmailVerified = useCallback(async () => {
    if (!isSupabaseConfigured || !userId) {
      setEmailVerified(false)
      return
    }
    const { data } = await supabase
      .from('profiles')
      .select('email_verified')
      .eq('id', userId)
      .single()
    setEmailVerified(Boolean(data?.email_verified))
  }, [userId])

  useEffect(() => {
    refreshEmailVerified()
  }, [refreshEmailVerified])

  const currentUser = session?.user ?? null

  const value = {
    session,
    user: currentUser,
    loading,
    isAdmin,
    isConfigured: isSupabaseConfigured,

    // ---- E-posta doğrulama (yumuşak akış, B4) ----
    emailVerified,
    refreshEmailVerified,

    // Doğrulama kodu gönder (Supabase e-posta OTP)
    sendEmailOtp: () =>
      isSupabaseConfigured && currentUser?.email
        ? supabase.auth.signInWithOtp({
            email: currentUser.email,
            options: { shouldCreateUser: false },
          })
        : Promise.resolve(notConfigured),

    // Kodu doğrula → başarılıysa bayrağı işaretle
    verifyEmailOtp: async (code) => {
      if (!isSupabaseConfigured || !currentUser?.email) return notConfigured
      const { error } = await supabase.auth.verifyOtp({
        email: currentUser.email,
        token: code,
        type: 'email',
      })
      if (error) return { error }
      const { error: markError } = await supabase.rpc('mark_email_verified')
      if (markError) return { error: markError }
      await refreshEmailVerified()
      return { error: null }
    },

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
