import { Link } from 'react-router-dom'
import './CtaBand.css'

export default function CtaBand({
  title = 'Satışlarınızı büyütmeye bugün başlayın',
  text = '14 gün boyunca ücretsiz deneyin. Kurulum ücreti yok, kredi kartı gerekmez.',
  primaryLabel = 'Paketleri Gör',
  primaryTo = '/paketler',
  secondaryLabel = 'Bizimle İletişime Geç',
  secondaryTo = '/iletisim',
}) {
  return (
    <section className="cta-band">
      <div className="container cta-band__inner">
        <div className="cta-band__glow" aria-hidden="true" />
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="cta-band__actions">
          <Link to={primaryTo} className="btn btn--invert btn--lg">
            {primaryLabel}
          </Link>
          <Link to={secondaryTo} className="btn btn--outline-invert btn--lg">
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
