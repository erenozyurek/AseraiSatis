import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import './Moduller.css'

const Icon = ({ path }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
    <path
      d={path}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const modules = [
  {
    title: 'E-Fatura & E-Arşiv',
    desc: 'Faturalarınızı otomatik oluşturun, GİB entegrasyonuyla e-fatura ve e-arşiv süreçlerini tek tıkla yönetin.',
    iconPath: 'M6 3h9l3 3v15H6zM14 3v4h4M9 12h6M9 16h6',
  },
  {
    title: 'Kargo Takip & Entegrasyon',
    desc: 'Anlaşmalı kargo firmalarını bağlayın; gönderi oluşturun, takip numarasını ve durumunu otomatik güncelleyin.',
    iconPath: 'M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10',
  },
  {
    title: 'Pazaryeri Entegrasyonu',
    desc: 'Trendyol, Hepsiburada, Amazon ve daha fazlasını tek panelden yönetin; ürün, stok ve siparişleri senkronize edin.',
    iconPath: 'M4 7h16M4 12h16M4 17h16M8 3v18M16 3v18',
  },
  {
    title: 'Muhasebe Entegrasyonu',
    desc: 'Satış, fatura ve tahsilat verilerinizi muhasebe programınıza otomatik aktarın, mutabakatı kolaylaştırın.',
    iconPath: 'M6 3h12v18H6zM9 7h6M9 11h6M9 15h3',
  },
  {
    title: 'Sanal POS & Ödeme',
    desc: 'Tüm sanal POS sağlayıcılarıyla tam uyum, taksit seçenekleri ve PCI-DSS uyumlu güvenli ödeme altyapısı.',
    iconPath: 'M3 6h18v12H3zM3 10h18M7 15h4',
  },
  {
    title: 'BuyBox Rekabet Analizi',
    desc: 'Pazaryerlerinde rakip fiyatlarını izleyin, BuyBox kazanma oranınızı artıracak akıllı fiyatlandırma yapın.',
    iconPath: 'M5 19V10M10 19V5M15 19v-7M20 19v-4M3 21h18',
  },
  {
    title: 'Stok & Depo Yönetimi',
    desc: 'Çoklu depo desteğiyle stokları tek yerden yönetin; kritik stok uyarıları ve otomatik senkron alın.',
    iconPath: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
  },
  {
    title: 'Toplu Ürün Yükleme',
    desc: 'Binlerce ürünü Excel veya pazaryerlerinden tek tıkla toplu yükleyin; görsel ve açıklamaları hızlıca düzenleyin.',
    iconPath: 'M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2',
  },
  {
    title: 'Sipariş Yönetimi',
    desc: 'Tüm kanallardan gelen siparişleri tek ekrandan görün; durum güncellemelerini ve iadeleri kolayca yönetin.',
    iconPath: 'M9 3h6a1 1 0 011 1v1h2v16H6V5h2V4a1 1 0 011-1zM9 11l1.5 1.5L14 9',
  },
  {
    title: 'B2B Modülü',
    desc: 'Bayi ve toptan müşterileriniz için özel fiyat listeleri, cari hesap ve sipariş akışı oluşturun.',
    iconPath: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 11h.01M15 11h.01',
  },
  {
    title: 'E-İhracat',
    desc: 'Sınırsız dil ve para birimiyle satış yapın; gümrük ve uluslararası kargo süreçlerini kolaylaştırın.',
    iconPath: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 3.8 6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-6-3.8-9s1.3-6.5 3.8-9z',
  },
  {
    title: 'CRM & Müşteri Yönetimi',
    desc: 'Müşteri segmentleri oluşturun, satın alma geçmişini takip edin ve kişiye özel iletişim kurun.',
    iconPath: 'M16 20a4 4 0 00-8 0M12 12a4 4 0 100-8 4 4 0 000 8M20 20a3 3 0 00-4-2.8M4 20a3 3 0 014-2.8',
  },
  {
    title: 'Kampanya & Kupon Yönetimi',
    desc: 'İndirim kuponları, sepet kampanyaları ve otomatik promosyon kurallarıyla dönüşümü artırın.',
    iconPath: 'M20 12l-8 8-9-9V4h7l10 10-1 1zM7.5 7.5h.01M9 15l6-6',
  },
  {
    title: 'Raporlama & Analitik',
    desc: 'Ciro, dönüşüm ve kanal performansını canlı grafiklerle izleyin; veriye dayalı kararlar alın.',
    iconPath: 'M4 4v16h16M8 16v-4M12 16V8M16 16v-6',
  },
  {
    title: 'Çoklu Dil & Çoklu Döviz',
    desc: 'Mağazanızı birden fazla dil ve para biriminde yayınlayarak global müşterilere ulaşın.',
    iconPath: 'M3 5h12M9 3v2m1.5 0c0 5-3 9-6.5 11M5 9c0 3 2.5 5.5 6 6.5M14 20l4-9 4 9M15.5 17h5',
  },
]

export default function Moduller() {
  return (
    <>
      <PageHeader
        eyebrow="Modüller"
        title="İşletmenizi büyüten modüller"
        text="E-ticaret operasyonunuzun her adımı için hazır entegrasyon ve modüller. İhtiyacınız olanları etkinleştirin, tek panelden yönetin."
      />

      <section className="section">
        <div className="container">
          <div className="mod-grid">
            {modules.map((m) => (
              <article key={m.title} className="mod-card">
                <span className="mod-card__icon" aria-hidden="true">
                  <Icon path={m.iconPath} />
                </span>
                <h3>{m.title}</h3>
                <p>{m.desc}</p>
              </article>
            ))}
          </div>

          <p className="mod-note">
            Aradığınız modülü bulamadınız mı?{' '}
            <Link to="/iletisim" className="text-link">
              Bizimle iletişime geçin
              <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      <CtaBand
        title="İhtiyacınız olan modülleri tek panelde toplayın"
        text="Aserai ve Iberai ile mağazanızı, entegrasyonlarınızı ve tüm operasyonunuzu tek yerden yönetin."
      />
    </>
  )
}
