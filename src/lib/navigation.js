const INTERNAL_ORIGIN = 'https://aserai.local'

export function getSafeInternalPath(value) {
  const raw = typeof value === 'string' ? value.trim() : ''
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.includes('\\')) {
    return null
  }

  try {
    const url = new URL(raw, INTERNAL_ORIGIN)
    if (url.origin !== INTERNAL_ORIGIN) return null
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return null
  }
}
