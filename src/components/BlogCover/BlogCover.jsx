import { useEffect, useState } from 'react'
import './BlogCover.css'

export default function BlogCover({
  post,
  className = '',
  showCategory = true,
  loading = 'lazy',
}) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageUrl = post?.imageUrl || null

  useEffect(() => {
    setImageFailed(false)
  }, [imageUrl])

  return (
    <div
      className={`blog-cover ${className}`.trim()}
      style={{ '--accent': post?.accent || '#1c3444' }}
    >
      {imageUrl && !imageFailed && (
        <img
          className="blog-cover__image"
          src={imageUrl}
          alt={`${post.title} kapak görseli`}
          loading={loading}
          decoding="async"
          onError={() => setImageFailed(true)}
        />
      )}
      {showCategory && (
        <span className="blog-cover__category">{post?.category}</span>
      )}
    </div>
  )
}
