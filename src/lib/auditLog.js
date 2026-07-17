import { supabase } from './supabase.js'

export async function logAdminAction(action, entityType = null, entityId = null, details = {}) {
  if (!supabase) return null

  const { data, error } = await supabase.rpc('admin_log_action', {
    p_action: action,
    p_entity_type: entityType,
    p_entity_id: entityId,
    p_details: details || {},
  })

  if (error) {
    console.warn('Audit log yazılamadı:', error.message)
    return null
  }

  return data
}
