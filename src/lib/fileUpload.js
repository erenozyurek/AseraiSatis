import { supabase } from './supabase.js'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const SUPPORT_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
])

function assertFile(file, allowedTypes = SUPPORT_TYPES) {
  if (!file || !Number.isFinite(file.size) || file.size <= 0) {
    throw new Error('Geçerli bir dosya seçin.')
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Dosya boyutu en fazla 10 MB olabilir.')
  }
  if (!allowedTypes.has(file.type)) {
    throw new Error('Bu dosya türü desteklenmiyor.')
  }
}

function extensionFor(file, fallback = 'bin') {
  const name = file.name || ''
  const ext = name.split('.').pop()?.toLowerCase()
  return ext && /^[a-z0-9]{2,8}$/.test(ext) ? ext : fallback
}

async function uploadPublicFile(bucket, path, file, options = {}) {
  if (!supabase) throw new Error('Dosya servisi yapılandırılmamış.')
  assertFile(file, options.allowedTypes)

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: Boolean(options.upsert),
      contentType: file.type,
    })

  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  if (!data?.publicUrl) throw new Error('Dosya adresi oluşturulamadı.')
  return data.publicUrl
}

export function uploadSupportAttachment(userId, ticketId, file) {
  const ext = extensionFor(file)
  const path = `${userId}/${ticketId}/${crypto.randomUUID()}.${ext}`
  return uploadPublicFile('support-attachments', path, file)
}

export function uploadInvoicePdf(invoiceId, file) {
  const path = `invoices/${invoiceId}.pdf`
  return uploadPublicFile('invoice-pdfs', path, file, {
    upsert: true,
    allowedTypes: new Set(['application/pdf']),
  })
}
