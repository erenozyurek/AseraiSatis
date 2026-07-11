import { createClient } from '@supabase/supabase-js'

/* Supabase istemcisi.
   URL ve anon anahtarı .env.local dosyasından okunur (bkz. .env.example).
   Anahtarlar tanımlı değilse istemci null döner ve konsola uyarı yazılır;
   böylece anahtar girilmeden de uygulama derlenir/çalışır (auth devre dışı). */

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

if (!isSupabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Aserai] Supabase ortam değişkenleri tanımlı değil. ' +
      '.env.local dosyasına VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY ekleyin.',
  )
}

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null
