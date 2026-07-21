import { useEffect, useMemo, useRef, useState } from 'react'
import {
  blogBlocksToRichHtml,
  plainTextToEditorHtml,
  richHtmlToBlogContent,
  richHtmlToPlainText,
  sanitizeRichHtml,
} from '../../lib/blogRichText.js'
import {
  mapBlogRow,
  slugifyBlogTitle,
  todayInIstanbul,
} from '../../data/blog.js'
import {
  removeBlogImage,
  uploadBlogImage,
  validateImageFile,
} from '../../lib/imageUpload.js'
import { logAdminAction } from '../../lib/auditLog.js'
import { supabase } from '../../lib/supabase.js'
import './BlogWriter.css'

const fontOptions = [
  { label: 'Varsayılan', value: '' },
  { label: 'Modern Sans', value: 'Inter, system-ui, sans-serif' },
  { label: 'Başlık Fontu', value: 'var(--font-display)' },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Mono', value: 'SFMono-Regular, Consolas, monospace' },
]

const fontSizes = ['14', '16', '18', '20', '24', '30', '36', '44', '52']
const lineHeights = ['1.2', '1.5', '1.8', '2', '2.4']
const paragraphSpaces = ['0', '8', '16', '24', '32', '48']
const letterSpacings = ['0', '0.5', '1', '1.5', '2']

const cleanTypingStyle = (style = {}) =>
  Object.fromEntries(
    Object.entries(style).filter(([, value]) => value !== '' && value !== false && value != null),
  )

const typingStyleKey = (style = {}) => JSON.stringify(cleanTypingStyle(style))

const hasTypingStyle = (style = {}) => Object.keys(cleanTypingStyle(style)).length > 0

const applyTypingStyleToElement = (element, style = {}) => {
  if (style.bold) element.style.fontWeight = '800'
  if (style.italic) element.style.fontStyle = 'italic'
  if (style.underline || style.strike) {
    element.style.textDecoration = [
      style.underline ? 'underline' : '',
      style.strike ? 'line-through' : '',
    ]
      .filter(Boolean)
      .join(' ')
  }
  if (style.color) element.style.color = style.color
  if (style.backgroundColor) element.style.backgroundColor = style.backgroundColor
  if (style.fontFamily) element.style.fontFamily = style.fontFamily
  if (style.fontSize) element.style.fontSize = `${style.fontSize}px`
  element.dataset.blogTyping = typingStyleKey(style)
}

const emptyForm = () => ({
  id: null,
  title: '',
  slug: '',
  excerpt: '',
  category: 'Genel',
  author: 'Aserai Ekibi',
  readingTimeMinutes: 5,
  imageUrl: null,
  accent: '#1c3444',
  isPublished: true,
  publishedOn: todayInIstanbul(),
})

const postToForm = (post) => {
  if (!post) return emptyForm()
  return {
    id: post.id || null,
    title: post.title || '',
    slug: post.slug || '',
    excerpt: post.excerpt || '',
    category: post.category || 'Genel',
    author: post.author || 'Aserai Ekibi',
    readingTimeMinutes: post.readingTimeMinutes || 5,
    imageUrl: post.imageUrl || null,
    accent: post.accent || '#1c3444',
    isPublished: Boolean(post.isPublished),
    publishedOn: post.publishedOn || todayInIstanbul(),
  }
}

const friendlyError = (error) => {
  if (error?.code === '23505') {
    return 'Bu bağlantı adresi başka bir blog yazısında kullanılıyor.'
  }
  if (error?.code === '42501') {
    return 'Bu işlem için yönetici yetkisi doğrulanamadı.'
  }
  if (/blog_posts|blog-images|content_html|schema cache|does not exist/i.test(error?.message || '')) {
    return 'Blog altyapısı hazır değil. 0032 blog doküman migrationını Supabase üzerinde çalıştırın.'
  }
  return error?.message || 'Blog kaydedilemedi. Lütfen tekrar deneyin.'
}

const isInsideEditor = (editor, range) => {
  if (!editor || !range) return false
  const container = range.commonAncestorContainer
  return editor.contains(container.nodeType === Node.ELEMENT_NODE ? container : container.parentNode)
}

const postToDocumentHtml = (post) =>
  post?.contentHtml || blogBlocksToRichHtml(post?.content)

const validatePayload = (form, content, documentHtml) => {
  const title = form.title.trim()
  const slug = slugifyBlogTitle(form.slug || form.title)
  const excerpt = form.excerpt.trim()
  const category = form.category.trim()
  const author = form.author.trim()
  const readingTime = Number(form.readingTimeMinutes)
  const documentText = richHtmlToPlainText(documentHtml)

  if (title.length < 3 || title.length > 180) {
    throw new Error('Başlık 3-180 karakter arasında olmalıdır.')
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length < 3) {
    throw new Error('Bağlantı adresi en az 3 karakter olmalıdır.')
  }
  if (excerpt.length < 10 || excerpt.length > 600) {
    throw new Error('Özet 10-600 karakter arasında olmalıdır.')
  }
  if (category.length < 2 || category.length > 80) {
    throw new Error('Kategori 2-80 karakter arasında olmalıdır.')
  }
  if (author.length < 2 || author.length > 100) {
    throw new Error('Yazar adı 2-100 karakter arasında olmalıdır.')
  }
  if (!Number.isInteger(readingTime) || readingTime < 1 || readingTime > 180) {
    throw new Error('Okuma süresi 1-180 dakika arasında olmalıdır.')
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.publishedOn)) {
    throw new Error('Geçerli bir yayın tarihi seçin.')
  }
  if (!/^#[0-9a-f]{6}$/i.test(form.accent)) {
    throw new Error('Geçerli bir kapak rengi seçin.')
  }
  if (content.length < 1 || content.length > 100) {
    throw new Error('Blog içeriği 1-100 bölüm arasında olmalıdır.')
  }
  if (content.some((block) => block.text.length < 1 || block.text.length > 10000)) {
    throw new Error('Çok uzun bölümleri birkaç paragrafa ayırın.')
  }
  if (documentText.length < 1 || documentText.length > 100000) {
    throw new Error('Blog metni 1-100000 karakter arasında olmalıdır.')
  }
  if (documentHtml.length < 8 || documentHtml.length > 180000) {
    throw new Error('Blog dokümanı çok uzun. Görsel veya biçim yoğunluğunu azaltın.')
  }

  return {
    title,
    slug,
    excerpt,
    category,
    author,
    reading_time: readingTime,
    accent: form.accent,
    content,
    content_html: documentHtml,
    is_published: form.isPublished,
    published_on: form.publishedOn,
  }
}

export default function BlogWriter({ post, onCancel, onSaved }) {
  const editorRef = useRef(null)
  const savedRangeRef = useRef(null)
  const typingStyleRef = useRef({})
  const [form, setForm] = useState(() => postToForm(post))
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug))
  const [initialHtml, setInitialHtml] = useState(() => postToDocumentHtml(post))
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(post?.imageUrl || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [typingStyle, setTypingStyle] = useState({})

  useEffect(() => {
    const nextHtml = postToDocumentHtml(post)
    setForm(postToForm(post))
    setSlugTouched(Boolean(post?.slug))
    setInitialHtml(nextHtml)
    setImageFile(null)
    setImagePreview(post?.imageUrl || '')
    setError('')
    typingStyleRef.current = {}
    setTypingStyle({})
    if (editorRef.current) editorRef.current.innerHTML = nextHtml
  }, [post])

  useEffect(
    () => () => {
      if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
    },
    [imagePreview],
  )

  const coverPreviewStyle = useMemo(
    () => ({ '--accent': form.accent || '#1c3444' }),
    [form.accent],
  )

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const changeTitle = (value) => {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugTouched ? current.slug : slugifyBlogTitle(value),
    }))
  }

  const saveSelection = () => {
    const editor = editorRef.current
    const selection = window.getSelection?.()
    if (!editor || !selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    if (isInsideEditor(editor, range)) {
      savedRangeRef.current = range.cloneRange()
    }
  }

  const placeCaretAtEnd = () => {
    const editor = editorRef.current
    const selection = window.getSelection?.()
    if (!editor || !selection) return null

    const range = document.createRange()
    range.selectNodeContents(editor)
    range.collapse(false)
    editor.focus()
    selection.removeAllRanges()
    selection.addRange(range)
    savedRangeRef.current = range.cloneRange()
    return range
  }

  const restoreSelection = () => {
    const editor = editorRef.current
    const range = savedRangeRef.current
    const selection = window.getSelection?.()
    if (!editor || !selection) return null

    if (!range || !isInsideEditor(editor, range)) {
      return placeCaretAtEnd()
    }

    editor.focus()
    selection.removeAllRanges()
    selection.addRange(range)
    return range
  }

  const syncEditorHtml = () => {
    if (!editorRef.current) return
    saveSelection()
  }

  const setTypingStyleNow = (nextStyle) => {
    const cleanStyle = cleanTypingStyle(nextStyle)
    typingStyleRef.current = cleanStyle
    setTypingStyle(cleanStyle)
  }

  const mergeTypingStyle = (patch) => {
    setTypingStyleNow({ ...typingStyleRef.current, ...patch })
  }

  const applyCommand = (command, value = null, typingPatch = null) => {
    restoreSelection()
    document.execCommand('styleWithCSS', false, true)
    document.execCommand(command, false, value)
    if (typingPatch) mergeTypingStyle(typingPatch)
    syncEditorHtml()
  }

  const applyFontSize = (size) => {
    restoreSelection()
    document.execCommand('styleWithCSS', false, true)
    document.execCommand('fontSize', false, '7')
    editorRef.current?.querySelectorAll('font[size="7"]').forEach((node) => {
      const span = document.createElement('span')
      span.style.fontSize = `${size}px`
      while (node.firstChild) span.appendChild(node.firstChild)
      node.replaceWith(span)
    })
    mergeTypingStyle({ fontSize: size })
    syncEditorHtml()
  }

  const applyBlockStyle = (patch) => {
    const editor = editorRef.current
    const range = restoreSelection()
    if (!editor || !range) return

    const blockSelector = 'p,h1,h2,h3,h4,h5,h6,blockquote,li,ul,ol'
    const startNode =
      range.startContainer.nodeType === Node.ELEMENT_NODE
        ? range.startContainer
        : range.startContainer.parentElement
    const selectedBlocks = Array.from(editor.querySelectorAll(blockSelector)).filter((node) =>
      range.intersectsNode(node),
    )
    const fallbackBlock = startNode?.closest?.(blockSelector)
    const targets = selectedBlocks.length ? selectedBlocks : fallbackBlock ? [fallbackBlock] : []

    targets.forEach((target) => {
      Object.entries(patch).forEach(([key, value]) => {
        target.style[key] = value
      })
    })
    syncEditorHtml()
  }

  const insertFallbackList = (ordered) => {
    const range = restoreSelection()
    if (!range) return

    const selectionText = range.toString().trim()
    const items = selectionText
      ? selectionText.split(/\n+/).map((line) => line.trim()).filter(Boolean)
      : ['']
    const list = document.createElement(ordered ? 'ol' : 'ul')
    items.forEach((item) => {
      const li = document.createElement('li')
      if (item) {
        li.textContent = item
      } else {
        li.appendChild(document.createElement('br'))
      }
      list.appendChild(li)
    })

    range.deleteContents()
    range.insertNode(list)

    const firstItem = list.querySelector('li')
    if (firstItem) {
      const nextRange = document.createRange()
      nextRange.selectNodeContents(firstItem)
      nextRange.collapse(false)
      const selection = window.getSelection?.()
      selection?.removeAllRanges()
      selection?.addRange(nextRange)
      savedRangeRef.current = nextRange.cloneRange()
    }
  }

  const toggleList = (ordered) => {
    const editor = editorRef.current
    if (!editor) return

    const range = restoreSelection()
    const listTag = ordered ? 'ol' : 'ul'
    const startNode =
      range?.startContainer.nodeType === Node.ELEMENT_NODE
        ? range.startContainer
        : range?.startContainer.parentElement
    const alreadyInSameList = Boolean(startNode?.closest?.(listTag))
    const before = editor.innerHTML
    const beforeListCount = editor.querySelectorAll(listTag).length
    document.execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList', false)

    requestAnimationFrame(() => {
      const selection = window.getSelection?.()
      const activeNode =
        selection?.rangeCount && selection.getRangeAt(0).startContainer.nodeType === Node.ELEMENT_NODE
          ? selection.getRangeAt(0).startContainer
          : selection?.rangeCount
            ? selection.getRangeAt(0).startContainer.parentElement
            : null
      const selectionIsInList = Boolean(activeNode?.closest?.(listTag))
      const afterListCount = editor.querySelectorAll(listTag).length

      if (
        !alreadyInSameList &&
        (editor.innerHTML === before || (!selectionIsInList && afterListCount <= beforeListCount))
      ) {
        insertFallbackList(ordered)
      }
      syncEditorHtml()
    })
  }

  const clearFormatting = () => {
    restoreSelection()
    document.execCommand('removeFormat', false)
    setTypingStyleNow({})
    syncEditorHtml()
  }

  const currentTypingAncestorMatches = (range, activeTypingStyle) => {
    const editor = editorRef.current
    if (!editor || !range || !hasTypingStyle(activeTypingStyle)) return false

    let node =
      range.startContainer.nodeType === Node.ELEMENT_NODE
        ? range.startContainer
        : range.startContainer.parentElement
    const key = typingStyleKey(activeTypingStyle)
    while (node && node !== editor) {
      if (node.dataset?.blogTyping === key) return true
      node = node.parentElement
    }
    return false
  }

  const handleBeforeInput = (event) => {
    const inputType = event.nativeEvent?.inputType || event.inputType
    const data = event.nativeEvent?.data ?? event.data
    const activeTypingStyle = typingStyleRef.current
    if (
      !data ||
      inputType !== 'insertText' ||
      !hasTypingStyle(activeTypingStyle)
    ) {
      return
    }

    const editor = editorRef.current
    const selection = window.getSelection?.()
    if (!editor || !selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    if (!range.collapsed || !isInsideEditor(editor, range)) return
    if (currentTypingAncestorMatches(range, activeTypingStyle)) return

    event.preventDefault()
    const span = document.createElement('span')
    applyTypingStyleToElement(span, activeTypingStyle)
    span.textContent = data
    range.deleteContents()
    range.insertNode(span)

    const nextRange = document.createRange()
    nextRange.setStart(span.firstChild, span.textContent.length)
    nextRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(nextRange)
    savedRangeRef.current = nextRange.cloneRange()
  }

  const handlePaste = (event) => {
    event.preventDefault()
    const html = event.clipboardData.getData('text/html')
    const text = event.clipboardData.getData('text/plain')
    const cleanHtml = html ? sanitizeRichHtml(html) : plainTextToEditorHtml(text)
    document.execCommand('insertHTML', false, cleanHtml)
    syncEditorHtml()
  }

  const chooseImage = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      validateImageFile(file)
      if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setError('')
    } catch (nextError) {
      setError(nextError.message)
    }
  }

  const removeImage = () => {
    if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
    setImageFile(null)
    setImagePreview('')
    setField('imageUrl', null)
  }

  const savePost = async () => {
    if (!supabase) {
      setError('Supabase bağlantısı yapılandırılmadığı için kayıt yapılamıyor.')
      return
    }

    let payload
    try {
      const documentHtml = sanitizeRichHtml(editorRef.current?.innerHTML || '')
      const content = richHtmlToBlogContent(documentHtml)
      payload = validatePayload(form, content, documentHtml)
    } catch (nextError) {
      setError(nextError.message)
      return
    }

    setSaving(true)
    setError('')
    let uploadedImageUrl = null

    try {
      if (imageFile) uploadedImageUrl = await uploadBlogImage(imageFile)
      payload.image_url = uploadedImageUrl || form.imageUrl || null

      const query = form.id
        ? supabase.from('blog_posts').update(payload).eq('id', form.id)
        : supabase.from('blog_posts').insert(payload)

      const { data, error: saveError } = await query.select('*').maybeSingle()
      if (saveError) throw saveError
      if (!data) throw new Error('Blog kaydedilemedi.')

      const savedPost = mapBlogRow(data)
      const oldImageUrl = post?.imageUrl || null
      const imageChanged = Boolean(imageFile) || form.imageUrl !== oldImageUrl
      if (oldImageUrl && imageChanged && oldImageUrl !== savedPost.imageUrl) {
        await removeBlogImage(oldImageUrl).catch(() => {})
      }

      await logAdminAction(
        form.id ? 'blog.page_update' : 'blog.page_create',
        'blog_post',
        savedPost.id,
        {
          title: savedPost.title,
          slug: savedPost.slug,
          is_published: savedPost.isPublished,
        },
      )

      onSaved?.(savedPost)
    } catch (nextError) {
      if (uploadedImageUrl) await removeBlogImage(uploadedImageUrl).catch(() => {})
      setError(friendlyError(nextError))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="blog-writer">
      <div className="blog-writer__bar">
        <div className="blog-writer__identity">
          <span className="eyebrow">{form.id ? 'Blog düzenleme' : 'Yeni blog'}</span>
          <strong>{form.title || 'Başlıksız yazı'}</strong>
        </div>
        <div className="blog-writer__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={saving}>
            Vazgeç
          </button>
          <button type="button" className="btn btn--primary" onClick={savePost} disabled={saving}>
            {saving ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
        </div>
      </div>

      <div className="blog-writer__meta">
        <label className="blog-writer__field blog-writer__field--wide">
          Başlık
          <input
            value={form.title}
            onChange={(event) => changeTitle(event.target.value)}
            maxLength="180"
            required
          />
        </label>
        <label className="blog-writer__field blog-writer__field--wide">
          Özet
          <textarea
            value={form.excerpt}
            onChange={(event) => setField('excerpt', event.target.value)}
            rows="3"
            maxLength="600"
            required
          />
        </label>
        <label className="blog-writer__field">
          Adres
          <span className="blog-writer__slug">
            <span>/blog/</span>
            <input
              value={form.slug}
              onChange={(event) => {
                setSlugTouched(true)
                setField('slug', slugifyBlogTitle(event.target.value))
              }}
              maxLength="180"
              required
            />
          </span>
        </label>
        <label className="blog-writer__field">
          Kategori
          <input
            value={form.category}
            onChange={(event) => setField('category', event.target.value)}
            maxLength="80"
            required
          />
        </label>
        <label className="blog-writer__field">
          Yazar
          <input
            value={form.author}
            onChange={(event) => setField('author', event.target.value)}
            maxLength="100"
            required
          />
        </label>
        <label className="blog-writer__field">
          Okuma
          <input
            type="number"
            min="1"
            max="180"
            value={form.readingTimeMinutes}
            onChange={(event) => setField('readingTimeMinutes', event.target.value)}
            required
          />
        </label>
        <label className="blog-writer__field">
          Yayın tarihi
          <input
            type="date"
            value={form.publishedOn}
            onChange={(event) => setField('publishedOn', event.target.value)}
            required
          />
        </label>
        <label className="blog-writer__field">
          Kapak rengi
          <input
            type="color"
            value={form.accent}
            onChange={(event) => setField('accent', event.target.value)}
          />
        </label>
        <label className="blog-writer__publish">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(event) => setField('isPublished', event.target.checked)}
          />
          Yayında
        </label>
      </div>

      <div className="blog-writer__cover-tools">
        <div className="blog-writer__cover-preview" style={coverPreviewStyle}>
          {imagePreview ? <img src={imagePreview} alt="Blog kapak önizlemesi" /> : <span>Kapak</span>}
        </div>
        <label className="btn btn--ghost blog-writer__upload">
          Görsel Seç
          <input
            type="file"
            accept="image/avif,image/jpeg,image/png,image/webp"
            onChange={chooseImage}
            hidden
          />
        </label>
        <button type="button" className="btn btn--ghost" onClick={removeImage}>
          Görseli Kaldır
        </button>
      </div>

      <div className="blog-writer__toolbar" onMouseUp={saveSelection}>
        <div className="blog-writer__toolgroup blog-writer__toolgroup--selects">
          <select
            className="blog-writer__select blog-writer__select--font"
            defaultValue=""
            onMouseDown={saveSelection}
            onChange={(event) => {
              if (event.target.value) {
                applyCommand('fontName', event.target.value, {
                  fontFamily: event.target.value,
                })
              } else {
                mergeTypingStyle({ fontFamily: '' })
              }
            }}
            aria-label="Font"
          >
            {fontOptions.map((font) => (
              <option key={font.label} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
          <select
            className="blog-writer__select blog-writer__select--size"
            defaultValue=""
            onMouseDown={saveSelection}
            onChange={(event) => {
              if (event.target.value) applyFontSize(event.target.value)
              else mergeTypingStyle({ fontSize: '' })
            }}
            aria-label="Yazı boyutu"
          >
            <option value="">Boyut</option>
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>
        </div>

        <div className="blog-writer__toolgroup">
          <button
            type="button"
            className={typingStyle.bold ? 'is-active' : ''}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyCommand('bold', null, { bold: !typingStyle.bold })}
            title="Kalın"
            aria-label="Kalın"
          >
            B
          </button>
          <button
            type="button"
            className={typingStyle.italic ? 'is-active' : ''}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyCommand('italic', null, { italic: !typingStyle.italic })}
            title="Eğik"
            aria-label="Eğik"
          >
            I
          </button>
          <button
            type="button"
            className={typingStyle.underline ? 'is-active' : ''}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() =>
              applyCommand('underline', null, { underline: !typingStyle.underline })
            }
            title="Altı çizili"
            aria-label="Altı çizili"
          >
            U
          </button>
          <button
            type="button"
            className={typingStyle.strike ? 'is-active' : ''}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() =>
              applyCommand('strikeThrough', null, { strike: !typingStyle.strike })
            }
            title="Üstü çizili"
            aria-label="Üstü çizili"
          >
            S
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={clearFormatting}
            title="Biçimi temizle"
            aria-label="Biçimi temizle"
          >
            Tx
          </button>
        </div>

        <div className="blog-writer__toolgroup">
          <label className="blog-writer__color" title="Yazı rengi">
            <span>A</span>
            <input
              type="color"
              defaultValue="#1c3444"
              onMouseDown={saveSelection}
              onChange={(event) =>
                applyCommand('foreColor', event.target.value, { color: event.target.value })
              }
              aria-label="Yazı rengi"
            />
          </label>
          <label className="blog-writer__color" title="Vurgu rengi">
            <span>▣</span>
            <input
              type="color"
              defaultValue="#ffffff"
              onMouseDown={saveSelection}
              onChange={(event) =>
                applyCommand('hiliteColor', event.target.value, {
                  backgroundColor: event.target.value,
                })
              }
              aria-label="Vurgu rengi"
            />
          </label>
        </div>

        <div className="blog-writer__toolgroup">
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyCommand('justifyLeft')}
            title="Sola hizala"
            aria-label="Sola hizala"
          >
            Sol
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyCommand('justifyCenter')}
            title="Ortala"
            aria-label="Ortala"
          >
            Orta
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyCommand('justifyRight')}
            title="Sağa hizala"
            aria-label="Sağa hizala"
          >
            Sağ
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyCommand('justifyFull')}
            title="İki yana yasla"
            aria-label="İki yana yasla"
          >
            Yasla
          </button>
        </div>

        <div className="blog-writer__toolgroup">
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => toggleList(false)}
            title="Madde listesi"
            aria-label="Madde listesi"
          >
            •
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => toggleList(true)}
            title="Numaralı liste"
            aria-label="Numaralı liste"
          >
            1.
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyCommand('outdent')}
            title="Girintiyi azalt"
            aria-label="Girintiyi azalt"
          >
            ←
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyCommand('indent')}
            title="Girintiyi artır"
            aria-label="Girintiyi artır"
          >
            →
          </button>
        </div>

        <div className="blog-writer__toolgroup blog-writer__toolgroup--compact-selects">
          <select
            className="blog-writer__select blog-writer__select--short"
            defaultValue=""
            onMouseDown={saveSelection}
            onChange={(event) => {
              if (event.target.value) applyBlockStyle({ lineHeight: event.target.value })
            }}
            aria-label="Satır yüksekliği"
          >
            <option value="">Satır</option>
            {lineHeights.map((height) => (
              <option key={height} value={height}>
                {height}
              </option>
            ))}
          </select>
          <select
            className="blog-writer__select blog-writer__select--short"
            defaultValue=""
            onMouseDown={saveSelection}
            onChange={(event) => {
              if (event.target.value !== '') {
                applyBlockStyle({ marginTop: `${event.target.value}px` })
              }
            }}
            aria-label="Üst boşluk"
          >
            <option value="">Üst</option>
            {paragraphSpaces.map((space) => (
              <option key={space} value={space}>
                {space}px
              </option>
            ))}
          </select>
          <select
            className="blog-writer__select blog-writer__select--short"
            defaultValue=""
            onMouseDown={saveSelection}
            onChange={(event) => {
              if (event.target.value !== '') {
                applyBlockStyle({ marginBottom: `${event.target.value}px` })
              }
            }}
            aria-label="Alt boşluk"
          >
            <option value="">Alt</option>
            {paragraphSpaces.map((space) => (
              <option key={space} value={space}>
                {space}px
              </option>
            ))}
          </select>
          <select
            className="blog-writer__select blog-writer__select--short"
            defaultValue=""
            onMouseDown={saveSelection}
            onChange={(event) => {
              if (event.target.value !== '') {
                applyBlockStyle({ letterSpacing: `${event.target.value}px` })
              }
            }}
            aria-label="Harf aralığı"
          >
            <option value="">Harf</option>
            {letterSpacings.map((spacing) => (
              <option key={spacing} value={spacing}>
                {spacing}px
              </option>
            ))}
          </select>
        </div>

        <div className="blog-writer__toolgroup">
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyCommand('undo')}
            title="Geri al"
            aria-label="Geri al"
          >
            ↶
          </button>
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyCommand('redo')}
            title="Yinele"
            aria-label="Yinele"
          >
            ↷
          </button>
        </div>
      </div>

      <div
        ref={editorRef}
        className="blog-writer__canvas blog-post__rich"
        contentEditable
        suppressContentEditableWarning
        onBeforeInput={handleBeforeInput}
        onBlur={saveSelection}
        onKeyUp={saveSelection}
        onMouseUp={saveSelection}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: initialHtml }}
      />

      {error && (
        <div className="blog-writer__error" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
