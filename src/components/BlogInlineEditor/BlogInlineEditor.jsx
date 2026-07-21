import { useEffect, useMemo, useState } from 'react'
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
import './BlogInlineEditor.css'

const fontOptions = [
  { label: 'Varsayılan', value: '' },
  { label: 'Modern Sans', value: 'Inter, system-ui, sans-serif' },
  { label: 'Başlık Fontu', value: 'var(--font-display)' },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Mono', value: 'SFMono-Regular, Consolas, monospace' },
]

const emptyStyle = {
  bold: false,
  italic: false,
  underline: false,
  color: '#1c3444',
  fontFamily: '',
  fontSize: '',
  align: 'left',
  list: 'none',
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
  content: [
    {
      type: 'h',
      text: 'Yeni blog başlığı',
      style: { ...emptyStyle, bold: true, fontSize: '30' },
    },
    {
      type: 'p',
      text: 'Blog içeriğinizi buraya yazın. Araç çubuğundan yazı rengi, kalınlık, eğik yazı, hizalama, font ve madde düzenini değiştirebilirsiniz.',
      style: { ...emptyStyle, color: '#344150' },
    },
  ],
  isPublished: true,
  publishedOn: todayInIstanbul(),
  updatedAt: null,
})

const getBlockStyle = (block) => ({
  ...emptyStyle,
  ...(block?.style && typeof block.style === 'object' ? block.style : {}),
})

const normalizeHex = (value, fallback = '') => {
  const raw = String(value || '').trim()
  return /^#[0-9a-f]{6}$/i.test(raw) ? raw : fallback
}

const normalizeStyle = (style = {}) => {
  const next = {}
  if (style.bold) next.bold = true
  if (style.italic) next.italic = true
  if (style.underline) next.underline = true

  const color = normalizeHex(style.color)
  if (color) next.color = color

  if (fontOptions.some((font) => font.value === style.fontFamily)) {
    if (style.fontFamily) next.fontFamily = style.fontFamily
  }

  const fontSize = Number(style.fontSize)
  if (Number.isFinite(fontSize) && fontSize >= 12 && fontSize <= 56) {
    next.fontSize = String(fontSize)
  }

  if (['left', 'center', 'right', 'justify'].includes(style.align)) {
    if (style.align !== 'left') next.align = style.align
  }

  if (['bullet', 'number'].includes(style.list)) next.list = style.list

  return next
}

const blockPreviewStyle = (block) => {
  const style = getBlockStyle(block)
  return {
    color: style.color || undefined,
    fontFamily: style.fontFamily || undefined,
    fontSize: style.fontSize ? `${style.fontSize}px` : undefined,
    fontWeight: style.bold ? 800 : undefined,
    fontStyle: style.italic ? 'italic' : undefined,
    textDecoration: style.underline ? 'underline' : undefined,
    textAlign: style.align || undefined,
  }
}

const friendlyError = (error) => {
  if (error?.code === '23505') {
    return 'Bu bağlantı adresi başka bir blog yazısında kullanılıyor.'
  }
  if (error?.code === '42501') {
    return 'Bu işlem için yönetici yetkisi doğrulanamadı.'
  }
  if (/blog_posts|blog-images|schema cache|does not exist/i.test(error?.message || '')) {
    return 'Blog altyapısı hazır değil. Blog migrationını Supabase üzerinde çalıştırın.'
  }
  return error?.message || 'Blog kaydedilemedi. Lütfen tekrar deneyin.'
}

function postToForm(post) {
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
    content: post.content?.length
      ? post.content.map((block) => ({
          type: block.type === 'h' ? 'h' : 'p',
          text: block.text || '',
          style: getBlockStyle(block),
        }))
      : emptyForm().content,
    isPublished: Boolean(post.isPublished),
    publishedOn: post.publishedOn || todayInIstanbul(),
    updatedAt: post.updatedAt || null,
  }
}

function validateForm(form) {
  const title = form.title.trim()
  const slug = slugifyBlogTitle(form.slug)
  const excerpt = form.excerpt.trim()
  const category = form.category.trim()
  const author = form.author.trim()
  const readingTime = Number(form.readingTimeMinutes)
  const accent = normalizeHex(form.accent)

  const content = form.content.map((block) => {
    const text = String(block.text || '').trim()
    const next = {
      type: block.type === 'h' ? 'h' : 'p',
      text,
    }
    const style = normalizeStyle(block.style || {})
    if (Object.keys(style).length) next.style = style
    return next
  })

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
  if (!accent) {
    throw new Error('Geçerli bir kapak rengi seçin.')
  }
  if (content.length < 1 || content.length > 100) {
    throw new Error('Blog içeriği 1-100 blok arasında olmalıdır.')
  }
  if (content.some((block) => block.text.length < 1 || block.text.length > 10000)) {
    throw new Error('Her içerik bloğunu doldurun.')
  }

  return {
    title,
    slug,
    excerpt,
    category,
    author,
    reading_time: readingTime,
    accent,
    content,
    is_published: form.isPublished,
    published_on: form.publishedOn,
  }
}

export default function BlogInlineEditor({ post, onClose, onSaved }) {
  const [form, setForm] = useState(() => postToForm(post))
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug))
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(post?.imageUrl || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(postToForm(post))
    setSlugTouched(Boolean(post?.slug))
    setImageFile(null)
    setImagePreview(post?.imageUrl || '')
    setError('')
  }, [post])

  useEffect(
    () => () => {
      if (imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview)
    },
    [imagePreview],
  )

  const currentBlockCount = form.content.length
  const hasImageChange = Boolean(imageFile) || form.imageUrl !== (post?.imageUrl || null)

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

  const updateBlock = (index, patch) => {
    setForm((current) => ({
      ...current,
      content: current.content.map((block, blockIndex) =>
        blockIndex === index ? { ...block, ...patch } : block,
      ),
    }))
  }

  const updateBlockStyle = (index, patch) => {
    setForm((current) => ({
      ...current,
      content: current.content.map((block, blockIndex) =>
        blockIndex === index
          ? { ...block, style: { ...getBlockStyle(block), ...patch } }
          : block,
      ),
    }))
  }

  const addBlock = (type) => {
    setForm((current) => ({
      ...current,
      content: [
        ...current.content,
        {
          type,
          text: type === 'h' ? 'Yeni başlık' : 'Yeni paragraf',
          style:
            type === 'h'
              ? { ...emptyStyle, bold: true, fontSize: '28' }
              : { ...emptyStyle, color: '#344150' },
        },
      ],
    }))
  }

  const duplicateBlock = (index) => {
    setForm((current) => ({
      ...current,
      content: current.content.flatMap((block, blockIndex) =>
        blockIndex === index
          ? [block, { ...block, style: { ...getBlockStyle(block) } }]
          : [block],
      ),
    }))
  }

  const removeBlock = (index) => {
    setForm((current) => ({
      ...current,
      content:
        current.content.length === 1
          ? current.content
          : current.content.filter((_, blockIndex) => blockIndex !== index),
    }))
  }

  const moveBlock = (index, direction) => {
    setForm((current) => {
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= current.content.length) return current
      const content = [...current.content]
      const moving = content[index]
      content[index] = content[targetIndex]
      content[targetIndex] = moving
      return { ...current, content }
    })
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

  const savePost = async (event) => {
    event.preventDefault()
    if (!supabase) {
      setError('Supabase bağlantısı yapılandırılmadığı için kayıt yapılamıyor.')
      return
    }

    let payload
    try {
      payload = validateForm(form)
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
      if (oldImageUrl && hasImageChange && oldImageUrl !== savedPost.imageUrl) {
        await removeBlogImage(oldImageUrl).catch(() => {})
      }

      await logAdminAction(
        form.id ? 'blog.inline_update' : 'blog.inline_create',
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

  const coverPreviewStyle = useMemo(
    () => ({ '--accent': form.accent || '#1c3444' }),
    [form.accent],
  )

  return (
    <div className="blog-editor-backdrop" role="dialog" aria-modal="true">
      <form className="blog-editor" onSubmit={savePost}>
        <div className="blog-editor__topbar">
          <div>
            <span className="blog-editor__eyebrow">
              {form.id ? 'Blog düzenleme' : 'Yeni blog oluştur'}
            </span>
            <h2>{form.id ? form.title || 'Blog yazısı' : 'Yeni blog yazısı'}</h2>
          </div>
          <div className="blog-editor__top-actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onClose}
              disabled={saving}
            >
              Kapat
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Kaydediliyor…' : 'Kaydet'}
            </button>
          </div>
        </div>

        <div className="blog-editor__layout">
          <aside className="blog-editor__side">
            <div className="blog-editor__panel">
              <h3>Yayın Bilgileri</h3>
              <label>
                Başlık
                <input
                  value={form.title}
                  onChange={(event) => changeTitle(event.target.value)}
                  maxLength="180"
                  required
                />
              </label>
              <label>
                Bağlantı adresi
                <span className="blog-editor__slug">
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
              <label>
                Özet
                <textarea
                  value={form.excerpt}
                  onChange={(event) => setField('excerpt', event.target.value)}
                  rows="4"
                  maxLength="600"
                  required
                />
              </label>
              <div className="blog-editor__split">
                <label>
                  Kategori
                  <input
                    value={form.category}
                    onChange={(event) => setField('category', event.target.value)}
                    maxLength="80"
                    required
                  />
                </label>
                <label>
                  Okuma
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={form.readingTimeMinutes}
                    onChange={(event) =>
                      setField('readingTimeMinutes', event.target.value)
                    }
                    required
                  />
                </label>
              </div>
              <div className="blog-editor__split">
                <label>
                  Yazar
                  <input
                    value={form.author}
                    onChange={(event) => setField('author', event.target.value)}
                    maxLength="100"
                    required
                  />
                </label>
                <label>
                  Yayın tarihi
                  <input
                    type="date"
                    value={form.publishedOn}
                    onChange={(event) => setField('publishedOn', event.target.value)}
                    required
                  />
                </label>
              </div>
              <label className="blog-editor__publish">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(event) => setField('isPublished', event.target.checked)}
                />
                Yayında göster
              </label>
            </div>

            <div className="blog-editor__panel">
              <h3>Kapak Görseli</h3>
              <div className="blog-editor__cover" style={coverPreviewStyle}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Blog kapak önizlemesi" />
                ) : (
                  <span>Kapak görseli yok</span>
                )}
              </div>
              <label>
                Yedek renk
                <input
                  type="color"
                  value={form.accent}
                  onChange={(event) => setField('accent', event.target.value)}
                />
              </label>
              <div className="blog-editor__image-actions">
                <label className="btn btn--ghost blog-editor__upload">
                  Görsel Seç
                  <input
                    type="file"
                    accept="image/avif,image/jpeg,image/png,image/webp"
                    onChange={chooseImage}
                    hidden
                  />
                </label>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={removeImage}
                >
                  Görseli Kaldır
                </button>
              </div>
            </div>
          </aside>

          <main className="blog-editor__main">
            <div className="blog-editor__panel blog-editor__content-head">
              <div>
                <h3>Yazı İçeriği</h3>
                <p>
                  Başlık, paragraf, madde düzeni, font, renk ve hizalama
                  ayarlarını blok bazında yönetin.
                </p>
              </div>
              <div className="blog-editor__add">
                <button type="button" className="btn btn--ghost" onClick={() => addBlock('h')}>
                  Başlık
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => addBlock('p')}>
                  Paragraf
                </button>
              </div>
            </div>

            <div className="blog-editor__blocks">
              {form.content.map((block, index) => {
                const style = getBlockStyle(block)
                return (
                  <section key={`${index}-${currentBlockCount}`} className="blog-editor-block">
                    <div className="blog-editor-block__toolbar">
                      <span className="blog-editor-block__number">{index + 1}</span>
                      <select
                        value={block.type}
                        onChange={(event) => updateBlock(index, { type: event.target.value })}
                        aria-label="Blok tipi"
                      >
                        <option value="p">Paragraf</option>
                        <option value="h">Başlık</option>
                      </select>
                      <button
                        type="button"
                        className={style.bold ? 'is-active' : ''}
                        onClick={() => updateBlockStyle(index, { bold: !style.bold })}
                        title="Kalın"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        className={style.italic ? 'is-active' : ''}
                        onClick={() => updateBlockStyle(index, { italic: !style.italic })}
                        title="Eğik"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        className={style.underline ? 'is-active' : ''}
                        onClick={() =>
                          updateBlockStyle(index, { underline: !style.underline })
                        }
                        title="Altı çizili"
                      >
                        U
                      </button>
                      <input
                        type="color"
                        value={style.color}
                        onChange={(event) => updateBlockStyle(index, { color: event.target.value })}
                        title="Yazı rengi"
                      />
                      <select
                        value={style.fontFamily}
                        onChange={(event) =>
                          updateBlockStyle(index, { fontFamily: event.target.value })
                        }
                        aria-label="Font"
                      >
                        {fontOptions.map((font) => (
                          <option key={font.label} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="12"
                        max="56"
                        value={style.fontSize}
                        onChange={(event) =>
                          updateBlockStyle(index, { fontSize: event.target.value })
                        }
                        placeholder="px"
                        title="Yazı boyutu"
                      />
                      <select
                        value={style.align}
                        onChange={(event) => updateBlockStyle(index, { align: event.target.value })}
                        aria-label="Hizalama"
                      >
                        <option value="left">Sol</option>
                        <option value="center">Orta</option>
                        <option value="right">Sağ</option>
                        <option value="justify">Yasla</option>
                      </select>
                      <select
                        value={style.list}
                        onChange={(event) => updateBlockStyle(index, { list: event.target.value })}
                        aria-label="Madde düzeni"
                        disabled={block.type === 'h'}
                      >
                        <option value="none">Düz</option>
                        <option value="bullet">Madde</option>
                        <option value="number">Numara</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => moveBlock(index, -1)}
                        disabled={index === 0}
                        title="Yukarı taşı"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(index, 1)}
                        disabled={index === form.content.length - 1}
                        title="Aşağı taşı"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicateBlock(index)}
                        title="Kopyala"
                      >
                        ⧉
                      </button>
                      <button
                        type="button"
                        className="is-danger"
                        onClick={() => removeBlock(index)}
                        disabled={form.content.length === 1}
                        title="Sil"
                      >
                        ×
                      </button>
                    </div>
                    <textarea
                      value={block.text}
                      onChange={(event) => updateBlock(index, { text: event.target.value })}
                      rows={block.type === 'h' ? 2 : 8}
                      style={blockPreviewStyle(block)}
                      required
                    />
                  </section>
                )
              })}
            </div>

            {error && (
              <div className="blog-editor__error" role="alert">
                {error}
              </div>
            )}
          </main>
        </div>
      </form>
    </div>
  )
}
