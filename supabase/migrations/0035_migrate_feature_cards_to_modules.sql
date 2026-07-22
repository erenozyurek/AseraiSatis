-- Move legacy Moduller page cards into the shared modules catalog.
-- This keeps old feature_cards intact and copies missing data into modules.

alter table public.feature_cards
  add column if not exists image_url text;

alter table public.modules
  add column if not exists icon_path text,
  add column if not exists image_url text,
  add column if not exists legacy_feature_card_id uuid;

create unique index if not exists uq_modules_legacy_feature_card_id
  on public.modules (legacy_feature_card_id)
  where legacy_feature_card_id is not null;

do $$
declare
  card record;
  v_base_slug text;
  v_target_slug text;
  v_slug text;
  v_suffix integer;
  v_module_id uuid;
  v_module_slug text;
begin
  for card in
    select *
      from public.feature_cards
      order by sort_order, title
  loop
    v_base_slug := btrim(coalesce(card.title, 'modul'));
    v_base_slug := replace(v_base_slug, 'İ', 'i');
    v_base_slug := lower(v_base_slug);
    v_base_slug := replace(v_base_slug, 'ç', 'c');
    v_base_slug := replace(v_base_slug, 'ğ', 'g');
    v_base_slug := replace(v_base_slug, 'ı', 'i');
    v_base_slug := replace(v_base_slug, 'ö', 'o');
    v_base_slug := replace(v_base_slug, 'ş', 's');
    v_base_slug := replace(v_base_slug, 'ü', 'u');
    v_base_slug := regexp_replace(v_base_slug, '[^a-z0-9]+', '-', 'g');
    v_base_slug := regexp_replace(v_base_slug, '(^-+|-+$)', '', 'g');

    if v_base_slug = '' then
      v_base_slug := 'aktarilan-modul';
    end if;

    v_target_slug := case lower(btrim(card.title))
      when lower('E-Fatura & E-Arşiv') then 'e-fatura'
      when lower('BuyBox Rekabet Analizi') then 'buybox'
      when lower('Stok & Depo Yönetimi') then 'tedarikci-stok'
      when lower('B2B Modülü') then 'b2b'
      when lower('E-İhracat') then 'e-ihracat-modulu'
      when lower('CRM & Müşteri Yönetimi') then 'crm-musteri'
      when lower('Kampanya & Kupon Yönetimi') then 'kampanya'
      else null
    end;

    select id, slug
      into v_module_id, v_module_slug
      from public.modules
      where legacy_feature_card_id = card.id
         or (v_target_slug is not null and slug = v_target_slug)
         or slug = v_base_slug
         or lower(btrim(name)) = lower(btrim(card.title))
      order by
        case
          when legacy_feature_card_id = card.id then 0
          when v_target_slug is not null and slug = v_target_slug then 1
          when slug = v_base_slug then 2
          else 3
        end
      limit 1;

    if v_module_id is not null then
      update public.modules
         set description = case
               when nullif(btrim(coalesce(description, '')), '') is null
                 then card.description
               else description
             end,
             category = coalesce(nullif(category, ''), 'Diğer Modüller'),
             icon_path = coalesce(icon_path, card.icon_path),
             image_url = coalesce(image_url, card.image_url),
             legacy_feature_card_id = coalesce(legacy_feature_card_id, card.id),
             sort_order = case
               when coalesce(sort_order, 0) = 0 then card.sort_order
               else sort_order
             end,
             is_active = is_active or card.is_active,
             updated_at = now()
       where id = v_module_id;
    else
      v_slug := v_base_slug;
      v_suffix := 2;

      while exists (select 1 from public.modules where slug = v_slug) loop
        v_slug := v_base_slug || '-' || v_suffix::text;
        v_suffix := v_suffix + 1;
      end loop;

      insert into public.modules (
        slug,
        name,
        description,
        monthly,
        category,
        icon_path,
        image_url,
        legacy_feature_card_id,
        sort_order,
        is_active
      )
      values (
        v_slug,
        card.title,
        card.description,
        0,
        'Diğer Modüller',
        card.icon_path,
        card.image_url,
        card.id,
        card.sort_order,
        card.is_active
      )
      returning id, slug into v_module_id, v_module_slug;
    end if;

    insert into public.package_module_rules (package_slug, module_slug, status)
    values
      ('baslangic', v_module_slug, 'addable'),
      ('standart', v_module_slug, 'addable'),
      ('profesyonel', v_module_slug, 'addable'),
      ('e-ihracat', v_module_slug, 'addable')
    on conflict (package_slug, module_slug) do nothing;
  end loop;
end $$;
