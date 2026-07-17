import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader/PageHeader.jsx'
import CtaBand from '../../components/CtaBand/CtaBand.jsx'
import { supabase } from '../../lib/supabase.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useEditMode } from '../../context/EditModeContext.jsx'
import { logAdminAction } from '../../lib/auditLog.js'
import {
  normalizeImageUrl,
  uploadCardImage,
} from '../../lib/imageUpload.js'
import './Moduller.css'

const Icon = ({ path }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
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

/* Statik yedek (DB boşsa / tablo yoksa gösterilir) */
const staticModules = [
  { title: 'E-Fatura & E-Arşiv', desc: 'Faturalarınızı otomatik oluşturun, GİB entegrasyonuyla e-fatura ve e-arşiv süreçlerini tek tıkla yönetin.', iconPath: 'M6 3h9l3 3v15H6zM14 3v4h4M9 12h6M9 16h6' },
  { title: 'Kargo Takip & Entegrasyon', desc: 'Anlaşmalı kargo firmalarını bağlayın; gönderi oluşturun, takip numarasını ve durumunu otomatik güncelleyin.', iconPath: 'M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10' },
  { title: 'Pazaryeri Entegrasyonu', desc: 'Trendyol, Hepsiburada, Amazon ve daha fazlasını tek panelden yönetin; ürün, stok ve siparişleri senkronize edin.', iconPath: 'M4 7h16M4 12h16M4 17h16M8 3v18M16 3v18' },
  { title: 'Muhasebe Entegrasyonu', desc: 'Satış, fatura ve tahsilat verilerinizi muhasebe programınıza otomatik aktarın, mutabakatı kolaylaştırın.', iconPath: 'M6 3h12v18H6zM9 7h6M9 11h6M9 15h3' },
  { title: 'Sanal POS & Ödeme', desc: 'Tüm sanal POS sağlayıcılarıyla tam uyum, taksit seçenekleri ve PCI-DSS uyumlu güvenli ödeme altyapısı.', iconPath: 'M3 6h18v12H3zM3 10h18M7 15h4' },
  { title: 'BuyBox Rekabet Analizi', desc: 'Pazaryerlerinde rakip fiyatlarını izleyin, BuyBox kazanma oranınızı artıracak akıllı fiyatlandırma yapın.', iconPath: 'M5 19V10M10 19V5M15 19v-7M20 19v-4M3 21h18' },
  { title: 'Stok & Depo Yönetimi', desc: 'Çoklu depo desteğiyle stokları tek yerden yönetin; kritik stok uyarıları ve otomatik senkron alın.', iconPath: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10' },
  { title: 'Toplu Ürün Yükleme', desc: 'Binlerce ürünü Excel veya pazaryerlerinden tek tıkla toplu yükleyin; görsel ve açıklamaları hızlıca düzenleyin.', iconPath: 'M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2' },
  { title: 'Sipariş Yönetimi', desc: 'Tüm kanallardan gelen siparişleri tek ekrandan görün; durum güncellemelerini ve iadeleri kolayca yönetin.', iconPath: 'M9 3h6a1 1 0 011 1v1h2v16H6V5h2V4a1 1 0 011-1zM9 11l1.5 1.5L14 9' },
  { title: 'B2B Modülü', desc: 'Bayi ve toptan müşterileriniz için özel fiyat listeleri, cari hesap ve sipariş akışı oluşturun.', iconPath: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 11h.01M15 11h.01' },
  { title: 'E-İhracat', desc: 'Sınırsız dil ve para birimiyle satış yapın; gümrük ve uluslararası kargo süreçlerini kolaylaştırın.', iconPath: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.5 3.8 6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-6-3.8-9s1.3-6.5 3.8-9z' },
  { title: 'CRM & Müşteri Yönetimi', desc: 'Müşteri segmentleri oluşturun, satın alma geçmişini takip edin ve kişiye özel iletişim kurun.', iconPath: 'M16 20a4 4 0 00-8 0M12 12a4 4 0 100-8 4 4 0 000 8M20 20a3 3 0 00-4-2.8M4 20a3 3 0 014-2.8' },
  { title: 'Kampanya & Kupon Yönetimi', desc: 'İndirim kuponları, sepet kampanyaları ve otomatik promosyon kurallarıyla dönüşümü artırın.', iconPath: 'M20 12l-8 8-9-9V4h7l10 10-1 1zM7.5 7.5h.01M9 15l6-6' },
  { title: 'Raporlama & Analitik', desc: 'Ciro, dönüşüm ve kanal performansını canlı grafiklerle izleyin; veriye dayalı kararlar alın.', iconPath: 'M4 4v16h16M8 16v-4M12 16V8M16 16v-6' },
  { title: 'Çoklu Dil & Çoklu Döviz', desc: 'Mağazanızı birden fazla dil ve para biriminde yayınlayarak global müşterilere ulaşın.', iconPath: 'M3 5h12M9 3v2m1.5 0c0 5-3 9-6.5 11M5 9c0 3 2.5 5.5 6 6.5M14 20l4-9 4 9M15.5 17h5' },
]

export default function Moduller() {
  const { isAdmin } = useAuth()
  const { editMode } = useEditMode()
  const editing = editMode && isAdmin

  const [cards, setCards] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [imageDraft, setImageDraft] = useState('')
  const [uploading, setUploading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')

  const openEdit = (card) => {
    setImageDraft(card.imageUrl || '')
    setActionError('')
    setEditingId(card.id)
  }

  const uploadImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setActionError('')
    try {
      setImageDraft(await uploadCardImage('modules', file))
    } catch (error) {
      setActionError(error.message || 'Görsel yüklenemedi.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const load = async () => {
    if (!supabase) return
    const { data } = await supabase
      .from('feature_cards')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    if (data)
      setCards(
        data.map((c) => ({
          id: c.id,
          title: c.title,
          desc: c.description,
          iconPath: c.icon_path,
          imageUrl: c.image_url,
        })),
      )
  }

  useEffect(() => {
    load()
  }, [])

  const list =
    cards && cards.length
      ? cards
      : staticModules.map((m) => ({ id: null, ...m }))

  const saveCard = async (card, e) => {
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
    const { error } = await supabase
      .from('feature_cards')
      .update({
        title: f.title.value,
        description: f.description.value,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', card.id)
    setBusy(false)
    if (error) {
      setActionError(error.message || 'Kart kaydedilemedi.')
      return
    }
    await logAdminAction('content.module_card_update', 'feature_card', card.id, {
      title: f.title.value,
    })
    setEditingId(null)
    load()
  }

  const deleteCard = async (card) => {
    setBusy(true)
    setActionError('')
    const { error } = await supabase
      .from('feature_cards')
      .delete()
      .eq('id', card.id)
    setBusy(false)
    if (error) {
      setActionError(error.message || 'Kart silinemedi.')
      return
    }
    await logAdminAction('content.module_card_delete', 'feature_card', card.id, {
      title: card.title,
    })
    setEditingId(null)
    load()
  }

  const addCard = async () => {
    setBusy(true)
    setActionError('')
    const { data, error } = await supabase
      .from('feature_cards')
      .insert({
        title: 'Yeni Modül',
        description: 'Açıklama ekleyin',
        icon_path: DEFAULT_ICON,
        sort_order: list.length + 1,
      })
      .select('id')
      .single()
    setBusy(false)
    if (error) {
      setActionError(error.message || 'Kart eklenemedi.')
      return
    }
    await load()
    await logAdminAction('content.module_card_create', 'feature_card', data?.id || null, {
      title: 'Yeni Modül',
    })
    if (data) {
      setImageDraft('')
      setEditingId(data.id)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Modüller"
        title="İşletmenizi büyüten modüller"
        text="E-ticaret operasyonunuzun her adımı için hazır entegrasyon ve modüller. İhtiyacınız olanları etkinleştirin, tek panelden yönetin."
      />

      <section className="section">
        <div className="container">
          <div className="mod-grid">
            {list.map((m) => {
              const isEditingCard = editing && editingId === m.id && m.id
              return (
                <article
                  key={m.id || m.title}
                  className={`mod-card ${editing ? 'is-editable' : ''} ${
                    isEditingCard ? 'is-editing' : ''
                  }`}
                >
                  {isEditingCard ? (
                    <form
                      className="mod-card__edit"
                      onSubmit={(e) => saveCard(m, e)}
                    >
                      <input
                        name="title"
                        defaultValue={m.title}
                        className="mod-edit-in mod-edit-in--title"
                        required
                      />
                      <textarea
                        name="description"
                        defaultValue={m.desc || ''}
                        rows="4"
                        className="mod-edit-in"
                      />
                      <div className="mod-img-edit">
                        {imageDraft && (
                          <span className="mod-card__img mod-card__img--preview">
                            <img src={imageDraft} alt="" />
                          </span>
                        )}
                        <div className="mod-img-edit__row">
                          <label className="btn btn--ghost mod-upload">
                            {uploading ? 'Yükleniyor…' : 'Görsel yükle'}
                            <input
                              type="file"
                              accept="image/avif,image/jpeg,image/png,image/webp"
                              onChange={uploadImage}
                              disabled={uploading}
                              hidden
                            />
                          </label>
                          {imageDraft && (
                            <button
                              type="button"
                              className="mod-card__del"
                              onClick={() => setImageDraft('')}
                            >
                              Görseli kaldır
                            </button>
                          )}
                        </div>
                        <input
                          value={imageDraft}
                          onChange={(e) => setImageDraft(e.target.value)}
                          placeholder="veya görsel URL'si yapıştırın — boşsa ikon gösterilir"
                          className="mod-edit-in"
                        />
                        {actionError && (
                          <span className="panel-error" role="alert">
                            {actionError}
                          </span>
                        )}
                      </div>
                      <div className="mod-card__edit-actions">
                        <button
                          type="button"
                          className="mod-card__del"
                          onClick={() => deleteCard(m)}
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
                      {editing && m.id && (
                        <button
                          type="button"
                          className="mod-card__pencil"
                          onClick={() => openEdit(m)}
                          aria-label="Kartı düzenle"
                        >
                          <PencilIcon />
                        </button>
                      )}
                      {m.imageUrl ? (
                        <span className="mod-card__img">
                          <img src={m.imageUrl} alt={m.title} loading="lazy" />
                        </span>
                      ) : (
                        <span className="mod-card__icon" aria-hidden="true">
                          <Icon path={m.iconPath} />
                        </span>
                      )}
                      <h3>{m.title}</h3>
                      <p>{m.desc}</p>
                    </>
                  )}
                </article>
              )
            })}

            {editing && (
              <button
                type="button"
                className="mod-card mod-card--add"
                onClick={addCard}
                disabled={busy}
              >
                <span className="mod-card__plus" aria-hidden="true">
                  +
                </span>
                <span>Yeni kart ekle</span>
              </button>
            )}
          </div>

          <p className="mod-note">
            Aradığınız modülü bulamadınız mı?{' '}
            <Link to="/iletisim" className="text-link">
              Bizimle iletişime geçin
              <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      <CtaBand
        title="İhtiyacınız olan modülleri tek panelde toplayın"
        text="Aserai ile mağazanızı, entegrasyonlarınızı ve tüm operasyonunuzu tek yerden yönetin."
      />
    </>
  )
}
