import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import '../panel/panel.css'

const actionLabels = {
  'academy.header_update': 'Akademi üst başlığı güncellendi',
  'academy.page_create': 'Akademi başlığı oluşturuldu',
  'academy.page_update': 'Akademi başlığı güncellendi',
  'academy.page_delete': 'Akademi başlığı silindi',
  'api_key.create': 'API anahtarı oluşturuldu',
  'api_key.revoke': 'API anahtarı iptal edildi',
  'blog.create': 'Blog yazısı oluşturuldu',
  'blog.update': 'Blog yazısı güncellendi',
  'blog.delete': 'Blog yazısı silindi',
  'content.feature_category_update': 'Özellik kategorisi güncellendi',
  'content.feature_item_create': 'Özellik kartı oluşturuldu',
  'content.feature_item_update': 'Özellik kartı güncellendi',
  'content.feature_item_delete': 'Özellik kartı silindi',
  'content.module_card_create': 'Modül kartı oluşturuldu',
  'content.module_card_update': 'Modül kartı güncellendi',
  'content.module_card_delete': 'Modül kartı silindi',
  'invoice.ops_update': 'Fatura/e-fatura güncellendi',
  'license.update': 'Lisans güncellendi',
  'module.update': 'Modül güncellendi',
  'notification.broadcast': 'Toplu bildirim gönderildi',
  'notification.send': 'Müşteriye bildirim gönderildi',
  'order.status_update': 'Sipariş durumu güncellendi',
  'package.update': 'Paket güncellendi',
  'payment.status_update': 'Ödeme durumu güncellendi',
  'renewal.status_update': 'Yenileme durumu güncellendi',
  'role.assign': 'Kullanıcıya rol atandı',
  'role.create': 'Rol oluşturuldu',
  'settings.upsert': 'Sistem ayarı güncellendi',
  'support.close': 'Destek talebi kapatıldı',
  'support.reply': 'Destek talebi yanıtlandı',
}

const formatDate = (iso) =>
  new Date(iso).toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

const formatJson = (value) => JSON.stringify(value || {}, null, 2)

export default function AdminLoglar() {
  const [logs, setLogs] = useState(null)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const load = async () => {
    if (!supabase) return
    setRefreshing(true)
    const { data, error: loadError } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(300)
    setError(loadError?.message || '')
    setLogs(data || [])
    setRefreshing(false)
  }

  useEffect(() => {
    load()
  }, [])

  const entityTypes = useMemo(
    () =>
      Array.from(new Set((logs || []).map((log) => log.entity_type).filter(Boolean))).sort(),
    [logs],
  )

  const filteredLogs = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('tr-TR')
    return (logs || []).filter((log) => {
      if (filter !== 'all' && log.entity_type !== filter) return false
      if (!term) return true
      const haystack = [
        log.action,
        actionLabels[log.action],
        log.entity_type,
        log.entity_id,
        log.actor_id,
        formatJson(log.details),
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('tr-TR')
      return haystack.includes(term)
    })
  }, [filter, logs, search])

  return (
    <>
      <div className="panel-head panel-head--row">
        <div>
          <h1>İşlem Logları</h1>
          <p>Yönetim panelindeki kritik operasyon kayıtlarını izleyin.</p>
        </div>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={load}
          disabled={refreshing}
        >
          {refreshing ? 'Yenileniyor…' : 'Yenile'}
        </button>
      </div>

      <div className="panel-card admin-edit">
        <div className="admin-edit__row">
          <div className="field">
            <label>Arama</label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Aksiyon, kullanıcı, kayıt veya detay ara"
            />
          </div>
          <div className="field">
            <label>Kayıt tipi</label>
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">Tümü</option>
              {entityTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="panel-card panel-note panel-note--error" role="alert">
          {error}
        </div>
      )}

      {logs === null ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : filteredLogs.length === 0 ? (
        <div className="panel-card panel-muted">Bu filtreye uygun işlem kaydı yok.</div>
      ) : (
        <div className="panel-invoices">
          {filteredLogs.map((log) => (
            <article key={log.id} className="panel-card panel-invoice">
              <div className="panel-invoice__main">
                <span className="panel-invoice__no">
                  {actionLabels[log.action] || log.action}
                </span>
                <span className="panel-invoice__date">
                  {formatDate(log.created_at)} · {log.entity_type || 'genel'}
                  {log.entity_id ? ` · ${log.entity_id.slice(0, 8)}` : ''}
                </span>
                {Object.keys(log.details || {}).length > 0 && (
                  <code className="panel-log-json">{formatJson(log.details)}</code>
                )}
              </div>
              <div className="panel-invoice__right">
                <span className="panel-chip">
                  {log.actor_id ? log.actor_id.slice(0, 8) : 'sistem'}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  )
}
