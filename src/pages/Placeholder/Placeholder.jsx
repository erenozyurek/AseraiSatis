import { Link } from 'react-router-dom'
import './Placeholder.css'

export default function Placeholder({ title, stage }) {
  return (
    <section className="placeholder">
      <div className="container placeholder__inner">
        <span className="placeholder__badge">{stage}</span>
        <h1>{title}</h1>
        <p>
          Bu sayfa pipeline'ın bir sonraki aşamasında tasarlanacak. Şu an
          Aşama&nbsp;1 (anasayfa, tasarım sistemi ve ortak bileşenler)
          tamamlandı.
        </p>
        <Link to="/" className="btn btn--primary btn--lg">
          Anasayfaya dön
        </Link>
      </div>
    </section>
  )
}
