/* ============================================================
   Blog yazıları
   ============================================================ */

import { supabase } from '../lib/supabase.js'

export const posts = [
  {
    slug: 'e-ticarete-baslarken-7-adim',
    title: 'E-Ticarete Başlarken Bilmeniz Gereken 7 Adım',
    excerpt:
      'Kendi online mağazanızı kurmadan önce planlamanız gereken her şeyi; ürün, ödeme, kargo ve pazarlama başlıklarıyla adım adım ele alıyoruz.',
    category: 'Başlangıç',
    date: '2026-07-02',
    readingTime: '6 dk',
    author: 'Aserai Ekibi',
    accent: '#1c3444',
    content: [
      { type: 'p', text: 'E-ticarete başlamak, doğru adımları doğru sırayla attığınızda göründüğünden çok daha yönetilebilir bir süreçtir. Bu yazıda ilk mağazanızı açarken izlemeniz gereken yol haritasını özetliyoruz.' },
      { type: 'h', text: '1. Ürün ve niş kararı' },
      { type: 'p', text: 'Hedef kitlenizi ve satacağınız ürün grubunu netleştirin. Rekabetin yoğun olduğu alanlarda farklılaşmanızı sağlayacak bir değer önerisi belirleyin.' },
      { type: 'h', text: '2. Mağaza altyapısı' },
      { type: 'p', text: 'Ölçeklenebilir, entegrasyonlara açık ve yönetimi kolay bir altyapı seçin. Aserai gibi hazır temalar ve toplu ürün yükleme sunan çözümler, kurulum süresini ciddi biçimde kısaltır.' },
      { type: 'h', text: '3. Ödeme ve kargo' },
      { type: 'p', text: 'Güvenli bir sanal POS ve birden fazla kargo seçeneği, dönüşüm oranınızı doğrudan etkiler. Süreçleri otomatikleştirmek operasyon yükünüzü azaltır.' },
      { type: 'h', text: '4. Pazarlama ve büyüme' },
      { type: 'p', text: 'SEO, kampanya senaryoları ve pazaryeri entegrasyonlarıyla satış kanallarınızı çeşitlendirin. Verilerinizi takip ederek kararlarınızı sürekli iyileştirin.' },
    ],
  },
  {
    slug: 'pazaryeri-entegrasyonu-neden-onemli',
    title: 'Pazaryeri Entegrasyonu Neden Önemli?',
    excerpt:
      'Tek panelden çok kanallı satış yönetmenin operasyonel verimliliğe ve büyümeye etkisini rakamlarla inceliyoruz.',
    category: 'Entegrasyon',
    date: '2026-06-24',
    readingTime: '5 dk',
    author: 'Aserai Ekibi',
    accent: '#234d63',
    content: [
      { type: 'p', text: 'Birden fazla pazaryerinde satış yapmak büyüme için güçlü bir fırsattır; ancak her kanalı ayrı ayrı yönetmek hata oranını ve iş yükünü artırır.' },
      { type: 'h', text: 'Merkezi stok yönetimi' },
      { type: 'p', text: 'Entegrasyon sayesinde stok tüm kanallarda otomatik senkron olur; “stokta yok” hataları ve sipariş iptalleri belirgin biçimde azalır.' },
      { type: 'h', text: 'Zaman tasarrufu' },
      { type: 'p', text: 'Ürün, fiyat ve sipariş süreçlerini tek panelden yöneterek tekrarlayan manuel işlere harcanan zamanı geri kazanırsınız.' },
      { type: 'h', text: 'Veriye dayalı kararlar' },
      { type: 'p', text: 'Tüm kanalların performansını tek yerde görmek, hangi ürünün nerede daha iyi sattığını anlamanızı ve bütçenizi doğru yönlendirmenizi sağlar.' },
    ],
  },
  {
    slug: 'donusum-oranini-artiran-5-taktik',
    title: 'Dönüşüm Oranını Artıran 5 Pratik Taktik',
    excerpt:
      'Ziyaretçilerinizi müşteriye dönüştürmek için mağazanızda hemen uygulayabileceğiniz beş etkili yöntem.',
    category: 'Pazarlama',
    date: '2026-06-15',
    readingTime: '4 dk',
    author: 'Aserai Ekibi',
    accent: '#04acfc',
    content: [
      { type: 'p', text: 'Trafik almak tek başına yeterli değildir; asıl mesele bu trafiği satışa çevirmektir. İşte dönüşümü artıran pratik taktikler.' },
      { type: 'h', text: '1. Hızlı ve sade ödeme' },
      { type: 'p', text: 'Tek sayfada tamamlanan (one page checkout) bir ödeme akışı, sepet terk oranını düşürür.' },
      { type: 'h', text: '2. Akıllı ürün önerileri' },
      { type: 'p', text: 'Yapay zekâ destekli öneriler, sepet ortalamasını yükseltir ve müşteriye ilgili ürünleri gösterir.' },
      { type: 'h', text: '3. Güven unsurları' },
      { type: 'p', text: 'Müşteri yorumları, güvenlik rozetleri ve şeffaf kargo/iade politikaları satın alma kararını kolaylaştırır.' },
      { type: 'h', text: '4. Mobil uyum' },
      { type: 'p', text: 'Ziyaretçilerin çoğu mobil cihazdan geliyor; mobil deneyiminizi öncelikli olarak optimize edin.' },
      { type: 'h', text: '5. Kampanya senaryoları' },
      { type: 'p', text: 'Sepet bazlı kampanyalar ve zamanlı indirimlerle karar aşamasındaki müşteriyi harekete geçirin.' },
    ],
  },
  {
    slug: 'e-ihracat-ile-yurt-disina-acilmak',
    title: 'E-İhracat ile Yurt Dışına Açılmak',
    excerpt:
      'Global pazaryerleri, çoklu dil ve döviz desteği ile markanızı sınırların ötesine taşımanın yollarını anlatıyoruz.',
    category: 'E-İhracat',
    date: '2026-06-03',
    readingTime: '7 dk',
    author: 'Aserai Ekibi',
    accent: '#2f5567',
    content: [
      { type: 'p', text: 'E-ihracat, doğru altyapı ile her ölçekten işletme için erişilebilir bir büyüme kanalıdır. Bu yazıda başlarken dikkat etmeniz gerekenleri ele alıyoruz.' },
      { type: 'h', text: 'Çoklu dil ve döviz' },
      { type: 'p', text: 'Ürün açıklamalarının otomatik çevirisi ve yerel para birimiyle satış, uluslararası müşteride güven oluşturur.' },
      { type: 'h', text: 'Global pazaryerleri' },
      { type: 'p', text: 'Amazon, Etsy ve eBay gibi kanallara ürünlerinizi tek noktadan aktararak yeni pazarlara hızlıca ulaşabilirsiniz.' },
      { type: 'h', text: 'Lojistik ve gümrük' },
      { type: 'p', text: 'Uluslararası kargo entegrasyonları ve GTIP kodu yönetimi, sınır ötesi gönderileri sorunsuz hale getirir.' },
    ],
  },
]

export const getPost = (slug) => posts.find((p) => p.slug === slug)

const BLOG_CARD_FIELDS = [
  'id',
  'slug',
  'title',
  'excerpt',
  'category',
  'author',
  'reading_time',
  'image_url',
  'accent',
  'is_published',
  'published_on',
  'created_at',
  'updated_at',
].join(',')

const BLOG_DETAIL_FIELDS = `${BLOG_CARD_FIELDS},content`
const BLOG_DETAIL_FIELDS_WITH_HTML = `${BLOG_DETAIL_FIELDS},content_html`

export const mapBlogRow = (row) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  category: row.category,
  date: row.published_on,
  publishedOn: row.published_on,
  readingTime: `${row.reading_time} dk`,
  readingTimeMinutes: row.reading_time,
  author: row.author,
  imageUrl: row.image_url || null,
  accent: row.accent || '#1c3444',
  content: Array.isArray(row.content) ? row.content : [],
  contentHtml: row.content_html || null,
  isPublished: row.is_published,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export function todayInIstanbul() {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

export async function fetchPublishedPosts() {
  if (!supabase) return posts

  const { data, error } = await supabase
    .from('blog_posts')
    .select(BLOG_CARD_FIELDS)
    .eq('is_published', true)
    .lte('published_on', todayInIstanbul())
    .order('published_on', { ascending: false })
    .order('created_at', { ascending: false })

  return error ? posts : (data || []).map(mapBlogRow)
}

export async function fetchPublishedPost(slug) {
  if (!supabase) return getPost(slug) || null

  const buildQuery = (fields) =>
    supabase
      .from('blog_posts')
      .select(fields)
      .eq('slug', slug)
      .eq('is_published', true)
      .lte('published_on', todayInIstanbul())
      .maybeSingle()

  let { data, error } = await buildQuery(BLOG_DETAIL_FIELDS_WITH_HTML)
  if (error && /content_html|schema cache|column/i.test(error.message || '')) {
    ;({ data, error } = await buildQuery(BLOG_DETAIL_FIELDS))
  }

  if (error) return getPost(slug) || null
  return data ? mapBlogRow(data) : null
}

export async function fetchRelatedPosts(slug, limit = 3) {
  if (!supabase) {
    return posts.filter((post) => post.slug !== slug).slice(0, limit)
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .select(BLOG_CARD_FIELDS)
    .eq('is_published', true)
    .lte('published_on', todayInIstanbul())
    .neq('slug', slug)
    .order('published_on', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    return posts.filter((post) => post.slug !== slug).slice(0, limit)
  }
  return (data || []).map(mapBlogRow)
}

export function slugifyBlogTitle(value) {
  return String(value || '')
    .trim()
    .toLocaleLowerCase('tr-TR')
    .replace(/[çÇ]/g, 'c')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o')
    .replace(/[şŞ]/g, 's')
    .replace(/[üÜ]/g, 'u')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180)
    .replace(/-+$/g, '')
}

export const formatDate = (iso) => {
  const input = /^\d{4}-\d{2}-\d{2}$/.test(iso || '')
    ? `${iso}T12:00:00`
    : iso
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
