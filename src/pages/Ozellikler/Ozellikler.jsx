import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import './Ozellikler.css'

const Icon = ({ path }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
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

const categories = [
  {
    title: 'Yapay Zeka & Otomasyon',
    desc: 'Yapay zeka destekli araçlarla içerik, öneri ve fiyatlandırma süreçlerinizi otomatikleştirin.',
    items: [
      {
        t: 'AI Otomatik İçerik Çevirisi',
        d: 'Ürün açıklamalarınız tüm dillere otomatik ve doğru şekilde çevrilir.',
        i: 'M4 5h7M7 4c0 6-3 10-4 11m2-4c3 0 6 2 7 4M13 20l4-9 4 9m-7-3h6',
      },
      {
        t: 'AI Otomatik Metin Oluşturma',
        d: 'Ürünleriniz için profesyonel açıklamalar ve tanıtım metinleri otomatik hazırlanır.',
        i: 'M4 6h16M4 10h16M4 14h10M4 18h7M18 14l3 3-5 2 2-5z',
      },
      {
        t: 'AI Tabanlı Ürün Öneri Motoru',
        d: 'Müşterilere en çok ilgisini çekecek ürünleri akıllıca önererek satışları artırır.',
        i: 'M12 3l2.5 5 5.5.8-4 3.9 1 5.5-5-2.6-5 2.6 1-5.5-4-3.9 5.5-.8z',
      },
      {
        t: 'Kullanıcı Davranışını Öğrenen Akıllı Filtreler',
        d: 'Müşterilerin alışveriş alışkanlıklarına göre kendini geliştirerek daha doğru filtreleme sunar.',
        i: 'M4 5h16l-6 7v6l-4 2v-8z',
      },
      {
        t: 'Akıllı Fiyatlandırma Algoritması',
        d: 'Piyasayı analiz ederek ürünlerinize en uygun fiyatı otomatik belirler.',
        i: 'M12 3v18M8 7h6a2 2 0 010 4H9a2 2 0 000 4h7',
      },
    ],
  },
  {
    title: 'Ürün & Katalog Yönetimi',
    desc: 'Sınırsız ürün, esnek varyant ve markanıza özel vitrinle katalogunuzu yönetin.',
    items: [
      {
        t: 'Sınırsız Ürün Sayısı',
        d: 'Platforma istediğiniz kadar ürün ekleyebilir, herhangi bir sınırla karşılaşmazsınız.',
        i: 'M4 7l8-4 8 4-8 4zM4 7v10l8 4 8-4V7M12 11v10',
      },
      {
        t: 'Özelleştirilebilir Tema / Katalog-Vitrin',
        d: 'Mağazanızın görünümünü kolayca değiştirerek tamamen markanıza uygun bir vitrin oluşturun.',
        i: 'M3 5h18v4H3zM3 11h10v8H3zM15 11h6v8h-6z',
      },
      {
        t: 'Ürün Versiyonlama',
        d: 'Ürünün stok, fiyat gibi değişikliklerinin kaydının tutulması ve geçmişe erişim.',
        i: 'M4 12a8 8 0 0114-5M20 12a8 8 0 01-14 5M17 4v3h-3M7 20v-3h3',
      },
      {
        t: 'Set Ürün Oluşturma / Ortak Stok',
        d: 'Set halinde ürün satışı ve satış başına ortak stok takibi yapabilirsiniz.',
        i: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
      },
      {
        t: 'Teklif ile Yayın Özelliği',
        d: 'Ürünlerinizi fiyat belirtmeden “teklif al” şeklinde yayınlayarak özel satış yapın.',
        i: 'M4 5h16v10H8l-4 4zM8 9h8M8 12h5',
      },
    ],
  },
  {
    title: 'Satış & Pazarlama',
    desc: 'SEO, kampanya senaryoları ve bayi araçlarıyla satışlarınızı büyütün.',
    items: [
      {
        t: 'Güçlü SEO Altyapısı',
        d: 'Siteniz arama motorlarında daha görünür olur ve daha fazla ziyaretçi çekersiniz.',
        i: 'M11 4a7 7 0 105 12 7 7 0 00-5-12zM21 21l-4.3-4.3',
      },
      {
        t: 'Sepet Kampanya Senaryoları',
        d: 'Müşterilerin sepet davranışlarına göre otomatik kampanyalar oluşturabilirsiniz.',
        i: 'M3 4h2l2.4 12.4a1 1 0 001 .8h9.2a1 1 0 001-.8L21 8H6M9 21a1 1 0 100-2 1 1 0 000 2z',
      },
      {
        t: 'Bayii Rolü',
        d: 'Üyeler Bayii rolüyle otomatik indirimli alışveriş yapabilir.',
        i: 'M16 20a4 4 0 00-8 0M12 12a4 4 0 100-8 4 4 0 000 8M20 20a3 3 0 00-4-2.8',
      },
      {
        t: 'Otomatik Yeniden Sipariş Eşikleri',
        d: 'B2B satışlarda sipariş eşiklerinin yönetimi ve takibi sağlanır.',
        i: 'M4 4v16h16M8 16v-4M12 16V8M16 16v-6',
      },
    ],
  },
  {
    title: 'Global Satış & Entegrasyon',
    desc: 'Modüler entegrasyon, çoklu dil-döviz ve e-ihracat desteğiyle dünyaya açılın.',
    items: [
      {
        t: 'Modüler Entegrasyon Uyumu',
        d: 'Sisteminiz diğer yazılımlarla kolayca entegre olur ve birlikte sorunsuz çalışır.',
        i: 'M4 7h16M4 12h16M4 17h16M8 3v18M16 3v18',
      },
      {
        t: 'Çoklu Dil & Çoklu Döviz Modülü',
        d: 'Mağazanızı farklı ülkelerde farklı dil ve para birimleriyle rahatça kullanın.',
        i: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 3.8 6 3.8 9s-1.3 6.5-3.8 9',
      },
      {
        t: 'E-İhracat Danışmanlığı',
        d: 'Yurtdışına satış yapmak isteyen işletmelere strateji, operasyon ve pazar desteği sağlanır.',
        i: 'M3 21h18M5 21V10l7-5 7 5v11M9 21v-5h6v5',
      },
      {
        t: 'İlan Açma Haritalandırma Modülü',
        d: 'Lokasyon bazlı stoklar için haritalandırma ve harita üzerinde konum belirtme.',
        i: 'M12 21s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
      },
    ],
  },
]

export default function Ozellikler() {
  return (
    <>
      <PageHeader
        eyebrow="Öne Çıkan Özellikler"
        title="Aserai Yeni Nesil E-Ticaret"
        text="Yapay zekâ destekli araçlardan global satışa, akıllı fiyatlandırmadan bayi yönetimine kadar Aserai’nin sunduğu öne çıkan özellikleri keşfedin."
      />

      {categories.map((cat, idx) => (
        <section
          key={cat.title}
          className={`section oz-cat ${idx % 2 === 1 ? 'section--soft' : ''}`}
        >
          <div className="container">
            <div className="oz-cat__head">
              <h2>{cat.title}</h2>
              <p>{cat.desc}</p>
            </div>
            <div className="oz-grid">
              {cat.items.map((it) => (
                <article key={it.t} className="oz-card">
                  <span className="oz-card__icon" aria-hidden="true">
                    <Icon path={it.i} />
                  </span>
                  <div>
                    <h3>{it.t}</h3>
                    <p>{it.d}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section oz-note-wrap">
        <div className="container">
          <p className="oz-note">
            * Bazı özellikler geliştirme ve test aşamasındadır; ilgili
            entegrasyonlarla birlikte aktif edilecektir.
          </p>
        </div>
      </section>

      <CtaBand
        title="Tüm bu özellikleri denemeye bugün başlayın"
        text="14 gün boyunca ücretsiz deneyin. Kurulum ücreti yok, kredi kartı gerekmez."
      />
    </>
  )
}
