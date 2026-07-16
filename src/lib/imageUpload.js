import { supabase } from './supabase.js'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const IMAGE_EXTENSIONS = {
  'image/avif': 'avif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

export function validateImageFile(file) {
  if (!file || !Number.isFinite(file.size) || file.size <= 0) {
    throw new Error('Geçerli bir görsel dosyası seçin.')
  }

  const extension = IMAGE_EXTENSIONS[file.type]
  if (!extension) {
    throw new Error('Yalnızca JPG, PNG, WebP veya AVIF görsel yükleyebilirsiniz.')
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Görsel boyutu en fazla 5 MB olabilir.')
  }

  return extension
}

async function uploadPublicImage(bucket, folder, file) {
  if (!supabase) throw new Error('Gorsel servisi yapilandirilmamis.')

  const extension = validateImageFile(file)
  const path = `${folder}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: '3600' })

  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  if (!data?.publicUrl) throw new Error('Gorsel adresi olusturulamadi.')
  return data.publicUrl
}

export function uploadCardImage(folder, file) {
  return uploadPublicImage('card-images', folder, file)
}

export function uploadBlogImage(file) {
  return uploadPublicImage('blog-images', 'covers', file)
}

export async function removeBlogImage(publicUrl) {
  if (!supabase || !publicUrl) return false

  let url
  try {
    url = new URL(publicUrl)
  } catch {
    return false
  }

  const marker = '/storage/v1/object/public/blog-images/'
  const markerIndex = url.pathname.indexOf(marker)
  if (markerIndex === -1) return false

  const encodedPath = url.pathname.slice(markerIndex + marker.length)
  let path
  try {
    path = decodeURIComponent(encodedPath)
  } catch {
    return false
  }

  if (!/^covers\/[0-9a-f-]+\.(avif|jpg|png|webp)$/.test(path)) {
    return false
  }

  const { error } = await supabase.storage.from('blog-images').remove([path])
  if (error) throw error
  return true
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
