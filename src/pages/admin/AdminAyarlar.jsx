import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import '../panel/panel.css'

const defaultSettings = {
  general: {
    siteName: 'Aserai',
    supportEmail: 'destek@aserai.com',
    companyName: 'Dijital Atölyemiz',
  },
  smtp: {
    senderName: 'Aserai',
    senderEmail: 'noreply@aserai.com',
  },
  sms: {
    provider: '',
    sender: 'ASERAI',
  },
  seo: {
    title: 'Aserai',
    description: 'E-ticaret altyapısı satış ve demo platformu',
  },
  analytics: {
    measurementId: '',
  },
  cookies: {
    bannerEnabled: true,
    policyVersion: '2026.1',
  },
}

export default function AdminAyarlar() {
  const [settings, setSettings] = useState(defaultSettings)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      if (!supabase) return
      const { data, error: loadError } = await supabase
        .from('system_settings')
        .select('*')
      if (loadError) {
        setError(loadError.message || 'Ayarlar alınamadı.')
        return
      }
      const next = { ...defaultSettings }
      ;(data || []).forEach((row) => {
        next[row.key] = { ...next[row.key], ...row.value }
      })
      setSettings(next)
    }
    load()
  }, [])

  const save = async (event) => {
    event.preventDefault()
    setBusy(true)
    setSaved(false)
    setError('')
    const form = event.target
    const next = {
      general: {
        siteName: form.siteName.value,
        supportEmail: form.supportEmail.value,
        companyName: form.companyName.value,
      },
      smtp: {
        senderName: form.senderName.value,
        senderEmail: form.senderEmail.value,
      },
      sms: {
        provider: form.smsProvider.value,
        sender: form.smsSender.value,
      },
      seo: {
        title: form.seoTitle.value,
        description: form.seoDescription.value,
      },
      analytics: {
        measurementId: form.measurementId.value,
      },
      cookies: {
        bannerEnabled: form.cookieBanner.checked,
        policyVersion: form.cookieVersion.value,
      },
    }

    for (const [key, value] of Object.entries(next)) {
      const { error: saveError } = await supabase.rpc(
        'admin_upsert_system_setting',
        {
          p_key: key,
          p_value: value,
        },
      )
      if (saveError) {
        setError(saveError.message || 'Ayarlar kaydedilemedi.')
        setBusy(false)
        return
      }
    }

    setSettings(next)
    setSaved(true)
    setBusy(false)
  }

  return (
    <>
      <div className="panel-head">
        <h1>Sistem Ayarları</h1>
        <p>Genel, SMTP, SMS, SEO, analytics ve çerez ayarlarını yönetin.</p>
      </div>

      {error && (
        <div className="panel-card panel-note panel-note--error" role="alert">
          {error}
        </div>
      )}
      {saved && (
        <div className="panel-card panel-note panel-note--success" role="status">
          Ayarlar kaydedildi.
        </div>
      )}

      <form className="panel-card admin-edit" onSubmit={save}>
        <h2 className="panel-card__title">Genel</h2>
        <div className="admin-edit__row">
          <div className="field">
            <label>Site adı</label>
            <input name="siteName" defaultValue={settings.general.siteName} />
          </div>
          <div className="field">
            <label>Destek e-postası</label>
            <input
              name="supportEmail"
              type="email"
              defaultValue={settings.general.supportEmail}
            />
          </div>
        </div>
        <div className="field">
          <label>Firma adı</label>
          <input name="companyName" defaultValue={settings.general.companyName} />
        </div>

        <h2 className="panel-subhead">SMTP ve SMS</h2>
        <div className="admin-edit__row">
          <div className="field">
            <label>Gönderici adı</label>
            <input name="senderName" defaultValue={settings.smtp.senderName} />
          </div>
          <div className="field">
            <label>Gönderici e-posta</label>
            <input
              name="senderEmail"
              type="email"
              defaultValue={settings.smtp.senderEmail}
            />
          </div>
          <div className="field">
            <label>SMS sağlayıcı</label>
            <input name="smsProvider" defaultValue={settings.sms.provider} />
          </div>
          <div className="field">
            <label>SMS başlığı</label>
            <input name="smsSender" defaultValue={settings.sms.sender} />
          </div>
        </div>

        <h2 className="panel-subhead">SEO, Analytics ve Çerez</h2>
        <div className="field">
          <label>SEO başlığı</label>
          <input name="seoTitle" defaultValue={settings.seo.title} />
        </div>
        <div className="field">
          <label>SEO açıklaması</label>
          <input name="seoDescription" defaultValue={settings.seo.description} />
        </div>
        <div className="admin-edit__row">
          <div className="field">
            <label>Analytics ölçüm ID</label>
            <input
              name="measurementId"
              defaultValue={settings.analytics.measurementId}
            />
          </div>
          <div className="field">
            <label>Çerez politika versiyonu</label>
            <input
              name="cookieVersion"
              defaultValue={settings.cookies.policyVersion}
            />
          </div>
        </div>
        <label className="admin-check">
          <input
            type="checkbox"
            name="cookieBanner"
            defaultChecked={settings.cookies.bannerEnabled}
          />
          Çerez bilgilendirme bandı aktif
        </label>

        <div className="admin-edit__actions">
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? 'Kaydediliyor…' : 'Ayarları Kaydet'}
          </button>
        </div>
      </form>
    </>
  )
}
