import { supabase } from './supabase.js'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const IMAGE_EXTENSIONS = {
  'image/avif': 'avif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export async function uploadCardImage(folder, file) {
  if (!supabase) throw new Error('Gorsel servisi yapilandirilmamis.')

  const extension = IMAGE_EXTENSIONS[file?.type]
  if (!extension) {
    throw new Error('Yalnizca JPG, PNG, WebP veya AVIF gorsel yukleyebilirsiniz.')
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Gorsel boyutu en fazla 5 MB olabilir.')
  }

  const path = `${folder}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage
    .from('card-images')
    .upload(path, file, { cacheControl: '3600' })

  if (error) throw error

  const { data } = supabase.storage.from('card-images').getPublicUrl(path)
  if (!data?.publicUrl) throw new Error('Gorsel adresi olusturulamadi.')
  return data.publicUrl
}

export function normalizeImageUrl(value) {
  const raw = typeof value === 'string' ? value.trim() : ''
  if (!raw) return null

  try {
    const url = new URL(raw)
    if (url.protocol !== 'https:') throw new Error()
    return url.href
  } catch {
    throw new Error('Görsel adresi geçerli bir HTTPS adresi olmalıdır.')
  }
}
