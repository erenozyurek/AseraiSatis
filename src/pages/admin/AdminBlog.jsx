import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BlogCover from '../../components/BlogCover/BlogCover.jsx'
import {
  formatDate,
  mapBlogRow,
  slugifyBlogTitle,
  todayInIstanbul,
} from '../../data/blog.js'
import {
  removeBlogImage,
  uploadBlogImage,
  validateImageFile,
} from '../../lib/imageUpload.js'
import { supabase } from '../../lib/supabase.js'
import '../panel/panel.css'
import './AdminBlog.css'

const emptyForm = () => ({
  title: '',
  slug: '',
  excerpt: '',
  category: '',
  author: 'Aserai Ekibi',
  readingTimeMinutes: 5,
  imageUrl: null,
  accent: '#1c3444',
  content: [{ type: 'p', text: '' }],
  isPublished: false,
  publishedOn: todayInIstanbul(),
})

const migrationMissing = (error) =>
  error?.code === '42P01' ||
  error?.code === 'PGRST205' ||
  /blog_posts|blog-images/i.test(error?.message || '')

const friendlyError = (error) => {
  if (error?.code === '23505') {
    return 'Bu bağlantı adresi başka bir blog yazısında kullanılıyor.'
  }
  if (error?.code === '42501') {
    return 'Bu işlem için yönetici yetkisi doğrulanamadı.'
  }
  if (migrationMissing(error)) {
    return 'Blog altyapısı hazır değil. 0019_blog_management.sql migrationını Supabase üzerinde çalıştırın.'
  }
  return error?.message || 'İşlem tamamlanamadı. Lütfen tekrar deneyin.'
}

const validateForm = (form, hasNewImage) => {
  const title = form.title.trim()
  const slug = slugifyBlogTitle(form.slug)
  const excerpt = form.excerpt.trim()
  const category = form.category.trim()
  const author = form.author.trim()
  const readingTime = Number(form.readingTimeMinutes)
  const content = form.content.map((block) => ({
    type: block.type,
    text: block.text.trim(),
  }))

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
  if (!hasNewImage && !form.imageUrl) {
    throw new Error('Blog yazısı için bir kapak görseli seçin.')
  }
  if (content.length < 1 || content.length > 100) {
    throw new Error('Blog içeriği 1-100 blok arasında olmalıdır.')
  }
  if (
    content.some(
      (block) =>
        !['h', 'p'].includes(block.type) ||
        block.text.length < 1 ||
        block.text.length > 10000,
    )
  ) {
    throw new Error('Her içerik bloğunu doldurun.')
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
    is_published: form.isPublished,
    published_on: form.publishedOn,
  }
}

export default function AdminBlog() {
  const [posts, setPosts] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [notice, setNotice] = useState('')
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [slugTouched, setSlugTouched] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const loadPosts = async ({ showLoading = true } = {}) => {
    if (!supabase) {
      setPosts([])
      setLoadError('Supabase bağlantısı yapılandırılmamış.')
      return
    }

    if (showLoading) setPosts(null)
    setLoadError('')
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_on', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      setPosts([])
      setLoadError(friendlyError(error))
      return
    }
    setPosts((data || []).map(mapBlogRow))
  }

  useEffect(() => {
    loadPosts()
  }, [])

  useEffect(
    () => () => {
      if (imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    },
    [imagePreview],
  )

  const closeEditor = () => {
    setEditorOpen(false)
    setEditingPost(null)
    setForm(emptyForm())
    setImageFile(null)
    setImagePreview('')
    setFormError('')
    setSlugTouched(false)
  }

  const openNew = () => {
    setNotice('')
    setDeleteId(null)
    setEditingPost(null)
    setForm(emptyForm())
    setImageFile(null)
    setImagePreview('')
    setFormError('')
    setSlugTouched(false)
    setEditorOpen(true)
  }

  const openEdit = (post) => {
    setNotice('')
    setDeleteId(null)
    setEditingPost(post)
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      category: post.category,
      author: post.author,
      readingTimeMinutes: post.readingTimeMinutes,
      imageUrl: post.imageUrl,
      accent: post.accent,
      content: post.content.length
        ? post.content.map((block) => ({ ...block }))
        : [{ type: 'p', text: '' }],
      isPublished: post.isPublished,
      publishedOn: post.publishedOn,
    })
    setImageFile(null)
    setImagePreview(post.imageUrl || '')
    setFormError('')
    setSlugTouched(true)
    setEditorOpen(true)
  }

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

  const chooseImage = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      validateImageFile(file)
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setFormError('')
    } catch (error) {
      setFormError(error.message)
    }
  }

  const resetImageSelection = () => {
    setImageFile(null)
    setImagePreview(form.imageUrl || '')
  }

  const updateBlock = (index, field, value) => {
    setForm((current) => ({
      ...current,
      content: current.content.map((block, blockIndex) =>
        blockIndex === index ? { ...block, [field]: value } : block,
      ),
    }))
  }

  const addBlock = (type) => {
    setForm((current) => ({
      ...current,
      content: [...current.content, { type, text: '' }],
    }))
  }

  const removeBlock = (index) => {
    setForm((current) => ({
      ...current,
      content: current.content.filter((_, blockIndex) => blockIndex !== index),
    }))
  }

  const moveBlock = (index, direction) => {
    setForm((current) => {
      const nextIndex = index + direction
      if (nextIndex < 0 || nextIndex >= current.content.length) return current
      const content = [...current.content]
      const movingBlock = content[index]
      content[index] = content[nextIndex]
      content[nextIndex] = movingBlock
      return { ...current, content }
    })
  }

  const savePost = async (event) => {
    event.preventDefault()
    setFormError('')
    setNotice('')

    let payload
    try {
      payload = validateForm(form, Boolean(imageFile))
    } catch (error) {
      setFormError(error.message)
      return
    }

    setSaving(true)
    let uploadedImageUrl = null
    let databaseSaved = false

    try {
      if (imageFile) uploadedImageUrl = await uploadBlogImage(imageFile)
      payload.image_url = uploadedImageUrl || form.imageUrl

      if (editingPost) {
        const { data, error } = await supabase
          .from('blog_posts')
          .update(payload)
          .eq('id', editingPost.id)
          .eq('updated_at', editingPost.updatedAt)
          .select('*')
          .maybeSingle()

        if (error) throw error
        if (!data) {
          const conflictError = new Error(
            'Yazı başka bir yönetici tarafından güncellendi. Sayfayı yenileyip tekrar deneyin.',
          )
          conflictError.name = 'BlogConflictError'
          throw conflictError
        }
      } else {
        const { error } = await supabase.from('blog_posts').insert(payload)
        if (error) throw error
      }

      databaseSaved = true
      let cleanupWarning = false
      if (
        editingPost?.imageUrl &&
        uploadedImageUrl &&
        editingPost.imageUrl !== uploadedImageUrl
      ) {
        try {
          await removeBlogImage(editingPost.imageUrl)
        } catch {
          cleanupWarning = true
        }
      }

      await loadPosts({ showLoading: false })
      closeEditor()
      setNotice(
        cleanupWarning
          ? 'Blog kaydedildi; önceki kapak dosyası depodan silinemedi.'
          : 'Blog yazısı kaydedildi.',
      )
    } catch (error) {
      if (uploadedImageUrl && !databaseSaved) {
        let verification = supabase
          .from('blog_posts')
          .select('id,image_url')

        verification = editingPost
          ? verification.eq('id', editingPost.id)
          : verification.eq('slug', payload.slug)

        const { data: persistedPost, error: verificationError } =
          await verification.maybeSingle()

        if (!verificationError && persistedPost?.image_url === uploadedImageUrl) {
          let cleanupWarning = false
          if (
            editingPost?.imageUrl &&
            editingPost.imageUrl !== uploadedImageUrl
          ) {
            try {
              await removeBlogImage(editingPost.imageUrl)
            } catch {
              cleanupWarning = true
            }
          }

          await loadPosts({ showLoading: false })
          closeEditor()
          setNotice(
            cleanupWarning
              ? 'Blog kaydedildi; önceki kapak dosyası depodan silinemedi.'
              : 'Blog yazısı kaydedildi.',
          )
          return
        }

        if (
          !verificationError ||
          Boolean(error?.code) ||
          error?.name === 'BlogConflictError'
        ) {
          await removeBlogImage(uploadedImageUrl).catch(() => {})
        }
      }
      setFormError(friendlyError(error))
    } finally {
      setSaving(false)
    }
  }

  const deletePost = async (post) => {
    setDeletingId(post.id)
    setNotice('')
    setLoadError('')

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', post.id)
        .eq('updated_at', post.updatedAt)
        .select('id')
        .maybeSingle()

      if (error) throw error
      if (!data) {
        throw new Error(
          'Yazı başka bir yönetici tarafından güncellendi. Listeyi yenileyip tekrar deneyin.',
        )
      }

      let cleanupWarning = false
      if (post.imageUrl) {
        try {
          await removeBlogImage(post.imageUrl)
        } catch {
          cleanupWarning = true
        }
      }

      if (editingPost?.id === post.id) closeEditor()
      setDeleteId(null)
      await loadPosts({ showLoading: false })
      setNotice(
        cleanupWarning
          ? 'Blog silindi; kapak dosyası depodan silinemedi.'
          : 'Blog yazısı silindi.',
      )
    } catch (error) {
      setLoadError(friendlyError(error))
    } finally {
      setDeletingId(null)
    }
  }

  const statusFor = (post) => {
    if (!post.isPublished) return { label: 'Taslak', className: 'is-draft' }
    if (post.publishedOn > todayInIstanbul()) {
      return { label: 'Planlandı', className: 'is-scheduled' }
    }
    return { label: 'Yayında', className: 'is-live' }
  }

  return (
    <>
      <div className="panel-head panel-head--row admin-blog-head">
        <div>
          <h1>Blog Yönetimi</h1>
          <p>Blog yazılarını, kapak görsellerini ve yayın durumunu yönetin.</p>
        </div>
        <button type="button" className="btn btn--primary" onClick={openNew}>
          Yeni Blog Yazısı
        </button>
      </div>

      {notice && (
        <div className="panel-card panel-note panel-note--success" role="status">
          {notice}
        </div>
      )}
      {loadError && (
        <div className="panel-card panel-note panel-note--error" role="alert">
          {loadError}
        </div>
      )}

      {editorOpen && (
        <form className="panel-card admin-blog-editor" onSubmit={savePost}>
          <div className="admin-blog-editor__head">
            <div>
              <h2>{editingPost ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}</h2>
              <p>
                {editingPost
                  ? 'Yazı ve kapak değişikliklerini yayınlamadan önce kontrol edin.'
                  : 'Yeni yazının içeriğini ve yayın durumunu oluşturun.'}
              </p>
            </div>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={closeEditor}
              disabled={saving}
            >
              Kapat
            </button>
          </div>

          <div className="admin-blog-form-grid">
            <div className="field admin-blog-span-2">
              <label htmlFor="blog-title">Başlık</label>
              <input
                id="blog-title"
                value={form.title}
                onChange={(event) => changeTitle(event.target.value)}
                maxLength="180"
                required
              />
            </div>

            <div className="field admin-blog-span-2">
              <label htmlFor="blog-slug">Bağlantı adresi</label>
              <div className="admin-blog-slug">
                <span>/blog/</span>
                <input
                  id="blog-slug"
                  value={form.slug}
                  onChange={(event) => {
                    setSlugTouched(true)
                    setField('slug', slugifyBlogTitle(event.target.value))
                  }}
                  maxLength="180"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="blog-category">Kategori</label>
              <input
                id="blog-category"
                value={form.category}
                onChange={(event) => setField('category', event.target.value)}
                maxLength="80"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="blog-author">Yazar</label>
              <input
                id="blog-author"
                value={form.author}
                onChange={(event) => setField('author', event.target.value)}
                maxLength="100"
                required
              />
            </div>

            <div className="field admin-blog-span-2">
              <label htmlFor="blog-excerpt">Özet</label>
              <textarea
                id="blog-excerpt"
                value={form.excerpt}
                onChange={(event) => setField('excerpt', event.target.value)}
                rows="3"
                maxLength="600"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="blog-date">Yayın tarihi</label>
              <input
                id="blog-date"
                type="date"
                value={form.publishedOn}
                onChange={(event) => setField('publishedOn', event.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="blog-reading-time">Okuma süresi (dakika)</label>
              <input
                id="blog-reading-time"
                type="number"
                min="1"
                max="180"
                value={form.readingTimeMinutes}
                onChange={(event) =>
                  setField('readingTimeMinutes', event.target.value)
                }
                required
              />
            </div>

            <div className="field admin-blog-span-2">
              <label>Kapak görseli</label>
              <div className="admin-blog-image">
                <div className="admin-blog-image__preview">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Blog kapak önizlemesi" />
                  ) : (
                    <span>Görsel seçilmedi</span>
                  )}
                </div>
                <div className="admin-blog-image__actions">
                  <label className="btn btn--ghost admin-blog-upload">
                    Görsel Seç
                    <input
                      type="file"
                      accept="image/avif,image/jpeg,image/png,image/webp"
                      onChange={chooseImage}
                      disabled={saving}
                      hidden
                    />
                  </label>
                  {imageFile && (
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={resetImageSelection}
                    >
                      Seçimi Geri Al
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="field">
              <label htmlFor="blog-accent">Görsel yedek rengi</label>
              <input
                id="blog-accent"
                className="admin-blog-color"
                type="color"
                value={form.accent}
                onChange={(event) => setField('accent', event.target.value)}
              />
            </div>

            <label className="admin-check admin-blog-publish">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) => setField('isPublished', event.target.checked)}
              />
              Yayında
            </label>
          </div>

          <div className="admin-blog-content">
            <div className="admin-blog-content__head">
              <h3>Yazı İçeriği</h3>
              <div className="admin-blog-content__add">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => addBlock('h')}
                >
                  Başlık Ekle
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => addBlock('p')}
                >
                  Paragraf Ekle
                </button>
              </div>
            </div>

            <div className="admin-blog-blocks">
              {form.content.map((block, index) => (
                <div
                  key={`${editingPost?.id || 'new'}-${index}`}
                  className="admin-blog-block"
                >
                  <div className="admin-blog-block__toolbar">
                    <select
                      value={block.type}
                      onChange={(event) =>
                        updateBlock(index, 'type', event.target.value)
                      }
                      aria-label={`${index + 1}. içerik bloğunun türü`}
                    >
                      <option value="p">Paragraf</option>
                      <option value="h">Başlık</option>
                    </select>
                    <span>{index + 1}</span>
                    <button
                      type="button"
                      className="admin-blog-icon-btn"
                      onClick={() => moveBlock(index, -1)}
                      disabled={index === 0}
                      aria-label="Bloğu yukarı taşı"
                      title="Yukarı taşı"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="admin-blog-icon-btn"
                      onClick={() => moveBlock(index, 1)}
                      disabled={index === form.content.length - 1}
                      aria-label="Bloğu aşağı taşı"
                      title="Aşağı taşı"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      className="admin-blog-icon-btn is-danger"
                      onClick={() => removeBlock(index)}
                      disabled={form.content.length === 1}
                      aria-label="İçerik bloğunu sil"
                      title="Bloğu sil"
                    >
                      ×
                    </button>
                  </div>
                  <textarea
                    value={block.text}
                    onChange={(event) =>
                      updateBlock(index, 'text', event.target.value)
                    }
                    rows={block.type === 'h' ? 2 : 5}
                    maxLength="10000"
                    aria-label={`${index + 1}. içerik bloğu`}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {formError && (
            <div className="panel-note panel-note--error" role="alert">
              {formError}
            </div>
          )}

          <div className="admin-blog-editor__actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={closeEditor}
              disabled={saving}
            >
              Vazgeç
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Kaydediliyor…' : 'Blogu Kaydet'}
            </button>
          </div>
        </form>
      )}

      {posts === null ? (
        <div className="panel-card panel-muted" role="status">
          Blog yazıları yükleniyor…
        </div>
      ) : posts.length === 0 && !loadError ? (
        <div className="panel-card panel-muted">
          Henüz blog yazısı oluşturulmamış.
        </div>
      ) : (
        <div className="admin-blog-list">
          {posts.map((post) => {
            const status = statusFor(post)
            return (
              <article key={post.id} className="panel-card admin-blog-row">
                <BlogCover
                  post={post}
                  className="admin-blog-row__cover"
                  showCategory={false}
                />
                <div className="admin-blog-row__main">
                  <div className="admin-blog-row__title">
                    <h2>{post.title}</h2>
                    <span className={`admin-blog-status ${status.className}`}>
                      {status.label}
                    </span>
                  </div>
                  <p>{post.excerpt}</p>
                  <span className="admin-blog-row__meta">
                    {formatDate(post.publishedOn)} · {post.category} ·{' '}
                    {post.readingTime}
                  </span>
                </div>
                <div className="admin-blog-row__actions">
                  {post.isPublished &&
                    post.publishedOn <= todayInIstanbul() && (
                    <Link
                      to={`/blog/${post.slug}`}
                      className="btn btn--ghost"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Görüntüle
                    </Link>
                    )}
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => openEdit(post)}
                  >
                    Düzenle
                  </button>
                  {deleteId === post.id ? (
                    <div className="admin-blog-delete-confirm">
                      <span>Silinsin mi?</span>
                      <button
                        type="button"
                        className="btn btn--ghost"
                        onClick={() => setDeleteId(null)}
                        disabled={deletingId === post.id}
                      >
                        Vazgeç
                      </button>
                      <button
                        type="button"
                        className="btn admin-blog-delete"
                        onClick={() => deletePost(post)}
                        disabled={deletingId === post.id}
                      >
                        {deletingId === post.id ? 'Siliniyor…' : 'Sil'}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn admin-blog-delete"
                      onClick={() => setDeleteId(post.id)}
                    >
                      Sil
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </>
  )
}
