import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { logAdminAction } from '../../lib/auditLog.js'
import { useAdminData } from '../../context/AdminDataContext.jsx'
import '../panel/panel.css'

export default function AdminRoller() {
  const { customers } = useAdminData()
  const [roles, setRoles] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [userRoles, setUserRoles] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    if (!supabase) return
    const [roleResult, permissionResult, userRoleResult] = await Promise.all([
      supabase.from('roles').select('*').order('name', { ascending: true }),
      supabase
        .from('permissions')
        .select('*')
        .order('code', { ascending: true }),
      supabase.from('user_roles').select('*'),
    ])
    setError(
      roleResult.error?.message ||
        permissionResult.error?.message ||
        userRoleResult.error?.message ||
        '',
    )
    setRoles(roleResult.data || [])
    setPermissions(permissionResult.data || [])
    setUserRoles(userRoleResult.data || [])
  }

  useEffect(() => {
    load()
  }, [])

  const createRole = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = event.target
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .insert({
        name: form.name.value,
        description: form.description.value,
      })
      .select()
      .single()
    if (roleError) {
      setError(roleError.message || 'Rol oluşturulamadı.')
      setBusy(false)
      return
    }

    const selected = permissions.filter((permission) => form[permission.code]?.checked)
    if (selected.length > 0) {
      const { error: permissionError } = await supabase
        .from('role_permissions')
        .insert(
          selected.map((permission) => ({
            role_id: role.id,
            permission_id: permission.id,
          })),
        )
      if (permissionError) {
        setError(permissionError.message || 'Rol yetkileri kaydedilemedi.')
      }
    }
    await logAdminAction('role.create', 'role', role.id, {
      name: role.name,
      permissions: selected.map((permission) => permission.code),
    })
    form.reset()
    await load()
    setBusy(false)
  }

  const assignRole = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = event.target
    const { error: assignError } = await supabase.from('user_roles').upsert({
      user_id: form.user_id.value,
      role_id: form.role_id.value,
    })
    if (assignError) {
      setError(assignError.message || 'Rol atanamadı.')
    } else {
      await logAdminAction('role.assign', 'user_role', null, {
        user_id: form.user_id.value,
        role_id: form.role_id.value,
      })
      await load()
    }
    setBusy(false)
  }

  return (
    <>
      <div className="panel-head">
        <h1>Rol ve Yetki Yönetimi</h1>
        <p>Rolleri, yetkileri ve kullanıcı rol atamalarını yönetin.</p>
      </div>

      {error && (
        <div className="panel-card panel-note panel-note--error" role="alert">
          {error}
        </div>
      )}

      <div className="admin-grid">
        <form className="panel-card admin-edit" onSubmit={createRole}>
          <h2 className="panel-card__title">Yeni rol</h2>
          <div className="field">
            <label>Rol adı</label>
            <input name="name" required />
          </div>
          <div className="field">
            <label>Açıklama</label>
            <input name="description" />
          </div>
          <div className="admin-permissions">
            {permissions.map((permission) => (
              <label key={permission.id} className="admin-check">
                <input type="checkbox" name={permission.code} />
                {permission.code}
              </label>
            ))}
          </div>
          <button type="submit" className="btn btn--primary" disabled={busy}>
            Rol Oluştur
          </button>
        </form>

        <form className="panel-card admin-edit" onSubmit={assignRole}>
          <h2 className="panel-card__title">Kullanıcıya rol ata</h2>
          <div className="field">
            <label>Kullanıcı</label>
            <select name="user_id" required>
              <option value="">Seçin</option>
              {(customers || []).map((customer) => (
                <option key={customer.user_id} value={customer.user_id}>
                  {customer.full_name || customer.email}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Rol</label>
            <select name="role_id" required>
              <option value="">Seçin</option>
              {(roles || []).map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn--primary" disabled={busy}>
            Rol Ata
          </button>
        </form>
      </div>

      <h2 className="panel-subhead">Roller</h2>
      {roles === null ? (
        <div className="panel-card panel-muted">Yükleniyor…</div>
      ) : (
        <div className="panel-invoices">
          {roles.map((role) => (
            <article key={role.id} className="panel-card panel-invoice">
              <div className="panel-invoice__main">
                <span className="panel-invoice__no">{role.name}</span>
                <span className="panel-invoice__date">
                  {role.description || 'Açıklama yok'}
                </span>
              </div>
              {role.is_system && (
                <span className="panel-badge panel-badge--active">Sistem</span>
              )}
            </article>
          ))}
        </div>
      )}

      <h2 className="panel-subhead">Atamalar</h2>
      <div className="panel-invoices">
        {userRoles.map((item) => {
          const user = (customers || []).find((c) => c.user_id === item.user_id)
          const role = (roles || []).find((r) => r.id === item.role_id)
          return (
            <article key={`${item.user_id}:${item.role_id}`} className="panel-card panel-invoice">
              <div className="panel-invoice__main">
                <span className="panel-invoice__no">
                  {user?.full_name || user?.email || item.user_id}
                </span>
                <span className="panel-invoice__date">
                  {role?.name || item.role_id}
                </span>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}
