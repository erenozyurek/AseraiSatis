-- ============================================================
-- Aserai — Faz 12: Kart görselleri (Modüller + Tüm Özellikler)
-- Supabase SQL Editor'de çalıştırın (0006 ve 0007 sonrası).
--
-- Kartlara opsiyonel bir görsel URL'si ekler. Görsel varsa kartta
-- ikon yerine resim gösterilir; boşsa mevcut SVG ikona düşülür.
-- Admin, inline düzenleme modunda bu URL'yi girer/değiştirir.
-- ============================================================

alter table public.feature_cards
  add column if not exists image_url text;

alter table public.feature_items
  add column if not exists image_url text;
