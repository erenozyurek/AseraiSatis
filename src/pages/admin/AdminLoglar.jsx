import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import '../panel/panel.css'

const formatDate = (iso) =>
  new Date(iso).toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })

export default function AdminLoglar() {
  const [logs, setLogs] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      if (!supabase) return
      const { data, error: loadError } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200)
      setError(loadError?.message || '')
      setLogs(data || [])
    }
    load()
  }, [])

  return (
    <>
      <div className="panel-head">
        <h1>İşlem Logları</h1>
        <p>Yönetim panelindeki kritik operasyon kayıtlarını izleyin.</p>
      </div>

      {error && (
        <div className="panel-card panel-note panel-note--error" role="alert">
          {error}
        </div>
      )}

      {logs === null ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : logs.length === 0 ? (
        <div className="panel-card panel-muted">Henüz işlem kaydı yok.</div>
      ) : (
        <div className="panel-invoices">
          {logs.map((log) => (
            <article key={log.id} className="panel-card panel-invoice">
              <div className="panel-invoice__main">
                <span className="panel-invoice__no">{log.action}</span>
                <span className="panel-invoice__date">
                  {formatDate(log.created_at)} · {log.entity_type || 'genel'}
                  {log.entity_id ? ` · ${log.entity_id.slice(0, 8)}` : ''}
                </span>
                {Object.keys(log.details || {}).length > 0 && (
                  <code className="panel-log-json">
                    {JSON.stringify(log.details)}
                  </code>
                )}
              </div>
              {log.actor_id && (
                <span className="panel-chip">{log.actor_id.slice(0, 8)}</span>
              )}
            </article>
          ))}
        </div>
      )}
    </>
  )
}
