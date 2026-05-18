import './PageHeader.css'

export default function PageHeader({ eyebrow, title, text }) {
  return (
    <section className="page-head">
      <div className="page-head__glow" aria-hidden="true" />
      <div className="page-head__inner">
        {eyebrow && (
          <span className="eyebrow eyebrow--invert">{eyebrow}</span>
        )}
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </section>
  )
}
