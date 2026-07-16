-- ============================================================
-- Aserai — Faz 20: E-posta doğrulama (B4, yumuşak/soft akış)
-- Supabase SQL Editor'de çalıştırın.
--
-- Model: Supabase "Confirm email" KAPALI (kullanıcı hemen giriş yapar).
-- Kendi doğrulama bayrağımızı tutarız: profiles.email_verified.
-- Doğrulama, Supabase e-posta OTP kodu ile e-posta sahipliği kanıtlandıktan
-- sonra mark_email_verified() ile true yapılır (frontend akışı).
--
-- Not: Bu "soft" doğrulama e-posta ULAŞILABİLİRLİĞİNİ teyit eder; giriş
-- engellenmez. Kurcalanamaz (tamper-proof) sert doğrulama için ileride
-- Edge Function ile sunucu tarafı token doğrulaması eklenebilir.
-- ============================================================

alter table public.profiles
  add column if not exists email_verified boolean not null default false;

-- Geçerli kullanıcının e-postasını doğrulanmış işaretle.
-- Frontend, Supabase verifyOtp başarılı olduktan SONRA çağırır.
create or replace function public.mark_email_verified()
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Kimlik doğrulaması gerekli';
  end if;

  update public.profiles
    set email_verified = true, updated_at = now()
    where id = auth.uid();
end;
$$;
