-- ============================================================
-- Aserai - Odeme disi guvenlik saglamlastirmalari
-- 0015 sonrasinda calistirilir.
-- ============================================================

-- Musteriler destek kayitlarini/mesajlarini dogrudan yazamaz. Iki atomik RPC,
-- personel bayragi taklidini ve yarim olusan destek kayitlarini engeller.
drop policy if exists "tickets_insert_own" on public.support_tickets;
drop policy if exists "tickets_update_own" on public.support_tickets;
drop policy if exists "ticket_messages_insert_own" on public.ticket_messages;

create or replace function public.create_support_ticket(
  p_subject text,
  p_body text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_ticket_id uuid;
  v_subject text := btrim(coalesce(p_subject, ''));
  v_body text := btrim(coalesce(p_body, ''));
begin
  if auth.uid() is null then
    raise exception 'Kimlik dogrulamasi gerekli';
  end if;
  if char_length(v_subject) < 3 or char_length(v_subject) > 200 then
    raise exception 'Konu 3-200 karakter arasinda olmalidir';
  end if;
  if char_length(v_body) < 1 or char_length(v_body) > 10000 then
    raise exception 'Mesaj 1-10000 karakter arasinda olmalidir';
  end if;

  insert into public.support_tickets (user_id, subject, status)
  values (auth.uid(), v_subject, 'open')
  returning id into v_ticket_id;

  insert into public.ticket_messages (
    ticket_id, author_id, is_staff, body
  )
  values (v_ticket_id, auth.uid(), false, v_body);

  return v_ticket_id;
end;
$$;

create or replace function public.reply_support_ticket(
  p_ticket_id uuid,
  p_body text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status text;
  v_message_id uuid;
  v_body text := btrim(coalesce(p_body, ''));
begin
  if auth.uid() is null then
    raise exception 'Kimlik dogrulamasi gerekli';
  end if;
  if char_length(v_body) < 1 or char_length(v_body) > 10000 then
    raise exception 'Mesaj 1-10000 karakter arasinda olmalidir';
  end if;

  select status into v_status
    from public.support_tickets
    where id = p_ticket_id and user_id = auth.uid()
    for update;

  if not found then
    raise exception 'Destek talebi bulunamadi';
  end if;
  if v_status = 'closed' then
    raise exception 'Kapali destek talebine yanit verilemez';
  end if;

  insert into public.ticket_messages (
    ticket_id, author_id, is_staff, body
  )
  values (p_ticket_id, auth.uid(), false, v_body)
  returning id into v_message_id;

  update public.support_tickets
    set status = 'open', updated_at = now()
    where id = p_ticket_id;

  return v_message_id;
end;
$$;

create or replace function public.admin_reply_support_ticket(
  p_ticket_id uuid,
  p_body text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_message_id uuid;
  v_body text := btrim(coalesce(p_body, ''));
begin
  if not public.is_platform_admin() then
    raise exception 'Yetkisiz erisim';
  end if;
  if char_length(v_body) < 1 or char_length(v_body) > 10000 then
    raise exception 'Mesaj 1-10000 karakter arasinda olmalidir';
  end if;
  if not exists (
    select 1 from public.support_tickets where id = p_ticket_id
  ) then
    raise exception 'Destek talebi bulunamadi';
  end if;

  insert into public.ticket_messages (
    ticket_id, author_id, is_staff, body
  )
  values (p_ticket_id, auth.uid(), true, v_body)
  returning id into v_message_id;

  update public.support_tickets
    set status = 'answered', updated_at = now()
    where id = p_ticket_id;

  return v_message_id;
end;
$$;

revoke all on function public.create_support_ticket(text, text) from public, anon;
revoke all on function public.reply_support_ticket(uuid, text) from public, anon;
revoke all on function public.admin_reply_support_ticket(uuid, text) from public, anon;
grant execute on function public.create_support_ticket(text, text) to authenticated;
grant execute on function public.reply_support_ticket(uuid, text) to authenticated;
grant execute on function public.admin_reply_support_ticket(uuid, text) to authenticated;

-- Yeni bildirimlerde yalnizca ayni site icindeki yollar saklanabilir.
alter table public.notifications
  drop constraint if exists notifications_internal_link;
alter table public.notifications
  add constraint notifications_internal_link
  check (
    link is null
    or link ~ '^/[A-Za-z0-9/_?=&%#.-]*$'
      and left(link, 2) <> '//'
  ) not valid;

-- Kart gorselleri hem istemcide hem bucket seviyesinde sinirlanir.
update storage.buckets
  set file_size_limit = 5242880,
      allowed_mime_types = array[
        'image/avif', 'image/jpeg', 'image/png', 'image/webp'
      ]::text[]
  where id = 'card-images';
