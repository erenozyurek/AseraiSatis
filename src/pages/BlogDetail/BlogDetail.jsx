import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import BlogCover from '../../components/BlogCover/BlogCover.jsx'
import BlogWriter from '../../components/BlogWriter/BlogWriter.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useEditMode } from '../../context/EditModeContext.jsx'
import {
  fetchPublishedPost,
  fetchRelatedPosts,
  formatDate,
  todayInIstanbul,
} from '../../data/blog.js'
import { richHtmlToPlainText, sanitizeRichHtml } from '../../lib/blogRichText.js'
import './BlogDetail.css'

const READ_MORE_CHAR_LIMIT = 2200
const READ_MORE_BLOCK_LIMIT = 8

const bulletPattern = /^\s*(?:[-*•●▪–—])\s+(.+)$/
const numberedPattern = /^\s*(\d+)[.)]\s+(.+)$/
const safeFonts = new Set([
  'Inter, system-ui, sans-serif',
  'var(--font-display)',
  'Georgia, "Times New Roman", serif',
  'SFMono-Regular, Consolas, monospace',
])

const splitTextLines = (text) =>
  String(text || '')
    .replace(/\r\n/g, '\n')
    .split('\n')

const stripListMarker = (line) => {
  const trimmed = line.trim()
  const numberedMatch = trimmed.match(numberedPattern)
  if (numberedMatch) return numberedMatch[2].trim()
  const bulletMatch = trimmed.match(bulletPattern)
  if (bulletMatch) return bulletMatch[1].trim()
  return trimmed
}

const blockStyleToCss = (style = {}) => {
  const fontSize = Number(style.fontSize)

  return {
    color: /^#[0-9a-f]{6}$/i.test(style.color || '') ? style.color : undefined,
    fontFamily: safeFonts.has(style.fontFamily) ? style.fontFamily : undefined,
    fontSize:
      Number.isFinite(fontSize) && fontSize >= 12 && fontSize <= 56
        ? `${fontSize}px`
        : undefined,
    fontWeight: style.bold ? 800 : undefined,
    fontStyle: style.italic ? 'italic' : undefined,
    textDecoration: style.underline ? 'underline' : undefined,
    textAlign: ['left', 'center', 'right', 'justify'].includes(style.align)
      ? style.align
      : undefined,
  }
}

const getListType = (style = {}) => {
  if (style.list === 'bullet') return 'ul'
  if (style.list === 'number') return 'ol'
  return null
}

const splitParagraphSegments = (text, explicitListType) => {
  if (explicitListType) {
    const items = splitTextLines(text).map(stripListMarker).filter(Boolean)
    return items.length ? [{ type: explicitListType, items }] : []
  }

  const segments = []
  let paragraphLines = []
  let listItems = []
  let listType = 'ul'

  const flushParagraph = () => {
    const lines = paragraphLines.map((line) => line.trim()).filter(Boolean)
    if (lines.length) {
      segments.push({ type: 'paragraph', lines })
    }
    paragraphLines = []
  }

  const flushList = () => {
    if (listItems.length) {
      segments.push({ type: listType, items: listItems })
    }
    listItems = []
  }

  splitTextLines(text).forEach((line) => {
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
      listItems.push((numberedMatch?.[2] || bulletMatch?.[1] || '').trim())
      return
    }

    flushList()
    paragraphLines.push(trimmed)
  })

  flushParagraph()
  flushList()

  return segments
}

function RichParagraph({ text, blockIndex, style }) {
  const cssStyle = blockStyleToCss(style)
  const segments = splitParagraphSegments(text, getListType(style))

  return segments.map((segment, segmentIndex) => {
    const key = `${blockIndex}-${segmentIndex}`

    if (segment.type === 'ul' || segment.type === 'ol') {
      const ListTag = segment.type
      return (
        <ListTag key={key} className="blog-post__list" style={cssStyle}>
          {segment.items.map((item, itemIndex) => (
            <li key={`${key}-${itemIndex}`}>{item}</li>
          ))}
        </ListTag>
      )
    }

    return (
      <p key={key} className="blog-post__paragraph" style={cssStyle}>
        {segment.lines.map((line, lineIndex) => (
          <span key={`${key}-${lineIndex}`}>
            {line}
            {lineIndex < segment.lines.length - 1 && <br />}
          </span>
        ))}
      </p>
    )
  })
}

function ContentBlock({ block, index }) {
  if (block.html) {
    return (
      <div
        className="blog-post__block blog-post__rich"
        dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(block.html) }}
      />
    )
  }

  const lines = splitTextLines(block.text).map((line) => line.trim()).filter(Boolean)
  const cssStyle = blockStyleToCss(block.style)

  if (block.type === 'h') {
    return (
      <div className="blog-post__block blog-post__block--heading">
        {lines.map((line, lineIndex) => (
          <h2 key={`${index}-${lineIndex}`} style={cssStyle}>{line}</h2>
        ))}
      </div>
    )
  }

  return (
    <div className="blog-post__block blog-post__block--paragraph">
      <RichParagraph text={block.text} blockIndex={index} style={block.style} />
    </div>
  )
}

export default function BlogDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [post, setPost] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [contentExpanded, setContentExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const { isAdmin } = useAuth()
  const { editMode } = useEditMode()
  const canManageBlog = editMode && isAdmin
  const editRequested = searchParams.get('duzenle') === '1'

  useEffect(() => {
    let active = true
    setLoading(true)
    setPost(null)
    setRelated([])
    setContentExpanded(false)
    setEditing(false)

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

  useEffect(() => {
    if (editRequested && canManageBlog && post && !editing) {
      setContentExpanded(true)
      setEditing(true)
    }
  }, [editRequested, canManageBlog, post, editing])

  const openWriter = () => {
    setContentExpanded(true)
    setEditing(true)
  }

  const closeWriter = () => {
    setEditing(false)
    if (editRequested) navigate(`/blog/${slug}`, { replace: true })
  }

  const handleWriterSaved = (savedPost) => {
    setEditing(false)

    if (!savedPost.isPublished || savedPost.publishedOn > todayInIstanbul()) {
      navigate('/blog', { replace: true })
      return
    }

    setPost(savedPost)
    setContentExpanded(true)
    if (savedPost.slug !== slug) {
      navigate(`/blog/${savedPost.slug}`, { replace: true })
    } else if (editRequested) {
      navigate(`/blog/${savedPost.slug}`, { replace: true })
    }
  }

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

  const contentLength = post.contentHtml
    ? richHtmlToPlainText(post.contentHtml).length
    : post.content.reduce(
        (total, block) => total + String(block.text || '').length,
        0,
      )
  const shouldCollapse =
    (post.contentHtml ? false : post.content.length > READ_MORE_BLOCK_LIMIT) ||
    contentLength > READ_MORE_CHAR_LIMIT
  const collapsed = shouldCollapse && !contentExpanded

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
            {canManageBlog && (
              <button
                type="button"
                className="btn btn--ghost blog-post__edit"
                onClick={openWriter}
              >
                {editing ? 'Düzenleniyor' : 'Yazıyı düzenle'}
              </button>
            )}
            <span>
              {formatDate(post.date)} · {post.readingTime} okuma ·{' '}
              {post.author}
            </span>
          </div>

          {editing ? (
            <BlogWriter
              post={post}
              onCancel={closeWriter}
              onSaved={handleWriterSaved}
            />
          ) : (
            <div
              className={`blog-post__body ${collapsed ? 'is-collapsed' : ''}`}
              aria-expanded={shouldCollapse ? contentExpanded : undefined}
            >
              {post.contentHtml ? (
                <div
                  className="blog-post__rich"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeRichHtml(post.contentHtml),
                  }}
                />
              ) : (
                post.content.map((block, i) => (
                  <ContentBlock key={i} block={block} index={i} />
                ))
              )}
            </div>
          )}

          {!editing && shouldCollapse && (
            <div className="blog-post__readmore">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setContentExpanded((current) => !current)}
                aria-expanded={contentExpanded}
              >
                {contentExpanded ? 'Daha az göster' : 'Devamını oku'}
              </button>
            </div>
          )}
        </div>
      </article>

      {/* İlgili yazılar */}
      {!editing && related.length > 0 && (
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
