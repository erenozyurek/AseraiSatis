const bulletPattern = /^\s*(?:[-*•●▪–—])\s+(.+)$/
const numberedPattern = /^\s*(\d+)[.)]\s+(.+)$/

const allowedTags = new Set([
  'A',
  'B',
  'BLOCKQUOTE',
  'BR',
  'DIV',
  'EM',
  'FONT',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'I',
  'LI',
  'OL',
  'P',
  'S',
  'SPAN',
  'STRIKE',
  'STRONG',
  'SUB',
  'SUP',
  'U',
  'UL',
])

const normalizeTag = (tagName) => {
  if (tagName === 'DIV') return 'P'
  if (tagName === 'FONT') return 'SPAN'
  if (tagName === 'STRIKE') return 'S'
  return tagName
}

const escapeHtml = (value) =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const cssColorPattern =
  /^(#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)|[a-z]+)$/i

const safeCssTextValue = (value, maxLength = 140) => {
  const raw = String(value || '').trim()
  if (!raw || raw.length > maxLength || /[;{}<>]/.test(raw)) return ''
  return raw
}

const getCleanStyle = (element) => {
  const source = element.style
  const styles = []

  const color = safeCssTextValue(source.color || element.getAttribute('color'))
  if (color && cssColorPattern.test(color)) styles.push(`color: ${color}`)

  const background = safeCssTextValue(source.backgroundColor)
  if (background && cssColorPattern.test(background)) {
    styles.push(`background-color: ${background}`)
  }

  const fontFamily = safeCssTextValue(source.fontFamily || element.getAttribute('face'))
  if (fontFamily) styles.push(`font-family: ${fontFamily}`)

  const sizeFromFontTag = element.getAttribute('size')
  const fontSize = safeCssTextValue(
    source.fontSize || (sizeFromFontTag ? `${Number(sizeFromFontTag) + 10}px` : ''),
  )
  if (/^\d{1,2}(?:\.\d+)?(?:px|rem|em)$/.test(fontSize)) {
    styles.push(`font-size: ${fontSize}`)
  }

  const fontWeight = safeCssTextValue(source.fontWeight)
  if (/^(bold|normal|[1-9]00)$/.test(fontWeight)) {
    styles.push(`font-weight: ${fontWeight}`)
  }

  const fontStyle = safeCssTextValue(source.fontStyle)
  if (fontStyle === 'italic' || fontStyle === 'normal') {
    styles.push(`font-style: ${fontStyle}`)
  }

  const textDecoration = safeCssTextValue(source.textDecorationLine || source.textDecoration)
  if (/underline/.test(textDecoration)) styles.push('text-decoration: underline')

  const textAlign = safeCssTextValue(source.textAlign)
  if (['left', 'center', 'right', 'justify'].includes(textAlign)) {
    styles.push(`text-align: ${textAlign}`)
  }

  const lineHeight = safeCssTextValue(source.lineHeight)
  if (/^(1|1\.[0-9]|2|2\.[0-9]|3|normal)$/.test(lineHeight)) {
    styles.push(`line-height: ${lineHeight}`)
  }

  ;['marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'textIndent'].forEach(
    (prop) => {
      const value = safeCssTextValue(source[prop])
      if (/^-?\d{1,3}(?:\.\d+)?px$/.test(value)) {
        const cssProp = prop.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
        styles.push(`${cssProp}: ${value}`)
      }
    },
  )

  const letterSpacing = safeCssTextValue(source.letterSpacing)
  if (/^-?\d{1,2}(?:\.\d+)?px$/.test(letterSpacing)) {
    styles.push(`letter-spacing: ${letterSpacing}`)
  }

  return styles.join('; ')
}

const sanitizeNode = (node, doc) => {
  if (node.nodeType === Node.TEXT_NODE) {
    return doc.createTextNode(node.textContent || '')
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return null

  const originalTag = node.tagName
  if (!allowedTags.has(originalTag)) {
    const fragment = doc.createDocumentFragment()
    node.childNodes.forEach((child) => {
      const cleanChild = sanitizeNode(child, doc)
      if (cleanChild) fragment.appendChild(cleanChild)
    })
    return fragment
  }

  const tagName = normalizeTag(originalTag)
  const clean = doc.createElement(tagName.toLowerCase())
  const cleanStyle = getCleanStyle(node)
  if (cleanStyle) clean.setAttribute('style', cleanStyle)

  if (tagName === 'A') {
    const href = safeCssTextValue(node.getAttribute('href'), 800)
    if (/^(https?:|mailto:|tel:)/i.test(href)) {
      clean.setAttribute('href', href)
      clean.setAttribute('target', '_blank')
      clean.setAttribute('rel', 'noopener noreferrer')
    }
  }

  node.childNodes.forEach((child) => {
    const cleanChild = sanitizeNode(child, doc)
    if (cleanChild) clean.appendChild(cleanChild)
  })

  return clean
}

export function sanitizeRichHtml(html) {
  if (!html) return ''
  if (typeof document === 'undefined') return escapeHtml(html)

  const template = document.createElement('template')
  template.innerHTML = String(html)
  const clean = document.createElement('div')

  template.content.childNodes.forEach((child) => {
    const cleanChild = sanitizeNode(child, document)
    if (cleanChild) clean.appendChild(cleanChild)
  })

  return clean.innerHTML
}

export function richHtmlToPlainText(html) {
  if (!html) return ''
  if (typeof document === 'undefined') return String(html).replace(/<[^>]+>/g, ' ')
  const template = document.createElement('template')
  template.innerHTML = sanitizeRichHtml(html)
  return (template.content.textContent || '').replace(/\s+/g, ' ').trim()
}

const styleToAttribute = (style = {}) => {
  const rules = []
  if (/^#[0-9a-f]{6}$/i.test(style.color || '')) rules.push(`color: ${style.color}`)
  if (style.fontFamily) rules.push(`font-family: ${safeCssTextValue(style.fontFamily)}`)
  const fontSize = Number(style.fontSize)
  if (Number.isFinite(fontSize) && fontSize >= 12 && fontSize <= 56) {
    rules.push(`font-size: ${fontSize}px`)
  }
  if (style.bold) rules.push('font-weight: 800')
  if (style.italic) rules.push('font-style: italic')
  if (style.underline) rules.push('text-decoration: underline')
  if (['center', 'right', 'justify'].includes(style.align)) {
    rules.push(`text-align: ${style.align}`)
  }
  return rules.length ? ` style="${escapeHtml(rules.join('; '))}"` : ''
}

const stripListMarker = (line) => {
  const numberedMatch = line.match(numberedPattern)
  if (numberedMatch) return numberedMatch[2].trim()
  const bulletMatch = line.match(bulletPattern)
  if (bulletMatch) return bulletMatch[1].trim()
  return line.trim()
}

const textLines = (text) =>
  String(text || '')
    .replace(/\r\n/g, '\n')
    .split('\n')

const paragraphTextToHtml = (text, styleAttribute) => {
  const output = []
  let paragraphLines = []
  let listItems = []
  let listType = 'ul'

  const flushParagraph = () => {
    const lines = paragraphLines.map((line) => line.trim()).filter(Boolean)
    if (lines.length) {
      output.push(`<p${styleAttribute}>${lines.map(escapeHtml).join('<br>')}</p>`)
    }
    paragraphLines = []
  }

  const flushList = () => {
    if (listItems.length) {
      output.push(
        `<${listType}${styleAttribute}>${listItems
          .map((item) => `<li>${escapeHtml(item)}</li>`)
          .join('')}</${listType}>`,
      )
    }
    listItems = []
  }

  textLines(text).forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed) {
      flushParagraph()
      flushList()
      return
    }

    const bulletMatch = trimmed.match(bulletPattern)
    const numberedMatch = trimmed.match(numberedPattern)

    if (bulletMatch || numberedMatch) {
      flushParagraph()
      const nextType = numberedMatch ? 'ol' : 'ul'
      if (listItems.length && listType !== nextType) flushList()
      listType = nextType
      listItems.push(stripListMarker(trimmed))
      return
    }

    flushList()
    paragraphLines.push(trimmed)
  })

  flushParagraph()
  flushList()

  return output.join('')
}

export function blogBlocksToRichHtml(content = []) {
  if (!Array.isArray(content) || !content.length) {
    return '<p>Blog içeriğinizi buraya yazın.</p>'
  }

  return sanitizeRichHtml(
    content
      .map((block) => {
        if (block?.html) return block.html

        const styleAttribute = styleToAttribute(block?.style || {})
        if (block?.type === 'h') {
          return textLines(block.text)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => `<h2${styleAttribute}>${escapeHtml(line)}</h2>`)
            .join('')
        }

        return paragraphTextToHtml(block?.text || '', styleAttribute)
      })
      .join(''),
  )
}

export function plainTextToEditorHtml(text) {
  const paragraphs = textLines(text)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('')

  return paragraphs || '<p><br></p>'
}

export function richHtmlToBlogContent(html) {
  const text = richHtmlToPlainText(html)
  if (!text) return []

  const chunks = []
  const chunkSize = 9000
  for (let index = 0; index < text.length; index += chunkSize) {
    chunks.push({
      type: 'p',
      text: text.slice(index, index + chunkSize).trim(),
    })
  }

  return chunks.filter((block) => block.text)
}
