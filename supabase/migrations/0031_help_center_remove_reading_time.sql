-- ============================================================
-- Aserai - Yardim Merkezi okuma suresi alanini kaldirma
-- 0029'un eski surumu calistirildiysa help_articles.reading_time kolonunu temizler.
-- ============================================================

alter table if exists public.help_articles
  drop constraint if exists help_articles_reading_time_range;

alter table if exists public.help_articles
  drop column if exists reading_time;
