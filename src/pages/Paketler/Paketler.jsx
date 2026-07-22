import Icon from '../../components/Icon/Icon.jsx'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import ComparisonTable from '../../components/ComparisonTable/ComparisonTable.jsx'
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
    a: 'Yeni satışa başlayacak markalar için Başlangıç, düzenli sipariş alan ve pazaryeri bağlantılarına ihtiyaç duyan işletmeler için Standart, yüksek ürün ve sipariş hacmi yöneten ekipler için Profesyonel, yurt dışına satış hedefleyen markalar için E-İhracat paketi daha uygundur. Emin değilseniz işletmenizin kanal, ürün ve sipariş yapısına göre birlikte değerlendirebiliriz.',
  },
  {
    q: 'Yıllık ödeme ne kadar avantaj sağlıyor?',
    a: 'Yıllık ödemede pakete göre avantajlı fiyat uygulanır. Paket kartlarında hem aylık kullanım bedelini hem de yıllık toplam tutarı görebilirsiniz. Yıllık ödeme seçildiğinde fiyatınız ilgili dönem boyunca sabit kalır ve aylık maliyetiniz düşer.',
  },
  {
    q: 'Paketler arasında geçiş yapabilir miyim?',
    a: 'Evet. İşletmeniz büyüdükçe üst pakete geçebilirsiniz. Geçiş sırasında mağaza, ürün, sipariş ve müşteri verileriniz korunur. Fark tutarı kalan kullanım dönemine göre hesaplanır.',
  },
  {
    q: 'Alt pakete geçiş yapabilir miyim?',
    a: 'Alt pakete geçiş talepleri mevcut kullanımınız ve aktif özellikleriniz kontrol edilerek değerlendirilir. Kullandığınız ürün limiti, entegrasyonlar veya modüller alt paket sınırlarını aşıyorsa önce bu alanların düzenlenmesi gerekir.',
  },
  {
    q: 'Paketlere sonradan modül ekleyebilir miyim?',
    a: 'Evet. İhtiyacınıza göre e-fatura, pazaryeri entegrasyonu, kargo, CRM, kampanya, raporlama ve benzeri modüller sonradan eklenebilir. Modüller sayfasında ihtiyacınız olan modülü bulamazsanız talep formu üzerinden özel ihtiyaçlarınızı iletebilirsiniz.',
  },
  {
    q: 'Modüller paket fiyatına dahil mi?',
    a: 'Her pakette temel kullanım özellikleri bulunur. Bazı gelişmiş modüller pakete dahil olabilir, bazıları ise ek ücretli olarak etkinleştirilir. Paket karşılaştırma alanında hangi özelliklerin hangi pakette bulunduğunu kontrol edebilirsiniz.',
  },
  {
    q: 'Kurulum süreci nasıl ilerliyor?',
    a: 'Paket seçimi sonrasında hesap kurulumu, temel mağaza ayarları, ödeme, kargo ve ihtiyaç duyulan entegrasyonlar adım adım hazırlanır. Gerekli bilgiler alındıktan sonra ekibimiz kurulum sürecinde sizi yönlendirir.',
  },
  {
    q: 'Mevcut e-ticaret sitemden geçiş yapabilir miyim?',
    a: 'Evet. Ürün, kategori, müşteri ve sipariş yapınız incelenerek geçiş planı hazırlanabilir. Veri aktarımı yapılacak kaynağa göre süreç ve kapsam değişebilir; bu nedenle geçiş öncesinde teknik değerlendirme yapılır.',
  },
  {
    q: 'Pazaryeri ve kargo entegrasyonları destekleniyor mu?',
    a: 'Aserai, e-ticaret operasyonunuzda pazaryeri, kargo, ödeme, muhasebe ve ERP bağlantılarını tek panelden yönetmeye odaklanır. Kullanılacak kanal ve servisler paketiniz ve aktif modülleriniz doğrultusunda belirlenir.',
  },
  {
    q: 'B2B veya bayi satış modeli için hangi paket uygun?',
    a: 'Bayi, toptan satış veya kurumsal müşteri yönetimi olan yapılarda B2B ihtiyaçları ayrıca değerlendirilir. Aserai B2B E-Ticaret yaklaşımıyla fiyat listesi, cari yapı, müşteri grubu ve özel sipariş akışları planlanabilir.',
  },
  {
    q: 'E-İhracat paketi kimler için uygundur?',
    a: 'Yurt dışına satış yapmak, çoklu dil ve döviz yapısını yönetmek, uluslararası kargo ve ödeme süreçlerini planlamak isteyen işletmeler için E-İhracat paketi uygundur. Hedef pazar ve operasyon modeline göre ek entegrasyon ihtiyacı ayrıca değerlendirilir.',
  },
  {
    q: 'Fiyatlara KDV dahil mi?',
    a: 'Belirtilen fiyatlar KDV hariçtir. Satın alma veya teklif sürecinde yürürlükteki KDV oranı fatura tutarına eklenir.',
  },
  {
    q: 'Ücretsiz deneme sürümü var mı?',
    a: 'Demo talep ederek paketi ve panel deneyimini inceleyebilirsiniz. Demo sürecinde işletmenizin ihtiyaçlarına göre uygun paket ve modül önerileri de paylaşılır.',
  },
  {
    q: 'Destek hizmeti paketlere dahil mi?',
    a: 'Evet. Tüm paketlerde Türkçe destek bulunur. Destek kapsamı; temel kullanım soruları, kurulum yönlendirmeleri, panel kullanımı ve sistem üzerindeki işlem adımlarını kapsar. Özel geliştirme ve ileri entegrasyon ihtiyaçları ayrıca planlanır.',
  },
  {
    q: 'Özel geliştirme veya ek özellik talep edebilir miyim?',
    a: 'Evet. Standart paketlerde yer almayan özel modül, entegrasyon veya iş akışı ihtiyaçlarınız için talep oluşturabilirsiniz. Ekibimiz talebin kapsamını inceleyerek size uygun çözüm ve zaman planı paylaşır.',
  },
  {
    q: 'Paket satın aldıktan sonra fiyat değişirse etkilenir miyim?',
    a: 'Aktif ödeme döneminiz boyunca seçtiğiniz paket koşulları korunur. Yenileme dönemlerinde güncel fiyatlandırma ve kampanya koşulları geçerli olabilir.',
  },
  {
    q: 'İptal etmek istersem ne olur?',
    a: 'Aboneliğinizi iptal etmek isterseniz talebiniz dönem ve sözleşme koşullarına göre değerlendirilir. Aktif hizmetiniz dönem sonuna kadar açık kalabilir; veri ve erişim süreçleri iptal planına göre yönetilir.',
  },
  {
    q: 'Teklif almadan doğrudan paket seçebilir miyim?',
    a: 'Evet. Paketleri karşılaştırarak size uygun planı seçebilirsiniz. Ancak modül, entegrasyon, B2B veya e-ihracat ihtiyacınız varsa teklif formu üzerinden bilgi paylaşmanız daha doğru paket önerisi almanızı sağlar.',
  },
]

export default function Paketler() {
  return (
    <>
      {/* ---------- BAŞLIK ---------- */}
      <PageHeader
        eyebrow="Paketler & Fiyatlandırma"
        title="İşletmenize uygun paketi seçin"
        text="İşletmenize en uygun Aserai paketini seçin. Aylık veya yıllık ödeyin — yıllık planlarda aya düşen maliyetiniz belirgin şekilde azalır."
      />

      {/* ---------- PAKETLER & KARŞILAŞTIRMA (tek tablo) ---------- */}
      <section className="section pak-plans">
        <div className="container">
          <ComparisonTable />
        </div>
      </section>

      {/* ---------- HER PAKETTE DAHİL ---------- */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Her pakette dahil</span>
            <h2>Hangi paketi seçerseniz seçin yanınızdayız</h2>
            <p>
              Tüm Aserai paketleri bu temel hizmetleri ek ücret
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
