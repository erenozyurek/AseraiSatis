-- ============================================================
-- Aserai - Blog document HTML storage
-- 0031 sonrasinda Supabase SQL Editor'de calistirilir.
-- Mevcut content JSON verisi silinmeden content_html alanina tasinir.
-- ============================================================

alter table public.blog_posts
  add column if not exists content_html text;

create or replace function public.blog_escape_html(p_text text)
returns text
language sql
immutable
set search_path = ''
as $$
  select replace(
    replace(
      replace(
        replace(
          replace(coalesce(p_text, ''), '&', '&amp;'),
          '<', '&lt;'
        ),
        '>', '&gt;'
      ),
      '"', '&quot;'
    ),
    '''', '&#39;'
  );
$$;

create or replace function public.blog_content_to_html(p_content jsonb)
returns text
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_item jsonb;
  v_type text;
  v_text text;
  v_html text;
  v_result text := '';
begin
  if p_content is null or pg_catalog.jsonb_typeof(p_content) <> 'array' then
    return '';
  end if;

  for v_item in
    select value from pg_catalog.jsonb_array_elements(p_content)
  loop
    v_html := pg_catalog.btrim(coalesce(v_item ->> 'html', ''));

    if v_html <> '' then
      v_result := v_result || v_html;
    else
      v_type := coalesce(v_item ->> 'type', 'p');
      v_text := replace(public.blog_escape_html(v_item ->> 'text'), chr(10), '<br>');

      if pg_catalog.btrim(v_text) <> '' then
        if v_type = 'h' then
          v_result := v_result || '<h2>' || v_text || '</h2>';
        else
          v_result := v_result || '<p>' || v_text || '</p>';
        end if;
      end if;
    end if;
  end loop;

  return v_result;
end;
$$;

update public.blog_posts
set content_html = public.blog_content_to_html(content)
where (content_html is null or pg_catalog.btrim(content_html) = '')
  and content is not null;

update public.blog_posts
set content_html = null
where pg_catalog.btrim(coalesce(content_html, '')) = '';

alter table public.blog_posts
  drop constraint if exists blog_posts_content_html_length;

alter table public.blog_posts
  add constraint blog_posts_content_html_length
    check (
      content_html is null
      or char_length(pg_catalog.btrim(content_html)) between 1 and 180000
    );

comment on column public.blog_posts.content_html is
  'Blog yazisinin Word benzeri tek parca zengin HTML dokumani. content JSON uyumluluk icin korunur.';

revoke all on function public.blog_escape_html(text) from public, anon;
revoke all on function public.blog_content_to_html(jsonb) from public, anon;
grant execute on function public.blog_escape_html(text) to authenticated;
grant execute on function public.blog_content_to_html(jsonb) to authenticated;
