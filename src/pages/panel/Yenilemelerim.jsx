import { Link } from 'react-router-dom'
import './panel.css'

export default function Yenilemelerim() {
  return (
    <>
      <div className="panel-head">
        <h1>Yenilemelerim</h1>
        <p>Lisans yenileme işlemleri geçici olarak pasif durumda.</p>
      </div>

      <div className="panel-card panel-empty">
        <p>
          Bu bölüm şimdilik kapalı. Lisans durumlarınızı görüntülemek ve modül
          ekleme işlemlerini yönetmek için Lisanslarım sayfasını kullanabilirsiniz.
        </p>
        <Link to="/panel/lisanslarim" className="btn btn--primary">
          Lisanslarıma Git
        </Link>
      </div>
    </>
  )
}
