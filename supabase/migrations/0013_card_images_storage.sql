-- ============================================================
-- Aserai — Faz 13: Kart görselleri için Supabase Storage
-- Supabase SQL Editor'de çalıştırın (0012 sonrası).
--
-- image_url kolonu 0012'de eklendi ve KORUNUR; artık yüklenen dosyanın
-- public URL'sini tutar. Burada public bir bucket + admin yazma
-- politikaları tanımlanır. Okuma herkese açık (public bucket / marka görselleri).
-- ============================================================

-- image_url kolonları (0012 çalışmadıysa da güvenli — tekrar edilebilir)
alter table public.feature_cards add column if not exists image_url text;
alter table public.feature_items add column if not exists image_url text;

-- ---------- Public bucket ----------
insert into storage.buckets (id, name, public)
values ('card-images', 'card-images', true)
on conflict (id) do update set public = true;

-- ---------- storage.objects politikaları (yalnızca bu bucket) ----------
-- Herkese açık okuma
create policy "card_images_public_read"
  on storage.objects for select
  using ( bucket_id = 'card-images' );

-- Yükleme: yalnızca platform admin
create policy "card_images_admin_insert"
  on storage.objects for insert
  with check ( bucket_id = 'card-images' and public.is_platform_admin() );

-- Güncelleme (upsert): yalnızca platform admin
create policy "card_images_admin_update"
  on storage.objects for update
  using ( bucket_id = 'card-images' and public.is_platform_admin() )
  with check ( bucket_id = 'card-images' and public.is_platform_admin() );

-- Silme: yalnızca platform admin
create policy "card_images_admin_delete"
  on storage.objects for delete
  using ( bucket_id = 'card-images' and public.is_platform_admin() );
