import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import BlogCover from '../../components/BlogCover/BlogCover.jsx'
import {
  fetchPublishedPost,
  fetchRelatedPosts,
  formatDate,
} from '../../data/blog.js'
import './BlogDetail.css'

export default function BlogDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    setPost(null)
    setRelated([])

    Promise.all([fetchPublishedPost(slug), fetchRelatedPosts(slug)])
      .then(([nextPost, nextRelated]) => {
        if (!active) return
        setPost(nextPost)
        setRelated(nextPost ? nextRelated : [])
      })
      .catch(() => {
        if (!active) return
        setPost(null)
        setRelated([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [slug])

  if (loading) {
    return (
      <PageHeader
        eyebrow="Blog"
        title="Yazı yükleniyor…"
        text="Blog içeriği hazırlanıyor."
      />
    )
  }

  if (!post) {
    return (
      <PageHeader
        eyebrow="Blog"
        title="Yazı bulunamadı"
        text="Aradığınız blog yazısı mevcut değil. Tüm yazılara göz atabilirsiniz."
      />
    )
  }

  return (
    <>
      <PageHeader eyebrow={post.category} title={post.title} text={post.excerpt} />

      <article className="section">
        <div className="container blog-post">
          <BlogCover
            post={post}
            className="blog-post__cover"
            showCategory={false}
            loading="eager"
          />

          <div className="blog-post__meta">
            <Link to="/blog" className="blog-post__back">
              <span aria-hidden="true">←</span> Tüm yazılar
            </Link>
            <span>
              {formatDate(post.date)} · {post.readingTime} okuma ·{' '}
              {post.author}
            </span>
          </div>

          <div className="blog-post__body">
            {post.content.map((block, i) =>
              block.type === 'h' ? (
                <h2 key={i}>{block.text}</h2>
              ) : (
                <p key={i}>{block.text}</p>
              ),
            )}
          </div>
        </div>
      </article>

      {/* İlgili yazılar */}
      {related.length > 0 && (
        <section className="section section--soft">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Devamı</span>
              <h2>İlgili yazılar</h2>
            </div>
            <div className="blog-related">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  className="blog-related__card"
                >
                  <BlogCover
                    post={p}
                    className="blog-related__cover"
                    showCategory={false}
                  />
                  <div className="blog-related__body">
                    <span className="blog-related__cat">{p.category}</span>
                    <h3>{p.title}</h3>
                    <span className="blog-related__meta">
                      {formatDate(p.date)} · {p.readingTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title="Mağazanızı Aserai ile büyütmeye hazır mısınız?"
        text="Ücretsiz demo talep edin, işletmenize en uygun çözümü birlikte belirleyelim."
        primaryLabel="Demo Talep Et"
        primaryTo="/demo"
        secondaryLabel="Paketleri İncele"
        secondaryTo="/paketler"
      />
    </>
  )
}
