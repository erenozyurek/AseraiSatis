import { NavLink } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import { legal, legalOrder } from '../../data/legal.js'
import './Legal.css'

export default function Legal({ slug }) {
  const doc = legal[slug]

  if (!doc) {
    return (
      <PageHeader
        eyebrow="Hukuki"
        title="Sayfa bulunamadı"
        text="Aradığınız hukuki metin mevcut değil."
      />
    )
  }

  return (
    <>
      <PageHeader eyebrow="Hukuki" title={doc.title} text={doc.intro} />

      <section className="section">
        <div className="container legal">
          {/* Sol menü */}
          <aside className="legal__nav" aria-label="Hukuki sayfalar">
            <span className="legal__nav-title">Hukuki Sayfalar</span>
            <ul>
              {legalOrder.map((key) => (
                <li key={key}>
                  <NavLink
                    to={`/${key}`}
                    className={({ isActive }) =>
                      `legal__nav-link ${isActive ? 'is-active' : ''}`
                    }
                  >
                    {legal[key].navLabel}
                  </NavLink>
                </li>
              ))}
            </ul>
          </aside>

          {/* İçerik */}
          <article className="legal__body">
            <p className="legal__updated">Son güncelleme: {doc.updated}</p>

            {doc.sections.map((sec) => (
              <div key={sec.heading} className="legal__section">
                <h2>{sec.heading}</h2>
                {sec.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ))}

            <p className="legal__disclaimer">
              Bu metin bilgilendirme amaçlı bir şablondur; yürürlüğe almadan önce
              hukuk danışmanınız tarafından gözden geçirilmelidir. Sorularınız
              için{' '}
              <NavLink to="/iletisim" className="legal__inline-link">
                iletişim
              </NavLink>{' '}
              sayfamızdan bize ulaşabilirsiniz.
            </p>
          </article>
        </div>
      </section>
    </>
  )
}
