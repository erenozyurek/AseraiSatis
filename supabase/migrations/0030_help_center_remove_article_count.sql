-- ============================================================
-- Aserai - Yardim Merkezi makale sayisi alanini kaldirma
-- Kategori kartlarinda "x makale" ifadesi artik kullanilmiyor.
-- 0028'in eski surumu calistirildiysa article_count kolonunu temizler.
-- ============================================================

alter table if exists public.help_categories
  drop column if exists article_count;
