-- ============================================================
-- Aserai - Akademi rehberleri
-- Blog iceriginden bagimsiz rehber tablosu.
-- ============================================================

create or replace function public.is_valid_academy_guide_content(p_content jsonb)
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

revoke all on function public.is_valid_academy_guide_content(jsonb) from public, anon;
grant execute on function public.is_valid_academy_guide_content(jsonb) to authenticated;

create table if not exists public.academy_guides (
  id             uuid primary key default gen_random_uuid(),
  slug           text not null unique,
  title          text not null,
  excerpt        text not null,
  category       text not null,
  author         text not null default 'Aserai Akademi',
  reading_time   smallint not null default 5,
  image_url      text,
  accent         text not null default '#1c3444',
  content        jsonb not null,
  sort_order     integer not null default 1,
  is_active      boolean not null default true,
  published_on   date not null default ((now() at time zone 'Europe/Istanbul')::date),
  created_by     uuid references auth.users (id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),

  constraint academy_guides_slug_format
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) between 3 and 180),
  constraint academy_guides_title_length
    check (char_length(btrim(title)) between 3 and 180),
  constraint academy_guides_excerpt_length
    check (char_length(btrim(excerpt)) between 10 and 600),
  constraint academy_guides_category_length
    check (char_length(btrim(category)) between 2 and 80),
  constraint academy_guides_author_length
    check (char_length(btrim(author)) between 2 and 100),
  constraint academy_guides_reading_time_range
    check (reading_time between 1 and 180),
  constraint academy_guides_image_url_https
    check (image_url is null or image_url ~ '^https://[^[:space:]]+$'),
  constraint academy_guides_accent_hex
    check (accent ~ '^#[0-9A-Fa-f]{6}$'),
  constraint academy_guides_content_valid
    check (public.is_valid_academy_guide_content(content))
);

create index if not exists idx_academy_guides_public
  on public.academy_guides (is_active, sort_order, published_on desc);

create or replace function public.set_academy_guide_audit_fields()
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

revoke all on function public.set_academy_guide_audit_fields()
  from public, anon, authenticated;

drop trigger if exists set_academy_guide_audit_fields on public.academy_guides;
create trigger set_academy_guide_audit_fields
before insert or update on public.academy_guides
for each row execute function public.set_academy_guide_audit_fields();

alter table public.academy_guides enable row level security;

drop policy if exists "academy_guides_public_select" on public.academy_guides;
drop policy if exists "academy_guides_admin_all" on public.academy_guides;

create policy "academy_guides_public_select"
  on public.academy_guides for select
  to anon, authenticated
  using (is_active);

create policy "academy_guides_admin_all"
  on public.academy_guides for all
  to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

revoke all on public.academy_guides from anon, authenticated;
grant select on public.academy_guides to anon, authenticated;
grant insert, update, delete on public.academy_guides to authenticated;

insert into public.academy_guides (
  slug,
  title,
  excerpt,
  category,
  author,
  reading_time,
  accent,
  content,
  sort_order,
  is_active,
  published_on
)
values
(
  'ilk-kurulum-rehberi',
  'Aserai Ilk Kurulum Rehberi',
  'Firma profilinden lisans kontrolune kadar Aserai panelini kullanima hazir hale getiren temel kurulum akisi.',
  'Baslangic',
  'Aserai Akademi',
  6,
  '#1c3444',
  '[{"type":"p","text":"Aserai de verimli bir baslangic icin once hesabinizi, firma bilgilerinizi ve aktif lisans durumunuzu kontrol edin. Bu hazirlik sonraki tum operasyon ekranlarinin dogru calismasini saglar."},{"type":"h","text":"Firma ve kullanici bilgileri"},{"type":"p","text":"Profilim ekraninda firma adi, yetkili kisi, telefon ve e-posta alanlarini tamamlayin. Yonetim ve musteri panellerinde gorunen bildirimlerin dogru kisilere ulasmasi icin bu bilgiler guncel kalmalidir."},{"type":"h","text":"Lisans kontrolu"},{"type":"p","text":"Lisanslarim ekranindan aktif paket, donem sonu tarihi ve ek modul durumlarini inceleyin. Bekleyen odeme veya yenileme varsa once bu islemleri tamamlayin."},{"type":"h","text":"Destek ve dogrulama"},{"type":"p","text":"E-posta dogrulama uyarisi gorunuyorsa dogrulama kodunu girin. Kurulum sirasinda takildiginiz adimlar icin Destek Taleplerim ekranindan dosya ekleyerek talep olusturabilirsiniz."}]'::jsonb,
  1,
  true,
  '2026-07-17'
),
(
  'urun-operasyon-rehberi',
  'Urun Operasyon Rehberi',
  'Urun yukleme, guncelleme, pasife alma ve silme kararlarinda izlenecek guvenli operasyon yaklasimi.',
  'Operasyon',
  'Aserai Akademi',
  5,
  '#234d63',
  '[{"type":"p","text":"Urun operasyonlarinda amac sadece urunu yayina almak degil; fiyat, stok, gorsel ve gecmis siparis butunlugunu koruyarak satis kanallarini duzenli yonetmektir."},{"type":"h","text":"Urun yayinlamadan once"},{"type":"p","text":"Urun adi, kategori, SKU, fiyat, stok ve gorsel alanlarini eksiksiz hazirlayin. Benzer urunlerde ayni gorsel oranini kullanmak vitrin kalitesini yukseltir."},{"type":"h","text":"Guncelleme ve pasife alma"},{"type":"p","text":"Satisi durdurmak istediginiz urunlerde once pasife alma yaklasimini kullanin. Gecmis siparislerde referans gereken urunleri kalici silmek yerine arsivlemek daha guvenlidir."},{"type":"h","text":"Hata kontrolu"},{"type":"p","text":"Eksik varyant, hatali stok veya desteklenmeyen gorsel formati gibi durumlarda urun yayin akisini tamamlamadan once uyarilari giderin."}]'::jsonb,
  2,
  true,
  '2026-07-17'
),
(
  'api-entegrasyon-rehberi',
  'API Hesaplari ve Entegrasyon Rehberi',
  'API anahtari olusturma, saklama, iptal etme ve entegrasyon guvenligini yonetme adimlari.',
  'Entegrasyon',
  'Aserai Akademi',
  4,
  '#04acfc',
  '[{"type":"p","text":"API anahtarlari harici sistemlerin Aserai verilerine kontrollu erismesini saglar. Her entegrasyon icin ayri anahtar kullanmak guvenlik ve takip acisindan daha saglikli bir modeldir."},{"type":"h","text":"Anahtar olusturma"},{"type":"p","text":"API Anahtarlarim ekraninda anlasilir bir ad girerek yeni anahtar olusturun. Olusturulan anahtar yalnizca ilk gosterimde tam olarak gorulebilir."},{"type":"h","text":"Guvenli saklama"},{"type":"p","text":"Anahtari yalnizca yetkili entegrasyon ortaminda saklayin. E-posta, mesajlasma uygulamasi veya ekran goruntusuyle paylasmaktan kacinin."},{"type":"h","text":"Iptal ve yenileme"},{"type":"p","text":"Kullanilmayan veya paylasildigindan suphelenilen anahtarlari iptal edin. Yeni entegrasyonlar icin eski anahtarlari yeniden kullanmak yerine yeni anahtar uretin."}]'::jsonb,
  3,
  true,
  '2026-07-17'
)
on conflict (slug) do nothing;
