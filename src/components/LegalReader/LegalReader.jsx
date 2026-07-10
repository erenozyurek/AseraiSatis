import { useState } from 'react'
import { Link } from 'react-router-dom'
import { legal, legalOrder } from '../../data/legal.js'
import '../../pages/Legal/Legal.css'

/* Sol menü + içerik olan hukuki okuyucu.
   Menüden seçim yapıldığında içerik yerinde (sayfa değiştirmeden) güncellenir.
   Aynı hukuki metinler ayrıca /kvkk, /gizlilik … sayfalarında da mevcuttur. */

export default function LegalReader({ initialSlug = legalOrder[0] }) {
  const [slug, setSlug] = useState(initialSlug)
  const doc = legal[slug]

  return (
    <div className="legal">
      {/* Sol menü */}
      <aside className="legal__nav" aria-label="Hukuki sayfalar">
        <span className="legal__nav-title">Hukuki Sayfalar</span>
        <ul>
          {legalOrder.map((key) => (
            <li key={key}>
              <button
                type="button"
                className={`legal__nav-link ${key === slug ? 'is-active' : ''}`}
                onClick={() => setSlug(key)}
                aria-current={key === slug ? 'true' : undefined}
              >
                {legal[key].navLabel}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* İçerik */}
      <article className="legal__body">
        <h2 className="legal__doc-title">{doc.title}</h2>
        <p className="legal__updated">Son güncelleme: {doc.updated}</p>
        <p className="legal__intro">{doc.intro}</p>

        {doc.sections.map((sec) => (
          <div key={sec.heading} className="legal__section">
            <h3>{sec.heading}</h3>
            {sec.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        ))}

        <p className="legal__disclaimer">
          Bu metin bilgilendirme amaçlı bir şablondur; yürürlüğe almadan önce
          hukuk danışmanınız tarafından gözden geçirilmelidir. Sorularınız için{' '}
          <Link to="/iletisim" className="legal__inline-link">
            iletişim
          </Link>{' '}
          sayfamızdan bize ulaşabilirsiniz.
        </p>
      </article>
    </div>
  )
}
