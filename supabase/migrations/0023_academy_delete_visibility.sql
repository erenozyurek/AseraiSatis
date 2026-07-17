-- ============================================================
-- Aserai — Akademi başlık silme desteği
-- Silinen varsayılan başlıkların statik yedekten geri eklenmemesi için
-- istemci inactive slug bilgisini okuyabilir. Sayfa yine istemcide
-- is_active=true kayıtlarla render edilir.
-- ============================================================

drop policy if exists "academy_pages_select_public" on public.academy_pages;

create policy "academy_pages_select_public" on public.academy_pages
  for select using (true);
