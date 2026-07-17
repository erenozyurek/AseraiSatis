-- ============================================================
-- Aserai — Akademi Rehberler başlığı
-- Blog yazılarından bağımsız, Akademi içi özel rehber sayfası.
-- ============================================================

insert into public.academy_pages
  (slug, label, eyebrow, title, intro, content, sort_order, is_active)
values
  (
    'rehberler',
    'Rehberler',
    'Kaynak',
    'Aserai Rehberleri',
    'Kurulum, operasyon, entegrasyon ve büyüme konularında Akademi’ye özel uygulama rehberleri.',
    '{}'::jsonb,
    6,
    true
  )
on conflict (slug) do nothing;
