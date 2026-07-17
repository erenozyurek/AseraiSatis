import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, Navigate, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useEditMode } from '../../context/EditModeContext.jsx'
import { normalizeImageUrl, uploadCardImage } from '../../lib/imageUpload.js'
import { logAdminAction } from '../../lib/auditLog.js'
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
const textTemplates = { steps: 'Yeni adım', notes: 'Yeni not' }
const objectTemplates = {
  qa: { q: 'Yeni soru', a: 'Yanıtı yazın', imageUrl: '' },
  roadmap: { phase: 'Yeni faz', text: 'Açıklama yazın', imageUrl: '' },
  videos: { title: 'Yeni video', url: '', imageUrl: '' },
  issues: { issue: 'Yeni hata', solution: 'Çözüm adımlarını yazın', imageUrl: '' },
  codes: { code: 'KOD-000', text: 'Açıklama yazın', imageUrl: '' },
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

function createNewAcademyPage(pages) {
  const slug = uniqueSlug('yeni-baslik', pages)
  return normalizePage({
    slug,
    label: 'Yeni Başlık',
    eyebrow: 'Akademi',
    title: 'Yeni Akademi Başlığı',
    intro: 'Bu başlığın açıklamasını yazın.',
    sort_order: pages.length + 1,
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

export default function Akademi() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const { editMode } = useEditMode()
  const editing = editMode && isAdmin
  const pendingEditSlug = useRef('')

  const [header, setHeader] = useState(DEFAULT_HEADER)
  const [pages, setPages] = useState(academySections.map(normalizePage))
  const [draft, setDraft] = useState(null)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState('')
  const [actionError, setActionError] = useState('')

  const activeSlug = slug || defaultSlug
  const active = pages.find((section) => section.slug === activeSlug)

  const load = async () => {
    if (!supabase) return

    const [settingsResult, pagesResult] = await Promise.all([
      supabase.from('academy_settings').select('*').eq('key', 'main').maybeSingle(),
      supabase
        .from('academy_pages')
        .select('*')
        .order('sort_order', { ascending: true }),
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
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    setDraft(null)
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

  const content = useMemo(() => normalizeContent(active?.content), [active])

  if (!active) return <Navigate to="/akademi" replace />

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

  const addPage = () => {
    const page = createNewAcademyPage(pages)
    pendingEditSlug.current = page.slug
    setPages((current) => [...current, page])
    navigate(`/akademi/${page.slug}`)
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

    const nextPage = pages.find((item) => item.slug !== page.slug)
    if (page.isNew) {
      setPages((current) => current.filter((item) => item.slug !== page.slug))
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
      ? supabase.from('academy_pages').update({ is_active: false, updated_at: payload.updated_at }).eq('id', page.id)
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
              {pages.map((section) => (
                <div key={section.slug} className="akademi-side__item">
                  <NavLink
                    to={`/akademi/${section.slug}`}
                    className="akademi-side__link"
                  >
                    <span>{section.label}</span>
                  </NavLink>
                  {editing && (
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
              ))}
            </nav>
            {editing && (
              <button
                type="button"
                className="akademi-side__add"
                onClick={addPage}
                disabled={busy || Boolean(draft)}
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
            {editing && !draft && (
              <button
                type="button"
                className="akademi-content__pencil"
                onClick={startEdit}
                aria-label="Akademi içeriğini düzenle"
              >
                <PencilIcon />
              </button>
            )}

            {draft ? (
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
