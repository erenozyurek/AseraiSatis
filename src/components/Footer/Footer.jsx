import { Link } from 'react-router-dom'
import './Footer.css'

import aseraiLogo from '../../assets/aserai.png'

const footerColumns = [
  {
    sections: [
      {
        title: 'Anasayfa',
        links: [
          { label: 'Anasayfa', to: '/' },
          { label: 'E-Ticaret Çözümleri', to: '/cozumler' },
          { label: 'Paketler', to: '/paketler' },
          { label: 'Demo Talep Et', to: '/demo' },
          { label: 'Teklif Al', to: '/teklif' },
          { label: 'Giriş Yap', to: '/giris' },
        ],
      },
      {
        title: 'E-Ticaret Paketleri',
        links: [
          { label: 'Yeni Başlayanlar', to: '/paketler' },
          { label: 'Standart Paketler', to: '/paketler' },
          { label: 'Profesyonel Paketler', to: '/paketler' },
          { label: 'E-İhracat Paketleri', to: '/paketler' },
          { label: 'Kampanyalar', to: '/paketler' },
        ],
      },
      {
        title: 'Kurumsal',
        links: [
          { label: 'Hakkımızda', to: '/hakkimizda' },
          { label: 'Referanslarımız', to: '/referanslar' },
          { label: 'Partner / Bayii', to: '/kurumsal' },
          { label: 'İş Ortaklarımız', to: '/kurumsal' },
          { label: 'Akademi', to: '/akademi' },
          { label: 'Kariyer', to: '/kurumsal' },
          { label: 'Kurumsal Kimlik', to: '/kurumsal' },
          { label: 'Bizden Haberler', to: '/blog' },
          { label: 'Blog', to: '/blog' },
          { label: 'Destek Merkezi', to: '/yardim' },
          { label: 'Şikayet / Öneri', to: '/iletisim' },
          { label: 'İletişim', to: '/iletisim' },
          { label: 'Hukuki Sayfalar', to: '/kvkk' },
        ],
      },
      {
        title: 'Banka Hesap Numaralarımız',
        links: [{ label: 'Online Tahsilat Ekranı', to: '/odeme', strong: true }],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Modüller',
        links: [],
      },
      {
        title: 'Satış ve Pazarlama',
        links: [
          { label: 'One Page Checkout', to: '/moduller', note: 'Hızlı ve Güvenli Ödeme' },
          { label: 'Kampanya ve Etiket Yönetimi', to: '/moduller' },
          { label: 'Promosyon Modülü', to: '/moduller' },
          { label: 'Kombin Satış Modülleri', to: '/moduller' },
          { label: 'İlişkili Ürün Bağlama Modülü', to: '/moduller' },
          { label: 'E-Fatura & E-Arşiv', to: '/moduller' },
          { label: 'E-İhracat Modülü', to: '/moduller' },
          { label: 'Aserai Influencer Kampanya Yazılımı', to: '/moduller', note: 'Yakında' },
          { label: 'Abonelik Modülü', to: '/moduller', note: 'Yakında' },
          { label: 'BuyBox Rekabet Analizi', to: '/moduller', note: 'Yakında' },
        ],
      },
      {
        title: 'Mağaza ve İçerik Yönetimi',
        links: [
          { label: 'Aserai Tema Editörü', to: '/moduller' },
          { label: 'Koleksiyon Modülü', to: '/moduller' },
          { label: 'Çoklu Dil ve Çoklu Para Modülü', to: '/moduller' },
          { label: 'Çok Dilli SEO Meta Modülü', to: '/moduller' },
        ],
      },
      {
        title: 'Operasyon ve Yönetim',
        links: [
          { label: 'CRM & Müşteri Yönetimi', to: '/moduller' },
          { label: 'Bayi Modülü', to: '/moduller' },
          { label: 'Tedarikçi / Stok Modülü', to: '/moduller' },
          { label: 'Haritalandırma Seçeneği', to: '/moduller' },
          { label: 'Site IP Güvenlik Modülü', to: '/moduller' },
          { label: 'Yetkili İşlem Kayıt Takip Modülü', to: '/moduller' },
        ],
      },
      {
        title: 'Yapay Zeka ve Analitik',
        links: [
          { label: 'Aserai Yapay Zeka Modülü', to: '/moduller' },
          { label: 'Canlı Ziyaretçi İzleme Modülü', to: '/moduller' },
          { label: 'Reklam Dönüşüm (ROI) Modülü', to: '/moduller' },
          { label: 'Blog Metin Üretici Modülü', to: '/moduller' },
          { label: 'İstatistik Modülü > Sipariş İstatistik', to: '/moduller' },
          { label: 'İstatistik Modülü > Üye İstatistik', to: '/moduller' },
          { label: 'İstatistik Modülü > Ürün Skor İstatistiği', to: '/moduller' },
          { label: 'İstatistik Modülü > Site İçi Arama İstatistik', to: '/moduller' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Tüm Özellikler',
        links: [],
      },
      {
        title: 'Satış ve Ürün Yönetimi',
        links: [
          { label: 'Varyantlı Ürün', to: '/ozellikler' },
          { label: 'Asortili Ürün Satış Modülü', to: '/ozellikler' },
          { label: 'Smart Price | Akıllı Fiyatlandırma', to: '/ozellikler' },
          { label: 'Faceted Search | Çok Yönlü Arama', to: '/ozellikler' },
          { label: 'Bayi Bazlı İskonto Yönetimi', to: '/ozellikler' },
          { label: 'Toplu Ürün Güncelleme', to: '/ozellikler' },
        ],
      },
      {
        title: 'Yapay Zeka Özellikleri',
        links: [
          { label: 'AI Görsel Editleme', to: '/ozellikler' },
          { label: 'AI Ürün Açıklaması', to: '/ozellikler' },
          { label: 'AI Öneri Motoru', to: '/ozellikler' },
          { label: 'Akıllı Filtreleme', to: '/ozellikler' },
          { label: 'AI Blog Motoru', to: '/ozellikler' },
        ],
      },
      {
        title: 'Pazarlama ve SEO',
        links: [
          { label: 'SEO Yönetimi', to: '/ozellikler' },
          { label: 'Arama Optimizasyonu', to: '/ozellikler' },
          { label: 'Blog ve İçerik Yönetimi', to: '/ozellikler' },
          { label: 'Müşteri Yorumları', to: '/ozellikler' },
        ],
      },
      {
        title: 'Operasyon ve Lojistik',
        links: [
          { label: 'Kargo Yönetimi', to: '/ozellikler' },
          { label: 'Yerel Teslimat Yönetimi', to: '/ozellikler' },
          { label: 'Stok Yönetimi', to: '/ozellikler' },
          { label: 'Rol Bazlı Yetkilendirme', to: '/ozellikler' },
        ],
      },
      {
        title: 'Diğer Özellikler',
        links: [
          { label: 'Top Ürün Skorlama', to: '/ozellikler' },
          { label: 'Tema Editörü', to: '/ozellikler' },
          { label: 'Ürün Kartı Editörü', to: '/ozellikler' },
          { label: 'Döviz Birimi Esnek Mimari', to: '/ozellikler' },
          { label: 'Stok / Tedarikçi API Eşleştirme', to: '/ozellikler' },
          { label: 'Rol Değişim Modülü', to: '/ozellikler' },
          { label: 'Duyuru Yayınlama', to: '/ozellikler' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Entegrasyonlar',
        links: [
          { label: 'İberai Ticari Entegrasyon Platformu', to: '/iberai', strong: true },
          { label: 'Yurt İçi Pazaryeri Entegrasyonu', to: '/iberai' },
          { label: 'Yurt Dışı Pazaryeri Entegrasyonu', to: '/iberai' },
          { label: 'E-Ticaret Yazılımları Entegrasyonu', to: '/iberai' },
          { label: 'Muhasebe Yazılımı Entegrasyonu', to: '/iberai' },
          { label: 'E-Dönüşüm Entegrasyonu', to: '/iberai' },
          { label: 'Ödeme Sistemi Entegrasyonu', to: '/iberai' },
          { label: 'Kargo Entegrasyonu', to: '/iberai' },
          { label: 'Fulfillment Entegrasyonu', to: '/iberai' },
          { label: 'CRM Entegrasyonu', to: '/iberai' },
          { label: 'İnsan Kaynakları (İK) Entegrasyonu', to: '/iberai' },
          { label: 'SMS-E-Posta Pazarlama Entegrasyonu', to: '/iberai' },
          { label: 'WhatsApp ve Mesajlaşma Entegrasyonu', to: '/iberai' },
        ],
      },
      {
        title: 'Dijital Atölyemiz Çözümleri',
        links: [
          { label: 'Aserai B2B E-Ticaret', href: 'https://dijitalatolyemiz.com.tr/' },
          { label: 'Aserai CRM', to: '/aserai' },
          { label: 'Aserai Workflow Yazılımı', href: 'https://dijitalatolyemiz.com.tr/' },
          { label: 'Belleq | Dijital Çalışma Hafızası Yazılımı', href: 'https://dijitalatolyemiz.com.tr/' },
        ],
      },
      {
        title: 'Araçlar',
        links: [
          { label: 'KDV Hesaplama', to: '/yardim' },
          { label: 'Kargo Ücreti Hesaplama', to: '/yardim' },
          { label: 'Desi Hesaplama', to: '/yardim' },
          { label: 'Gümrük Vergisi Hesaplama', to: '/yardim' },
          { label: 'Trendyol Komisyon Hesaplama', to: '/yardim' },
          { label: 'Hepsiburada Komisyon Hesaplama', to: '/yardim' },
          { label: 'N11 Komisyon Hesaplama', to: '/yardim' },
          { label: 'Amazon Komisyon Hesaplama', to: '/yardim' },
          { label: 'PttAVM Komisyon Hesaplama', to: '/yardim' },
          { label: 'Maliyet Hesaplama', to: '/yardim' },
        ],
      },
    ],
  },
]

const legalLinks = [
  { label: 'Site Haritası', to: '/' },
  { label: 'Yasal Uyarı', to: '/yasal-uyari' },
  { label: 'Kullanım Şartları', to: '/kullanim-sartlari' },
  { label: 'KVKK Politikası', to: '/kvkk' },
  { label: 'Çerezlerin Politikası', to: '/cerez-politikasi' },
  { label: 'Gizlilik Politikası', to: '/gizlilik' },
]

const socialLinks = [
  {
    label: 'Twitter',
    href: 'https://twitter.com/dijitalatolyetr',
    iconPath:
      'M22 5.8c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.2 1.7-2.2-.8.5-1.6.8-2.5 1A4 4 0 0012 7.9c0 .3 0 .6.1.9A11.3 11.3 0 013.9 4.7a4 4 0 001.2 5.3c-.6 0-1.2-.2-1.8-.5v.1a4 4 0 003.2 3.9c-.4.1-.7.1-1.1.1-.3 0-.5 0-.8-.1a4 4 0 003.7 2.8A8 8 0 012.5 18c-.4 0-.7 0-1.1-.1A11.3 11.3 0 007.6 20c7.4 0 11.5-6.1 11.5-11.5v-.5c.8-.6 1.5-1.3 2-2.2z',
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/dijitalatolyemiztr',
    iconPath:
      'M14 8.5V6.8c0-.8.4-1.2 1.3-1.2h1.5V2.9c-.7-.1-1.5-.1-2.2-.1-2.2 0-3.8 1.3-3.8 3.7v2H8.3v3h2.5V21H14v-9.5h2.5l.4-3H14z',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/dijitalatolyemiztr/',
    iconPath:
      'M7.5 2.8h9A4.7 4.7 0 0121.2 7.5v9a4.7 4.7 0 01-4.7 4.7h-9a4.7 4.7 0 01-4.7-4.7v-9a4.7 4.7 0 014.7-4.7zM12 8a4 4 0 100 8 4 4 0 000-8zm5.2-.9a1 1 0 100-2 1 1 0 000 2z',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/dijitalatolyemiztr/',
    iconPath:
      'M5.1 8.8H2.3V21h2.8V8.8zM3.7 3A1.6 1.6 0 102 4.6 1.6 1.6 0 003.7 3zm6.2 5.8H7.2V21H10v-6.4c0-1.7.3-3.3 2.4-3.3 2 0 2 1.9 2 3.4V21h2.8v-7.1c0-3.5-.8-5.3-3.9-5.3-1.5 0-2.6.8-3.1 1.6h-.1V8.8z',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@dijitalatolyemiz',
    iconPath:
      'M21.4 7.2a2.8 2.8 0 00-2-2C17.7 4.8 12 4.8 12 4.8s-5.7 0-7.4.4a2.8 2.8 0 00-2 2A29 29 0 002.2 12a29 29 0 00.4 4.8 2.8 2.8 0 002 2c1.7.4 7.4.4 7.4.4s5.7 0 7.4-.4a2.8 2.8 0 002-2 29 29 0 00.4-4.8 29 29 0 00-.4-4.8zM10 15.2V8.8l5.4 3.2L10 15.2z',
  },
]

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" />
  </svg>
)

const CartIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 4h2l2.4 12.4a1 1 0 001 .8h9.2a1 1 0 001-.8L21 8H6M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
)

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
)

function FooterLink({ item }) {
  const className = [
    item.strong ? 'is-strong' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const content = (
    <>
      {item.label}
      {item.note ? <small> ({item.note})</small> : null}
    </>
  )

  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link to={item.to} className={className}>
      {content}
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__utility">
          <div className="footer__utility-brand">
            <Link to="/" className="footer__logo" aria-label="Aserai anasayfa">
              <img src={aseraiLogo} alt="Aserai" />
            </Link>
            <ChevronIcon />
            <Link to="/yardim" className="footer__support">
              Destek
            </Link>
          </div>

          <div className="footer__utility-actions">
            <Link to="/kayit" className="footer__action">
              <UserIcon />
              <span>Katıl</span>
            </Link>
            <Link to="/paketler" className="footer__action">
              <CartIcon />
              <span>E-Ticarete Başla</span>
            </Link>
          </div>
        </div>

        <div className="footer__map">
          {footerColumns.map((column, columnIndex) => (
            <div className="footer__map-col" key={columnIndex}>
              {column.sections.map((section) => (
                <section
                  className={section.links.length ? 'footer__group' : 'footer__group footer__group--heading'}
                  key={section.title}
                >
                  <h4>{section.title}</h4>
                  {section.links.length ? (
                    <ul>
                      {section.links.map((item) => (
                        <li key={`${section.title}-${item.label}`}>
                          <FooterLink item={item} />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}

              {columnIndex === footerColumns.length - 1 ? (
                <div className="footer__social" aria-label="Sosyal medya bağlantıları">
                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      title={item.label}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d={item.iconPath} />
                      </svg>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <div className="footer__legal">
            {legalLinks.map((item) => (
              <Link key={item.label} to={item.to}>
                {item.label}
              </Link>
            ))}
          </div>
          <p className="footer__copy">
            © Telif Hakkı 2019-2026 Aserai Yazılım.
            <br />
            Aserai, bir{' '}
            <a
              href="https://dijitalatolyemiz.com.tr/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dijital Atölyemiz
            </a>{' '}
            markasıdır. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  )
}
