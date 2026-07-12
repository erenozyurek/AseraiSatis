-- ============================================================
-- Aserai — Faz 3: Destek Sistemi (Destek Taleplerim)
-- Supabase SQL Editor'de çalıştırın.
-- ============================================================

create table if not exists public.support_tickets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  tenant_id   uuid references public.tenants (id) on delete set null,
  subject     text not null,
  status      text not null default 'open'
                check (status in ('open', 'answered', 'closed')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.ticket_messages (
  id          uuid primary key default gen_random_uuid(),
  ticket_id   uuid not null references public.support_tickets (id) on delete cascade,
  author_id   uuid not null references auth.users (id) on delete cascade,
  is_staff    boolean not null default false,
  body        text not null,
  created_at  timestamptz not null default now()
);

create index if not exists idx_tickets_user on public.support_tickets (user_id);
create index if not exists idx_ticket_messages_ticket on public.ticket_messages (ticket_id);

-- ============================================================
-- RLS
-- ============================================================
alter table public.support_tickets enable row level security;
alter table public.ticket_messages enable row level security;

-- support_tickets: kullanıcı yalnızca kendi taleplerini görür/oluşturur/günceller
create policy "tickets_select_own"
  on public.support_tickets for select
  using (user_id = auth.uid());

create policy "tickets_insert_own"
  on public.support_tickets for insert
  with check (user_id = auth.uid());

create policy "tickets_update_own"
  on public.support_tickets for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ticket_messages: yalnızca kendi taleplerinin mesajları
create policy "ticket_messages_select_own"
  on public.ticket_messages for select
  using (
    ticket_id in (select id from public.support_tickets where user_id = auth.uid())
  );

create policy "ticket_messages_insert_own"
  on public.ticket_messages for insert
  with check (
    author_id = auth.uid()
    and ticket_id in (select id from public.support_tickets where user_id = auth.uid())
  );
