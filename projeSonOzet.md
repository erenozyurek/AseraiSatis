# Aserai Satış Sitesi — Proje Son Özet & Devir Dökümanı

> Yeni bir oturumda kaldığın yerden devam etmek için bu dosyayı ilk aç.
> Son güncelleme: 13 Temmuz 2026. Ayrıca bkz: `PROJE_OZET.md`, `BACKEND_PLAN.md`.

---

## 1. Proje Nedir?

**Aserai**, Dijital Atölyemiz'in çok kanallı **e-ticaret altyapısı (SaaS)**'dır.
Bu repo (`AseraiSatis-main`) = **Aserai'nin tanıtım / demo / SATIŞ web sitesi**
(ürünün pazarlanıp satıldığı, müşteri paneli + yönetim paneli içeren site).

- Gereksinim kaynağı: **ANA GEREKSİNİMLER** (modül ağacı A–R + ekran listesi) ve
  **Diğer detaylarımız** dökümanları (~/Downloads içinde).
- **Marka kuralı:** Site kendini yalnızca **"Aserai"** olarak tanıtır. İberai yalnızca
  entegrasyon bağlamında geçer (Çözümler sayfası, /iberai, iberai.com.tr linkleri).

---

## 2. Teknik Yığın & Çalıştırma

- **Vite 5 + React 18 + react-router-dom v6** (SPA). ⚠️ Next.js değil.
- **Backend: Supabase** (Postgres + Auth + RLS). İstemci: `@supabase/supabase-js`.
- Stil: bileşen başına `.css` + `src/styles/global.css` design token'ları.

```bash
cd ~/Downloads/AseraiSatis-main
npm install
npm run dev       # geliştirme (hot reload) → http://localhost:5173
npm run build     # üretim derlemesi → dist/
npm run preview   # dist'i sun → http://localhost:4173
```

---

## 3. Supabase & Ortam Değişkenleri

- **Proje URL:** `https://sjbrcmymejqgreyefjzn.supabase.co`
- **Yerel:** `.env.local` (git'te ignore'lu). Şablon: `.env.example`.

### Vercel Environment Variables (frontend için 2 tane, hepsi PUBLIC)
| Key | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://sjbrcmymejqgreyefjzn.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | anon public JWT (`.env.local`'deki değer) |

> `service_role` / `secret` anahtarları **ASLA** frontend'e / Vercel'e (bu Vite projesine)
> konmaz. ⚠️ Güvenlik: sohbete yapıştırılan gizli anahtarların **Supabase'den yenilenmesi** önerilir.
> Not: Vercel'de env değişkenlerini Production + Preview + Development için ekle; Vite bunları
> **build sırasında** gömer, değişince yeniden deploy gerekir.

### Migration'lar (`supabase/migrations/`, SQL Editor'de sırayla çalıştır)
| Dosya | İçerik | Durum |
|---|---|---|
| `0001_init_auth.sql` | profiles, tenants, tenant_users + trigger + create_tenant RPC | ✅ çalıştı |
| `0002_orders.sql` | orders, order_items + create_order RPC | ✅ çalıştı |
| `0003_support.sql` | support_tickets, ticket_messages | ✅ çalıştı |
| `0004_admin.sql` | platform_admins + is_platform_admin() + admin RLS | ✅ çalıştı |
| `0005_catalog.sql` | packages, modules (+ seed) | ✅ çalıştı |
| `0006_feature_cards.sql` | Modüller sayfası kartları (+ seed) | ✅ çalıştı |
| `0007_features.sql` | Tüm Özellikler kategorileri+kartları (+ seed) | ✅ çalıştı |
| `0008_licenses_invoices.sql` | licenses, invoices + sipariş 'paid' trigger + backfill | ✅ çalıştı |
| `0009_renewals.sql` | renewals + request_renewal RPC + 'paid' trigger (lisans uzatma + fatura) | ✅ çalıştı |
| `0010_admin_customers.sql` | admin_list_customers() RPC (read-only, admin-guard'lı müşteri listesi) | ✅ çalıştı |
| `0011_notifications.sql` | notifications + gönderim/okundu RPC'leri + sipariş/yenileme 'paid' otomatik bildirim trigger'ları | ✅ çalıştı |
| `0012_card_images.sql` | Modül/özellik kartlarına `image_url` alanı | ✅ çalıştı |
| `0013_card_images_storage.sql` | `card-images` public bucket + admin upload/update/delete storage policy'leri | ✅ çalıştı |
| `0014_block_admin_order_creation.sql` | Admin alışveriş/sipariş oluşturma backend engeli + admin order RLS ayrımı | ✅ çalıştı |
| `0015_license_module_addons.sql` | Lisansa sonradan modül ekleme: `request_license_module`, `parent_license_id`, modül lisansları | ✅ çalıştı |
| `0016_security_hardening.sql` | Destek RPC/RLS sertleştirme, bildirim iç rota kısıtı, görsel boyut/MIME sınırı | ⏳ yeni — çalıştırılacak |
| `0017_customer_license_cancellation.sql` | İlk müşteri paket iptal altyapısı + sahiplik ve yarış koşulu korumaları | ⚠️ `0018` ile dönem sonu modeline güncellendi |
| `0018_period_end_license_cancellation.sql` | İptali fatura dönemi sonuna planlama; paket/modüller bitiş tarihine kadar aktif kalır | ⏳ yeni — çalıştırılacak |
| `0019_blog_management.sql` | Blog tablosu, mevcut yazı seed'i, admin RLS, güvenli içerik blokları ve `blog-images` Storage bucket'ı | ✅ çalıştı (13 Tem, kullanıcı bildirdi) |
| `0020_email_verification.sql` | `profiles.email_verified` + `mark_email_verified()` RPC (soft e-posta doğrulama, B4) | ⏳ yeni — çalıştırılacak |

> Migration notu: 13 Temmuz 2026'da kullanıcı `0001`-`0015` migration'larının canlı
> Supabase'de çalıştığını bildirdi. `0017` daha önce çalıştırılmış olsa bile dönem sonu
> davranışı için `0018` ayrıca çalıştırılmalıdır. Eksik migration'lar SQL Editor'de dosya
> sırasıyla uygulanmalıdır.

### Admin kullanıcı
- Test/admin parolaları proje dosyalarında tutulmaz. Daha önce paylaşılmış test parolaları
  Supabase Authentication ekranından yenilenmelidir.
- Yeni admin: Supabase > Authentication > Add user (Auto Confirm) → `insert into platform_admins (user_id) values ('...')`.
- **Giriş:** `/giris`'te admin ise **otomatik `/yonetim`**'e gider; navbar'da admin için
  hesap linki "Yönetim" olur.
- **Güvenlik kuralı:** Admin kullanıcı müşteri gibi alışveriş yapamaz. Sepet ikonu gizlenir,
  `/sepet` ve `/odeme` admin için `/yonetim`'e yönlenir; `create_order` RPC de admin için
  exception fırlatır (`0014`).

---

## 4. Mimari / Context'ler

`main.jsx` sarmalama sırası:
`ErrorBoundary > AuthProvider > NotificationsProvider > EditModeProvider > CatalogProvider > CartProvider > App`.

- **AuthContext** — oturum + `isAdmin` (is_platform_admin RPC, user id'ye bağlı).
- **CatalogContext** — packages/modules DB'den (fallback: `data/pricing.js`, `data/modules.js`).
- **CartContext** — sepet (paket + modüller), localStorage'da kalıcı; admin oturumunda sepet temizlenir/pasif olur.
- **EditModeContext** — site-üstü düzenleme modu (admin, navbar kalemi).
- **PanelDataContext** — müşteri paneli veri önbelleği (sekme geçişi hızlı).
- **AdminDataContext** — yönetim paneli veri önbelleği.
- Koruma: `ProtectedRoute` (giriş, opsiyonel `allowAdmin=false`), `AdminRoute` (giriş + admin).

---

## 5. Route Haritası

**Public:** `/` `/cozumler` `/moduller` `/ozellikler` `/kurumsal` `/aserai` `/iberai`
`/paketler` `/hakkimizda` `/referanslar` `/iletisim` `/demo` `/teklif` `/yardim`
`/blog` `/blog/:slug` `/kvkk` `/gizlilik` `/kullanim-sartlari` `/cerez-politikasi` `/yasal-uyari`

**Auth:** `/giris` `/kayit` `/sifremi-unuttum` `/sifre-yenile`

**Satın alma:** `/sepet` `/odeme`(korumalı) `/siparis-tamamlandi`

**Müşteri paneli (korumalı):** `/panel` `/panel/siparislerim` `/panel/lisanslarim`
`/panel/faturalarim` `/panel/faturalarim/:id` `/panel/yenilemelerim`(geçici pasif)
`/panel/bildirimlerim` `/panel/destek` `/panel/destek/:id` `/panel/profil`

**Yönetim paneli (admin):** `/yonetim` `/yonetim/siparisler` `/yonetim/paketler`
`/yonetim/yenilemeler` `/yonetim/musteriler` `/yonetim/musteriler/:id`
`/yonetim/bildirimler` `/yonetim/moduller` `/yonetim/destek` `/yonetim/destek/:id`

---

## 6. ✨ Site-üstü İnline Düzenleme (özel yetenek)

Admin, navbar'daki **kalem** ikonuyla **düzenleme modunu** açar; sonra sayfada doğrudan:
- **Paketler tablosu** (`/paketler`, `/cozumler`): paket adı/fiyat/rozet/vurgu düzenlenir → DB.
- **Modüller** (`/moduller`): karta gelince kalem → düzenle/sil, sonda **"+"** kart ekle.
- **Tüm Özellikler** (`/ozellikler`): aynı akış + kategori başlığı düzenleme.
- Kart görselleri için `image_url` alanı ve Supabase Storage bucket desteği eklendi (`0012`, `0013`).

---

## 6.1. Son Yapılan Yenilikler (12 Temmuz 2026)

| Alan | Yapılan yenilik | Dosya / Not |
|---|---|---|
| Admin alışveriş engeli | Admin sepet göremez, ödeme yapamaz, sipariş oluşturamaz. Frontend route/UI engeli + backend `create_order` engeli eklendi. | `CartContext`, `Navbar`, `Sepet`, `Odeme`, `ProtectedRoute`, `0014` |
| Yönetim paneli akıcılığı | Yönetim menüsünde seçili sekme tıklama anında yanar; geçiş hissi hızlandı. Aktif sekme hover'da lacivert kalır. | `AdminLayout`, `PanelLayout.css` |
| Müşteri paneli hover düzeltmesi | Profilim/Faturalarım/Siparişlerim/Lisanslarım gibi aktif sekmeler üstüne gelince aktif lacivert renk korunur. | `PanelLayout.css` |
| Fatura/PDF tasarımı | Fatura başlığı, alıcı bilgileri, kalem tablosu ve genel toplam toparlandı; A4 print/PDF CSS'i düzenlendi. Genel toplam siyah arka planı kaldırıldı. | `FaturaDetay`, `panel.css` |
| Lisansa modül ekleme | Müşteri `Lisanslarım` ekranında aktif paket lisansı için **Yeni Modül Ekle** ile modül siparişi oluşturabilir. Admin siparişi `paid` yapınca modül lisansı ana lisansa bağlanır. | `Lisanslarim`, `0015` |
| İlk satın alma modül lisansları | İlk siparişte seçilmiş modüller de paket lisansına bağlı ayrı modül lisansı olarak üretilir. | `0015` |
| Yenilemelerim geçici pasif | Müşteri panelindeki `Yenilemelerim` menüde pasif/Yakında yapıldı; URL'den açılırsa kapalı bilgilendirme ekranı gösterir. | `PanelLayout`, `Yenilemelerim` |

Son doğrulama: `npm run build` başarılı geçti.

## 6.2. Sağlamlaştırma Turu (13 Temmuz 2026)

| Alan | Yapılan yenilik | Dosya / Not |
|---|---|---|
| Çökme koruması | Global ErrorBoundary eklendi; beklenmeyen bileşen hatası tüm siteyi beyaz bırakmaz. | `ErrorBoundary`, `main.jsx` |
| Iberai beyaz ekran | Fiyat verisi olmayan Iberai sayfası artık çökmez; resmi Iberai fiyat sayfasına güvenli CTA gösterir. | `ProductPage`, `PricingPlans` |
| Rota bazlı yükleme | Sayfalar `React.lazy` ile ayrı parçalara bölündü. Ana JS 597 KB'den 411 KB'ye düştü; >500 KB uyarısı kalktı. | `App.jsx` |
| Destek güvenliği | Müşteri/personel mesajları atomik RPC'lere taşındı; müşteri `is_staff` taklidi ve yarım talep oluşması kapatıldı. | `0016`, müşteri/admin destek detayları |
| Bildirim güvenliği | Bildirim bağlantıları yalnızca aynı site içindeki güvenli `/...` yollarını kabul eder. | `navigation.js`, Bildirim ekranları, `0016` |
| Görsel güvenliği | Kart yüklemeleri JPG/PNG/WebP/AVIF ve en fazla 5 MB ile sınırlandı; yalnız HTTPS URL kabul edilir. | `imageUpload.js`, Modüller, Özellikler, `0016` |
| Modül görsel standardı | Sonradan yüklenen modül görselleri kaynak ölçüsü ve en-boy oranından bağımsız olarak yerleşik ikonlarla aynı `52×52` kutuda gösterilir. Görsel `24×24`, ortalanmış `object-fit: contain` ile ölçeklenir; kart yüksekliğini değiştirmez. Düzenleme önizlemesi `110×110` kalır. | `Moduller.css` |
| Yardım araması | Arama alanı kategori ve SSS sonuçlarını gerçekten filtreler; kategori kartları klavyeyle kullanılabilir. | `Yardim.jsx`, `Yardim.css` |
| Sessiz hata düzeltmesi | Panel/admin veri hataları ve temel yazma hataları kullanıcıya görünür hale getirildi. | Data context'leri, Profil, Sipariş/Destek ekranları |
| Kimlik güvenliği | Kayıt ve parola yenilemede en az 8 karakter + parola tekrar kontrolü eklendi. | `Kayit`, `SifreYenile` |
| Demo şeffaflığı | Çalışmayan iletişim/demo/teklif formları artık veri gönderilmiş gibi davranmaz; demo önizlemesi olduğunu söyler. | Home, İletişim, Demo, Teklif, Kurumsal |
| Hukuki sayfa kapsamı | Kurumsal sayfasındaki hukuki okuyucu 11 metne genişletildi. Mesafeli Satış Sözleşmesi, Gizlilik Sözleşmesi (KVKK), Üyelik Sözleşmesi, Verilerin Silinmesi Talimatı, İade Politikası ve İade Formu eklendi; her metin bağımsız URL'den de açılır. | `legal.js`, `LegalReader`, `App.jsx`, `Legal.css` |
| Footer yönlendirmeleri | Footer'daki KVKK etiketi Hukuki Sayfalar olarak güncellendi. Modüller sütunundaki içerikler Modüller sayfasını, Tüm Özellikler sütunundaki içerikler Tüm Özellikler sayfasını açar. | `Footer.jsx` |
| Blog yönetimi | Blog liste ve detay sayfaları Supabase verisine taşındı; aynı kapak görseli liste, detay ve ilgili yazılarda kullanılır. Yönetim panelinden görselli taslak/yayın/planlı yazı oluşturma, düzenleme, sıralı başlık-paragraf blokları ve güvenli silme eklendi. Migration uygulanana kadar mevcut statik yazılar fallback olarak korunur. | `AdminBlog`, `BlogCover`, `blog.js`, `imageUpload.js`, `0019` |
| Boş yönlendirmeler | Sipariş bilgisi olmadan başarı gösterimi kapatıldı; başarı rotası giriş korumasına alındı; 404 metni üretime uygun hale getirildi. | `App`, `SiparisTamamlandi`, `Placeholder` |
| Bağımlılık | React Router 6.30.4'e yükseltildi; açık yönlendirme kaydı kapandı. Babel zinciri güncellendi. | `package.json`, `package-lock.json` |
| Dev sunucu | Yerel geliştirme sunucusu `127.0.0.1` ve yerel origin CORS ile sınırlandı. | `vite.config.js` |
| Dönem sonu paket iptali | `Lisanslarım` ekranındaki iki aşamalı iptal, mevcut fatura dönemi sonuna planlanır. Paket ve bağlı modüller `expires_at` tarihine kadar kullanılabilir; bu tarihte kapanır ve yenilenmez. | `Lisanslarim`, `panel.css`, `0018` |
| İptal yarış koşulları | İptali planlanan pakete yeni modül/yenileme açılması veya eski admin ekranından bekleyen işlemin `paid` yapılması DB tetikleriyle engellendi. | `0017`, `0018` |

Son doğrulama: Üretim build'i 196 modülle başarılı geçti. Blog liste/detay sayfaları
masaüstü ve mobil tarayıcıda doğrulandı. `0019` migrationı geçici PostgreSQL üzerinde
iki kez hatasız çalıştırıldı; RLS, JSON içerik kısıtı ve Storage yol politikası test edildi.

> Ödeme, yıllık fiyat/KDV hesabı, gateway ve gerçek sipariş tahsilatı bu turda özellikle
> değiştirilmedi. Kullanıcı isteğiyle demo olarak bırakıldı; gerçek ödeme sayfası ayrı fazdır.

---

## 7. 📊 Neler Yapıldı / Neler Yapılmadı

**✅ tam · 🟡 kısmi · 🔴 yok**

### Ekran grupları
| Grup | Durum | Not |
|---|---|---|
| Genel Web Sitesi | 🟢 ~%95 | Tüm sayfalar + Hukuki + Blog + Yardım + Teklif |
| Üyelik | 🟡 ~%75 | Kayıt/Giriş/Şifre/E-posta ✅ · Telefon, 2FA ❌ |
| Satın Alma | 🟢 ~%85 | Sepet→Ödeme→Sipariş ✅ · admin alışveriş engeli ✅ · canlı kart tahsilatı ❌ |
| Müşteri Paneli | 🟢 ~%92 | Dashboard/Sipariş/Destek/Profil/Lisans/Fatura/**Bildirim** ✅ · Lisansa modül ekleme ve dönem sonu paket iptali ✅ · Yenilemelerim geçici pasif · Ödeme/API ❌ |
| Yönetim Paneli | 🟡 ~%72 | Dashboard/Sipariş/Destek/Paket/Modül/Yenileme/Müşteri/Bildirim/**Blog** ✅ · sekme akıcılığı/hover düzeltmeleri ✅ · Ödeme/API/Ayarlar/Roller ❌ |

### Modül Ağacı (A–R)
| Modül | Durum | Not |
|---|---|---|
| A. Genel Web Sitesi | 🟢 | Tam |
| B. Kimlik/Üyelik | 🟡 | B1–B4 ✅ · B5 Telefon, B6 2FA ❌ |
| C. Satın Alma | 🟢 | Sepet/ödeme/sipariş ✅ · admin alışveriş engeli ✅ · canlı tahsilat ❌ |
| D. Müşteri Paneli | 🟢 | Dashboard/Sipariş/Destek/Profil/Lisans(D3)/Fatura(D5)/Bildirim(D10) ✅ · Lisansa modül ekleme ve dönem sonu paket iptali ✅ · Yenilemelerim geçici pasif · Ödeme/API ❌ |
| E. Tenant Yönetimi | 🟢 | Admin müşteri listesi + detay (sipariş/lisans/talep geçmişi) ✅ · tenant düzenleme/üye yönetimi ❌ |
| F. Paket Yönetimi | 🟢 | Admin + inline ✅ (paket ekle/sil hariç) |
| G. Modül Yönetimi | 🟢 | Admin + inline ekle/düzenle/sil ✅ |
| H. Lisans Yönetimi | 🟡 | Sipariş 'paid' → otomatik paket lisansı ✅ · müşteri "Lisanslarım" ✅ · lisansa modül ekleme ✅ (`0015`) · güvenli dönem sonu paket/modül iptali ✅ (`0018`) · admin lisans yönetim UI ❌ |
| I. Sipariş Yönetimi (admin) | 🟢 | Liste + durum ✅ |
| J. Fatura Yönetimi (EDM) | 🟡 | Sipariş 'paid' → otomatik fatura + müşteri "Faturalarım" (liste + düzenli yazdır/PDF) ✅ · EDM e-fatura entegrasyonu ❌ |
| K. Ödeme Yönetimi (PayTR/İyzico) | 🔴 | Sipariş yapısı hazır, gateway ❌ |
| L. Destek Sistemi | 🟢 | Müşteri + admin yanıt/kapatma ✅ · departman/SLA ❌ |
| M. Yenileme Yönetimi | 🟡 | DB/RPC + admin yenileme yönetimi hazır ✅ · müşteri `Yenilemelerim` ekranı geçici pasif · otomatik hatırlatma (bildirim) ❌ |
| N. Bildirim Sistemi | 🟢 | Müşteri "Bildirimlerim" + admin tekli/toplu duyuru + sipariş/yenileme otomatik bildirim ✅ · e-posta/SMS kanalı ❌ |
| O. API Yönetimi | 🔴 | — |
| P. İçerik (CMS) | 🟡 | Modüller + Özellikler inline ✅ · kart görsel URL/storage desteği ✅ · görselli Blog yönetimi + DB/RLS ✅ (`0019`) · Hukuki metin yönetimi statik ❌ |
| Q. Sistem Ayarları | 🔴 | — |
| R. Yetki/Rol | 🟡 | platform_admins + tenant_users rolleri ✅ · yönetim UI ❌ |

---

## 8. 🎯 Sıradaki Adaylar
> ✅ Adım 1 (Lisans & Fatura — H+J+D3+D5): `0008` + Lisanslarım/Faturalarım.
> ✅ Adım 2 (Yenilemeler — M+D7): `0009` + request_renewal + admin Yenileme Yönetimi.
> Not: müşteri `Yenilemelerim` ekranı daha sonra geçici pasif yapıldı.
> ✅ Adım 3 (Tenant/Müşteri — E): `0010` admin_list_customers RPC + admin Müşteri Yönetimi (liste + detay).
> ✅ Adım 4 (Bildirim — N+D10): `0011` + müşteri Bildirimlerim + admin Bildirim Yönetimi + otomatik tetikleyiciler.
> ✅ Adım 5 (Kart görselleri — P): `0012` + `0013` image_url + storage bucket/policy.
> ✅ Adım 6 (Admin alışveriş engeli): `0014` + frontend sepet/ödeme kapatma.
> ✅ Adım 7 (Lisansa modül ekleme): `0015` + müşteri Lisanslarım üzerinden modül siparişi/bağlı modül lisansı.
> ✅ Adım 8 (Panel/PDF polish): yönetim/müşteri sekme aktif durumu + fatura PDF düzeni.
> ✅ Adım 9 (Müşteri paket iptali): `0017` + `0018` ile Lisanslarım üzerinden dönem sonu paket/bağlı modül iptali ve DB yarış koşulu korumaları.
> ✅ Adım 10 (Blog yönetimi — P.2): `0019` + admin görselli blog CRUD, DB'ye taşınmış liste/detay.

> 🎯 **Sıradaki (kullanıcı kararı, 13 Tem):** B4 **E-posta doğrulama** + B5 **Telefon doğrulama** (gerçek akış). Supabase Auth email confirmation UI'a bağlanacak; telefon için phone OTP/SMS (Q.3 SMS ayarları ile ilişkili).
1. **E-posta + Telefon doğrulama (B4/B5)** — sıradaki iş.
2. **Ödeme Entegrasyonu (K)** — PayTR/İyzico Edge Function webhook → sipariş/modül siparişi `paid` otomatikleşsin.
2. **Admin lisans yönetimi UI** — lisansları yönetim panelinden doğrudan düzenleme/iptal/uzatma.
3. **Yenilemelerim ekranını yeniden aktif etme** — sayfa şimdilik pasif; ürün kararı sonrası tekrar açılabilir.
4. **CMS (P)** — Hukuki metinleri yönetilebilir DB yapısına taşımak; Blog yönetimi `0019` ile tamamlandı.
5. **Üyelik kalanı** — telefon doğrulama, 2FA (Supabase MFA).

---

## 9. Git Durumu
- Aktif dal: **`aserai-supabase-auth-panel`** (origin'e push'lu). Son commit: `8c82f63`.
- `main` bu dalın gerisinde (istenirse merge edilir).
- Repo: https://github.com/erenozyurek/AseraiSatis
- Not: Bu çalışma kopyasında `git status` çalıştırıldığında `.git` bulunamadı; push/branch
  işlemleri için gerçek git klonu veya repo klasörü kontrol edilmeli.

---

## 10. Önemli Notlar
- **Statik fallback:** Katalog/kart tabloları yoksa public sayfalar statik veriyle çalışır.
- **Fiyatlar örnektir** (`data/pricing.js` / DB seed) — gerçek değerlerle güncellenmeli.
- **Hukuki metinler şablon** — hukukçu onayı gerekir.
- **Modül ekleme akışı:** Müşteri `Lisanslarım`da modül siparişi oluşturur; sipariş
  `pending` olur. Admin `Sipariş Yönetimi`nde `paid` yapınca `0015` trigger'ı modül
  lisansını ana paket lisansına bağlar.
- **Paket iptal akışı:** Müşteri yalnızca kendi aktif paketinin iptalini `Lisanslarım`dan
  dönem sonuna planlayabilir. `0018` ile paket ve bağlı modüller mevcut `expires_at`
  tarihine kadar aktif kalır; bu tarihte kapanır ve yeni döneme yenilenmez. Bekleyen ek
  işlemler kapatılır, geçmiş ve faturalar silinmez.
- **Yenilemelerim:** Menüde geçici pasif/Yakında. URL doğrudan açılırsa kapalı bilgi ekranı gösterir.
- **Admin güvenliği:** Adminin alışveriş yapması hem frontend hem RPC/RLS seviyesinde engelli.
- **Konvansiyona sadık kal:** yeni desen icat etme; mevcut context/CSS token yapısını kullan.
- **Kapsam disiplini:** bir işi yaparken alakasız sistemlere (auth/RLS/veri) dokunma.
- Test kullanıcı bilgileri ve parolalar proje dökümanında tutulmaz.
