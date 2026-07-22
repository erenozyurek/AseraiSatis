-- Help center article excerpt/content fields are optional in the editor.

alter table public.help_articles
  alter column excerpt drop not null,
  alter column content drop not null;

alter table public.help_articles
  drop constraint if exists help_articles_excerpt_length,
  drop constraint if exists help_articles_content_length;

alter table public.help_articles
  add constraint help_articles_excerpt_length
    check (excerpt is null or char_length(btrim(excerpt)) <= 600),
  add constraint help_articles_content_length
    check (content is null or char_length(btrim(content)) <= 30000);
