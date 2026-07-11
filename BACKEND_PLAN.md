# Aserai — Backend Planı (Supabase)

Mimari karar: **Supabase (Postgres + Auth + RLS + Storage + Edge Functions)** + mevcut Vite/React frontend.
Bkz. genel durum: [PROJE_OZET.md](PROJE_OZET.md).

---

## 1. Neden Supabase?
- **Auth hazır:** kayıt, e-posta/telefon doğrulama, şifre sıfırlama, **2FA (MFA)** → B (Üyelik) modülü.
- **Postgres + RLS:** çok kiracılı (multi-tenant) yapı, lisans/sipariş/fatura/destek tabloları, satır bazlı yetki.
- **Storage:** fatura PDF, destek dosyaları, CMS dokümanları.
- **Edge Functions:** PayTR/İyzico webhook, EDM e-fatura, lisans/komisyon iş mantığı (public'e kapalı).

## 2. Kurulum (kullanıcı tarafından yapılacak — bir kez)
1. https://supabase.com → yeni proje oluştur (bölge: Frankfurt/EU önerilir).
2. **Project Settings > API**'den `Project URL` ve `anon public` anahtarını al.
3. Proje kökünde `.env.local` oluştur (bkz. `.env.example`):
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
   (`.env.local` git tarafından yok sayılır; anon anahtarı frontend'de güvenlidir.)
4. **SQL Editor**'de `supabase/migrations/0001_init_auth.sql` içeriğini çalıştır.
5. **Authentication > Providers**: Email aktif; istenirse telefon (SMS sağlayıcı) ve MFA aç.
6. **Authentication > URL Configuration**: Site URL = `http://localhost:5173` (geliştirme) ve prod domaini ekle.

> Not: Hesap/proje oluşturma ve anahtar girme kullanıcıya aittir; bu adımları asistan yapmaz.

## 3. Frontend entegrasyon iskeleti (hazır)
- `src/lib/supabase.js` — istemci (env yoksa `null` döner, uygulama yine derlenir).
- `.env.example` — anahtar şablonu.
- Sıradaki: `AuthContext` (oturum durumu), korumalı route sarmalayıcı, auth ekranları.

## 4. Veri Modeli — Fazlara Göre

### Faz 1 — Kimlik & Üyelik  *(şema hazır: 0001_init_auth.sql)*
- `profiles` (id→auth.users, full_name, phone)
- `tenants` (id, name, owner_id) — müşteri firma
- `tenant_users` (tenant_id, user_id, role: owner/admin/member)
- Trigger: yeni kullanıcıda profil otomatik oluşur.
- RPC: `create_tenant(name)` — kayıt sonrası firma oluşturma.

### Faz 2 — Katalog & Satın Alma
- `packages` (paketler), `modules` (ek modüller), `package_features`
- `carts` / `cart_items` (veya frontend state + sipariş anında yazma)
- `orders`, `order_items` (paket + modüller)
- Ödeme: **Edge Function** `payment-webhook` (PayTR/İyzico) → order.status güncelle.

### Faz 3 — Lisans, Fatura, Destek (Müşteri Paneli)
- `licenses` (tenant_id, package_id, status, starts_at, ends_at, activation)
- `invoices` (order_id, tenant_id, pdf_path, e_fatura_status) + Storage
- `support_tickets`, `ticket_messages` (+ dosya eki Storage)
- `renewals`, `notifications`, `api_keys`
- E-fatura: **Edge Function** (EDM Bilişim) entegrasyonu.

### Faz 4 — Yönetim Paneli (E–R modülleri)
- `roles`, `permissions`, `role_permissions`, `audit_logs`
- CMS tabloları: `pages`, `blog_posts`, `faqs`, `documents`, `sliders`
  (mevcut `data/blog.js` / `data/legal.js` içerikleri buraya taşınır)
- Platform admin ayrımı: ayrı `is_platform_admin` bayrağı veya özel rol + RLS.

## 5. Güvenlik İlkeleri (RLS)
- Her tabloda RLS **açık**; varsayılan **reddet**.
- Kullanıcı yalnızca üyesi olduğu tenant'ın verisini görür.
- Yazma/karmaşık iş kuralları **security definer RPC** veya **Edge Function** ile (RLS özyinelemesinden kaçın).
- Servis anahtarı (`service_role`) **asla** frontend'e konmaz; yalnızca Edge Function içinde.
- Ödeme/e-fatura gibi hassas akışlar tamamen sunucu tarafında.

## 6. Sıradaki Adım (Faz 1 uygulaması)
Kullanıcı Supabase projesini kurup anahtarları verince:
1. `AuthContext` + oturum yönetimi.
2. **Kayıt Ol** sayfası (`/kayit`) → `supabase.auth.signUp` (+ `create_tenant`).
3. **Giriş** (`/giris`) → `supabase.auth.signInWithPassword` (mevcut UI'ı bağla).
4. **Şifremi Unuttum / Yenileme** (`/sifremi-unuttum`, `/sifre-yenile`).
5. **E-posta doğrulama** dönüş sayfası.
6. Korumalı route + oturum açıkken navbar'da "Hesabım/Çıkış".
