import { useEffect, useState } from 'react'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useEditMode } from '../../context/EditModeContext.jsx'
import {
  normalizeImageUrl,
  uploadCardImage,
} from '../../lib/imageUpload.js'
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

const DEFAULT_ICON = 'M4 5h16v14H4zM4 9h16M9 9v10'

/* Statik yedek (DB boşsa gösterilir) */
const staticCategories = [
  { slug: 'yapay-zeka', title: 'Yapay Zeka & Otomasyon', description: 'Yapay zeka destekli araçlarla içerik, öneri ve fiyatlandırma süreçlerinizi otomatikleştirin.', items: [
    { title: 'AI Otomatik İçerik Çevirisi', desc: 'Ürün açıklamalarınız tüm dillere otomatik ve doğru şekilde çevrilir.', iconPath: 'M4 5h7M7 4c0 6-3 10-4 11m2-4c3 0 6 2 7 4M13 20l4-9 4 9m-7-3h6' },
    { title: 'AI Otomatik Metin Oluşturma', desc: 'Ürünleriniz için profesyonel açıklamalar ve tanıtım metinleri otomatik hazırlanır.', iconPath: 'M4 6h16M4 10h16M4 14h10M4 18h7M18 14l3 3-5 2 2-5z' },
    { title: 'AI Tabanlı Ürün Öneri Motoru', desc: 'Müşterilere en çok ilgisini çekecek ürünleri akıllıca önererek satışları artırır.', iconPath: 'M12 3l2.5 5 5.5.8-4 3.9 1 5.5-5-2.6-5 2.6 1-5.5-4-3.9 5.5-.8z' },
    { title: 'Kullanıcı Davranışını Öğrenen Akıllı Filtreler', desc: 'Müşterilerin alışveriş alışkanlıklarına göre kendini geliştirerek daha doğru filtreleme sunar.', iconPath: 'M4 5h16l-6 7v6l-4 2v-8z' },
    { title: 'Akıllı Fiyatlandırma Algoritması', desc: 'Piyasayı analiz ederek ürünlerinize en uygun fiyatı otomatik belirler.', iconPath: 'M12 3v18M8 7h6a2 2 0 010 4H9a2 2 0 000 4h7' },
  ] },
  { slug: 'urun-katalog', title: 'Ürün & Katalog Yönetimi', description: 'Sınırsız ürün, esnek varyant ve markanıza özel vitrinle katalogunuzu yönetin.', items: [
    { title: 'Sınırsız Ürün Sayısı', desc: 'Platforma istediğiniz kadar ürün ekleyebilir, herhangi bir sınırla karşılaşmazsınız.', iconPath: 'M4 7l8-4 8 4-8 4zM4 7v10l8 4 8-4V7M12 11v10' },
    { title: 'Özelleştirilebilir Tema / Katalog-Vitrin', desc: 'Mağazanızın görünümünü kolayca değiştirerek tamamen markanıza uygun bir vitrin oluşturun.', iconPath: 'M3 5h18v4H3zM3 11h10v8H3zM15 11h6v8h-6z' },
    { title: 'Ürün Versiyonlama', desc: 'Ürünün stok, fiyat gibi değişikliklerinin kaydının tutulması ve geçmişe erişim.', iconPath: 'M4 12a8 8 0 0114-5M20 12a8 8 0 01-14 5M17 4v3h-3M7 20v-3h3' },
    { title: 'Set Ürün Oluşturma / Ortak Stok', desc: 'Set halinde ürün satışı ve satış başına ortak stok takibi yapabilirsiniz.', iconPath: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' },
    { title: 'Teklif ile Yayın Özelliği', desc: 'Ürünlerinizi fiyat belirtmeden teklif al şeklinde yayınlayarak özel satış yapın.', iconPath: 'M4 5h16v10H8l-4 4zM8 9h8M8 12h5' },
  ] },
  { slug: 'satis-pazarlama', title: 'Satış & Pazarlama', description: 'SEO, kampanya senaryoları ve bayi araçlarıyla satışlarınızı büyütün.', items: [
    { title: 'Güçlü SEO Altyapısı', desc: 'Siteniz arama motorlarında daha görünür olur ve daha fazla ziyaretçi çekersiniz.', iconPath: 'M11 4a7 7 0 105 12 7 7 0 00-5-12zM21 21l-4.3-4.3' },
    { title: 'Sepet Kampanya Senaryoları', desc: 'Müşterilerin sepet davranışlarına göre otomatik kampanyalar oluşturabilirsiniz.', iconPath: 'M3 4h2l2.4 12.4a1 1 0 001 .8h9.2a1 1 0 001-.8L21 8H6M9 21a1 1 0 100-2 1 1 0 000 2z' },
    { title: 'Bayii Rolü', desc: 'Üyeler Bayii rolüyle otomatik indirimli alışveriş yapabilir.', iconPath: 'M16 20a4 4 0 00-8 0M12 12a4 4 0 100-8 4 4 0 000 8M20 20a3 3 0 00-4-2.8' },
    { title: 'Otomatik Yeniden Sipariş Eşikleri', desc: 'B2B satışlarda sipariş eşiklerinin yönetimi ve takibi sağlanır.', iconPath: 'M4 4v16h16M8 16v-4M12 16V8M16 16v-6' },
  ] },
  { slug: 'global-satis', title: 'Global Satış & Entegrasyon', description: 'Modüler entegrasyon, çoklu dil-döviz ve e-ihracat desteğiyle dünyaya açılın.', items: [
    { title: 'Modüler Entegrasyon Uyumu', desc: 'Sisteminiz diğer yazılımlarla kolayca entegre olur ve birlikte sorunsuz çalışır.', iconPath: 'M4 7h16M4 12h16M4 17h16M8 3v18M16 3v18' },
    { title: 'Çoklu Dil & Çoklu Döviz Modülü', desc: 'Mağazanızı farklı ülkelerde farklı dil ve para birimleriyle rahatça kullanın.', iconPath: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 3.8 6 3.8 9s-1.3 6.5-3.8 9' },
    { title: 'E-İhracat Danışmanlığı', desc: 'Yurtdışına satış yapmak isteyen işletmelere strateji, operasyon ve pazar desteği sağlanır.', iconPath: 'M3 21h18M5 21V10l7-5 7 5v11M9 21v-5h6v5' },
    { title: 'İlan Açma Haritalandırma Modülü', desc: 'Lokasyon bazlı stoklar için haritalandırma ve harita üzerinde konum belirtme.', iconPath: 'M12 21s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z' },
  ] },
]

export default function Ozellikler() {
  const { isAdmin } = useAuth()
  const { editMode } = useEditMode()
  const editing = editMode && isAdmin

  const [cats, setCats] = useState(null)
  const [editingItemId, setEditingItemId] = useState(null)
  const [imageDraft, setImageDraft] = useState('')
  const [uploading, setUploading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')

  const openEditItem = (item) => {
    setImageDraft(item.imageUrl || '')
    setActionError('')
    setEditingItemId(item.id)
  }

  const uploadImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setActionError('')
    try {
      setImageDraft(await uploadCardImage('features', file))
    } catch (error) {
      setActionError(error.message || 'Görsel yüklenemedi.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const load = async () => {
    if (!supabase) return
    const [{ data: c }, { data: it }] = await Promise.all([
      supabase.from('feature_categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('feature_items').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
    ])
    if (c) {
      const items = it || []
      setCats(
        c.map((cat) => ({
          id: cat.id,
          slug: cat.slug,
          title: cat.title,
          description: cat.description,
          items: items
            .filter((i) => i.category_id === cat.id)
            .map((i) => ({ id: i.id, title: i.title, desc: i.description, iconPath: i.icon_path, imageUrl: i.image_url })),
        })),
      )
    }
  }

  useEffect(() => {
    load()
  }, [])

  const list =
    cats && cats.length
      ? cats
      : staticCategories.map((c) => ({ ...c, id: null, items: c.items.map((i) => ({ ...i, id: null })) }))

  const saveItem = async (item, e) => {
    e.preventDefault()
    const f = e.target
    setActionError('')
    let imageUrl
    try {
      imageUrl = normalizeImageUrl(imageDraft)
    } catch (error) {
      setActionError(error.message)
      return
    }
    setBusy(true)
    const { error } = await supabase.from('feature_items').update({ title: f.title.value, description: f.description.value, image_url: imageUrl, updated_at: new Date().toISOString() }).eq('id', item.id)
    setBusy(false)
    if (error) {
      setActionError(error.message || 'Özellik kaydedilemedi.')
      return
    }
    setEditingItemId(null)
    load()
  }
  const deleteItem = async (item) => {
    setBusy(true)
    await supabase.from('feature_items').delete().eq('id', item.id)
    setBusy(false)
    setEditingItemId(null)
    load()
  }
  const addItem = async (cat) => {
    setBusy(true)
    const { data } = await supabase.from('feature_items').insert({ category_id: cat.id, title: 'Yeni Özellik', description: 'Açıklama ekleyin', icon_path: DEFAULT_ICON, sort_order: cat.items.length + 1 }).select('id').single()
    setBusy(false)
    await load()
    if (data) {
      setImageDraft('')
      setEditingItemId(data.id)
    }
  }
  const saveCategory = async (cat, e) => {
    e.preventDefault()
    const f = e.target
    setBusy(true)
    await supabase.from('feature_categories').update({ title: f.title.value, description: f.description.value, updated_at: new Date().toISOString() }).eq('id', cat.id)
    setBusy(false)
    load()
  }

  return (
    <>
      <PageHeader
        eyebrow="Öne Çıkan Özellikler"
        title="Aserai Yeni Nesil E-Ticaret"
        text="Yapay zekâ destekli araçlardan global satışa, akıllı fiyatlandırmadan bayi yönetimine kadar Aserai’nin sunduğu öne çıkan özellikleri keşfedin."
      />

      {list.map((cat, idx) => (
        <section key={cat.id || cat.slug} className={`section oz-cat ${idx % 2 === 1 ? 'section--soft' : ''}`}>
          <div className="container">
            <div className="oz-cat__head">
              {editing && cat.id ? (
                <form className="oz-cat__edit" onSubmit={(e) => saveCategory(cat, e)}>
                  <input name="title" defaultValue={cat.title} className="oz-edit-in oz-edit-in--h2" required />
                  <input name="description" defaultValue={cat.description || ''} className="oz-edit-in" />
                  <button type="submit" className="btn btn--primary" disabled={busy}>Başlığı Kaydet</button>
                </form>
              ) : (
                <>
                  <h2>{cat.title}</h2>
                  <p>{cat.description}</p>
                </>
              )}
            </div>

            <div className="oz-grid">
              {cat.items.map((it) => {
                const isEd = editing && editingItemId === it.id && it.id
                return (
                  <article key={it.id || it.title} className={`oz-card ${editing ? 'is-editable' : ''} ${isEd ? 'is-editing' : ''}`}>
                    {isEd ? (
                      <form className="oz-card__edit" onSubmit={(e) => saveItem(it, e)}>
                        <input name="title" defaultValue={it.title} className="oz-edit-in oz-edit-in--title" required />
                        <textarea name="description" defaultValue={it.desc || ''} rows="3" className="oz-edit-in" />
                        <div className="oz-img-edit">
                          {imageDraft && (
                            <span className="oz-card__img oz-card__img--preview">
                              <img src={imageDraft} alt="" />
                            </span>
                          )}
                          <div className="oz-img-edit__row">
                            <label className="btn btn--ghost oz-upload">
                              {uploading ? 'Yükleniyor…' : 'Görsel yükle'}
                              <input type="file" accept="image/avif,image/jpeg,image/png,image/webp" onChange={uploadImage} disabled={uploading} hidden />
                            </label>
                            {imageDraft && (
                              <button type="button" className="oz-card__del" onClick={() => setImageDraft('')}>
                                Kaldır
                              </button>
                            )}
                          </div>
                          <input value={imageDraft} onChange={(e) => setImageDraft(e.target.value)} placeholder="veya görsel URL'si — boşsa ikon" className="oz-edit-in" />
                          {actionError && (
                            <span className="panel-error" role="alert">
                              {actionError}
                            </span>
                          )}
                        </div>
                        <div className="oz-card__edit-actions">
                          <button type="button" className="oz-card__del" onClick={() => deleteItem(it)} disabled={busy}>Sil</button>
                          <button type="button" className="btn btn--ghost" onClick={() => setEditingItemId(null)}>Vazgeç</button>
                          <button type="submit" className="btn btn--primary" disabled={busy}>Kaydet</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        {editing && it.id && (
                          <button type="button" className="oz-card__pencil" onClick={() => openEditItem(it)} aria-label="Özelliği düzenle">
                            <PencilIcon />
                          </button>
                        )}
                        {it.imageUrl ? (
                          <span className="oz-card__img">
                            <img src={it.imageUrl} alt={it.title} loading="lazy" />
                          </span>
                        ) : (
                          <span className="oz-card__icon" aria-hidden="true">
                            <Icon path={it.iconPath} />
                          </span>
                        )}
                        <div>
                          <h3>{it.title}</h3>
                          <p>{it.desc}</p>
                        </div>
                      </>
                    )}
                  </article>
                )
              })}

              {editing && cat.id && (
                <button type="button" className="oz-card oz-card--add" onClick={() => addItem(cat)} disabled={busy}>
                  <span className="oz-card__plus" aria-hidden="true">+</span>
                  <span>Yeni özellik ekle</span>
                </button>
              )}
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
