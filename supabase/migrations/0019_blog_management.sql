-- ============================================================
-- Aserai - Blog yonetimi, kapak gorselleri ve RLS
-- 0018 sonrasinda Supabase SQL Editor'de calistirilir.
-- ============================================================

-- Blog govdesi yalnizca guvenli baslik/paragraf bloklarindan olusur.
-- HTML saklanmadigi icin istemcide ham HTML calistirilmasi gerekmez.
create or replace function public.is_valid_blog_content(p_content jsonb)
returns boolean
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_item jsonb;
  v_text text;
  v_total_length integer := 0;
begin
  if p_content is null or pg_catalog.jsonb_typeof(p_content) <> 'array' then
    return false;
  end if;

  if pg_catalog.jsonb_array_length(p_content) not between 1 and 100 then
    return false;
  end if;

  for v_item in
    select value from pg_catalog.jsonb_array_elements(p_content)
  loop
    if pg_catalog.jsonb_typeof(v_item) <> 'object'
      or coalesce(v_item ->> 'type', '') not in ('h', 'p')
      or coalesce(pg_catalog.jsonb_typeof(v_item -> 'text'), '') <> 'string'
    then
      return false;
    end if;

    v_text := pg_catalog.btrim(v_item ->> 'text');
    if pg_catalog.char_length(v_text) not between 1 and 10000 then
      return false;
    end if;

    v_total_length := v_total_length + pg_catalog.char_length(v_text);
    if v_total_length > 100000 then
      return false;
    end if;
  end loop;

  return true;
exception
  when others then
    return false;
end;
$$;

revoke all on function public.is_valid_blog_content(jsonb) from public, anon;
grant execute on function public.is_valid_blog_content(jsonb) to authenticated;

create table if not exists public.blog_posts (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  excerpt        text not null,
  category       text not null,
  author         text not null default 'Aserai Ekibi',
  reading_time   smallint not null default 5,
  image_url      text,
  accent         text not null default '#1c3444',
  content        jsonb not null,
  is_published   boolean not null default false,
  published_on   date not null default ((now() at time zone 'Europe/Istanbul')::date),
  created_by     uuid references auth.users (id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint blog_posts_slug_format
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) between 3 and 180),
  constraint blog_posts_title_length
    check (char_length(btrim(title)) between 3 and 180),
  constraint blog_posts_excerpt_length
    check (char_length(btrim(excerpt)) between 10 and 600),
  constraint blog_posts_category_length
    check (char_length(btrim(category)) between 2 and 80),
  constraint blog_posts_author_length
    check (char_length(btrim(author)) between 2 and 100),
  constraint blog_posts_reading_time_range
    check (reading_time between 1 and 180),
  constraint blog_posts_image_url_https
    check (image_url is null or image_url ~ '^https://[^[:space:]]+$'),
  constraint blog_posts_accent_hex
    check (accent ~ '^#[0-9A-Fa-f]{6}$'),
  constraint blog_posts_content_valid
    check (public.is_valid_blog_content(content))
);

create index if not exists idx_blog_posts_publication
  on public.blog_posts (is_published, published_on desc, created_at desc);

-- Denetim alanlari istemciden degistirilemez; her yazmada sunucu gunceller.
create or replace function public.set_blog_post_audit_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.created_by := auth.uid();
    new.created_at := pg_catalog.now();
  else
    new.created_by := old.created_by;
    new.created_at := old.created_at;
  end if;

  new.updated_at := pg_catalog.now();
  return new;
end;
$$;

revoke all on function public.set_blog_post_audit_fields()
  from public, anon, authenticated;

drop trigger if exists set_blog_post_audit_fields on public.blog_posts;
create trigger set_blog_post_audit_fields
before insert or update on public.blog_posts
for each row execute function public.set_blog_post_audit_fields();

-- Public yalnizca yayindaki ve tarihi gelmis yazilari gorur.
-- Taslaklar ve tum yazma islemleri yalnizca platform adminine aciktir.
alter table public.blog_posts enable row level security;

drop policy if exists "blog_posts_public_select" on public.blog_posts;
drop policy if exists "blog_posts_admin_all" on public.blog_posts;

create policy "blog_posts_public_select"
  on public.blog_posts for select
  to anon, authenticated
  using (
    is_published
    and published_on <= ((now() at time zone 'Europe/Istanbul')::date)
  );

create policy "blog_posts_admin_all"
  on public.blog_posts for all
  to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

revoke all on public.blog_posts from anon, authenticated;
grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;

-- ---------- Blog kapak gorselleri ----------
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'blog-images',
  'blog-images',
  true,
  5242880,
  array['image/avif', 'image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "blog_images_public_read" on storage.objects;
drop policy if exists "blog_images_admin_insert" on storage.objects;
drop policy if exists "blog_images_admin_update" on storage.objects;
drop policy if exists "blog_images_admin_delete" on storage.objects;

create policy "blog_images_public_read"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "blog_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'blog-images'
    and name ~ '^covers/[0-9a-f-]+[.](avif|jpg|png|webp)$'
    and public.is_platform_admin()
  );

create policy "blog_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'blog-images' and public.is_platform_admin())
  with check (
    bucket_id = 'blog-images'
    and name ~ '^covers/[0-9a-f-]+[.](avif|jpg|png|webp)$'
    and public.is_platform_admin()
  );

create policy "blog_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'blog-images' and public.is_platform_admin());

-- ---------- Mevcut blog yazilari ----------
-- Migration calismadan onceki statik yazilar kaybolmadan admin yonetimine tasinir.
insert into public.blog_posts (
  slug,
  title,
  excerpt,
  category,
  author,
  reading_time,
  accent,
  content,
  is_published,
  published_on
)
values
(
  'e-ticarete-baslarken-7-adim',
  'E-Ticarete Başlarken Bilmeniz Gereken 7 Adım',
  'Kendi online mağazanızı kurmadan önce planlamanız gereken her şeyi; ürün, ödeme, kargo ve pazarlama başlıklarıyla adım adım ele alıyoruz.',
  'Başlangıç',
  'Aserai Ekibi',
  6,
  '#1c3444',
  '[{"type":"p","text":"E-ticarete başlamak, doğru adımları doğru sırayla attığınızda göründüğünden çok daha yönetilebilir bir süreçtir. Bu yazıda ilk mağazanızı açarken izlemeniz gereken yol haritasını özetliyoruz."},{"type":"h","text":"1. Ürün ve niş kararı"},{"type":"p","text":"Hedef kitlenizi ve satacağınız ürün grubunu netleştirin. Rekabetin yoğun olduğu alanlarda farklılaşmanızı sağlayacak bir değer önerisi belirleyin."},{"type":"h","text":"2. Mağaza altyapısı"},{"type":"p","text":"Ölçeklenebilir, entegrasyonlara açık ve yönetimi kolay bir altyapı seçin. Aserai gibi hazır temalar ve toplu ürün yükleme sunan çözümler, kurulum süresini ciddi biçimde kısaltır."},{"type":"h","text":"3. Ödeme ve kargo"},{"type":"p","text":"Güvenli bir sanal POS ve birden fazla kargo seçeneği, dönüşüm oranınızı doğrudan etkiler. Süreçleri otomatikleştirmek operasyon yükünüzü azaltır."},{"type":"h","text":"4. Pazarlama ve büyüme"},{"type":"p","text":"SEO, kampanya senaryoları ve pazaryeri entegrasyonlarıyla satış kanallarınızı çeşitlendirin. Verilerinizi takip ederek kararlarınızı sürekli iyileştirin."}]'::jsonb,
  true,
  '2026-07-02'
),
(
  'pazaryeri-entegrasyonu-neden-onemli',
  'Pazaryeri Entegrasyonu Neden Önemli?',
  'Tek panelden çok kanallı satış yönetmenin operasyonel verimliliğe ve büyümeye etkisini rakamlarla inceliyoruz.',
  'Entegrasyon',
  'Aserai Ekibi',
  5,
  '#234d63',
  '[{"type":"p","text":"Birden fazla pazaryerinde satış yapmak büyüme için güçlü bir fırsattır; ancak her kanalı ayrı ayrı yönetmek hata oranını ve iş yükünü artırır."},{"type":"h","text":"Merkezi stok yönetimi"},{"type":"p","text":"Entegrasyon sayesinde stok tüm kanallarda otomatik senkron olur; stokta yok hataları ve sipariş iptalleri belirgin biçimde azalır."},{"type":"h","text":"Zaman tasarrufu"},{"type":"p","text":"Ürün, fiyat ve sipariş süreçlerini tek panelden yöneterek tekrarlayan manuel işlere harcanan zamanı geri kazanırsınız."},{"type":"h","text":"Veriye dayalı kararlar"},{"type":"p","text":"Tüm kanalların performansını tek yerde görmek, hangi ürünün nerede daha iyi sattığını anlamanızı ve bütçenizi doğru yönlendirmenizi sağlar."}]'::jsonb,
  true,
  '2026-06-24'
),
(
  'donusum-oranini-artiran-5-taktik',
  'Dönüşüm Oranını Artıran 5 Pratik Taktik',
  'Ziyaretçilerinizi müşteriye dönüştürmek için mağazanızda hemen uygulayabileceğiniz beş etkili yöntem.',
  'Pazarlama',
  'Aserai Ekibi',
  4,
  '#04acfc',
  '[{"type":"p","text":"Trafik almak tek başına yeterli değildir; asıl mesele bu trafiği satışa çevirmektir. İşte dönüşümü artıran pratik taktikler."},{"type":"h","text":"1. Hızlı ve sade ödeme"},{"type":"p","text":"Tek sayfada tamamlanan bir ödeme akışı, sepet terk oranını düşürür."},{"type":"h","text":"2. Akıllı ürün önerileri"},{"type":"p","text":"Yapay zekâ destekli öneriler, sepet ortalamasını yükseltir ve müşteriye ilgili ürünleri gösterir."},{"type":"h","text":"3. Güven unsurları"},{"type":"p","text":"Müşteri yorumları, güvenlik rozetleri ve şeffaf kargo/iade politikaları satın alma kararını kolaylaştırır."},{"type":"h","text":"4. Mobil uyum"},{"type":"p","text":"Ziyaretçilerin çoğu mobil cihazdan geliyor; mobil deneyiminizi öncelikli olarak optimize edin."},{"type":"h","text":"5. Kampanya senaryoları"},{"type":"p","text":"Sepet bazlı kampanyalar ve zamanlı indirimlerle karar aşamasındaki müşteriyi harekete geçirin."}]'::jsonb,
  true,
  '2026-06-15'
),
(
  'e-ihracat-ile-yurt-disina-acilmak',
  'E-İhracat ile Yurt Dışına Açılmak',
  'Global pazaryerleri, çoklu dil ve döviz desteği ile markanızı sınırların ötesine taşımanın yollarını anlatıyoruz.',
  'E-İhracat',
  'Aserai Ekibi',
  7,
  '#2f5567',
  '[{"type":"p","text":"E-ihracat, doğru altyapı ile her ölçekten işletme için erişilebilir bir büyüme kanalıdır. Bu yazıda başlarken dikkat etmeniz gerekenleri ele alıyoruz."},{"type":"h","text":"Çoklu dil ve döviz"},{"type":"p","text":"Ürün açıklamalarının otomatik çevirisi ve yerel para birimiyle satış, uluslararası müşteride güven oluşturur."},{"type":"h","text":"Global pazaryerleri"},{"type":"p","text":"Amazon, Etsy ve eBay gibi kanallara ürünlerinizi tek noktadan aktararak yeni pazarlara hızlıca ulaşabilirsiniz."},{"type":"h","text":"Lojistik ve gümrük"},{"type":"p","text":"Uluslararası kargo entegrasyonları ve GTIP kodu yönetimi, sınır ötesi gönderileri sorunsuz hale getirir."}]'::jsonb,
  true,
  '2026-06-03'
)
on conflict (slug) do nothing;
