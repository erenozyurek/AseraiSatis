import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import BlogCover from '../../components/BlogCover/BlogCover.jsx'
import BlogWriter from '../../components/BlogWriter/BlogWriter.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useEditMode } from '../../context/EditModeContext.jsx'
import {
  fetchPublishedPosts,
  formatDate,
  posts,
  todayInIstanbul,
} from '../../data/blog.js'
import './Blog.css'

export default function Blog() {
  const navigate = useNavigate()
  const [blogPosts, setBlogPosts] = useState(null)
  const [writerOpen, setWriterOpen] = useState(false)
  const { isAdmin } = useAuth()
  const { editMode } = useEditMode()
  const canManageBlog = editMode && isAdmin

  const loadPosts = useCallback(async ({ showLoading = false } = {}) => {
    if (showLoading) setBlogPosts(null)

    try {
      const data = await fetchPublishedPosts()
      setBlogPosts(data)
    } catch {
      setBlogPosts(posts)
    }
  }, [])

  useEffect(() => {
    loadPosts({ showLoading: true })
  }, [loadPosts])

  const [featured, ...rest] = blogPosts || []

  const openNewPost = () => {
    setWriterOpen(true)
  }

  const openEditPost = (post, event) => {
    event.preventDefault()
    event.stopPropagation()
    navigate(`/blog/${post.slug}?duzenle=1`)
  }

  const handleWriterSaved = (savedPost) => {
    setWriterOpen(false)
    loadPosts()
    if (savedPost.isPublished && savedPost.publishedOn <= todayInIstanbul()) {
      navigate(`/blog/${savedPost.slug}`)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="E-ticaret üzerine bilgi ve ipuçları"
        text="Satışlarınızı büyütmenize yardımcı olacak rehberler, güncel gelişmeler ve pratik öneriler."
      />

      <section className="section">
        <div className="container">
          {blogPosts === null && (
            <div className="blog-state" role="status" aria-live="polite">
              Yazılar yükleniyor…
            </div>
          )}

          {blogPosts?.length === 0 && (
            <div className="blog-state">
              Henüz yayınlanmış bir blog yazısı bulunmuyor.
            </div>
          )}

          {canManageBlog && (
            <div className="blog-adminbar">
              <div>
                <span className="eyebrow">Blog düzenleme</span>
                <h2>Yazıları arayüzden yönetin</h2>
              </div>
              <button
                type="button"
                className="blog-adminbar__add"
                onClick={openNewPost}
                aria-label="Yeni blog yazısı ekle"
              >
                +
              </button>
            </div>
          )}

          {canManageBlog && writerOpen && (
            <BlogWriter
              post={null}
              onCancel={() => setWriterOpen(false)}
              onSaved={handleWriterSaved}
            />
          )}

          {featured && (
            <>
              {/* Öne çıkan yazı */}
              <div className="blog-featured-shell">
                <Link
                  to={`/blog/${featured.slug}`}
                  className="blog-featured"
                >
                  <BlogCover
                    post={featured}
                    className="blog-featured__cover"
                    loading="eager"
                  />
                  <div className="blog-featured__body">
                    <span className="blog-card__meta">
                      {formatDate(featured.date)} · {featured.readingTime} okuma
                    </span>
                    <h2>{featured.title}</h2>
                    <p>{featured.excerpt}</p>
                    <span className="blog-featured__link">
                      Yazıyı oku <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
                {canManageBlog && (
                  <button
                    type="button"
                    className="blog-card__edit blog-card__edit--featured"
                    onClick={(event) => openEditPost(featured, event)}
                  >
                    Düzenle
                  </button>
                )}
              </div>

              {/* Diğer yazılar */}
              <div className="blog-grid">
                {rest.map((post) => (
                  <article key={post.slug} className="blog-card-shell">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="blog-card"
                    >
                      <BlogCover post={post} className="blog-card__cover" />
                      <div className="blog-card__body">
                        <span className="blog-card__meta">
                          {formatDate(post.date)} · {post.readingTime}
                        </span>
                        <h3>{post.title}</h3>
                        <p>{post.excerpt}</p>
                      </div>
                    </Link>
                    {canManageBlog && (
                      <button
                        type="button"
                        className="blog-card__edit"
                        onClick={(event) => openEditPost(post, event)}
                      >
                        Düzenle
                      </button>
                    )}
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
