import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, Navigate, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useEditMode } from '../../context/EditModeContext.jsx'
import { normalizeImageUrl, uploadCardImage } from '../../lib/imageUpload.js'
import { logAdminAction } from '../../lib/auditLog.js'
import BlogCover from '../../components/BlogCover/BlogCover.jsx'
import '../../components/PageHeader/PageHeader.css'
import './Akademi.css'

const DEFAULT_HEADER = {
  eyebrow: 'Aserai Akademi',
  title: 'Aserai kullanım kılavuzu ve eğitim merkezi',
  text: 'Kullanım adımları, sık sorulan sorular, yol haritası, video içerikleri ve hata çözüm rehberleri tek yerde.',
}

const emptyContent = {
  steps: [],
  notes: [],
  qa: [],
  roadmap: [],
  videos: [],
  issues: [],
  codes: [],
}

const academySections = [
  {
    slug: 'kullanim-kilavuzu',
    label: 'Kullanım Kılavuzu',
    eyebrow: 'Başlangıç',
    title: 'Aserai Kullanım Kılavuzu',
    intro:
      'Aserai panelinde mağaza kurulumu, günlük operasyon ve yönetim ekranları için temel çalışma akışı.',
    content: {
      steps: [
        'Hesabınızı oluşturun ve firma bilgilerinizi Profilim ekranından tamamlayın.',
        'Paketinizi seçip ödeme talebinizi oluşturun; onay sonrası lisansınız panelde görünür.',
        'Lisanslarım ekranından aktif paket, modül ve yenileme durumlarını takip edin.',
        'Destek Taleplerim üzerinden sorularınızı ek dosyalarla birlikte iletin.',
      ],
      notes: [
        'Yönetim kullanıcıları müşteri gibi alışveriş yapamaz; yönetim panelinden operasyon yürütür.',
        'Fatura ve ödeme kayıtları panelde ayrı ekranlardan izlenir.',
      ],
    },
  },
  {
    slug: 'urun-yukleme',
    label: 'Ürün Yükleme',
    eyebrow: 'Katalog',
    title: 'Ürün Yükleme Akışı',
    intro:
      'Ürünlerinizi Aserai’ye tekil giriş, toplu dosya veya entegrasyon kaynaklarıyla hazırlamak için izlenecek temel adımlar.',
    content: {
      steps: [
        'Ürün adını, açıklamasını ve kategori bilgisini netleştirin.',
        'Fiyat, stok, KDV ve varyant alanlarını eksiksiz doldurun.',
        'Görselleri aynı oran ve kaliteli dosyalarla yükleyin.',
        'Önizleme yapın, eksik alan uyarılarını giderin ve ürünü yayına alın.',
      ],
      notes: [
        'Toplu aktarımda SKU değerlerinin benzersiz olması gerekir.',
        'Eksik görsel veya varyant bilgisi satış kanallarında yayın sorununa yol açabilir.',
      ],
    },
  },
  {
    slug: 'urun-silme',
    label: 'Ürün Silme',
    eyebrow: 'Katalog',
    title: 'Ürün Silme ve Pasife Alma',
    intro:
      'Yayındaki ürünleri kalıcı olarak silmeden önce pasife alma ve geçmiş sipariş etkilerini kontrol etme rehberi.',
    content: {
      steps: [
        'Ürünün açık siparişlerde kullanılıp kullanılmadığını kontrol edin.',
        'Satışı durdurmak için önce ürünü pasife alın.',
        'Pazaryeri veya kanal eşleşmelerini kaldırın.',
        'Geçmiş raporlama gerekiyorsa kalıcı silme yerine arşivlemeyi tercih edin.',
      ],
      notes: [
        'Kalıcı silme geçmiş entegrasyon kayıtlarında kopukluğa neden olabilir.',
        'Silme işleminden önce ürün dışa aktarımı almak iyi bir güvenlik adımıdır.',
      ],
    },
  },
  {
    slug: 'api-hesaplari',
    label: 'API Hesapları Oluşturma',
    eyebrow: 'Entegrasyon',
    title: 'API Anahtarı Oluşturma',
    intro:
      'Harici sistemlerin Aserai verilerine erişmesi için güvenli API anahtarı oluşturma ve iptal etme akışı.',
    content: {
      steps: [
        'Müşteri panelinde API Anahtarlarım ekranını açın.',
        'Anahtar için anlaşılır bir ad girin ve gerekiyorsa firma seçin.',
        'Oluşturulan anahtarı yalnızca ilk gösterimde güvenli bir yerde saklayın.',
        'Kullanılmayan anahtarları aynı ekrandan iptal edin.',
      ],
      notes: [
        'API anahtarının tam değeri daha sonra tekrar görüntülenmez.',
        'Her entegrasyon için ayrı anahtar kullanmak erişim takibini kolaylaştırır.',
      ],
    },
  },
  {
    slug: 'sss',
    label: 'SSS',
    eyebrow: 'Yardım',
    title: 'Sık Sorulan Sorular',
    intro:
      'Aserai kurulumu, lisanslar, ödemeler ve destek süreçleri hakkında en sık karşılaşılan sorular.',
    content: {
      qa: [
        {
          q: 'Lisansım ne zaman aktif olur?',
          a: 'Sipariş durumu ödendi olarak onaylandığında lisans otomatik oluşur ve Lisanslarım ekranında görünür.',
        },
        {
          q: 'Faturamı nereden alırım?',
          a: 'Faturalarım ekranından fatura detayını açabilir, yazdır/PDF çıktısı alabilir veya yüklenmiş PDF dosyasını görüntüleyebilirsiniz.',
        },
        {
          q: 'Destek talebine dosya ekleyebilir miyim?',
          a: 'Evet. Destek talebi oluştururken veya yanıt yazarken PDF, görsel veya metin dosyası ekleyebilirsiniz.',
        },
      ],
    },
  },
  {
    slug: 'rehberler',
    label: 'Rehberler',
    eyebrow: 'Kaynak',
    title: 'Aserai Rehberleri',
    intro:
      'Kurulum, operasyon, entegrasyon ve büyüme konularında Akademi’ye özel uygulama rehberleri.',
    content: {},
  },
  {
    slug: 'yol-haritasi',
    label: 'Yol Haritaları',
    eyebrow: 'Plan',
    title: 'Ürün Yol Haritası',
    intro:
      'Aserai satış platformunun operasyonel gelişim başlıkları ve planlanan iyileştirme alanları.',
    content: {
      roadmap: [
        {
          phase: 'Kısa vade',
          text: 'Panel ekranlarının kullanım metrikleri ve destek içerikleriyle zenginleştirilmesi.',
        },
        {
          phase: 'Orta vade',
          text: 'Canlı ödeme ve e-fatura servis bağlantılarının devreye alınması.',
        },
        {
          phase: 'Uzun vade',
          text: 'Akademi içeriklerinin video, doküman ve sürüm notlarıyla CMS üzerinden yönetilmesi.',
        },
      ],
    },
  },
  {
    slug: 'video-icerikleri',
    label: 'Video İçerikleri',
    eyebrow: 'Eğitim',
    title: 'Video İçerikleri',
    intro:
      'Panel kullanımını adım adım anlatacak kısa eğitim videoları için önerilen içerik dizisi.',
    content: {
      videos: [
        { title: 'İlk giriş ve profil/firma bilgilerini tamamlama' },
        { title: 'Paket seçimi, sepet ve ödeme talebi oluşturma' },
        { title: 'Lisans yönetimi ve modül ekleme' },
        { title: 'Fatura, ödeme ve yenileme takibi' },
        { title: 'Destek talebi oluşturma ve dosya ekleme' },
      ],
    },
  },
  {
    slug: 'hatalar-ve-cozumler',
    label: 'Hatalar ve Çözümler',
    eyebrow: 'Destek',
    title: 'Hatalar ve Çözümler',
    intro:
      'Kullanım sırasında karşılaşılabilecek yaygın durumlar ve hızlı çözüm adımları.',
    content: {
      issues: [
        {
          issue: 'Ödeme kaydı beklemede görünüyor',
          solution:
            'Havale/EFT dekontunun yönetim tarafından onaylanması gerekir. Onay sonrası lisans ve fatura kayıtları güncellenir.',
        },
        {
          issue: 'API anahtarı tekrar görüntülenemiyor',
          solution:
            'Güvenlik nedeniyle anahtar yalnızca oluşturulduğu anda gösterilir. Gerekirse yeni anahtar oluşturup eski anahtarı iptal edin.',
        },
        {
          issue: 'Destek ek dosyası yüklenemiyor',
          solution:
            'Dosya boyutunun 10 MB altında ve PDF, JPG, PNG, WebP veya TXT formatında olduğundan emin olun.',
        },
      ],
    },
  },
  {
    slug: 'hata-kodlari',
    label: 'Hata Kodları',
    eyebrow: 'Referans',
    title: 'Hata Kodları',
    intro:
      'Destek ve entegrasyon süreçlerinde kullanılabilecek örnek hata kodları ve anlamları.',
    content: {
      codes: [
        {
          code: 'AUTH-401',
          text: 'Oturum doğrulanamadı. Kullanıcının tekrar giriş yapması gerekir.',
        },
        {
          code: 'PAY-202',
          text: 'Ödeme onay bekliyor. Yönetim panelinde ödeme durumu kontrol edilir.',
        },
        {
          code: 'LIC-409',
          text: 'Lisans için bekleyen işlem var. Yenileme veya modül talebi tamamlanmalıdır.',
        },
        {
          code: 'API-403',
          text: 'API anahtarı iptal edilmiş veya yetkisiz firma için kullanılıyor.',
        },
        {
          code: 'SUP-415',
          text: 'Destek ekinde desteklenmeyen dosya türü gönderildi.',
        },
      ],
    },
  },
]

const defaultSlug = academySections[0].slug
const guideRootSlug = 'rehberler'
const textTemplates = { steps: 'Yeni adım', notes: 'Yeni not' }
const objectTemplates = {
  qa: { q: 'Yeni soru', a: 'Yanıtı yazın', imageUrl: '' },
  roadmap: { phase: 'Yeni faz', text: 'Açıklama yazın', imageUrl: '' },
  videos: { title: 'Yeni video', url: '', imageUrl: '' },
  issues: { issue: 'Yeni hata', solution: 'Çözüm adımlarını yazın', imageUrl: '' },
  codes: { code: 'KOD-000', text: 'Açıklama yazın', imageUrl: '' },
}

const academyGuides = [
  {
    slug: 'ilk-kurulum-rehberi',
    title: 'Aserai İlk Kurulum Rehberi',
    excerpt:
      'Firma profilinden lisans kontrolüne kadar Aserai panelini kullanıma hazır hale getiren temel kurulum akışı.',
    category: 'Başlangıç',
    date: '2026-07-17',
    readingTime: '6 dk',
    author: 'Aserai Akademi',
    accent: '#1c3444',
    content: [
      {
        type: 'p',
        text: 'Aserai’de verimli bir başlangıç için önce hesabınızı, firma bilgilerinizi ve aktif lisans durumunuzu kontrol edin. Bu hazırlık sonraki tüm operasyon ekranlarının doğru çalışmasını sağlar.',
      },
      { type: 'h', text: 'Firma ve kullanıcı bilgileri' },
      {
        type: 'p',
        text: 'Profilim ekranında firma adı, yetkili kişi, telefon ve e-posta alanlarını tamamlayın. Yönetim ve müşteri panellerinde görünen bildirimlerin doğru kişilere ulaşması için bu bilgiler güncel kalmalıdır.',
      },
      { type: 'h', text: 'Lisans kontrolü' },
      {
        type: 'p',
        text: 'Lisanslarım ekranından aktif paket, dönem sonu tarihi ve ek modül durumlarını inceleyin. Bekleyen ödeme veya yenileme varsa önce bu işlemleri tamamlayın.',
      },
      { type: 'h', text: 'Destek ve doğrulama' },
      {
        type: 'p',
        text: 'E-posta doğrulama uyarısı görünüyorsa doğrulama kodunu girin. Kurulum sırasında takıldığınız adımlar için Destek Taleplerim ekranından dosya ekleyerek talep oluşturabilirsiniz.',
      },
    ],
  },
  {
    slug: 'urun-operasyon-rehberi',
    title: 'Ürün Operasyon Rehberi',
    excerpt:
      'Ürün yükleme, güncelleme, pasife alma ve silme kararlarında izlenecek güvenli operasyon yaklaşımı.',
    category: 'Operasyon',
    date: '2026-07-17',
    readingTime: '5 dk',
    author: 'Aserai Akademi',
    accent: '#234d63',
    content: [
      {
        type: 'p',
        text: 'Ürün operasyonlarında amaç sadece ürünü yayına almak değil; fiyat, stok, görsel ve geçmiş sipariş bütünlüğünü koruyarak satış kanallarını düzenli yönetmektir.',
      },
      { type: 'h', text: 'Ürün yayınlamadan önce' },
      {
        type: 'p',
        text: 'Ürün adı, kategori, SKU, fiyat, stok ve görsel alanlarını eksiksiz hazırlayın. Benzer ürünlerde aynı görsel oranını kullanmak vitrin kalitesini yükseltir.',
      },
      { type: 'h', text: 'Güncelleme ve pasife alma' },
      {
        type: 'p',
        text: 'Satışı durdurmak istediğiniz ürünlerde önce pasife alma yaklaşımını kullanın. Geçmiş siparişlerde referans gereken ürünleri kalıcı silmek yerine arşivlemek daha güvenlidir.',
      },
      { type: 'h', text: 'Hata kontrolü' },
      {
        type: 'p',
        text: 'Eksik varyant, hatalı stok veya desteklenmeyen görsel formatı gibi durumlarda ürün yayın akışını tamamlamadan önce uyarıları giderin.',
      },
    ],
  },
  {
    slug: 'api-entegrasyon-rehberi',
    title: 'API Hesapları ve Entegrasyon Rehberi',
    excerpt:
      'API anahtarı oluşturma, saklama, iptal etme ve entegrasyon güvenliğini yönetme adımları.',
    category: 'Entegrasyon',
    date: '2026-07-17',
    readingTime: '4 dk',
    author: 'Aserai Akademi',
    accent: '#04acfc',
    content: [
      {
        type: 'p',
        text: 'API anahtarları harici sistemlerin Aserai verilerine kontrollü erişmesini sağlar. Her entegrasyon için ayrı anahtar kullanmak güvenlik ve takip açısından daha sağlıklı bir modeldir.',
      },
      { type: 'h', text: 'Anahtar oluşturma' },
      {
        type: 'p',
        text: 'API Anahtarlarım ekranında anlaşılır bir ad girerek yeni anahtar oluşturun. Oluşturulan anahtar yalnızca ilk gösterimde tam olarak görülebilir.',
      },
      { type: 'h', text: 'Güvenli saklama' },
      {
        type: 'p',
        text: 'Anahtarı yalnızca yetkili entegrasyon ortamında saklayın. E-posta, mesajlaşma uygulaması veya ekran görüntüsüyle paylaşmaktan kaçının.',
      },
      { type: 'h', text: 'İptal ve yenileme' },
      {
        type: 'p',
        text: 'Kullanılmayan veya paylaşıldığından şüphelenilen anahtarları iptal edin. Yeni entegrasyonlar için eski anahtarları yeniden kullanmak yerine yeni anahtar üretin.',
      },
    ],
  },
]

function todayInIstanbul() {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

function normalizeGuide(row) {
  const readingTimeMinutes = Number(row.reading_time || row.readingTimeMinutes || 5)
  return {
    id: row.id || null,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    date: row.published_on || row.date || todayInIstanbul(),
    publishedOn: row.published_on || row.date || todayInIstanbul(),
    readingTime: `${readingTimeMinutes} dk`,
    readingTimeMinutes,
    author: row.author || 'Aserai Akademi',
    imageUrl: row.image_url || row.imageUrl || null,
    accent: row.accent || '#1c3444',
    content: Array.isArray(row.content) ? row.content : [],
    sortOrder: row.sort_order || row.sortOrder || 0,
    isActive: row.is_active !== false,
    isNew: Boolean(row.isNew),
    updatedAt: row.updated_at || row.updatedAt || null,
  }
}

function createGuideDraft(guides) {
  const title = 'Yeni Rehber'
  return normalizeGuide({
    slug: uniqueSlug(title, guides),
    title,
    excerpt: 'Bu rehberin kısa açıklamasını yazın.',
    category: 'Rehber',
    author: 'Aserai Akademi',
    reading_time: 5,
    published_on: todayInIstanbul(),
    accent: '#1c3444',
    sort_order: guides.length + 1,
    content: [{ type: 'p', text: 'Rehber giriş metnini yazın.' }],
    isNew: true,
  })
}

function validateGuideDraft(draft, guides) {
  const title = cleanString(draft.title)
  const slug = uniqueSlug(draft.slug || title, guides, draft.originalSlug || draft.slug)
  const excerpt = cleanString(draft.excerpt)
  const category = cleanString(draft.category)
  const author = cleanString(draft.author)
  const readingTime = Number(draft.readingTimeMinutes)
  const publishedOn = draft.publishedOn || draft.date
  const imageUrl = normalizeOptionalUrl(draft.imageUrl)
  const content = draft.content.map((block) => ({
    type: block.type === 'h' ? 'h' : 'p',
    text: cleanString(block.text),
  }))

  if (title.length < 3 || title.length > 180) {
    throw new Error('Rehber başlığı 3-180 karakter arasında olmalıdır.')
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length < 3) {
    throw new Error('Rehber bağlantı adresi en az 3 karakter olmalıdır.')
  }
  if (excerpt.length < 10 || excerpt.length > 600) {
    throw new Error('Rehber özeti 10-600 karakter arasında olmalıdır.')
  }
  if (category.length < 2 || category.length > 80) {
    throw new Error('Kategori 2-80 karakter arasında olmalıdır.')
  }
  if (author.length < 2 || author.length > 100) {
    throw new Error('Yazar adı 2-100 karakter arasında olmalıdır.')
  }
  if (!Number.isInteger(readingTime) || readingTime < 1 || readingTime > 180) {
    throw new Error('Okuma süresi 1-180 dakika arasında olmalıdır.')
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedOn)) {
    throw new Error('Geçerli bir yayın tarihi seçin.')
  }
  if (
    content.length < 1 ||
    content.length > 100 ||
    content.some((block) => !block.text || block.text.length > 10000)
  ) {
    throw new Error('Her rehber içerik bloğunu doldurun.')
  }

  return {
    slug,
    title,
    excerpt,
    category,
    author,
    reading_time: readingTime,
    published_on: publishedOn,
    image_url: imageUrl || null,
    accent: draft.accent || '#1c3444',
    content,
    sort_order: draft.sortOrder || guides.findIndex((guide) => guide.slug === draft.slug) + 1,
    is_active: true,
  }
}

const PencilIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
    <path
      d="M4 20h4L18 10l-4-4L4 16v4zM14 6l4 4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function normalizeContent(content = {}) {
  return {
    ...emptyContent,
    ...content,
    videos: Array.isArray(content.videos)
      ? content.videos.map((item) =>
          typeof item === 'string' ? { title: item, url: '', imageUrl: '' } : item,
        )
      : [],
  }
}

function normalizePage(row) {
  return {
    id: row.id || null,
    slug: row.slug,
    parentId: row.parent_id || row.parentId || null,
    label: row.label,
    eyebrow: row.eyebrow,
    title: row.title,
    intro: row.intro,
    imageUrl: row.image_url || row.imageUrl || '',
    sortOrder: row.sort_order || row.sortOrder || 0,
    isNew: Boolean(row.isNew),
    content: normalizeContent(row.content || row),
  }
}

function mergeAcademyPages(rows = [], hiddenSlugs = new Set()) {
  const fallbackPages = academySections.map(normalizePage)
  const rowMap = new Map(rows.map((row) => [row.slug, normalizePage(row)]))
  const fallbackSlugs = new Set(fallbackPages.map((page) => page.slug))
  const customPages = rows
    .filter((row) => !fallbackSlugs.has(row.slug))
    .map(normalizePage)
    .sort((a, b) => a.sortOrder - b.sortOrder)

  return [
    ...fallbackPages
      .filter((page) => !hiddenSlugs.has(page.slug))
      .map((page) => rowMap.get(page.slug) || page),
    ...customPages,
  ]
}

function buildAcademyTree(pages) {
  const visibleIds = new Set(pages.map((page) => page.id).filter(Boolean))
  const childrenByParent = new Map()

  pages.forEach((page) => {
    if (!page.parentId) return
    const list = childrenByParent.get(page.parentId) || []
    list.push(page)
    childrenByParent.set(page.parentId, list)
  })

  childrenByParent.forEach((children) => {
    children.sort((a, b) => a.sortOrder - b.sortOrder)
  })

  const roots = pages
    .filter((page) => !page.parentId || !visibleIds.has(page.parentId))
    .sort((a, b) => a.sortOrder - b.sortOrder)

  return { roots, childrenByParent }
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function slugify(value) {
  return cleanString(value)
    .toLocaleLowerCase('tr-TR')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function uniqueSlug(value, pages, ignoredSlug = '') {
  const base = slugify(value) || 'yeni-baslik'
  const existing = new Set(
    pages.filter((page) => page.slug !== ignoredSlug).map((page) => page.slug),
  )
  let next = base
  let counter = 2
  while (existing.has(next)) {
    next = `${base}-${counter}`
    counter += 1
  }
  return next
}

function createNewAcademyPage(pages, parent = null) {
  const isChild = Boolean(parent)
  const siblingCount = pages.filter((page) =>
    isChild ? page.parentId === parent.id : !page.parentId,
  ).length
  const slug = uniqueSlug(isChild ? 'yeni-alt-baslik' : 'yeni-baslik', pages)
  return normalizePage({
    slug,
    parent_id: parent?.id || null,
    label: isChild ? 'Yeni Alt Başlık' : 'Yeni Başlık',
    eyebrow: 'Akademi',
    title: isChild ? 'Yeni Akademi Alt Başlığı' : 'Yeni Akademi Başlığı',
    intro: 'Bu içeriğin açıklamasını yazın.',
    sort_order: siblingCount + 1,
    isNew: true,
    content: {
      steps: ['İlk içerik adımını yazın.'],
    },
  })
}

function normalizeOptionalUrl(value) {
  const raw = cleanString(value)
  return raw ? normalizeImageUrl(raw) : ''
}

function sanitizeContent(content) {
  return {
    steps: content.steps.map(cleanString).filter(Boolean),
    notes: content.notes.map(cleanString).filter(Boolean),
    qa: content.qa
      .map((item) => ({
        q: cleanString(item.q),
        a: cleanString(item.a),
        imageUrl: cleanString(item.imageUrl),
      }))
      .filter((item) => item.q || item.a || item.imageUrl),
    roadmap: content.roadmap
      .map((item) => ({
        phase: cleanString(item.phase),
        text: cleanString(item.text),
        imageUrl: cleanString(item.imageUrl),
      }))
      .filter((item) => item.phase || item.text || item.imageUrl),
    videos: content.videos
      .map((item) => ({
        title: cleanString(item.title),
        url: cleanString(item.url),
        imageUrl: cleanString(item.imageUrl),
      }))
      .filter((item) => item.title || item.url || item.imageUrl),
    issues: content.issues
      .map((item) => ({
        issue: cleanString(item.issue),
        solution: cleanString(item.solution),
        imageUrl: cleanString(item.imageUrl),
      }))
      .filter((item) => item.issue || item.solution || item.imageUrl),
    codes: content.codes
      .map((item) => ({
        code: cleanString(item.code),
        text: cleanString(item.text),
        imageUrl: cleanString(item.imageUrl),
      }))
      .filter((item) => item.code || item.text || item.imageUrl),
  }
}

function validateContentImages(content) {
  ;['qa', 'roadmap', 'videos', 'issues', 'codes'].forEach((key) => {
    content[key].forEach((item) => {
      if (item.imageUrl) normalizeImageUrl(item.imageUrl)
    })
  })
}

function EditablePageHeader({ header, editing, busy, onSave }) {
  if (!editing) {
    return (
      <section className="page-head akademi-page-head">
        <div className="page-head__glow" aria-hidden="true" />
        <div className="page-head__inner">
          {header.eyebrow && <span className="eyebrow">{header.eyebrow}</span>}
          <h1>{header.title}</h1>
          {header.text && <p>{header.text}</p>}
        </div>
      </section>
    )
  }

  return (
    <section className="page-head akademi-edit-head">
      <div className="page-head__glow" aria-hidden="true" />
      <form className="page-head__inner akademi-edit-form" onSubmit={onSave}>
        <input name="eyebrow" defaultValue={header.eyebrow} className="akademi-edit-in" />
        <input
          name="title"
          defaultValue={header.title}
          className="akademi-edit-in akademi-edit-in--hero"
          required
        />
        <textarea
          name="text"
          defaultValue={header.text}
          rows="3"
          className="akademi-edit-in"
        />
        <button type="submit" className="btn btn--primary" disabled={busy}>
          Üst başlığı kaydet
        </button>
      </form>
    </section>
  )
}

function TextListEditor({ title, items, onChange, onAdd, onRemove }) {
  return (
    <div className="akademi-editor-block">
      <div className="akademi-editor-block__head">
        <h3>{title}</h3>
        <button type="button" className="btn btn--ghost" onClick={onAdd}>
          Ekle
        </button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="akademi-editor-row">
          <textarea
            value={item}
            rows="2"
            className="akademi-edit-in"
            onChange={(e) => onChange(index, e.target.value)}
          />
          <button type="button" className="akademi-card__del" onClick={() => onRemove(index)}>
            Sil
          </button>
        </div>
      ))}
    </div>
  )
}

function ObjectListEditor({ title, items, fields, onChange, onAdd, onRemove, onUpload }) {
  return (
    <div className="akademi-editor-block">
      <div className="akademi-editor-block__head">
        <h3>{title}</h3>
        <button type="button" className="btn btn--ghost" onClick={onAdd}>
          Ekle
        </button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="akademi-editor-item">
          {fields.map((field) =>
            field.multiline ? (
              <textarea
                key={field.name}
                value={item[field.name] || ''}
                rows={field.rows || 3}
                placeholder={field.label}
                className="akademi-edit-in"
                onChange={(e) => onChange(index, field.name, e.target.value)}
              />
            ) : (
              <input
                key={field.name}
                value={item[field.name] || ''}
                placeholder={field.label}
                className="akademi-edit-in"
                onChange={(e) => onChange(index, field.name, e.target.value)}
              />
            ),
          )}
          <div className="akademi-image-edit">
            {item.imageUrl && (
              <span className="akademi-image-preview">
                <img src={item.imageUrl} alt="" />
              </span>
            )}
            <input
              value={item.imageUrl || ''}
              placeholder="Görsel HTTPS URL'si"
              className="akademi-edit-in"
              onChange={(e) => onChange(index, 'imageUrl', e.target.value)}
            />
            <label className="btn btn--ghost akademi-upload">
              Görsel yükle
              <input
                type="file"
                accept="image/avif,image/jpeg,image/png,image/webp"
                hidden
                onChange={(e) => onUpload(index, e)}
              />
            </label>
            <button type="button" className="akademi-card__del" onClick={() => onRemove(index)}>
              Sil
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function AcademyImage({ src, alt }) {
  if (!src) return null
  return (
    <figure className="akademi-visual">
      <img src={src} alt={alt} loading="lazy" />
    </figure>
  )
}

function CardImage({ src, alt }) {
  if (!src) return null
  return <img className="akademi-card__image" src={src} alt={alt} loading="lazy" />
}

function formatGuideDate(iso) {
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function GuideList({ guides, editing, onNew }) {
  return (
    <div className="akademi-guides">
      <span className="eyebrow">Rehberler</span>
      <h1>Aserai Rehberleri</h1>
      <p className="akademi-lead">
        Kurulum, operasyon ve entegrasyon süreçlerini blog formatında okuyun.
        Bu içerikler Akademi’ye özeldir ve blog yazılarıyla karışmaz.
      </p>

      {editing && (
        <div className="akademi-guide-actions">
          <button type="button" className="btn btn--primary" onClick={onNew}>
            Yeni rehber ekle
          </button>
        </div>
      )}

      <div className="akademi-guide-grid">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            to={`/akademi/${guideRootSlug}/${guide.slug}`}
            className="akademi-guide-card"
          >
            <BlogCover post={guide} className="akademi-guide-card__cover" />
            <div className="akademi-guide-card__body">
              <span className="akademi-guide-card__meta">
                {formatGuideDate(guide.date)} · {guide.readingTime}
              </span>
              <h3>{guide.title}</h3>
              <p>{guide.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function GuideDetail({ guide }) {
  if (!guide) {
    return (
      <div className="akademi-guides">
        <span className="eyebrow">Rehberler</span>
        <h1>Rehber bulunamadı</h1>
        <p className="akademi-lead">
          Aradığınız rehber mevcut değil. Tüm rehberlere geri dönebilirsiniz.
        </p>
        <Link to={`/akademi/${guideRootSlug}`} className="btn btn--primary">
          Tüm rehberler
        </Link>
      </div>
    )
  }

  return (
    <div className="akademi-guide-post">
      <span className="eyebrow">{guide.category}</span>
      <h1>{guide.title}</h1>
      <p className="akademi-lead">{guide.excerpt}</p>

      <BlogCover
        post={guide}
        className="akademi-guide-post__cover"
        showCategory={false}
        loading="eager"
      />

      <div className="akademi-guide-post__meta">
        <Link to={`/akademi/${guideRootSlug}`} className="akademi-guide-post__back">
          <span aria-hidden="true">←</span> Tüm rehberler
        </Link>
        <span>
          {formatGuideDate(guide.date)} · {guide.readingTime} okuma · {guide.author}
        </span>
      </div>

      <div className="akademi-guide-post__body">
        {guide.content.map((block, index) =>
          block.type === 'h' ? (
            <h2 key={`${block.text}-${index}`}>{block.text}</h2>
          ) : (
            <p key={`${block.text}-${index}`}>{block.text}</p>
          ),
        )}
      </div>
    </div>
  )
}

function GuideEditor({
  draft,
  busy,
  uploading,
  actionError,
  onSave,
  onCancel,
  onChange,
  onUpload,
  onBlockChange,
  onBlockAdd,
  onBlockRemove,
  onBlockMove,
}) {
  return (
    <form className="akademi-section-editor akademi-guide-editor" onSubmit={onSave}>
      <div className="akademi-editor-block">
        <h3>{draft.id ? 'Rehberi düzenle' : 'Yeni rehber'}</h3>
        <input
          value={draft.title}
          placeholder="Rehber başlığı"
          className="akademi-edit-in akademi-edit-in--title"
          onChange={(e) => onChange('title', e.target.value)}
        />
        <input
          value={draft.slug}
          placeholder="URL slug"
          className="akademi-edit-in"
          onChange={(e) => onChange('slug', e.target.value)}
        />
        <textarea
          value={draft.excerpt}
          rows="3"
          placeholder="Rehber özeti"
          className="akademi-edit-in"
          onChange={(e) => onChange('excerpt', e.target.value)}
        />
        <div className="akademi-guide-editor__grid">
          <input
            value={draft.category}
            placeholder="Kategori"
            className="akademi-edit-in"
            onChange={(e) => onChange('category', e.target.value)}
          />
          <input
            value={draft.author}
            placeholder="Yazar"
            className="akademi-edit-in"
            onChange={(e) => onChange('author', e.target.value)}
          />
          <input
            type="number"
            min="1"
            max="180"
            value={draft.readingTimeMinutes}
            placeholder="Okuma süresi"
            className="akademi-edit-in"
            onChange={(e) => onChange('readingTimeMinutes', Number(e.target.value))}
          />
          <input
            type="date"
            value={draft.publishedOn || draft.date}
            className="akademi-edit-in"
            onChange={(e) => onChange('publishedOn', e.target.value)}
          />
        </div>
        <div className="akademi-image-edit">
          {draft.imageUrl && (
            <span className="akademi-image-preview">
              <img src={draft.imageUrl} alt="" />
            </span>
          )}
          <input
            value={draft.imageUrl || ''}
            placeholder="Kapak görseli HTTPS URL'si"
            className="akademi-edit-in"
            onChange={(e) => onChange('imageUrl', e.target.value)}
          />
          <label className="btn btn--ghost akademi-upload">
            {uploading === 'guide' ? 'Yükleniyor...' : 'Kapak görseli yükle'}
            <input
              type="file"
              accept="image/avif,image/jpeg,image/png,image/webp"
              hidden
              onChange={onUpload}
            />
          </label>
        </div>
      </div>

      <div className="akademi-editor-block">
        <div className="akademi-editor-block__head">
          <h3>Rehber içeriği</h3>
          <div className="akademi-editor-actions">
            <button type="button" className="btn btn--ghost" onClick={() => onBlockAdd('h')}>
              Başlık ekle
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => onBlockAdd('p')}>
              Paragraf ekle
            </button>
          </div>
        </div>
        {draft.content.map((block, index) => (
          <div key={index} className="akademi-editor-item">
            <select
              value={block.type}
              className="akademi-edit-in"
              onChange={(e) => onBlockChange(index, 'type', e.target.value)}
            >
              <option value="p">Paragraf</option>
              <option value="h">Başlık</option>
            </select>
            <textarea
              value={block.text}
              rows={block.type === 'h' ? 2 : 5}
              placeholder={block.type === 'h' ? 'Alt başlık' : 'Paragraf metni'}
              className="akademi-edit-in"
              onChange={(e) => onBlockChange(index, 'text', e.target.value)}
            />
            <div className="akademi-editor-actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => onBlockMove(index, -1)}
                disabled={index === 0}
              >
                Yukarı
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => onBlockMove(index, 1)}
                disabled={index === draft.content.length - 1}
              >
                Aşağı
              </button>
              <button
                type="button"
                className="akademi-card__del"
                onClick={() => onBlockRemove(index)}
                disabled={draft.content.length <= 1}
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {actionError && (
        <span className="panel-error akademi-editor-error" role="alert">
          {actionError}
        </span>
      )}
      <div className="akademi-editor-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={busy}>
          Vazgeç
        </button>
        <button type="submit" className="btn btn--primary" disabled={busy || uploading}>
          Kaydet
        </button>
      </div>
    </form>
  )
}

function AcademyEmptyState({ editing, onAdd }) {
  return (
    <div className="akademi-empty">
      <span className="eyebrow">Akademi</span>
      <h1>Henüz Akademi başlığı yok</h1>
      <p className="akademi-lead">
        Akademi içerikleri silinmiş veya henüz oluşturulmamış. Başlıklar
        eklendiğinde sol menüde listelenir ve içerikler burada okunur.
      </p>
      {editing && (
        <button type="button" className="btn btn--primary" onClick={onAdd}>
          İlk başlığı ekle
        </button>
      )}
    </div>
  )
}

export default function Akademi() {
  const { slug, guideSlug } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const { editMode } = useEditMode()
  const editing = editMode && isAdmin
  const pendingEditSlug = useRef('')

  const [header, setHeader] = useState(DEFAULT_HEADER)
  const [pages, setPages] = useState(academySections.map(normalizePage))
  const [guides, setGuides] = useState(academyGuides.map(normalizeGuide))
  const [draft, setDraft] = useState(null)
  const [guideDraft, setGuideDraft] = useState(null)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState('')
  const [actionError, setActionError] = useState('')
  const [draggedPage, setDraggedPage] = useState(null)
  const [dragOverSlug, setDragOverSlug] = useState('')

  const activeSlug = slug || defaultSlug
  const active = pages.find((section) => section.slug === activeSlug)
  const { roots, childrenByParent } = useMemo(() => buildAcademyTree(pages), [pages])
  const [openGroups, setOpenGroups] = useState(() => new Set())
  const isGuidesPage = active?.slug === guideRootSlug
  const selectedGuide = isGuidesPage && guideSlug
    ? guides.find((guide) => guide.slug === guideSlug)
    : null

  const load = async () => {
    if (!supabase) return

    const [settingsResult, pagesResult, guidesResult] = await Promise.all([
      supabase.from('academy_settings').select('*').eq('key', 'main').maybeSingle(),
      supabase
        .from('academy_pages')
        .select('*')
        .order('sort_order', { ascending: true }),
      supabase
        .from('academy_guides')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('published_on', { ascending: false }),
    ])

    if (settingsResult.data) {
      setHeader({
        eyebrow: settingsResult.data.eyebrow,
        title: settingsResult.data.title,
        text: settingsResult.data.description,
      })
    }

    if (pagesResult.data?.length) {
      const hiddenSlugs = new Set(
        pagesResult.data
          .filter((page) => page.is_active === false)
          .map((page) => page.slug),
      )
      setPages(
        mergeAcademyPages(
          pagesResult.data.filter((page) => page.is_active !== false),
          hiddenSlugs,
        ),
      )
    }

    if (!guidesResult.error && guidesResult.data?.length) {
      setGuides(guidesResult.data.map(normalizeGuide))
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    setDraft(null)
    setGuideDraft(null)
    setActionError('')
    if (editing && pendingEditSlug.current && pendingEditSlug.current === active?.slug) {
      pendingEditSlug.current = ''
      setDraft({
        ...active,
        imageUrl: active.imageUrl || '',
        content: normalizeContent(active.content),
      })
    }
  }, [activeSlug, editMode, active?.slug, editing])

  useEffect(() => {
    if (!active?.parentId) return
    setOpenGroups((current) => {
      const next = new Set(current)
      next.add(active.parentId)
      return next
    })
  }, [active?.parentId])

  const content = useMemo(() => normalizeContent(active?.content), [active])

  if (!active && pages.length > 0) {
    const fallbackPage = roots[0] || pages[0]
    return <Navigate to={`/akademi/${fallbackPage.slug}`} replace />
  }

  const saveHeader = async (e) => {
    e.preventDefault()
    const f = e.target
    setBusy(true)
    setActionError('')
    const payload = {
      key: 'main',
      eyebrow: f.eyebrow.value,
      title: f.title.value,
      description: f.text.value,
      updated_at: new Date().toISOString(),
    }
    const { error } = await supabase.from('academy_settings').upsert(payload, { onConflict: 'key' })
    setBusy(false)
    if (error) {
      setActionError(error.message || 'Üst başlık kaydedilemedi.')
      return
    }
    setHeader({ eyebrow: payload.eyebrow, title: payload.title, text: payload.description })
    await logAdminAction('academy.header_update', 'academy_settings', null, {
      title: payload.title,
    })
  }

  const startEdit = () => {
    setDraft({
      ...active,
      imageUrl: active.imageUrl || '',
      content: normalizeContent(active.content),
    })
    setActionError('')
  }

  const openNewGuide = () => {
    setGuideDraft(createGuideDraft(guides))
    setActionError('')
  }

  const openEditGuide = (guide) => {
    if (!guide) return
    setGuideDraft({
      ...guide,
      originalSlug: guide.slug,
      imageUrl: guide.imageUrl || '',
      content: guide.content.length
        ? guide.content.map((block) => ({ ...block }))
        : [{ type: 'p', text: '' }],
    })
    setActionError('')
  }

  const closeGuideDraft = () => {
    setGuideDraft(null)
    setActionError('')
  }

  const updateGuideBlock = (index, field, value) => {
    setGuideDraft((current) => ({
      ...current,
      content: current.content.map((block, blockIndex) =>
        blockIndex === index ? { ...block, [field]: value } : block,
      ),
    }))
  }

  const addGuideBlock = (type) => {
    setGuideDraft((current) => ({
      ...current,
      content: [...current.content, { type, text: '' }],
    }))
  }

  const removeGuideBlock = (index) => {
    setGuideDraft((current) => ({
      ...current,
      content: current.content.filter((_, blockIndex) => blockIndex !== index),
    }))
  }

  const moveGuideBlock = (index, direction) => {
    setGuideDraft((current) => {
      const nextIndex = index + direction
      if (nextIndex < 0 || nextIndex >= current.content.length) return current
      const content = [...current.content]
      const movingBlock = content[index]
      content[index] = content[nextIndex]
      content[nextIndex] = movingBlock
      return { ...current, content }
    })
  }

  const uploadGuideImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading('guide')
    setActionError('')
    try {
      const url = await uploadCardImage('academy-guides', file)
      setGuideDraft((current) => ({ ...current, imageUrl: url }))
    } catch (error) {
      setActionError(error.message || 'Rehber kapak görseli yüklenemedi.')
    } finally {
      setUploading('')
      e.target.value = ''
    }
  }

  const saveGuide = async (e) => {
    e.preventDefault()
    setBusy(true)
    setActionError('')

    let payload
    try {
      payload = validateGuideDraft(
        guideDraft,
        guides,
      )
    } catch (error) {
      setBusy(false)
      setActionError(error.message)
      return
    }

    if (!supabase) {
      const nextGuide = normalizeGuide({ ...payload, id: guideDraft.id || crypto.randomUUID() })
      setGuides((current) =>
        guideDraft.id || guideDraft.originalSlug
          ? current.map((guide) =>
              guide.slug === (guideDraft.originalSlug || guideDraft.slug) ? nextGuide : guide,
            )
          : [...current, nextGuide],
      )
      setGuideDraft(null)
      setBusy(false)
      navigate(`/akademi/${guideRootSlug}/${nextGuide.slug}`, { replace: true })
      return
    }

    const query = guideDraft.id
      ? supabase.from('academy_guides').update(payload).eq('id', guideDraft.id)
      : supabase.from('academy_guides').insert(payload).select('id').single()

    const { data, error } = await query
    setBusy(false)

    if (error) {
      setActionError(
        error.code === '42P01' || error.code === 'PGRST205'
          ? 'Rehberleri kaydetmek için 0027_academy_guides_table.sql migrationını çalıştırın.'
          : error.message || 'Rehber kaydedilemedi.',
      )
      return
    }

    await logAdminAction(
      guideDraft.id ? 'academy.guide_update' : 'academy.guide_create',
      'academy_guide',
      guideDraft.id || data?.id || null,
      { slug: payload.slug, title: payload.title },
    )
    setGuideDraft(null)
    await load()
    navigate(`/akademi/${guideRootSlug}/${payload.slug}`, { replace: true })
  }

  const addPage = () => {
    const page = createNewAcademyPage(pages)
    pendingEditSlug.current = page.slug
    setPages((current) => [...current, page])
    navigate(`/akademi/${page.slug}`)
  }

  const addSubPage = (parent) => {
    if (!parent.id) {
      setActionError('Alt başlık eklemek için Akademi veritabanı migrationlarını çalıştırın.')
      return
    }
    const page = createNewAcademyPage(pages, parent)
    pendingEditSlug.current = page.slug
    setOpenGroups((current) => {
      const next = new Set(current)
      next.add(parent.id)
      return next
    })
    setPages((current) => [...current, page])
    navigate(`/akademi/${page.slug}`)
  }

  const canDragPage = (page) => Boolean(editing && !busy && !draft && page)

  const startPageDrag = (e, page) => {
    if (!canDragPage(page)) return
    setDraggedPage({ slug: page.slug, parentId: page.parentId || null })
    setDragOverSlug('')
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', page.slug)
  }

  const endPageDrag = () => {
    setDraggedPage(null)
    setDragOverSlug('')
  }

  const handlePageDragOver = (e, targetPage) => {
    if (!draggedPage || !targetPage || draggedPage.slug === targetPage.slug) return
    if ((draggedPage.parentId || null) !== (targetPage.parentId || null)) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverSlug(targetPage.slug)
  }

  const reorderPages = async (dragSlug, targetSlug) => {
    if (!dragSlug || !targetSlug || dragSlug === targetSlug) return

    const dragging = pages.find((page) => page.slug === dragSlug)
    const target = pages.find((page) => page.slug === targetSlug)
    if (!dragging || !target) return
    if ((dragging.parentId || null) !== (target.parentId || null)) return

    const siblings = (dragging.parentId
      ? childrenByParent.get(dragging.parentId) || []
      : roots
    ).filter((page) => page.slug !== dragSlug)
    const targetIndex = siblings.findIndex((page) => page.slug === targetSlug)
    if (targetIndex < 0) return

    const reordered = [...siblings]
    reordered.splice(targetIndex, 0, dragging)
    const sortMap = new Map(
      reordered.map((page, index) => [page.slug, index + 1]),
    )
    const previousPages = pages
    const nextPages = pages.map((page) =>
      sortMap.has(page.slug) ? { ...page, sortOrder: sortMap.get(page.slug) } : page,
    )

    setPages(nextPages)
    setDraggedPage(null)
    setDragOverSlug('')

    if (!supabase) return

    const updates = reordered.filter((page) => page.id && !page.isNew)
    if (!updates.length) return

    setBusy(true)
    setActionError('')
    const results = await Promise.all(
      updates.map((page, index) =>
        supabase
          .from('academy_pages')
          .update({ sort_order: index + 1, updated_at: new Date().toISOString() })
          .eq('id', page.id),
      ),
    )
    setBusy(false)

    const failed = results.find((result) => result.error)
    if (failed) {
      setPages(previousPages)
      setActionError(failed.error.message || 'Başlık sıralaması kaydedilemedi.')
      return
    }

    await logAdminAction('academy.page_reorder', 'academy_page', dragging.id || null, {
      slug: dragging.slug,
      parentId: dragging.parentId || null,
    })
  }

  const dropPage = (e, targetPage) => {
    e.preventDefault()
    const dragSlug = draggedPage?.slug || e.dataTransfer.getData('text/plain')
    void reorderPages(dragSlug, targetPage.slug)
  }

  const toggleGroup = (pageId) => {
    setOpenGroups((current) => {
      const next = new Set(current)
      if (next.has(pageId)) next.delete(pageId)
      else next.add(pageId)
      return next
    })
  }

  const closeDraft = () => {
    if (draft?.isNew) {
      setPages((current) => current.filter((page) => page.slug !== draft.slug))
      navigate(`/akademi/${defaultSlug}`, { replace: true })
    }
    setDraft(null)
    setActionError('')
  }

  const deletePage = async (page) => {
    if (pages.length <= 1) {
      setActionError('En az bir Akademi başlığı kalmalı.')
      return
    }
    if (!window.confirm(`"${page.label}" başlığını silmek istiyor musunuz?`)) return

    const childIds = new Set((childrenByParent.get(page.id) || []).map((item) => item.id))
    const nextPage = pages.find(
      (item) => item.slug !== page.slug && !childIds.has(item.id),
    )
    if (page.isNew) {
      setPages((current) =>
        current.filter((item) => item.slug !== page.slug && item.parentId !== page.id),
      )
      if (active.slug === page.slug && nextPage) {
        navigate(`/akademi/${nextPage.slug}`, { replace: true })
      }
      return
    }

    setBusy(true)
    setActionError('')
    const payload = {
      slug: page.slug,
      label: page.label,
      eyebrow: page.eyebrow,
      title: page.title,
      intro: page.intro,
      image_url: page.imageUrl || null,
      content: normalizeContent(page.content),
      sort_order: page.sortOrder || pages.findIndex((item) => item.slug === page.slug) + 1,
      is_active: false,
      updated_at: new Date().toISOString(),
    }
    const query = page.id
      ? supabase
          .from('academy_pages')
          .update({ is_active: false, updated_at: payload.updated_at })
          .or(`id.eq.${page.id},parent_id.eq.${page.id}`)
      : supabase.from('academy_pages').upsert(payload, { onConflict: 'slug' })
    const { error } = await query
    setBusy(false)

    if (error) {
      setActionError(error.message || 'Başlık silinemedi.')
      return
    }

    await logAdminAction('academy.page_delete', 'academy_page', page.id || null, {
      slug: page.slug,
      label: page.label,
    })
    setDraft(null)
    await load()
    if (active.slug === page.slug && nextPage) {
      navigate(`/akademi/${nextPage.slug}`, { replace: true })
    }
  }

  const updateDraftContent = (key, value) => {
    setDraft((current) => ({
      ...current,
      content: { ...current.content, [key]: value },
    }))
  }

  const updateTextList = (key, index, value) => {
    updateDraftContent(
      key,
      draft.content[key].map((item, itemIndex) => (itemIndex === index ? value : item)),
    )
  }

  const addTextItem = (key) => updateDraftContent(key, [...draft.content[key], textTemplates[key]])

  const removeTextItem = (key, index) => {
    updateDraftContent(
      key,
      draft.content[key].filter((_, itemIndex) => itemIndex !== index),
    )
  }

  const updateObjectList = (key, index, field, value) => {
    updateDraftContent(
      key,
      draft.content[key].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    )
  }

  const addObjectItem = (key) => {
    updateDraftContent(key, [...draft.content[key], { ...objectTemplates[key] }])
  }

  const removeObjectItem = (key, index) => {
    updateDraftContent(
      key,
      draft.content[key].filter((_, itemIndex) => itemIndex !== index),
    )
  }

  const uploadImageToDraft = async (field, e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(field)
    setActionError('')
    try {
      const url = await uploadCardImage('academy', file)
      if (field === 'section') {
        setDraft((current) => ({ ...current, imageUrl: url }))
      } else {
        const [key, index] = field.split(':')
        updateObjectList(key, Number(index), 'imageUrl', url)
      }
    } catch (error) {
      setActionError(error.message || 'Görsel yüklenemedi.')
    } finally {
      setUploading('')
      e.target.value = ''
    }
  }

  const saveSection = async (e) => {
    e.preventDefault()
    setBusy(true)
    setActionError('')

    let imageUrl
    let contentPayload
    try {
      imageUrl = normalizeOptionalUrl(draft.imageUrl)
      contentPayload = sanitizeContent(draft.content)
      validateContentImages(contentPayload)
    } catch (error) {
      setBusy(false)
      setActionError(error.message)
      return
    }

    const slugValue = uniqueSlug(draft.slug || draft.label, pages, active.slug)
    const payload = {
      slug: slugValue,
      parent_id: draft.parentId || null,
      label: cleanString(draft.label) || 'Yeni Başlık',
      eyebrow: draft.eyebrow,
      title: draft.title,
      intro: draft.intro,
      image_url: imageUrl || null,
      content: contentPayload,
      sort_order: draft.sortOrder || pages.findIndex((page) => page.slug === active.slug) + 1,
      is_active: true,
      updated_at: new Date().toISOString(),
    }

    const query = draft.id
      ? supabase.from('academy_pages').update(payload).eq('id', draft.id)
      : supabase
          .from('academy_pages')
          .upsert(payload, { onConflict: 'slug' })
          .select('id')
          .single()
    const { data, error } = await query
    setBusy(false)

    if (error) {
      setActionError(error.message || 'Akademi sayfası kaydedilemedi.')
      return
    }

    await logAdminAction(
      draft.id ? 'academy.page_update' : 'academy.page_create',
      'academy_page',
      draft.id || data?.id || null,
      {
        slug: payload.slug,
        label: payload.label,
        title: payload.title,
      },
    )
    setDraft(null)
    await load()
    if (payload.slug !== active.slug) navigate(`/akademi/${payload.slug}`, { replace: true })
  }

  return (
    <>
      <EditablePageHeader
        header={header}
        editing={editing}
        busy={busy}
        onSave={saveHeader}
      />

      <section className="section akademi-section">
        <div className="container akademi-layout">
          <aside className="akademi-side" aria-label="Aserai Akademi başlıkları">
            <span className="akademi-side__title">Başlıklar</span>
            <nav>
              {roots.length === 0 && (
                <span className="akademi-side__empty">
                  Henüz başlık yok
                </span>
              )}
              {roots.map((section) => {
                const children = childrenByParent.get(section.id) || []
                const hasChildren = children.length > 0
                const isOpen = section.id && openGroups.has(section.id)
                const groupActive =
                  active?.slug === section.slug ||
                  children.some((child) => child.slug === active?.slug)

                return (
                  <div
                    key={section.slug}
                    className={`akademi-side__group ${
                      groupActive ? 'is-active' : ''
                    } ${draggedPage?.slug === section.slug ? 'is-dragging' : ''} ${
                      dragOverSlug === section.slug ? 'is-drop-target' : ''
                    }`}
                    draggable={canDragPage(section)}
                    onDragStart={(e) => startPageDrag(e, section)}
                    onDragEnd={endPageDrag}
                    onDragOver={(e) => handlePageDragOver(e, section)}
                    onDrop={(e) => dropPage(e, section)}
                  >
                    <div className="akademi-side__item">
                      {hasChildren ? (
                        <button
                          type="button"
                          className={`akademi-side__link akademi-side__toggle ${
                            groupActive ? 'active' : ''
                          }`}
                          onClick={() => toggleGroup(section.id)}
                          aria-expanded={Boolean(isOpen)}
                        >
                          <span>{section.label}</span>
                          <span className="akademi-side__caret" aria-hidden="true">
                            ›
                          </span>
                        </button>
                      ) : (
                        <NavLink
                          to={`/akademi/${section.slug}`}
                          className="akademi-side__link"
                        >
                          <span>{section.label}</span>
                        </NavLink>
                      )}
                      {editing && section.slug !== guideRootSlug && (
                        <button
                          type="button"
                          className="akademi-side__delete"
                          onClick={() => deletePage(section)}
                          disabled={busy || Boolean(draft)}
                          aria-label={`${section.label} başlığını sil`}
                        >
                          Sil
                        </button>
                      )}
                    </div>

                    {editing && section.slug !== guideRootSlug && (
                      <button
                        type="button"
                        className="akademi-side__subadd"
                        onClick={() => addSubPage(section)}
                        disabled={busy || Boolean(draft)}
                      >
                        + Alt başlık ekle
                      </button>
                    )}

                    {hasChildren && isOpen && (
                      <div className="akademi-side__children">
                        {children.map((child) => (
                          <div
                            key={child.slug}
                            className={`akademi-side__item akademi-side__item--child ${
                              draggedPage?.slug === child.slug ? 'is-dragging' : ''
                            } ${dragOverSlug === child.slug ? 'is-drop-target' : ''}`}
                            draggable={canDragPage(child)}
                            onDragStart={(e) => {
                              e.stopPropagation()
                              startPageDrag(e, child)
                            }}
                            onDragEnd={(e) => {
                              e.stopPropagation()
                              endPageDrag()
                            }}
                            onDragOver={(e) => {
                              e.stopPropagation()
                              handlePageDragOver(e, child)
                            }}
                            onDrop={(e) => {
                              e.stopPropagation()
                              dropPage(e, child)
                            }}
                          >
                            <NavLink
                              to={`/akademi/${child.slug}`}
                              className="akademi-side__link akademi-side__link--child"
                            >
                              <span>{child.label}</span>
                            </NavLink>
                            {editing && (
                              <button
                                type="button"
                                className="akademi-side__delete"
                                onClick={() => deletePage(child)}
                                disabled={busy || Boolean(draft)}
                                aria-label={`${child.label} alt başlığını sil`}
                              >
                                Sil
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
            {editing && (
              <button
                type="button"
                className="akademi-side__add"
                onClick={addPage}
                disabled={busy || Boolean(draft) || Boolean(guideDraft)}
              >
                + Yeni başlık ekle
              </button>
            )}
            {editing && actionError && !draft && (
              <span className="panel-error akademi-side__error" role="alert">
                {actionError}
              </span>
            )}
          </aside>

          <article className={`akademi-content ${editing ? 'is-editable' : ''}`}>
            {editing && active && !draft && !guideDraft && (
              <button
                type="button"
                className="akademi-content__pencil"
                onClick={() =>
                  isGuidesPage
                    ? guideSlug
                      ? openEditGuide(selectedGuide)
                      : openNewGuide()
                    : startEdit()
                }
                aria-label={
                  isGuidesPage
                    ? guideSlug
                      ? 'Rehberi düzenle'
                      : 'Yeni rehber ekle'
                    : 'Akademi içeriğini düzenle'
                }
              >
                <PencilIcon />
              </button>
            )}

            {!active && !draft && !guideDraft ? (
              <AcademyEmptyState editing={editing} onAdd={addPage} />
            ) : guideDraft ? (
              <GuideEditor
                draft={guideDraft}
                busy={busy}
                uploading={uploading}
                actionError={actionError}
                onSave={saveGuide}
                onCancel={closeGuideDraft}
                onChange={(field, value) =>
                  setGuideDraft((current) => ({ ...current, [field]: value }))
                }
                onUpload={uploadGuideImage}
                onBlockChange={updateGuideBlock}
                onBlockAdd={addGuideBlock}
                onBlockRemove={removeGuideBlock}
                onBlockMove={moveGuideBlock}
              />
            ) : isGuidesPage && !draft ? (
              guideSlug ? (
                <GuideDetail guide={selectedGuide} />
              ) : (
                <GuideList guides={guides} editing={editing} onNew={openNewGuide} />
              )
            ) : draft ? (
              <form className="akademi-section-editor" onSubmit={saveSection}>
                <div className="akademi-editor-block">
                  <h3>Sayfa bilgileri</h3>
                  <input
                    value={draft.label}
                    placeholder="Sol menü başlığı"
                    className="akademi-edit-in"
                    onChange={(e) => setDraft((current) => ({ ...current, label: e.target.value }))}
                  />
                  <input
                    value={draft.slug}
                    placeholder="URL slug"
                    className="akademi-edit-in"
                    onChange={(e) => setDraft((current) => ({ ...current, slug: e.target.value }))}
                  />
                  <select
                    value={draft.parentId || ''}
                    className="akademi-edit-in"
                    onChange={(e) =>
                      setDraft((current) => ({
                        ...current,
                        parentId: e.target.value || null,
                      }))
                    }
                  >
                    <option value="">Üst başlık yok</option>
                    {roots
                      .filter((page) => page.slug !== draft.slug && page.id)
                      .map((page) => (
                        <option key={page.id} value={page.id}>
                          {page.label}
                        </option>
                      ))}
                  </select>
                  <input
                    value={draft.eyebrow}
                    placeholder="Üst küçük başlık"
                    className="akademi-edit-in"
                    onChange={(e) =>
                      setDraft((current) => ({ ...current, eyebrow: e.target.value }))
                    }
                  />
                  <input
                    value={draft.title}
                    placeholder="Sayfa başlığı"
                    className="akademi-edit-in akademi-edit-in--title"
                    onChange={(e) => setDraft((current) => ({ ...current, title: e.target.value }))}
                  />
                  <textarea
                    value={draft.intro}
                    rows="4"
                    placeholder="Giriş metni"
                    className="akademi-edit-in"
                    onChange={(e) => setDraft((current) => ({ ...current, intro: e.target.value }))}
                  />
                  <div className="akademi-image-edit">
                    {draft.imageUrl && (
                      <span className="akademi-image-preview">
                        <img src={draft.imageUrl} alt="" />
                      </span>
                    )}
                    <input
                      value={draft.imageUrl}
                      placeholder="Ana görsel HTTPS URL'si"
                      className="akademi-edit-in"
                      onChange={(e) =>
                        setDraft((current) => ({ ...current, imageUrl: e.target.value }))
                      }
                    />
                    <label className="btn btn--ghost akademi-upload">
                      {uploading === 'section' ? 'Yükleniyor...' : 'Ana görsel yükle'}
                      <input
                        type="file"
                        accept="image/avif,image/jpeg,image/png,image/webp"
                        hidden
                        onChange={(e) => uploadImageToDraft('section', e)}
                      />
                    </label>
                  </div>
                </div>

                <TextListEditor
                  title="Adım adım"
                  items={draft.content.steps}
                  onChange={(index, value) => updateTextList('steps', index, value)}
                  onAdd={() => addTextItem('steps')}
                  onRemove={(index) => removeTextItem('steps', index)}
                />
                <TextListEditor
                  title="Dikkat edilmesi gerekenler"
                  items={draft.content.notes}
                  onChange={(index, value) => updateTextList('notes', index, value)}
                  onAdd={() => addTextItem('notes')}
                  onRemove={(index) => removeTextItem('notes', index)}
                />
                <ObjectListEditor
                  title="SSS"
                  items={draft.content.qa}
                  fields={[
                    { name: 'q', label: 'Soru' },
                    { name: 'a', label: 'Yanıt', multiline: true },
                  ]}
                  onChange={(index, field, value) => updateObjectList('qa', index, field, value)}
                  onAdd={() => addObjectItem('qa')}
                  onRemove={(index) => removeObjectItem('qa', index)}
                  onUpload={(index, e) => uploadImageToDraft(`qa:${index}`, e)}
                />
                <ObjectListEditor
                  title="Yol haritası"
                  items={draft.content.roadmap}
                  fields={[
                    { name: 'phase', label: 'Faz' },
                    { name: 'text', label: 'Açıklama', multiline: true },
                  ]}
                  onChange={(index, field, value) =>
                    updateObjectList('roadmap', index, field, value)
                  }
                  onAdd={() => addObjectItem('roadmap')}
                  onRemove={(index) => removeObjectItem('roadmap', index)}
                  onUpload={(index, e) => uploadImageToDraft(`roadmap:${index}`, e)}
                />
                <ObjectListEditor
                  title="Video içerikleri"
                  items={draft.content.videos}
                  fields={[
                    { name: 'title', label: 'Video başlığı' },
                    { name: 'url', label: 'Video bağlantısı' },
                  ]}
                  onChange={(index, field, value) => updateObjectList('videos', index, field, value)}
                  onAdd={() => addObjectItem('videos')}
                  onRemove={(index) => removeObjectItem('videos', index)}
                  onUpload={(index, e) => uploadImageToDraft(`videos:${index}`, e)}
                />
                <ObjectListEditor
                  title="Hatalar ve çözümler"
                  items={draft.content.issues}
                  fields={[
                    { name: 'issue', label: 'Hata' },
                    { name: 'solution', label: 'Çözüm', multiline: true },
                  ]}
                  onChange={(index, field, value) => updateObjectList('issues', index, field, value)}
                  onAdd={() => addObjectItem('issues')}
                  onRemove={(index) => removeObjectItem('issues', index)}
                  onUpload={(index, e) => uploadImageToDraft(`issues:${index}`, e)}
                />
                <ObjectListEditor
                  title="Hata kodları"
                  items={draft.content.codes}
                  fields={[
                    { name: 'code', label: 'Kod' },
                    { name: 'text', label: 'Açıklama', multiline: true },
                  ]}
                  onChange={(index, field, value) => updateObjectList('codes', index, field, value)}
                  onAdd={() => addObjectItem('codes')}
                  onRemove={(index) => removeObjectItem('codes', index)}
                  onUpload={(index, e) => uploadImageToDraft(`codes:${index}`, e)}
                />

                {actionError && (
                  <span className="panel-error akademi-editor-error" role="alert">
                    {actionError}
                  </span>
                )}
                <div className="akademi-editor-actions">
                  <button type="button" className="btn btn--ghost" onClick={closeDraft}>
                    Vazgeç
                  </button>
                  <button type="submit" className="btn btn--primary" disabled={busy || uploading}>
                    Kaydet
                  </button>
                </div>
              </form>
            ) : (
              <>
                <span className="eyebrow">{active.eyebrow}</span>
                <h1>{active.title}</h1>
                <p className="akademi-lead">{active.intro}</p>
                <AcademyImage src={active.imageUrl} alt={active.title} />

                {content.steps.length > 0 && (
                  <div className="akademi-block">
                    <h2>Adım adım</h2>
                    <ol className="akademi-steps">
                      {content.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {content.notes.length > 0 && (
                  <div className="akademi-note">
                    <h2>Dikkat edilmesi gerekenler</h2>
                    <ul>
                      {content.notes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {content.qa.length > 0 && (
                  <div className="akademi-list">
                    {content.qa.map((item) => (
                      <section key={item.q || item.a} className="akademi-card">
                        <CardImage src={item.imageUrl} alt={item.q} />
                        <h2>{item.q}</h2>
                        <p>{item.a}</p>
                      </section>
                    ))}
                  </div>
                )}

                {content.roadmap.length > 0 && (
                  <div className="akademi-list">
                    {content.roadmap.map((item) => (
                      <section key={item.phase || item.text} className="akademi-card">
                        <CardImage src={item.imageUrl} alt={item.phase} />
                        <span>{item.phase}</span>
                        <p>{item.text}</p>
                      </section>
                    ))}
                  </div>
                )}

                {content.videos.length > 0 && (
                  <div className="akademi-video-grid">
                    {content.videos.map((video, index) => (
                      <div key={video.title || index} className="akademi-video">
                        {video.imageUrl ? (
                          <img src={video.imageUrl} alt={video.title} loading="lazy" />
                        ) : (
                          <span>{String(index + 1).padStart(2, '0')}</span>
                        )}
                        {video.url ? (
                          <a href={video.url} target="_blank" rel="noreferrer">
                            {video.title}
                          </a>
                        ) : (
                          <strong>{video.title}</strong>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {content.issues.length > 0 && (
                  <div className="akademi-list">
                    {content.issues.map((item) => (
                      <section key={item.issue || item.solution} className="akademi-card">
                        <CardImage src={item.imageUrl} alt={item.issue} />
                        <h2>{item.issue}</h2>
                        <p>{item.solution}</p>
                      </section>
                    ))}
                  </div>
                )}

                {content.codes.length > 0 && (
                  <div className="akademi-codes">
                    {content.codes.map((item) => (
                      <div key={item.code || item.text} className="akademi-code">
                        <CardImage src={item.imageUrl} alt={item.code} />
                        <code>{item.code}</code>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="akademi-next">
                  <span>Aradığınız içerik yok mu?</span>
                  <Link to="/panel/destek" className="btn btn--primary">
                    Destek Talebi Oluştur
                  </Link>
                </div>
              </>
            )}
          </article>
        </div>
      </section>
    </>
  )
}
