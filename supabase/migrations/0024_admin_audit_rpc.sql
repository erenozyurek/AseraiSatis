-- ============================================================
-- Aserai — Genel admin audit log RPC
-- Frontend'de doğrudan yapılan kritik admin işlemleri güvenli şekilde
-- audit_logs tablosuna yazılsın.
-- ============================================================

create or replace function public.admin_log_action(
  p_action text,
  p_entity_type text default null,
  p_entity_id uuid default null,
  p_details jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_log_id uuid;
begin
  if not public.is_platform_admin() then
    raise exception 'Yetkisiz erisim';
  end if;

  if nullif(btrim(coalesce(p_action, '')), '') is null then
    raise exception 'Log aksiyonu zorunludur';
  end if;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, details)
  values (
    auth.uid(),
    btrim(p_action),
    nullif(btrim(coalesce(p_entity_type, '')), ''),
    p_entity_id,
    coalesce(p_details, '{}'::jsonb)
  )
  returning id into v_log_id;

  return v_log_id;
end;
$$;

revoke all on function public.admin_log_action(text, text, uuid, jsonb)
  from public, anon, authenticated;
grant execute on function public.admin_log_action(text, text, uuid, jsonb)
  to authenticated;
