/* ============================================================
   Hukuki sayfa içerikleri (KVKK · Gizlilik · Kullanım Şartları ·
   Çerez Politikası · Yasal Uyarı)
   NOT: Bu metinler şablon niteliğindedir; yürürlüğe almadan önce
   hukuk danışmanınız tarafından gözden geçirilmelidir.
   ============================================================ */

export const legalOrder = [
  'kvkk',
  'gizlilik',
  'kullanim-sartlari',
  'cerez-politikasi',
  'yasal-uyari',
]

export const legal = {
  kvkk: {
    slug: 'kvkk',
    navLabel: 'KVKK Aydınlatma Metni',
    title: 'KVKK Aydınlatma Metni',
    updated: 'Temmuz 2026',
    intro:
      '6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında, veri sorumlusu sıfatıyla Aserai (Dijital Atölyemiz Danışmanlık ve Ticaret İnş. San. Ltd. Şti.) tarafından kişisel verilerinizin işlenmesine ilişkin aydınlatma metnidir.',
    sections: [
      {
        heading: '1. Veri Sorumlusu',
        body: [
          'Kişisel verileriniz, veri sorumlusu olarak Aserai tarafından aşağıda açıklanan kapsamda işlenmektedir.',
        ],
      },
      {
        heading: '2. İşlenen Kişisel Veriler',
        body: [
          'Ad-soyad, e-posta, telefon, firma bilgileri gibi kimlik ve iletişim verileriniz; hizmetlerimizi kullanımınıza ilişkin işlem güvenliği ve kullanım verileriniz işlenebilmektedir.',
        ],
      },
      {
        heading: '3. Kişisel Verilerin İşlenme Amaçları',
        body: [
          'Verileriniz; hizmetlerin sunulması, talep ve şikâyetlerin yönetimi, sözleşme süreçlerinin yürütülmesi, yasal yükümlülüklerin yerine getirilmesi ve sizinle iletişim kurulması amaçlarıyla işlenir.',
        ],
      },
      {
        heading: '4. Verilerin Aktarılması',
        body: [
          'Kişisel verileriniz, mevzuata uygun olarak ve gerekli güvenlik tedbirleri alınarak; yetkili kamu kurumlarına ve hizmet aldığımız tedarikçilere (ör. ödeme, e-fatura, barındırma) aktarılabilir.',
        ],
      },
      {
        heading: '5. Haklarınız',
        body: [
          'KVKK’nın 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini talep etme ve işleme itiraz etme gibi haklara sahipsiniz.',
          'Taleplerinizi iletişim kanallarımız üzerinden bize iletebilirsiniz.',
        ],
      },
    ],
  },

  gizlilik: {
    slug: 'gizlilik',
    navLabel: 'Gizlilik Politikası',
    title: 'Gizlilik Politikası',
    updated: 'Temmuz 2026',
    intro:
      'Aserai olarak kullanıcılarımızın gizliliğine önem veriyoruz. Bu politika, hizmetlerimizi kullanırken toplanan verilerin nasıl kullanıldığını ve korunduğunu açıklar.',
    sections: [
      {
        heading: '1. Topladığımız Bilgiler',
        body: [
          'Sizinle iletişim kurabilmek ve hizmet sunabilmek için form ve hesap oluşturma süreçlerinde paylaştığınız bilgileri; ayrıca sitemizi kullanımınıza dair teknik verileri toplarız.',
        ],
      },
      {
        heading: '2. Bilgilerin Kullanımı',
        body: [
          'Toplanan bilgiler; hizmet kalitesini artırmak, taleplerinizi yanıtlamak ve yasal yükümlülüklerimizi yerine getirmek için kullanılır. Bilgileriniz izniniz olmadan pazarlama amacıyla üçüncü taraflara satılmaz.',
        ],
      },
      {
        heading: '3. Veri Güvenliği',
        body: [
          'Verilerinizi yetkisiz erişime karşı korumak için endüstri standardı teknik ve idari tedbirleri (SSL, erişim kontrolü, yedekleme) uygularız.',
        ],
      },
      {
        heading: '4. Üçüncü Taraf Hizmetleri',
        body: [
          'Ödeme, analiz ve entegrasyon amacıyla üçüncü taraf hizmetler kullanabiliriz. Bu sağlayıcıların kendi gizlilik politikaları geçerlidir.',
        ],
      },
      {
        heading: '5. İletişim',
        body: [
          'Gizlilikle ilgili sorularınız için iletişim sayfamız üzerinden bize ulaşabilirsiniz.',
        ],
      },
    ],
  },

  'kullanim-sartlari': {
    slug: 'kullanim-sartlari',
    navLabel: 'Kullanım Şartları',
    title: 'Kullanım Şartları',
    updated: 'Temmuz 2026',
    intro:
      'Bu web sitesini ve Aserai hizmetlerini kullanarak aşağıdaki şartları kabul etmiş sayılırsınız. Lütfen dikkatlice okuyunuz.',
    sections: [
      {
        heading: '1. Hizmetin Kapsamı',
        body: [
          'Aserai, e-ticaret altyapısı ve ilgili hizmetleri sunar. Hizmet kapsamı, seçtiğiniz paket ve modüllere göre değişiklik gösterebilir.',
        ],
      },
      {
        heading: '2. Kullanıcı Yükümlülükleri',
        body: [
          'Hizmetleri yürürlükteki mevzuata ve dürüstlük kurallarına uygun kullanmayı; hesabınızın güvenliğini sağlamayı kabul edersiniz.',
        ],
      },
      {
        heading: '3. Fikri Mülkiyet',
        body: [
          'Sitedeki tüm marka, logo, tasarım ve içerikler Aserai’ye aittir ve izinsiz kullanılamaz.',
        ],
      },
      {
        heading: '4. Sorumluluğun Sınırlandırılması',
        body: [
          'Hizmetler “olduğu gibi” sunulur. Mücbir sebep ve öngörülemeyen teknik aksaklıklardan doğabilecek dolaylı zararlardan Aserai sorumlu tutulamaz.',
        ],
      },
      {
        heading: '5. Değişiklikler',
        body: [
          'Aserai, bu şartları güncelleme hakkını saklı tutar. Güncel sürüm bu sayfada yayımlanır.',
        ],
      },
    ],
  },

  'cerez-politikasi': {
    slug: 'cerez-politikasi',
    navLabel: 'Çerez Politikası',
    title: 'Çerez Politikası',
    updated: 'Temmuz 2026',
    intro:
      'Bu politika, web sitemizde çerezlerin (cookies) nasıl ve hangi amaçlarla kullanıldığını açıklar.',
    sections: [
      {
        heading: '1. Çerez Nedir?',
        body: [
          'Çerezler, siteyi ziyaret ettiğinizde cihazınıza kaydedilen küçük metin dosyalarıdır ve sitenin doğru çalışmasına yardımcı olur.',
        ],
      },
      {
        heading: '2. Kullandığımız Çerez Türleri',
        body: [
          'Zorunlu çerezler (sitenin çalışması için gerekli), performans/analiz çerezleri (kullanım istatistikleri) ve tercih çerezleri (ayarlarınızın hatırlanması) kullanılır.',
        ],
      },
      {
        heading: '3. Çerezleri Yönetme',
        body: [
          'Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Zorunlu çerezlerin engellenmesi, bazı özelliklerin çalışmamasına neden olabilir.',
        ],
      },
      {
        heading: '4. Üçüncü Taraf Çerezleri',
        body: [
          'Analiz ve reklam hizmetleri kapsamında üçüncü taraf çerezleri kullanılabilir. Bu çerezler ilgili sağlayıcıların politikalarına tabidir.',
        ],
      },
    ],
  },

  'yasal-uyari': {
    slug: 'yasal-uyari',
    navLabel: 'Yasal Uyarı',
    title: 'Yasal Uyarı',
    updated: 'Temmuz 2026',
    intro:
      'Bu web sitesinin kullanımına ilişkin yasal uyarılar aşağıda belirtilmiştir.',
    sections: [
      {
        heading: '1. Genel',
        body: [
          'Bu sitede yer alan bilgiler yalnızca genel bilgilendirme amaçlıdır ve önceden haber verilmeksizin değiştirilebilir.',
        ],
      },
      {
        heading: '2. İçeriğin Doğruluğu',
        body: [
          'İçeriklerin güncel ve doğru olması için azami özen gösterilir; ancak eksiksizliği veya kesintisizliği garanti edilmez.',
        ],
      },
      {
        heading: '3. Dış Bağlantılar',
        body: [
          'Site, üçüncü taraf web sitelerine bağlantılar içerebilir. Bu sitelerin içeriğinden Aserai sorumlu değildir.',
        ],
      },
      {
        heading: '4. Telif Hakları',
        body: [
          '© 2019–2026 Aserai E-Ticaret Sistemleri. Aserai, bir Dijital Atölyemiz markasıdır. Tüm hakları saklıdır.',
        ],
      },
    ],
  },
}
