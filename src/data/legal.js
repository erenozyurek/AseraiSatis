/* ============================================================
   Hukuki sayfa içerikleri
   NOT: Bu metinler şablon niteliğindedir; yürürlüğe almadan önce
   hukuk danışmanınız tarafından gözden geçirilmelidir.
   ============================================================ */

export const legalOrder = [
  'mesafeli-satis-sozlesmesi',
  'gizlilik',
  'kvkk',
  'kvkk-gizlilik-sozlesmesi',
  'uyelik-sozlesmesi',
  'verilerin-silinmesi',
  'iade-politikasi',
  'iade-formu',
  'kullanim-sartlari',
  'cerez-politikasi',
  'yasal-uyari',
]

export const legal = {
  'mesafeli-satis-sozlesmesi': {
    slug: 'mesafeli-satis-sozlesmesi',
    navLabel: 'Mesafeli Satış Sözleşmesi',
    title: 'Mesafeli Satış Sözleşmesi',
    updated: 'Temmuz 2026',
    intro:
      'Bu sözleşme, Aserai üzerinden uzaktan iletişim araçlarıyla satın alınan paket, modül ve dijital hizmetlere ilişkin genel satış koşullarını düzenler. Siparişe özel ürün, süre, bedel ve taraf bilgileri ödeme öncesindeki sipariş özetinin ayrılmaz parçasıdır.',
    sections: [
      {
        heading: '1. Taraflar ve Kapsam',
        body: [
          'Satıcı veya hizmet sağlayıcı Aserai (Dijital Atölyemiz Danışmanlık ve Ticaret İnş. San. Ltd. Şti.); alıcı ise sipariş sırasında bilgilerini paylaşan gerçek veya tüzel kişidir.',
          'Alıcının tüketici sıfatıyla hareket ettiği işlemlerde 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve ilgili mesafeli sözleşme mevzuatı uygulanır. Ticari veya mesleki amaçla yapılan alımlarda tarafların sipariş ve hizmet koşulları esas alınır.',
        ],
      },
      {
        heading: '2. Sözleşmenin Konusu',
        body: [
          'Sözleşmenin konusu; alıcının seçtiği Aserai paketi, ek modüller ve ilgili dijital hizmetlerin belirtilen dönem boyunca sunulması ile tarafların hak ve yükümlülüklerinin belirlenmesidir.',
          'Hizmetin temel nitelikleri, faturalama dönemi, vergiler dâhil toplam bedel ve varsa ek ücretler sipariş özeti ile ön bilgilendirme alanında gösterilir.',
        ],
      },
      {
        heading: '3. Sözleşmenin Kurulması',
        body: [
          'Alıcı, siparişi onaylamadan önce hizmetin temel nitelikleri, toplam bedel, ödeme yöntemi, sözleşme süresi, yenileme ve cayma koşulları hakkında bilgilendirilir.',
          'Sözleşme, alıcının ön bilgileri ve ödeme yükümlülüğünü kabul ederek siparişi tamamlaması ve siparişin Aserai tarafından elektronik ortamda teyit edilmesiyle kurulur.',
        ],
      },
      {
        heading: '4. Hizmetin İfası ve Lisans',
        body: [
          'Dijital hizmet ve lisans erişimi, ödeme onayından sonra hesap üzerinden kullanıma açılır. Başlangıç ve bitiş tarihleri müşterinin Lisanslarım alanında gösterilir.',
          'Paket iptali mevcut fatura döneminin sonuna planlanır; paket ve bağlı modüller bitiş tarihine kadar kullanılabilir ve yeni dönemde yenilenmez.',
        ],
      },
      {
        heading: '5. Bedel ve Ödeme',
        body: [
          'Alıcının ödeyeceği toplam bedel ve ödeme yöntemi sipariş onayından önce gösterilir. Fatura, ödeme işleminin onaylanmasının ardından mevzuata uygun şekilde düzenlenir.',
          'Ödeme altyapısı sağlayıcılarının işlemleri kendi güvenlik ve kullanım koşullarına tabi olabilir.',
        ],
      },
      {
        heading: '6. Cayma Hakkı',
        body: [
          'Tüketici niteliğindeki alıcı, mevzuattaki istisnalar saklı kalmak üzere, sözleşmenin kurulduğu tarihten itibaren on dört gün içinde gerekçe göstermeden cayma hakkını kullanabilir.',
          'Cayma süresi sona ermeden tüketicinin açık onayıyla ifasına başlanan hizmetler veya anında teslim edilen dijital içerikler bakımından mevzuattaki cayma hakkı istisnaları uygulanabilir. Ticari alımlarda iade ve fesih koşulları sipariş ve hizmet şartlarına göre değerlendirilir.',
        ],
      },
      {
        heading: '7. İptal, İade ve Yenileme',
        body: [
          'Dönem sonu iptal talebi tek başına geçmiş döneme ilişkin otomatik bedel iadesi oluşturmaz. Kanuni cayma ve ayıplı hizmet hakları ile İade Politikası hükümleri saklıdır.',
          'İade talepleri İade Formu veya iletişim kanalları üzerinden sipariş bilgileriyle birlikte iletilir.',
        ],
      },
      {
        heading: '8. Uyuşmazlıklar',
        body: [
          'Tüketici işlemlerinde yürürlükteki parasal sınırlar dâhilinde tüketici hakem heyetleri ile tüketici mahkemelerine; diğer işlemlerde görevli ve yetkili mahkemelere başvurulabilir.',
        ],
      },
    ],
  },

  'kvkk-gizlilik-sozlesmesi': {
    slug: 'kvkk-gizlilik-sozlesmesi',
    navLabel: 'Gizlilik Sözleşmesi (KVKK)',
    title: 'Gizlilik Sözleşmesi (KVKK)',
    updated: 'Temmuz 2026',
    intro:
      'Bu sözleşme; Aserai hizmetleri kapsamında paylaşılan gizli bilgilerin ve kişisel verilerin korunmasına ilişkin tarafların temel yükümlülüklerini açıklar.',
    sections: [
      {
        heading: '1. Gizli Bilginin Kapsamı',
        body: [
          'Tarafların hizmet ilişkisi sırasında öğrendiği ticari, teknik, mali ve operasyonel bilgiler ile müşteri, kullanıcı ve çalışanlara ait kişisel veriler gizli bilgi kapsamındadır.',
          'Kamuya açık hâle gelmiş, hukuka uygun olarak üçüncü kişiden edinilmiş veya açıklanması kanunen zorunlu bilgiler bu kapsamın dışındadır.',
        ],
      },
      {
        heading: '2. Kullanım Amacı ve Sınırlar',
        body: [
          'Gizli bilgiler yalnızca hizmetin kurulması, yürütülmesi, desteklenmesi ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla kullanılabilir.',
          'Taraflar, diğer tarafın yazılı izni veya kanuni zorunluluk bulunmadıkça gizli bilgileri yetkisiz üçüncü kişilerle paylaşamaz.',
        ],
      },
      {
        heading: '3. Kişisel Verilerin Korunması',
        body: [
          'Kişisel veriler; hukuka ve dürüstlük kurallarına uygun, belirli ve meşru amaçlarla, işlendikleri amaçla bağlantılı, sınırlı ve ölçülü biçimde işlenir.',
          'Taraflar, kendi veri işleme faaliyetleri bakımından 6698 sayılı KVKK ve ilgili mevzuattan doğan yükümlülüklerini yerine getirir.',
        ],
      },
      {
        heading: '4. Güvenlik Tedbirleri',
        body: [
          'Gizli bilgi ve kişisel verilerin yetkisiz erişim, kayıp, değişiklik veya ifşaya karşı korunması için uygun teknik ve idari tedbirler uygulanır; erişim yalnızca görev gereği ihtiyaç duyan kişilerle sınırlandırılır.',
        ],
      },
      {
        heading: '5. Tedarikçiler ve Aktarım',
        body: [
          'Barındırma, ödeme, e-fatura ve destek gibi hizmetlerin sağlanması için gerekli olduğu ölçüde tedarikçilerden yararlanılabilir. Aktarımlar hukuki sebebe dayanır ve gerekli güvenlik taahhütleriyle yürütülür.',
        ],
      },
      {
        heading: '6. Saklama, İade ve İmha',
        body: [
          'Gizli bilgiler ve kişisel veriler, işleme amacı veya yasal saklama süresi sona erdiğinde mevzuata uygun şekilde silinir, yok edilir, anonim hâle getirilir ya da hak sahibine iade edilir.',
        ],
      },
      {
        heading: '7. Süre ve Sorumluluk',
        body: [
          'Gizlilik yükümlülüğü üyelik veya hizmet ilişkisi sona erdikten sonra da bilginin gizli niteliği devam ettiği sürece yürürlükte kalır. İhlal hâlinde kanundan ve sözleşmeden doğan haklar saklıdır.',
        ],
      },
    ],
  },

  'uyelik-sozlesmesi': {
    slug: 'uyelik-sozlesmesi',
    navLabel: 'Üyelik Sözleşmesi',
    title: 'Üyelik Sözleşmesi',
    updated: 'Temmuz 2026',
    intro:
      'Bu sözleşme, Aserai hesabının oluşturulması ve müşteri panelinin kullanılmasıyla ilgili üyelik koşullarını düzenler.',
    sections: [
      {
        heading: '1. Üyeliğin Kurulması',
        body: [
          'Üyelik, kayıt formundaki zorunlu bilgilerin doğru ve eksiksiz girilmesi, gerekli onayların verilmesi ve hesabın doğrulanmasıyla oluşturulur.',
          'Üye, hesap açmaya ve bu sözleşmeyi kabul etmeye yetkili olduğunu beyan eder.',
        ],
      },
      {
        heading: '2. Hesap Güvenliği',
        body: [
          'Üye, parola ve oturum bilgilerinin gizliliğinden sorumludur. Yetkisiz kullanım şüphesi hâlinde parolasını değiştirmeli ve Aserai ile iletişime geçmelidir.',
          'Hesap bilgileri üçüncü kişilere devredilemez veya hukuka aykırı amaçlarla kullandırılamaz.',
        ],
      },
      {
        heading: '3. Üyenin Yükümlülükleri',
        body: [
          'Üye, hizmetleri mevzuata, dürüstlük kurallarına ve üçüncü kişilerin haklarına uygun kullanmayı; güncel ve doğru bilgi sağlamayı kabul eder.',
          'Sistemin güvenliğini bozacak, yetkisiz erişim sağlayacak veya hizmeti aksatacak faaliyetlerde bulunulamaz.',
        ],
      },
      {
        heading: '4. Paketler ve Ücretli Hizmetler',
        body: [
          'Üyelik hesabı tek başına ücretli paket veya modül lisansı sağlamaz. Ücretli hizmetlerin kapsamı, süresi ve bedeli ilgili sipariş ve lisans kayıtlarında belirtilir.',
        ],
      },
      {
        heading: '5. Askıya Alma ve Sona Erme',
        body: [
          'Sözleşmeye veya mevzuata aykırı kullanım, güvenlik riski ya da ödeme yükümlülüğünün yerine getirilmemesi hâlinde hesap veya ilgili hizmet, ölçülü olmak kaydıyla askıya alınabilir.',
          'Üyelik sona erse dahi fatura, işlem ve hukuken saklanması gereken kayıtlar ilgili süreler boyunca muhafaza edilebilir.',
        ],
      },
      {
        heading: '6. Fikri Mülkiyet',
        body: [
          'Aserai yazılımı, marka, tasarım, dokümantasyon ve içeriklerine ilişkin fikri mülkiyet hakları hak sahiplerine aittir. Üyeye yalnızca hizmet süresiyle sınırlı kullanım hakkı tanınır.',
        ],
      },
      {
        heading: '7. Değişiklik ve Bildirimler',
        body: [
          'Üyelik koşullarındaki önemli değişiklikler uygun iletişim kanallarıyla duyurulur. Üyenin yasal hakları saklıdır.',
        ],
      },
    ],
  },

  'verilerin-silinmesi': {
    slug: 'verilerin-silinmesi',
    navLabel: 'Verilerin Silinmesi Talimatı',
    title: 'Verilerin Silinmesi Talimatı',
    updated: 'Temmuz 2026',
    intro:
      'Bu talimat, kişisel verilerinizin silinmesi, yok edilmesi veya anonim hâle getirilmesine ilişkin talebinizi Aserai’ye nasıl iletebileceğinizi açıklar.',
    sections: [
      {
        heading: '1. Kimler Başvurabilir?',
        body: [
          'Kişisel verisi Aserai tarafından işlenen ilgili kişi, KVKK kapsamındaki hakları doğrultusunda kendisiyle ilgili verilerin silinmesini, yok edilmesini veya anonim hâle getirilmesini talep edebilir.',
        ],
      },
      {
        heading: '2. Talebin İçeriği',
        body: [
          'Başvuruda ad-soyad, iletişim bilgisi, varsa üyelik veya müşteri numarası, talebe konu veri ve istenen işlem açıkça belirtilmelidir.',
          'Kimliğin doğrulanması için gerekli ve ölçülü ek bilgi istenebilir; özel nitelikli kişisel veriler veya hesap parolası başvuru metnine eklenmemelidir.',
        ],
      },
      {
        heading: '3. Başvuru Yöntemi',
        body: [
          'Talep, iletişim sayfasında belirtilen kanallardan yazılı olarak iletilebilir. Başvurunun güvenli şekilde sonuçlandırılabilmesi için talep sahibiyle ek doğrulama yapılabilir.',
        ],
      },
      {
        heading: '4. Değerlendirme',
        body: [
          'Talep, kişisel verinin işlenme amacı, hukuki sebebi ve yürürlükteki zorunlu saklama süreleri dikkate alınarak mevzuatta öngörülen süre içinde değerlendirilir.',
          'İşleme şartlarının tamamı ortadan kalkmışsa veri uygun yönteme göre silinir, yok edilir veya anonim hâle getirilir. Kanunen saklanması gereken kayıtlar, erişimi sınırlandırılarak zorunlu sürenin sonuna kadar tutulabilir.',
        ],
      },
      {
        heading: '5. Sonucun Bildirilmesi',
        body: [
          'Başvurunun sonucu ve uygulanan işlem, başvuruda belirtilen güvenli iletişim kanalından ilgili kişiye bildirilir. Talebin reddedilmesi hâlinde gerekçe açıklanır.',
        ],
      },
    ],
  },

  'iade-politikasi': {
    slug: 'iade-politikasi',
    navLabel: 'İade Politikası',
    title: 'İade Politikası',
    updated: 'Temmuz 2026',
    intro:
      'Bu politika, Aserai paket ve modül satın alımlarında cayma, iptal ve bedel iadesi taleplerinin hangi esaslarla değerlendirildiğini açıklar.',
    sections: [
      {
        heading: '1. Politikanın Kapsamı',
        body: [
          'Politika; internet sitesi üzerinden satın alınan paket, modül ve dijital hizmetler için geçerlidir. Tüketicilerin emredici mevzuattan doğan hakları her durumda saklıdır.',
        ],
      },
      {
        heading: '2. Cayma Hakkı',
        body: [
          'Tüketici niteliğindeki alıcılar, mevzuattaki istisnalar saklı kalmak üzere, mesafeli hizmet sözleşmesinin kurulmasından itibaren on dört gün içinde cayma hakkını kullanabilir.',
          'Cayma süresi sona ermeden açık onayla ifasına başlanan hizmetler ve anında teslim edilen dijital içerikler için yasal istisnalar uygulanabilir.',
        ],
      },
      {
        heading: '3. Dönem Sonu İptal',
        body: [
          'Lisanslarım alanından verilen iptal talebi, mevcut fatura döneminin sonuna planlanır. Paket ve bağlı modüller bitiş tarihine kadar kullanılabilir; planlı iptal tek başına otomatik veya oransal iade oluşturmaz.',
          'Kanuni cayma hakkı, ayıplı hizmet ve ifa edilmemiş hizmete ilişkin talepler bu kuralın dışındadır ve somut işleme göre ayrıca değerlendirilir.',
        ],
      },
      {
        heading: '4. İade Talebi',
        body: [
          'Talep; sipariş numarası, hesap e-postası, satın alınan hizmet, talep nedeni ve tercih edilen iletişim bilgisiyle birlikte İade Formu veya iletişim kanalları üzerinden iletilmelidir.',
        ],
      },
      {
        heading: '5. Değerlendirme ve Ödeme',
        body: [
          'Talep; hizmetin etkinleştirilme ve kullanım durumu, sözleşme koşulları ve uygulanabilir mevzuat dikkate alınarak incelenir. Onaylanan iadeler, kanuni süreler ve ödeme kuruluşunun işlem kuralları içinde, mümkünse ilk ödeme yöntemine yapılır.',
        ],
      },
      {
        heading: '6. Ticari Alımlar',
        body: [
          'Ticari veya mesleki amaçla yapılan alımlarda tüketici cayma hakkı uygulanmayabilir; iade ve fesih talepleri taraflar arasındaki sözleşme, sipariş ve hizmet koşullarına göre değerlendirilir.',
        ],
      },
    ],
  },

  'iade-formu': {
    slug: 'iade-formu',
    navLabel: 'İade Formu',
    title: 'İade ve Cayma Bildirim Formu',
    updated: 'Temmuz 2026',
    intro:
      'Cayma veya iade talebinizi iletirken aşağıdaki bilgileri eksiksiz biçimde belirtin. Form, iletişim sayfasındaki kanallardan Aserai’ye gönderilebilir.',
    sections: [
      {
        heading: '1. Müşteri Bilgileri',
        body: [
          'Ad-soyad / ticaret unvanı:',
          'Hesaba kayıtlı e-posta adresi:',
          'Telefon numarası:',
        ],
      },
      {
        heading: '2. Sipariş Bilgileri',
        body: [
          'Sipariş veya fatura numarası:',
          'Satın alma tarihi:',
          'Paket / modül / hizmet adı:',
          'Ödenen toplam tutar ve ödeme yöntemi:',
        ],
      },
      {
        heading: '3. Talep Bilgileri',
        body: [
          'Talep türü: Cayma / İade / Ayıplı hizmet / Diğer',
          'Talebin açıklaması:',
          'Varsa destek talebi veya ilgili belge numarası:',
        ],
      },
      {
        heading: '4. Beyan ve Gönderim',
        body: [
          'Yukarıdaki bilgilerin doğru olduğunu ve belirtilen siparişe ilişkin cayma veya iade talebimi ilettiğimi beyan ederim.',
          'Tarih:',
          'Ad-soyad ve imza (yazılı başvurularda):',
          'Başvurunuza hesap parolası, kartın tam numarası, CVV veya gereksiz kişisel veri eklemeyin.',
        ],
      },
    ],
  },

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
