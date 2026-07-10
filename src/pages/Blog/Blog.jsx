import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import { posts, formatDate } from '../../data/blog.js'
import './Blog.css'

export default function Blog() {
  const [featured, ...rest] = posts

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="E-ticaret üzerine bilgi ve ipuçları"
        text="Satışlarınızı büyütmenize yardımcı olacak rehberler, güncel gelişmeler ve pratik öneriler."
      />

      <section className="section">
        <div className="container">
          {/* Öne çıkan yazı */}
          <Link
            to={`/blog/${featured.slug}`}
            className="blog-featured"
            style={{ '--accent': featured.accent }}
          >
            <div className="blog-featured__cover" aria-hidden="true">
              <span className="blog-featured__cat">{featured.category}</span>
            </div>
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
                style={{ '--accent': post.accent }}
              >
                <div className="blog-card__cover" aria-hidden="true">
                  <span className="blog-card__cat">{post.category}</span>
                </div>
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
        </div>
      </section>
    </>
  )
}
