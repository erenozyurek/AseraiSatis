import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '../../components/Icon/Icon.jsx'
import Faq from '../../components/Faq/Faq.jsx'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useEditMode } from '../../context/EditModeContext.jsx'
import { logAdminAction } from '../../lib/auditLog.js'
import { supabase } from '../../lib/supabase.js'
import './Yardim.css'

const DEFAULT_ICON = 'M12 3l9 4-9 4-9-4 9-4zM3 12l9 4 9-4M3 17l9 4 9-4'

const defaultHelpSettings = {
  key: 'main',
  categoryEyebrow: 'Kategoriler',
  categoryTitle: 'Konu başlığına göre keşfedin',
  categoryDescription:
    'İhtiyacınıza en uygun başlığı seçin, ilgili rehberlere ulaşın.',
}

const staticCategories = [
  {
    slug: 'baslangic-rehberi',
    title: 'Başlangıç Rehberi',
    desc: 'Hesap oluşturma, mağaza kurulumu ve ilk ürün yükleme adımları.',
    iconPath: 'M12 3l9 4-9 4-9-4 9-4zM3 12l9 4 9-4M3 17l9 4 9-4',
  },
  {
    slug: 'urun-stok',
    title: 'Ürün & Stok',
    desc: 'Ürün ekleme, varyant yönetimi, toplu güncelleme ve stok takibi.',
    iconPath: 'M20 7l-8-4-8 4v10l8 4 8-4V7zM4 7l8 4 8-4M12 11v10',
  },
  {
    slug: 'siparis-kargo',
    title: 'Sipariş & Kargo',
    desc: 'Sipariş yönetimi, kargo entegrasyonu ve teslimat süreçleri.',
    iconPath: 'M3 7h11v8H3zM14 10h4l3 3v2h-7zM7 19a2 2 0 100-4 2 2 0 000 4zm10 0a2 2 0 100-4 2 2 0 000 4z',
  },
  {
    slug: 'odeme-fatura',
    title: 'Ödeme & Fatura',
    desc: 'Sanal POS, ödeme yöntemleri, fatura ve abonelik işlemleri.',
    iconPath: 'M3 6h18v12H3zM3 10h18M7 15h4',
  },
  {
    slug: 'hesap-guvenlik',
    title: 'Hesap & Güvenlik',
    desc: 'Profil ayarları, kullanıcı rolleri ve güvenlik seçenekleri.',
    iconPath: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4',
  },
  {
    slug: 'entegrasyonlar',
    title: 'Entegrasyonlar',
    desc: 'Pazaryeri, ERP, muhasebe ve e-fatura entegrasyon ayarları.',
    iconPath: 'M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1',
  },
]

const staticArticles = [
  {
    slug: 'hesap-olusturma-ve-ilk-giris',
    categorySlug: 'baslangic-rehberi',
    title: 'Hesap oluşturma ve ilk giriş',
    excerpt:
      'Aserai hesabınızı oluşturduktan sonra panelde ilk kontrol etmeniz gereken temel alanlar.',
    content:
      'Hesabınızı oluşturduktan sonra e-posta doğrulamasını tamamlayın ve Profilim alanındaki firma bilgilerini güncelleyin.\n\nİlk girişte aktif paket, lisans durumu ve destek kanallarını kontrol etmek sonraki kurulum adımlarını kolaylaştırır.',
  },
  {
    slug: 'magaza-kurulum-kontrol-listesi',
    categorySlug: 'baslangic-rehberi',
    title: 'Mağaza kurulum kontrol listesi',
    excerpt:
      'Yayına çıkmadan önce tema, ödeme, kargo ve temel içerik ayarlarını gözden geçirin.',
    content:
      'Mağazanızı yayına almadan önce logo, iletişim bilgileri, ödeme yöntemleri ve kargo ayarlarını tamamlayın.\n\nÜrün yükleme öncesinde kategori yapısını sade tutmak, müşterinin aradığı ürüne daha hızlı ulaşmasını sağlar.',
  },
  {
    slug: 'tekil-urun-yukleme',
    categorySlug: 'urun-stok',
    title: 'Tekil ürün yükleme',
    excerpt:
      'Ürün adı, açıklama, fiyat, stok ve görsel alanlarıyla hızlı ürün yayınlama akışı.',
    content:
      'Ürün eklerken başlık, açıklama, SKU, fiyat ve stok alanlarını eksiksiz girin.\n\nGörsellerin aynı oranlarda hazırlanması vitrin kalitesini artırır ve ürün kartlarının düzenli görünmesini sağlar.',
  },
  {
    slug: 'stok-guncelleme-adimlari',
    categorySlug: 'urun-stok',
    title: 'Stok güncelleme adımları',
    excerpt:
      'Stok değişikliklerini satış kanallarına doğru yansıtmak için temel kontrol noktaları.',
    content:
      'Stok güncellemesi yapmadan önce açık siparişleri ve bekleyen kanal senkronlarını kontrol edin.\n\nKritik stok seviyelerini düzenli takip etmek, satışta olmayan ürünlerin müşteriye görünmesini engeller.',
  },
  {
    slug: 'siparis-durumu-takibi',
    categorySlug: 'siparis-kargo',
    title: 'Sipariş durumu takibi',
    excerpt:
      'Siparişleri ödeme, hazırlık, kargo ve teslimat aşamalarında izleme yöntemi.',
    content:
      'Sipariş ekranında ödeme durumu, ürün kalemleri ve müşteri bilgilerini kontrol ederek işleme başlayın.\n\nKargo bilgisi oluşturulduğunda takip numarasını müşteriye görünür hale getirmek destek taleplerini azaltır.',
  },
  {
    slug: 'kargo-entegrasyonu-kontrolu',
    categorySlug: 'siparis-kargo',
    title: 'Kargo entegrasyonu kontrolü',
    excerpt:
      'Kargo firması bağlantıları, teslimat seçenekleri ve takip bilgilerinin kontrolü.',
    content:
      'Kargo entegrasyonunda firma hesap bilgileri, gönderi şablonları ve teslimat bölgeleri uyumlu olmalıdır.\n\nTest gönderisi oluşturmak, canlı sipariş akışına geçmeden önce bağlantı sorunlarını görmenizi sağlar.',
  },
  {
    slug: 'odeme-kaydi-kontrolu',
    categorySlug: 'odeme-fatura',
    title: 'Ödeme kaydı kontrolü',
    excerpt:
      'Bekleyen, onaylanan ve başarısız ödeme kayıtlarını panelden takip etme.',
    content:
      'Ödeme kayıtlarında sipariş numarası, tutar ve durum alanlarını birlikte değerlendirin.\n\nHavale veya EFT akışlarında yönetim onayı sonrası lisans ve fatura kayıtları otomatik olarak güncellenir.',
  },
  {
    slug: 'fatura-goruntuleme',
    categorySlug: 'odeme-fatura',
    title: 'Fatura görüntüleme',
    excerpt:
      'Müşteri panelinde fatura detaylarını görüntüleme, yazdırma ve PDF akışı.',
    content:
      'Faturalarım ekranından ilgili fatura kaydını açarak ürün kalemleri, tutar ve tarih bilgilerini inceleyebilirsiniz.\n\nPDF dosyası yüklenmişse aynı ekrandan görüntüleme bağlantısı da kullanılabilir.',
  },
  {
    slug: 'profil-bilgilerini-guncelleme',
    categorySlug: 'hesap-guvenlik',
    title: 'Profil bilgilerini güncelleme',
    excerpt:
      'Firma, kullanıcı ve iletişim bilgilerini güncel tutmak için izlenecek adımlar.',
    content:
      'Profilim ekranında firma adı, yetkili kişi, telefon ve e-posta alanlarını düzenli olarak güncel tutun.\n\nDoğru iletişim bilgileri bildirim, destek ve fatura süreçlerinin kesintisiz ilerlemesini sağlar.',
  },
  {
    slug: 'api-anahtari-guvenligi',
    categorySlug: 'hesap-guvenlik',
    title: 'API anahtarı güvenliği',
    excerpt:
      'API anahtarlarını oluşturma, saklama ve kullanılmayan anahtarları iptal etme rehberi.',
    content:
      'API anahtarları yalnızca oluşturulduğu anda tam olarak görüntülenir. Bu nedenle anahtarı güvenli bir parola kasasında saklayın.\n\nKullanılmayan veya paylaşıldığından şüphelenilen anahtarları iptal edip yeni anahtar oluşturun.',
  },
  {
    slug: 'pazaryeri-baglantisi',
    categorySlug: 'entegrasyonlar',
    title: 'Pazaryeri bağlantısı',
    excerpt:
      'Pazaryeri hesabınızı Aserai operasyon akışına bağlamadan önce yapılacak kontroller.',
    content:
      'Pazaryeri bağlantısı için mağaza yetki bilgileri, kategori eşleşmeleri ve stok kuralları hazır olmalıdır.\n\nBağlantı sonrası ürün, fiyat ve sipariş senkronlarını küçük bir ürün setiyle test etmek daha güvenli bir başlangıç sağlar.',
  },
  {
    slug: 'erp-ve-muhasebe-aktarimi',
    categorySlug: 'entegrasyonlar',
    title: 'ERP ve muhasebe aktarımı',
    excerpt:
      'Sipariş, fatura ve tahsilat verilerinin harici sistemlere aktarımında dikkat edilecekler.',
    content:
      'ERP veya muhasebe aktarımında müşteri, ürün kodu, vergi ve para birimi alanlarının iki sistemde de aynı anlamı taşıması gerekir.\n\nAktarım öncesi test kayıtlarıyla eşleşme doğrulaması yapmak canlı veride hata riskini azaltır.',
  },
]

const faq = [
  {
    q: 'Aserai ile mağazamı ne kadar sürede kurabilirim?',
    a: 'Hazır temalar ve toplu ürün yükleme sayesinde temel bir mağazayı birkaç saat içinde yayına alabilirsiniz. Kurulum sihirbazı her adımda size yol gösterir.',
  },
  {
    q: 'Ürünlerimi pazaryerlerinden toplu olarak aktarabilir miyim?',
    a: 'Evet. Excel, XML, API veya bağlantı ile toplu ürün aktarımı yapabilir; stok ve fiyatları tüm kanallarda otomatik senkron tutabilirsiniz.',
  },
  {
    q: 'Ödeme altyapısı için ne gerekiyor?',
    a: 'Anlaşmalı sanal POS sağlayıcınızı birkaç adımda bağlayabilirsiniz. Kurulumda destek ekibimiz size yardımcı olur.',
  },
  {
    q: 'Başka bir altyapıdan Aserai’ye nasıl geçerim?',
    a: 'Geçiş sürecinde destek ekibimiz ürün, müşteri ve sipariş verilerinizin aktarımında size eşlik eder; veri kaybı yaşamazsınız.',
  },
  {
    q: 'Destek ekibine nasıl ulaşırım?',
    a: 'Panel içinden destek talebi oluşturabilir, canlı destek hattını kullanabilir veya iletişim sayfamızdaki kanallardan bize ulaşabilirsiniz.',
  },
]

const slugify = (value) => {
  const map = {
    ç: 'c',
    Ç: 'c',
    ğ: 'g',
    Ğ: 'g',
    ı: 'i',
    I: 'i',
    İ: 'i',
    ö: 'o',
    Ö: 'o',
    ş: 's',
    Ş: 's',
    ü: 'u',
    Ü: 'u',
  }

  return String(value || '')
    .replace(/[çÇğĞıIİöÖşŞüÜ]/g, (letter) => map[letter] || letter)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 80)
}

const mapCategory = (category) => ({
  id: category.id,
  slug: category.slug,
  title: category.title,
  desc: category.description,
  iconPath: category.icon_path || DEFAULT_ICON,
  sortOrder: category.sort_order,
})

const mapArticle = (article) => ({
  id: article.id,
  categoryId: article.category_id,
  categorySlug: article.help_categories?.slug,
  slug: article.slug,
  title: article.title,
  excerpt: article.excerpt,
  content: article.content,
  sortOrder: article.sort_order,
})

const mapSettings = (settings) => ({
  ...defaultHelpSettings,
  categoryEyebrow:
    settings?.category_eyebrow || defaultHelpSettings.categoryEyebrow,
  categoryTitle: settings?.category_title || defaultHelpSettings.categoryTitle,
  categoryDescription:
    settings?.category_description || defaultHelpSettings.categoryDescription,
})

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

const getArticleKey = (article) => article.id || article.slug

function ArticleBody({ text }) {
  const paragraphs = String(text || '')
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <div className="yardim-article__body">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  )
}

export default function Yardim() {
  const { isAdmin } = useAuth()
  const { editMode } = useEditMode()
  const editing = editMode && isAdmin

  const [query, setQuery] = useState('')
  const [settings, setSettings] = useState(defaultHelpSettings)
  const [dbCategories, setDbCategories] = useState(null)
  const [dbArticles, setDbArticles] = useState(null)
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('')
  const [expandedArticleKey, setExpandedArticleKey] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editingArticleId, setEditingArticleId] = useState(null)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')
  const [savedMessage, setSavedMessage] = useState('')
  const articlesRef = useRef(null)
  const pendingArticleScroll = useRef(false)

  const normalizedQuery = query.trim().toLocaleLowerCase('tr-TR')
  const includesQuery = (...values) =>
    !normalizedQuery ||
    values.some((value) =>
      String(value || '')
        .toLocaleLowerCase('tr-TR')
        .includes(normalizedQuery),
    )

  const categoryList = useMemo(() => {
    if (dbCategories) return dbCategories
    if (dbCategories === null) {
      return staticCategories.map((category, index) => ({
        id: null,
        sortOrder: index + 1,
        ...category,
      }))
    }
    return []
  }, [dbCategories])

  const articleList = useMemo(() => {
    if (Array.isArray(dbArticles)) return dbArticles
    return staticArticles
  }, [dbArticles])

  const canManageHelp = editing && supabase && Array.isArray(dbCategories)
  const canManageArticles =
    canManageHelp && Array.isArray(dbArticles) && categoryList.some((c) => c.id)

  const visibleCategories = categoryList.filter((category) => {
    const categoryMatches = includesQuery(category.title, category.desc)
    const articleMatches =
      normalizedQuery &&
      articleList.some(
        (article) =>
          article.categorySlug === category.slug &&
          includesQuery(article.title, article.excerpt, article.content),
      )
    return categoryMatches || articleMatches
  })

  const selectedCategory =
    categoryList.find((category) => category.slug === selectedCategorySlug) ||
    null

  const visibleArticles = articleList.filter((article) => {
    if (selectedCategory) {
      return article.categorySlug === selectedCategory.slug
    }
    if (normalizedQuery) {
      return includesQuery(article.title, article.excerpt, article.content)
    }
    return false
  })

  const shouldShowArticles = Boolean(selectedCategory || normalizedQuery)

  const visibleFaq = faq.filter((item) => includesQuery(item.q, item.a))

  const loadContent = async () => {
    if (!supabase) return

    const [
      { data: settingsData, error: settingsError },
      { data, error },
      { data: articleData, error: articleError },
    ] = await Promise.all([
      supabase
        .from('help_settings')
        .select('*')
        .eq('key', 'main')
        .maybeSingle(),
      supabase
        .from('help_categories')
        .select('*')
        .order('sort_order', { ascending: true }),
      supabase
        .from('help_articles')
        .select('*, help_categories(slug, title)')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
    ])

    if (!settingsError) {
      setSettings(mapSettings(settingsData))
    }

    if (error) {
      setActionError(
        'Yardım içerikleri veritabanından okunamadı. 0028_help_center_content.sql migrationını çalıştırın.',
      )
      return
    }

    setDbCategories((data || []).map(mapCategory))

    if (articleError) {
      setDbArticles(null)
      if (!error) {
        setActionError(
          'Yardım makalelerini düzenlemek için 0029_help_center_articles.sql migrationını çalıştırın.',
        )
      }
      return
    }

    setDbArticles((articleData || []).map(mapArticle))
  }

  useEffect(() => {
    loadContent()
  }, [])

  useEffect(() => {
    if (
      selectedCategorySlug &&
      !categoryList.some((category) => category.slug === selectedCategorySlug)
    ) {
      setSelectedCategorySlug('')
      setExpandedArticleKey(null)
      setEditingArticleId(null)
    }
  }, [categoryList, selectedCategorySlug])

  useEffect(() => {
    if (!pendingArticleScroll.current || !shouldShowArticles) return

    pendingArticleScroll.current = false
    window.requestAnimationFrame(() => {
      articlesRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }, [shouldShowArticles, selectedCategorySlug])

  const selectCategory = (category) => {
    setQuery('')
    pendingArticleScroll.current = true
    setSelectedCategorySlug(category.slug)
    setExpandedArticleKey(null)
    setEditingArticleId(null)

    if (category.slug === selectedCategorySlug && shouldShowArticles) {
      pendingArticleScroll.current = false
      window.requestAnimationFrame(() => {
        articlesRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
    }
  }

  const openEdit = (category) => {
    setActionError('')
    setSavedMessage('')
    setEditingId(category.id)
  }

  const saveSettings = async (event) => {
    event.preventDefault()
    if (!supabase) return

    const form = event.currentTarget
    const payload = {
      key: 'main',
      category_eyebrow: form.categoryEyebrow.value.trim(),
      category_title: form.categoryTitle.value.trim(),
      category_description: form.categoryDescription.value.trim(),
      updated_at: new Date().toISOString(),
    }

    setBusy(true)
    setActionError('')
    setSavedMessage('')
    const { error } = await supabase
      .from('help_settings')
      .upsert(payload, { onConflict: 'key' })
    setBusy(false)

    if (error) {
      setActionError(error.message || 'Yardım başlığı kaydedilemedi.')
      return
    }

    setSettings(mapSettings(payload))
    setSavedMessage('Yardım bölüm başlığı kaydedildi.')
    await logAdminAction('help.settings_update', 'help_settings', null, {
      section: 'categories',
    })
  }

  const saveCategory = async (category, event) => {
    event.preventDefault()
    if (!supabase || !category.id) return

    const form = event.currentTarget
    const payload = {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      icon_path: form.iconPath.value.trim() || DEFAULT_ICON,
      updated_at: new Date().toISOString(),
    }

    setBusy(true)
    setActionError('')
    setSavedMessage('')
    const { error } = await supabase
      .from('help_categories')
      .update(payload)
      .eq('id', category.id)
    setBusy(false)

    if (error) {
      setActionError(error.message || 'Kategori kaydedilemedi.')
      return
    }

    await logAdminAction('help.category_update', 'help_category', category.id, {
      title: payload.title,
    })
    setEditingId(null)
    setSavedMessage('Yardım kategorisi kaydedildi.')
    loadContent()
  }

  const addCategory = async () => {
    if (!supabase) return

    const title = 'Yeni Yardım Kategorisi'
    const slug = `${slugify(title)}-${Date.now().toString(36)}`
    const sortOrder =
      categoryList.reduce(
        (max, category) => Math.max(max, Number(category.sortOrder || 0)),
        0,
      ) + 1

    setBusy(true)
    setActionError('')
    setSavedMessage('')
    const { data, error } = await supabase
      .from('help_categories')
      .insert({
        slug,
        title,
        description: 'Bu kategori için kısa açıklama ekleyin.',
        icon_path: DEFAULT_ICON,
        sort_order: sortOrder,
      })
      .select('id')
      .single()
    setBusy(false)

    if (error) {
      setActionError(error.message || 'Kategori eklenemedi.')
      return
    }

    await logAdminAction('help.category_create', 'help_category', data?.id || null, {
      title,
    })
    await loadContent()
    if (data?.id) setEditingId(data.id)
  }

  const deleteCategory = async (category) => {
    if (!supabase || !category.id) return

    setBusy(true)
    setActionError('')
    setSavedMessage('')
    const { error } = await supabase
      .from('help_categories')
      .delete()
      .eq('id', category.id)
    setBusy(false)

    if (error) {
      setActionError(error.message || 'Kategori silinemedi.')
      return
    }

    await logAdminAction('help.category_delete', 'help_category', category.id, {
      title: category.title,
    })
    setEditingId(null)
    if (selectedCategorySlug === category.slug) {
      setSelectedCategorySlug('')
      setExpandedArticleKey(null)
      setEditingArticleId(null)
    }
    setSavedMessage('Yardım kategorisi silindi.')
    loadContent()
  }

  const moveCategory = async (category, direction) => {
    if (!supabase || !category.id) return

    const currentIndex = categoryList.findIndex((item) => item.id === category.id)
    const targetIndex = currentIndex + direction
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= categoryList.length) {
      return
    }

    const nextList = [...categoryList]
    const [current] = nextList.splice(currentIndex, 1)
    nextList.splice(targetIndex, 0, current)

    setDbCategories(nextList.map((item, index) => ({ ...item, sortOrder: index + 1 })))
    setBusy(true)
    setActionError('')
    setSavedMessage('')
    const updates = await Promise.all(
      nextList.map((item, index) =>
        supabase
          .from('help_categories')
          .update({
            sort_order: index + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', item.id),
      ),
    )
    setBusy(false)

    const error = updates.find((result) => result.error)?.error
    if (error) {
      setActionError(error.message || 'Kategori sırası kaydedilemedi.')
      loadContent()
      return
    }

    await logAdminAction('help.category_reorder', 'help_category', category.id, {
      title: category.title,
      direction,
    })
  }

  const handleCategoryKeyDown = (event, category) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    selectCategory(category)
  }

  const toggleArticle = (article) => {
    const key = getArticleKey(article)
    setExpandedArticleKey((current) => (current === key ? null : key))
    setEditingArticleId(null)
  }

  const openArticleEdit = (article) => {
    setActionError('')
    setSavedMessage('')
    setExpandedArticleKey(getArticleKey(article))
    setEditingArticleId(article.id)
  }

  const addArticle = async () => {
    if (!supabase || !selectedCategory?.id) return

    const title = 'Yeni Yardım Makalesi'
    const sortOrder =
      articleList
        .filter((article) => article.categorySlug === selectedCategory.slug)
        .reduce(
          (max, article) => Math.max(max, Number(article.sortOrder || 0)),
          0,
        ) + 1

    setBusy(true)
    setActionError('')
    setSavedMessage('')
    const { data, error } = await supabase
      .from('help_articles')
      .insert({
        category_id: selectedCategory.id,
        slug: `${slugify(title)}-${Date.now().toString(36)}`,
        title,
        excerpt: 'Bu makale için kısa özet ekleyin.',
        content: 'Makale içeriğini buraya yazın.',
        sort_order: sortOrder,
      })
      .select('id')
      .single()
    setBusy(false)

    if (error) {
      setActionError(error.message || 'Makale eklenemedi.')
      return
    }

    await logAdminAction('help.article_create', 'help_article', data?.id || null, {
      category_id: selectedCategory.id,
    })
    await loadContent()
    if (data?.id) {
      setExpandedArticleKey(data.id)
      setEditingArticleId(data.id)
    }
  }

  const saveArticle = async (article, event) => {
    event.preventDefault()
    if (!supabase || !article.id) return

    const form = event.currentTarget
    const payload = {
      title: form.elements.title.value.trim(),
      excerpt: form.elements.excerpt.value.trim() || null,
      content: form.elements.content.value.trim() || null,
      updated_at: new Date().toISOString(),
    }

    setBusy(true)
    setActionError('')
    setSavedMessage('')
    const { error } = await supabase
      .from('help_articles')
      .update(payload)
      .eq('id', article.id)
    setBusy(false)

    if (error) {
      setActionError(error.message || 'Makale kaydedilemedi.')
      return
    }

    await logAdminAction('help.article_update', 'help_article', article.id, {
      title: payload.title,
    })
    setEditingArticleId(null)
    setSavedMessage('Yardım makalesi kaydedildi.')
    loadContent()
  }

  const deleteArticle = async (article) => {
    if (!supabase || !article.id) return

    setBusy(true)
    setActionError('')
    setSavedMessage('')
    const { error } = await supabase
      .from('help_articles')
      .delete()
      .eq('id', article.id)
    setBusy(false)

    if (error) {
      setActionError(error.message || 'Makale silinemedi.')
      return
    }

    await logAdminAction('help.article_delete', 'help_article', article.id, {
      title: article.title,
    })
    setExpandedArticleKey(null)
    setEditingArticleId(null)
    setSavedMessage('Yardım makalesi silindi.')
    loadContent()
  }

  return (
    <>
      {/* ---------- HERO + ARAMA ---------- */}
      <section className="yardim-hero">
        <div className="yardim-hero__glow" aria-hidden="true" />
        <div className="container yardim-hero__inner">
          <span className="eyebrow">Yardım Merkezi</span>
          <h1>Size nasıl yardımcı olabiliriz?</h1>
          <p>
            Aklınıza takılan her şeyin yanıtı burada. Bir konu arayın ya da
            aşağıdaki kategorilerden ilerleyin.
          </p>
          <form
            className="yardim-search"
            onSubmit={(e) => e.preventDefault()}
            role="search"
          >
            <span className="yardim-search__icon" aria-hidden="true">
              <Icon path="M11 4a7 7 0 105 12l4 4M11 4a7 7 0 015 12" />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedCategorySlug('')
                setExpandedArticleKey(null)
                setEditingArticleId(null)
              }}
              placeholder="Örneğin: ürün yükleme, kargo entegrasyonu…"
              aria-label="Yardım konusu ara"
            />
            <button type="submit" className="btn btn--primary">
              Ara
            </button>
          </form>
        </div>
      </section>

      {/* ---------- KATEGORİLER ---------- */}
      <section className="section">
        <div className="container">
          {canManageHelp ? (
            <form className="section-head yardim-head-edit" onSubmit={saveSettings}>
              <input
                name="categoryEyebrow"
                defaultValue={settings.categoryEyebrow}
                className="yardim-edit-in yardim-edit-in--eyebrow"
                placeholder="Etiket"
                required
              />
              <input
                name="categoryTitle"
                defaultValue={settings.categoryTitle}
                className="yardim-edit-in yardim-edit-in--title"
                placeholder="Başlık"
                required
              />
              <textarea
                name="categoryDescription"
                defaultValue={settings.categoryDescription}
                className="yardim-edit-in"
                rows="2"
                placeholder="Açıklama"
              />
              <div className="yardim-edit-actions yardim-edit-actions--center">
                <button type="submit" className="btn btn--primary" disabled={busy}>
                  Başlığı kaydet
                </button>
              </div>
            </form>
          ) : (
            <div className="section-head">
              <span className="eyebrow">{settings.categoryEyebrow}</span>
              <h2>{settings.categoryTitle}</h2>
              <p>{settings.categoryDescription}</p>
            </div>
          )}

          {editing && !canManageHelp && (
            <p className="yardim-admin-note" role="status">
              Yardım içeriklerini düzenlemek için Supabase migrationını çalıştırın.
            </p>
          )}

          {editing && (actionError || savedMessage) && (
            <p
              className={`yardim-admin-note ${
                actionError ? 'is-error' : 'is-success'
              }`}
              role={actionError ? 'alert' : 'status'}
            >
              {actionError || savedMessage}
            </p>
          )}

          <div className="yardim-cats">
            {visibleCategories.map((c, index) => {
              const isEditingCard = canManageHelp && editingId === c.id
              const categoryIndex = categoryList.findIndex(
                (category) => category.id === c.id,
              )
              return (
                <article
                  key={c.id || c.slug || c.title}
                  className={`yardim-cat ${editing ? 'is-editable' : ''} ${
                    isEditingCard ? 'is-editing' : ''
                  } ${selectedCategorySlug === c.slug ? 'is-selected' : ''} ${
                    !editing ? 'is-clickable' : ''
                  }`}
                  role={!editing ? 'button' : undefined}
                  tabIndex={!editing ? 0 : undefined}
                  onClick={!editing ? () => selectCategory(c) : undefined}
                  onKeyDown={!editing ? (event) => handleCategoryKeyDown(event, c) : undefined}
                >
                  {isEditingCard ? (
                    <form
                      className="yardim-cat__edit"
                      onSubmit={(event) => saveCategory(c, event)}
                    >
                      <input
                        name="title"
                        defaultValue={c.title}
                        className="yardim-edit-in yardim-edit-in--card-title"
                        placeholder="Kategori başlığı"
                        required
                      />
                      <textarea
                        name="description"
                        defaultValue={c.desc || ''}
                        className="yardim-edit-in"
                        rows="3"
                        placeholder="Kategori açıklaması"
                      />
                      <label className="yardim-edit-label">
                        İkon SVG path
                        <textarea
                          name="iconPath"
                          defaultValue={c.iconPath || DEFAULT_ICON}
                          className="yardim-edit-in yardim-edit-in--code"
                          rows="3"
                        />
                      </label>
                      <div className="yardim-edit-actions">
                        <button
                          type="button"
                          className="yardim-card-del"
                          onClick={() => deleteCategory(c)}
                          disabled={busy}
                        >
                          Sil
                        </button>
                        <button
                          type="button"
                          className="btn btn--ghost"
                          onClick={() => setEditingId(null)}
                        >
                          Vazgeç
                        </button>
                        <button
                          type="submit"
                          className="btn btn--primary"
                          disabled={busy}
                        >
                          Kaydet
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      {canManageHelp && (
                        <>
                          <button
                            type="button"
                            className="yardim-cat__pencil"
                            onClick={() => openEdit(c)}
                            aria-label="Yardım kategorisini düzenle"
                          >
                            <PencilIcon />
                          </button>
                          <div className="yardim-cat__order" aria-label="Kategori sırası">
                            <button
                              type="button"
                              onClick={() => moveCategory(c, -1)}
                              disabled={busy || Boolean(normalizedQuery) || categoryIndex <= 0}
                              aria-label="Yukarı taşı"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => moveCategory(c, 1)}
                              disabled={
                                busy ||
                                Boolean(normalizedQuery) ||
                                categoryIndex === categoryList.length - 1
                              }
                              aria-label="Aşağı taşı"
                            >
                              ↓
                            </button>
                          </div>
                        </>
                      )}
                      <span className="yardim-cat__icon">
                        <Icon path={c.iconPath || DEFAULT_ICON} />
                      </span>
                      <h3>{c.title}</h3>
                      <p>{c.desc}</p>
                      {canManageHelp && (
                        <button
                          type="button"
                          className="yardim-cat__show"
                          onClick={() => selectCategory(c)}
                        >
                          Makaleleri göster
                        </button>
                      )}
                    </>
                  )}
                </article>
              )
            })}

            {canManageHelp && (
              <button
                type="button"
                className="yardim-cat yardim-cat--add"
                onClick={addCategory}
                disabled={busy}
              >
                <span className="yardim-cat__plus" aria-hidden="true">
                  +
                </span>
                <span>Yeni kategori ekle</span>
              </button>
            )}
          </div>
          {visibleCategories.length === 0 && (
            <p className="yardim-empty" role="status">
              {categoryList.length === 0
                ? 'Henüz yardım kategorisi oluşturulmamış.'
                : 'Bu aramayla eşleşen yardım kategorisi bulunamadı.'}
            </p>
          )}

          {shouldShowArticles && (
            <div className="yardim-articles" ref={articlesRef} aria-live="polite">
              <div className="yardim-articles__head">
                <div>
                  <span className="eyebrow">
                    {selectedCategory ? 'Seçili kategori' : 'Arama sonuçları'}
                  </span>
                  <h3>
                    {selectedCategory
                      ? selectedCategory.title
                      : 'Eşleşen yardım içerikleri'}
                  </h3>
                  <p>
                    {selectedCategory
                      ? selectedCategory.desc
                      : 'Arama teriminizle eşleşen yardım içerikleri aşağıda listelenir.'}
                  </p>
                </div>
                <div className="yardim-articles__actions">
                  {canManageArticles && selectedCategory?.id && (
                    <button
                      type="button"
                      className="btn yardim-articles__add"
                      onClick={addArticle}
                      disabled={busy}
                    >
                      Yeni makale ekle
                    </button>
                  )}
                  {selectedCategory && (
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => {
                        setSelectedCategorySlug('')
                        setExpandedArticleKey(null)
                        setEditingArticleId(null)
                      }}
                    >
                      Seçimi temizle
                    </button>
                  )}
                </div>
              </div>

              {visibleArticles.length > 0 ? (
                <div className="yardim-article-list">
                  {visibleArticles.map((article) => {
                    const articleKey = getArticleKey(article)
                    const isOpen = expandedArticleKey === articleKey
                    const isEditingArticle =
                      canManageArticles && editingArticleId === article.id

                    return (
                      <article
                        key={articleKey}
                        className={`yardim-article ${isOpen ? 'is-open' : ''} ${
                          isEditingArticle ? 'is-editing' : ''
                        }`}
                      >
                        {isEditingArticle ? (
                          <form
                            className="yardim-article__edit"
                            onSubmit={(event) => saveArticle(article, event)}
                          >
                            <input
                              name="title"
                              defaultValue={article.title}
                              className="yardim-edit-in yardim-edit-in--card-title"
                              placeholder="Makale başlığı"
                              required
                            />
                            <textarea
                              name="excerpt"
                              defaultValue={article.excerpt || ''}
                              className="yardim-edit-in"
                              rows="2"
                              placeholder="Kısa özet (isteğe bağlı)"
                            />
                            <label className="yardim-edit-label">
                              Makale içeriği
                              <textarea
                                name="content"
                                defaultValue={article.content || ''}
                                className="yardim-edit-in"
                                rows="8"
                                placeholder="Paragrafları boş satırla ayırabilirsiniz. (isteğe bağlı)"
                              />
                            </label>
                            <div className="yardim-edit-actions">
                              <button
                                type="button"
                                className="yardim-card-del"
                                onClick={() => deleteArticle(article)}
                                disabled={busy}
                              >
                                Sil
                              </button>
                              <button
                                type="button"
                                className="btn btn--ghost"
                                onClick={() => setEditingArticleId(null)}
                              >
                                Vazgeç
                              </button>
                              <button
                                type="submit"
                                className="btn btn--primary"
                                disabled={busy}
                              >
                                Kaydet
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            {canManageArticles && article.id && (
                              <button
                                type="button"
                                className="yardim-article__pencil"
                                onClick={() => openArticleEdit(article)}
                                aria-label="Yardım makalesini düzenle"
                              >
                                <PencilIcon />
                              </button>
                            )}
                            <button
                              type="button"
                              className="yardim-article__toggle"
                              onClick={() => toggleArticle(article)}
                              aria-expanded={isOpen}
                            >
                              <span>
                                <strong>{article.title}</strong>
                                {article.excerpt && <small>{article.excerpt}</small>}
                              </span>
                              <span className="yardim-article__chevron">
                                {isOpen ? '−' : '+'}
                              </span>
                            </button>
                            {isOpen && <ArticleBody text={article.content} />}
                          </>
                        )}
                      </article>
                    )
                  })}
                </div>
              ) : (
                <p className="yardim-empty" role="status">
                  Bu başlık için henüz içerik eklenmemiş.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ---------- POPÜLER SORULAR ---------- */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Sık Sorulanlar</span>
            <h2>En çok merak edilenler</h2>
          </div>
          {visibleFaq.length > 0 ? (
            <Faq items={visibleFaq} />
          ) : (
            <p className="yardim-empty" role="status">
              Bu aramayla eşleşen sık sorulan soru bulunamadı.
            </p>
          )}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <CtaBand
        title="Aradığınızı bulamadınız mı?"
        text="Destek ekibimiz sorularınızı yanıtlamak için hazır. Bize ulaşın, en kısa sürede dönelim."
        primaryLabel="Destek Talebi Oluştur"
        primaryTo="/iletisim"
        secondaryLabel="Demo Talep Et"
        secondaryTo="/demo"
      />
    </>
  )
}
