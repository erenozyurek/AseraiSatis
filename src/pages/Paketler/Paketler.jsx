import Icon from '../../components/Icon/Icon.jsx'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import PricingPlans from '../../components/PricingPlans/PricingPlans.jsx'
import Faq from '../../components/Faq/Faq.jsx'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import './Paketler.css'

const included = [
  {
    title: 'SSL & Güvenlik',
    desc: 'Ücretsiz SSL sertifikası ve PCI-DSS uyumlu altyapı.',
    iconPath: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  },
  {
    title: 'Mobil Uyumlu Panel',
    desc: 'Yönetim panelini telefon ve tabletten de kullanın.',
    iconPath: 'M7 3h10v18H7zM11 18h2',
  },
  {
    title: 'Ücretsiz Güncellemeler',
    desc: 'Tüm yeni özellikler ek ücret olmadan hesabınıza gelir.',
    iconPath: 'M4 12a8 8 0 0114-5M20 12a8 8 0 01-14 5M17 4v3h-3M7 20v-3h3',
  },
  {
    title: 'Otomatik Yedekleme',
    desc: 'Verileriniz her gün otomatik olarak yedeklenir.',
    iconPath: 'M4 7c0-2 4-3 8-3s8 1 8 3-4 3-8 3-8-1-8-3zM4 7v10c0 2 4 3 8 3s8-1 8-3V7M4 12c0 2 4 3 8 3s8-1 8-3',
  },
  {
    title: 'KVKK Uyumu',
    desc: 'Kişisel veri yönetimi mevzuata uygun şekilde sağlanır.',
    iconPath: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM12 9v3M12 15h.01',
  },
  {
    title: 'Türkçe Destek',
    desc: 'Uzman destek ekibi her adımda Türkçe yardım sağlar.',
    iconPath: 'M21 15a2 2 0 01-2 2H8l-4 4V5a2 2 0 012-2h13a2 2 0 012 2z',
  },
]

const faq = [
  {
    q: 'Hangi paket işletmeme uygun?',
    a: 'Yeni başlıyorsanız Başlangıç, büyüyen bir KOBİ iseniz Standart, yüksek hacimli operasyonlar için Profesyonel, yurt dışına satış için ise E-İhracat paketini öneririz. Emin değilseniz ücretsiz danışmanlık alabilirsiniz.',
  },
  {
    q: 'Yıllık ödeme ne kadar avantaj sağlıyor?',
    a: 'Yıllık ödemede pakete göre %20 ile %25 arasında indirim uygulanır; aylık maliyetiniz belirgin şekilde düşer ve fiyatınız bir yıl sabit kalır.',
  },
  {
    q: 'Paketler arasında geçiş yapabilir miyim?',
    a: 'İstediğiniz an üst pakete yükseltebilirsiniz. Fark tutarı kalan döneme orantılı hesaplanır, veri kaybı yaşanmaz.',
  },
  {
    q: 'Fiyatlara KDV dahil mi?',
    a: 'Belirtilen tüm fiyatlar KDV hariçtir. Fatura tutarına yürürlükteki KDV oranı eklenir.',
  },
  {
    q: 'Ücretsiz deneme sürümü var mı?',
    a: 'Evet. Tüm paketleri 14 gün boyunca ücretsiz deneyebilirsiniz; deneme için kredi kartı bilgisi gerekmez.',
  },
  {
    q: 'İptal etmek istersem ne olur?',
    a: 'Aboneliğinizi istediğiniz an iptal edebilirsiniz. Dönem sonuna kadar hizmetiniz açık kalır, ek bir ücret alınmaz.',
  },
]

export default function Paketler() {
  return (
    <>
      {/* ---------- BAŞLIK ---------- */}
      <PageHeader
        eyebrow="Paketler & Fiyatlandırma"
        title="İşletmenize uygun paketi seçin"
        text="Aserai’yi, Iberai’yi ya da ikisini birden kapsayan avantajlı paketi seçin. Aylık veya yıllık ödeyin — yıllık planlarda aya düşen maliyetiniz belirgin şekilde azalır."
      />

      {/* ---------- FİYAT TABLOSU ---------- */}
      <section className="section pak-plans">
        <div className="container">
          <PricingPlans productKeys={['aserai']} showTabs={false} />
        </div>
      </section>

      {/* ---------- HER PAKETTE DAHİL ---------- */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Her pakette dahil</span>
            <h2>Hangi paketi seçerseniz seçin yanınızdayız</h2>
            <p>
              Tüm Aserai ve Iberai paketleri bu temel hizmetleri ek ücret
              olmadan içerir.
            </p>
          </div>
          <div className="pak-included">
            {included.map((it) => (
              <article key={it.title} className="pak-included__card">
                <span className="pak-included__icon">
                  <Icon path={it.iconPath} />
                </span>
                <div>
                  <h3>{it.title}</h3>
                  <p>{it.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- SSS ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">SSS</span>
            <h2>Fiyatlandırma hakkında sık sorulanlar</h2>
          </div>
          <Faq items={faq} />
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <CtaBand
        title="Hangi paketin size uygun olduğundan emin değil misiniz?"
        text="Uzman ekibimiz işletmenize en uygun paketi birlikte belirlesin."
        primaryLabel="Ücretsiz Danışmanlık Al"
        primaryTo="/iletisim"
        secondaryLabel="Demo Talep Et"
        secondaryTo="/demo"
      />
    </>
  )
}
