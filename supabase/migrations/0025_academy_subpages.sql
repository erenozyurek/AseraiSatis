-- ============================================================
-- Aserai — Akademi alt başlık desteği
-- Mevcut academy_pages kayıtlarına parent_id hiyerarşisi ekler.
-- Üst başlıklar parent_id=null kalır; alt başlıklar parent_id ile bağlanır.
-- ============================================================

alter table public.academy_pages
  add column if not exists parent_id uuid references public.academy_pages (id) on delete set null;

alter table public.academy_pages
  drop constraint if exists academy_pages_not_own_parent;

alter table public.academy_pages
  add constraint academy_pages_not_own_parent
  check (parent_id is null or parent_id <> id);

create index if not exists idx_academy_pages_parent_sort
  on public.academy_pages (parent_id, is_active, sort_order);

drop policy if exists "academy_pages_select_public" on public.academy_pages;

create policy "academy_pages_select_public" on public.academy_pages
  for select using (true);
