import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import BlogCover from '../../components/BlogCover/BlogCover.jsx'
import { fetchPublishedPosts, formatDate, posts } from '../../data/blog.js'
import './Blog.css'

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState(null)

  useEffect(() => {
    let active = true

    fetchPublishedPosts()
      .then((data) => {
        if (active) setBlogPosts(data)
      })
      .catch(() => {
        if (active) setBlogPosts(posts)
      })

    return () => {
      active = false
    }
  }, [])

  const [featured, ...rest] = blogPosts || []

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

          {featured && (
            <>
              {/* Öne çıkan yazı */}
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

              {/* Diğer yazılar */}
              <div className="blog-grid">
                {rest.map((post) => (
                  <Link
                    key={post.slug}
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
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
