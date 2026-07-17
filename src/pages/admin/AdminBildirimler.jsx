import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { logAdminAction } from '../../lib/auditLog.js'
import { useAdminData } from '../../context/AdminDataContext.jsx'
import { getSafeInternalPath } from '../../lib/navigation.js'
import '../panel/panel.css'

export default function AdminBildirimler() {
  const { customers } = useAdminData()
  const list = customers || []

  const [target, setTarget] = useState('all')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [link, setLink] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!supabase || !title.trim()) return
    setResult(null)
    setSending(true)

    const safeLink = link.trim() ? getSafeInternalPath(link) : null
    if (link.trim() && !safeLink) {
      setResult({
        ok: false,
        msg: 'Bağlantı aynı site içinde / ile başlayan güvenli bir yol olmalıdır.',
      })
      setSending(false)
      return
    }

    let next
    if (target === 'all') {
      const { data, error } = await supabase.rpc('admin_broadcast_notification', {
        p_title: title.trim(),
        p_body: body.trim() || null,
        p_link: safeLink,
      })
      next = error
        ? { ok: false, msg: 'Gönderilemedi: ' + error.message }
        : { ok: true, msg: `${data} müşteriye duyuru gönderildi.` }
      if (!error) {
        await logAdminAction('notification.broadcast', 'notification', null, {
          title: title.trim(),
          count: data,
          link: safeLink,
        })
      }
    } else {
      const { data, error } = await supabase.rpc('admin_send_notification', {
        p_user_id: target,
        p_title: title.trim(),
        p_body: body.trim() || null,
        p_link: safeLink,
      })
      next = error
        ? { ok: false, msg: 'Gönderilemedi: ' + error.message }
        : { ok: true, msg: 'Bildirim gönderildi.' }
      if (!error) {
        await logAdminAction('notification.send', 'notification', data, {
          title: title.trim(),
          user_id: target,
          link: safeLink,
        })
      }
    }

    setResult(next)
    setSending(false)
    if (next.ok) {
      setTitle('')
      setBody('')
      setLink('')
    }
  }

  return (
    <>
      <div className="panel-head">
        <h1>Bildirim Yönetimi</h1>
        <p>Tek bir müşteriye veya tüm müşterilere duyuru gönderin.</p>
      </div>

      <div className="panel-card">
        <form onSubmit={handleSubmit} className="panel-form">
          <div className="field">
            <label htmlFor="hedef">Alıcı</label>
            <select
              id="hedef"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            >
              <option value="all">Tüm müşteriler</option>
              {list.map((c) => (
                <option key={c.user_id} value={c.user_id}>
                  {c.full_name ? `${c.full_name} — ${c.email}` : c.email}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="baslik">Başlık</label>
            <input
              id="baslik"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn. Planlı bakım duyurusu"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="icerik">İçerik</label>
            <textarea
              id="icerik"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Bildirim metni (opsiyonel)"
            />
          </div>

          <div className="field">
            <label htmlFor="baglanti">Bağlantı (opsiyonel)</label>
            <input
              id="baglanti"
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Örn. /panel/siparislerim"
            />
          </div>

          <div className="panel-form__foot">
            <button type="submit" className="btn btn--primary" disabled={sending}>
              {sending ? 'Gönderiliyor…' : 'Gönder'}
            </button>
            {result && (
              <span className={result.ok ? 'panel-saved' : 'panel-error'}>
                {result.ok ? '✓ ' : ''}
                {result.msg}
              </span>
            )}
          </div>
        </form>
      </div>
    </>
  )
}
