# Aserai Satış Sitesi — Proje Durum & Devir Dökümanı

> Bu döküman, projeyi başka bir kod editöründe kaldığı yerden sürdürmek için hazırlanmıştır.
> Son güncelleme: 11 Temmuz 2026.

---

## 1. Proje Nedir? (Bağlam)

**Aserai**, Dijital Atölyemiz Danışmanlık ve Ticaret İnş. San. Ltd. Şti.'nin geliştirdiği
yeni nesil, çok kanallı bir **e-ticaret altyapısı (SaaS)**'dır.

Bu repo (`AseraiSatis-main`) = **Aserai'nin tanıtım / demo / SATIŞ web sitesi**dir.
Yani ürünün kendisi değil, ürünün pazarlandığı ve satıldığı siteyi geliştiriyoruz.

- İki ürün var: **(1) Aserai** — e-ticaret altyapısı (bu sitenin sattığı şey).
  **(2) Iberai** — pazaryeri entegrasyon yazılımı (ayrı ürün, `iberai.com.tr`, ayrı konumlandırılıyor).
- **ÖNEMLİ MARKA KURALI:** Site kendini yalnızca **"Aserai"** olarak tanıtır. İberai
  sadece entegrasyon bağlamında (Çözümler sayfası entegrasyon kartı, `/iberai` ürün
  sayfası, entegrasyon bölümleri, iberai.com.tr linkleri) geçer. Siteyi "Aserai & Iberai"
  diye markalamayın.

### Kaynak gereksinim dökümanları (ağırlıklı ikisi)
Aşağıdaki dosyalar `~/Downloads` altında; sitenin **birincil gereksinim kaynağı**:
1. **`ASERAI _2026_Demo Sitesi ANA GEREKSİNİMLER.docx`** — sistem modül ağacı (A–R) +
   ekran listesi (Genel Web Sitesi / Üyelik / Satın Alma / Müşteri Paneli / Yönetim Paneli).
2. **`ASERAI _2026_Demo Sitesi Diğer detaylarımız.docx`** — "Özellikler" iç sayfasının içeriği.
3. Destekleyici: `ASERAI LANDING PAGE UI_2026.docx` (anasayfa wireframe), `Aserai Öne Çıkan
   Özellikler.docx`, `Aserai Software Solutions General Table.xlsx` (bu sonuncusu **diğer ürünün**
   — entegrasyon yazılımının — proje planı, bu sitenin kapsamı değil).

---

## 2. Teknik Yığın & Mimari

- **Framework:** React 18 + **Vite 5** (SPA). ⚠️ Next.js DEĞİL.
- **Router:** `react-router-dom` v6.
- **Dil:** JavaScript (JSX), tümü Türkçe içerik.
- **Stil:** Bileşen başına ayrı `.css` dosyası + global tasarım token'ları (`src/styles/global.css`).
  Tailwind/CSS-in-JS YOK.
- **Backend:** **YOK.** API çağrısı, veritabanı, auth, global state (context/redux),
  localStorage kullanımı yok. Tüm formlar **statik** (submit sadece "teşekkürler" ekranı gösterir,
  gerçek gönderim yapmaz). Giriş sayfası bile "gerçek oturum açılmaz" notu taşır.
- **Fontlar:** Google Fonts (Plus Jakarta Sans) + Fontshare (Clash Display), `index.html`'de.

### Çalıştırma
```bash
cd ~/Downloads/AseraiSatis-main
npm install          # ilk kez
npm run dev          # http://localhost:5173
npm run build        # üretim derlemesi (dist/)
npm run preview      # derlemeyi önizle
```

---

## 3. Proje Yapısı & Konvansiyonlar

```
src/
  App.jsx                # Tüm route tanımları + scroll-reset + reveal animasyonu
  main.jsx
  data/                  # Statik içerik verisi (JS export)
    pricing.js           #   paketler + comparison (karşılaştırma matrisi)
    products.js          #   /aserai ve /iberai ürün sayfası içerikleri
    legal.js             #   5 hukuki metin (KVKK, gizlilik, ...)
    blog.js              #   blog yazıları
  components/            # Yeniden kullanılabilir bileşenler (her biri + .css)
    Navbar/ Footer/ Layout/ PageHeader/ CtaBand/ Faq/ Icon/ WhatsappButton/
    PricingPlans/ PricingCard/ BillingToggle/
    ComparisonTable/     #   birleşik paket + karşılaştırma tablosu
    LegalReader/         #   sol menü + içerik, yerinde değişen hukuki okuyucu
  pages/                 # Her sayfa: X/X.jsx + X.css
  styles/
    global.css           # Tasarım token'ları (renk/tipografi/spacing) + reset + .btn, .section...
    forms.css            # .field, .field-row, .form-check (ortak form stilleri)
```

**Yeni sayfa eklerken kalıp:**
1. `src/pages/Ad/Ad.jsx` + `Ad.css` oluştur.
2. Üstte `PageHeader` (eyebrow/title/text), bölümler için `.section` / `.section--soft`,
   başlık için `.section-head`, alt CTA için `CtaBand` kullan.
3. İçerik dizilerini sayfanın üstünde sabit dizi olarak ya da `src/data/*.js`'te tut.
4. Route'u `App.jsx`'e ekle; menü/footer linkini ilgili bileşene ekle.
5. Renk/dolgu için daima `global.css` token'larını kullan (`var(--c-...)`, `var(--radius-...)`).

**Tasarım token'ları (özet):** ana renk lacivert `--c-navy: #1c3444`; yüzey `#fff`;
yumuşak zemin `--c-bg-soft: #fdfbf7` (çok hafif krem); vurgu yeşili tasarruf kutularında `#1d9d57`.

---

## 4. Şu Ana Kadar Yapılanlar

### 4.1 Zaten mevcut olan sayfalar (temel)
Anasayfa, Hakkımızda, Çözümler, Modüller, Özellikler, Referanslar, Kurumsal, İletişim,
Demo, Giriş, Ürün sayfaları (`/aserai`, `/iberai`), Paketler. Hepsi görsel/pazarlama
olarak tamamlanmış, kaliteli; ama backend yok (statik).

### 4.2 Bu oturumda yapılan değişiklikler

1. **Paket Karşılaştırma → Birleşik Paket Tablosu** (`components/ComparisonTable`,
   `data/pricing.js` içindeki `comparison`): Paketler sayfasındaki ayrı fiyat kartları ile
   karşılaştırma tablosu **tek tabloda birleştirildi**. Üstte kart tarzı başlıklar (isim,
   açıklama, büyük fiyat, yeşil tasarruf kutusu, "Paketi Seç" butonu, Aylık/Yıllık geçişi,
   Standart sütunu "EN POPÜLER" vurgulu), altında özellik karşılaştırma satırları. Eski
   ayrı `PricingPlans` kart bölümü Paketler'den kaldırıldı (ama `PricingPlans`/`PricingCard`
   bileşenleri `ProductPage`'de hâlâ kullanıldığı için **silinmedi**).

2. **Marka: "sadece Aserai"** — `index.html` title + meta; Giriş logosu/etiketi; İletişim
   (başlık + e-posta `merhaba@aserai.com` + konu listesi); Demo; Referanslar; Modüller;
   Paketler; Home mini fiyat önizlemesi ve adım açıklaması. İberai yalnızca meşru entegrasyon
   yerlerinde bırakıldı.

3. **Arka plan tonu** — `global.css`'te `--c-bg-soft`, `--c-bg-tint`, `--gradient-soft`
   nötr griden çok hafif krem/bej off-white'a çekildi (kullanıcı isteğiyle beyaza yakın).

4. **Hukuki Sayfalar** (`data/legal.js`, `pages/Legal`, `components/LegalReader`): 5 metin —
   KVKK, Gizlilik, Kullanım Şartları, Çerez Politikası, Yasal Uyarı. Hem ayrı route'lar
   (`/kvkk`, `/gizlilik`, `/kullanim-sartlari`, `/cerez-politikasi`, `/yasal-uyari`) hem de
   **Kurumsal sayfasının altına gömülü** `LegalReader` (sol menü + yerinde değişen içerik).
   Footer'daki hukuki linkler gerçek sayfalara bağlandı. ⚠️ Metinler **şablon** — yürürlük
   öncesi hukukçu onayı gerekir.

5. **Teklif Talep Formu** (`pages/Teklif`, route `/teklif`): Demo'dan ayrı, sektör/paket/
   sipariş hacmi alanlı statik form + "Teklifinizde neler olacak?" paneli. Footer'a "Teklif Al".

6. **Yardım Merkezi** (`pages/Yardim`, route `/yardim`): arama kutusu (görsel) + 6 kategori
   kartı + popüler SSS (`Faq`) + destek CTA. Footer "Destek Merkezi" buraya bağlı.

7. **Blog** (`data/blog.js`, `pages/Blog` liste + `pages/BlogDetail` detay,
   routes `/blog`, `/blog/:slug`): 4 örnek yazı, öne çıkan + kart ızgarası, detayda
   içerik + ilgili yazılar + CTA. Footer "Blog" buraya bağlı.

8. **Footer sadeleştirme:** Footer'ın en üstündeki utility şeridi (Aserai logosu + "Destek" +
   "Katıl" + "E-Ticarete Başla") kaldırıldı. Header'daki aynı butonlar duruyor.

> Not: Bu oturumdaki tüm değişiklikler **çalışma ağacında (henüz commit edilmemiş olabilir)**.
> Başka editöre geçmeden `git status` / `git add` / `git commit` yapman önerilir.

---

## 5. Gereksinim Dökümanlarına Göre Kapsam Durumu

### 5.1 Ekran Listesi (ANA GEREKSİNİMLER dökümanı, 5 grup)

| Grup | Durum | Not |
|---|---|---|
| **Genel Web Sitesi** | 🟢 ~%95 | Ana Sayfa, Hakkımızda, Ürün Detay, Paketler, **Paket Karşılaştırma**, Demo, **Teklif Formu**, **Yardım Merkezi**, Blog Liste/Detay, İletişim, **Hukuki Sayfalar** tamam. Eksik/kısmi: gerçek "Ürün Listesi/katalog" (şu an Çözümler + ürün sayfaları var). |
| **Üyelik** | 🔴 ~%10 | Sadece **Giriş** (statik UI) var. Eksik: Kayıt Ol, Şifremi Unuttum, Şifre Yenileme, E-Posta Doğrulama, Telefon Doğrulama, 2FA. |
| **Satın Alma** | 🔴 %0 | Sepet, Ödeme, Ek Modül Seçim (sepete ekleme), Sipariş Tamamlandı → yok. Paketler/Modüller sadece vitrin. |
| **Müşteri Paneli** | 🔴 %0 | Dashboard, Lisanslarım, Siparişlerim, Faturalarım, Destek Taleplerim, Yenilemelerim, API Anahtarlarım, Bildirimlerim → yok. |
| **Yönetim Paneli** | 🔴 %0 | Tenant, Paket, Modül, Lisans, Sipariş, Fatura, Ödeme, Destek, Yenileme, Bildirim, API, CMS, Rol/Yetki, İşlem Logları → yok. |

### 5.2 Sistem Modül Ağacı (A–R)
Bunların tamamı backend/işlevsel sistem (B Kimlik, C Satın Alma, D Müşteri Paneli, E Tenant,
F Paket, G Modül, H Lisans, I Sipariş, J Fatura [E-fatura: EDM Bilişim], K Ödeme
[PayTR/İyzico], L Destek, M Yenileme, N Bildirim, O API, P CMS, Q Ayarlar, R Rol/Yetki).
Backend olmadığı için **~%0**. Bunlar bir sonraki büyük faz.

---

## 6. Yapılması Gerekenler (öncelik sırasıyla)

Genel Web Sitesi katmanı büyük ölçüde bitti. Sıradaki blok **arka uç gerektiren uygulama katmanı**.

### Adım 0 — Mimari/Backend Kararı (ön koşul)
Aşağıdakiler için bir backend + veritabanı + kimlik doğrulama stratejisi kararı gerekir.
Seçenekler: (a) ayrı bir API (Node/NestJS + PostgreSQL vb.), (b) BaaS (Supabase/Firebase),
(c) Next.js'e taşıyıp full-stack. Ödeme için **PayTR veya İyzico**, e-fatura için **EDM Bilişim**
(dökümanda belirtilmiş). Bu karar verilmeden panel/sepet/üyelik işlevsel olamaz.

### Adım 1 — Üyelik Akışı (B modülü)
Kayıt Ol, Giriş (gerçek oturum), Şifremi Unuttum + Yenileme, E-Posta/Telefon Doğrulama, 2FA.
Mevcut `/giris` UI'ı temel alınabilir.

### Adım 2 — Satın Alma Akışı (C modülü)
Paket Seçim → Ek Modül Seçim (sepete ekleme) → **Sepet** → **Ödeme** (sanal POS) →
Sipariş Tamamlandı. Paketler ve Modüller sayfaları vitrin olarak hazır; sepet state'i +
ödeme entegrasyonu eklenecek.

### Adım 3 — Müşteri Paneli (D modülü)
Dashboard (özet, aktif lisanslar, yaklaşan yenilemeler, son faturalar, açık destek),
Lisanslarım, Siparişlerim, Faturalarım (PDF), Destek Taleplerim (mesajlaşma+dosya),
Yenilemelerim, API Anahtarlarım, Bildirimlerim, Profil/Firma.

### Adım 4 — Yönetim Paneli (E–R modülleri)
Tenant, Paket, Modül, Lisans, Sipariş, Fatura, Ödeme, Destek (SLA), Yenileme, Bildirim
(şablon+tetikleyici), API (limit/log), CMS (blog/SSS/doküman/slider), Rol/Yetki, Ayarlar,
İşlem Logları.

### Küçük iyileştirmeler (opsiyonel, backend'siz yapılabilir)
- Gerçek bir "Ürün Listesi/katalog" ekranı (şu an Çözümler + ürün sayfaları).
- Blog/Yardım içeriğinin CMS'e taşınması (backend gelince).
- Referanslar'daki müşteri yorumlarında "Iberai" geçiyor (entegrasyon ürünü olarak); istenirse
  "Aserai" yapılabilir.

---

## 7. Dikkat Edilecek Önemli Notlar

- **Statik site:** Tüm formlar sahte (submit → teşekkür ekranı). Blog/hukuki içerik veri
  dosyalarında sabit.
- **Fiyatlar örnektir** (`data/pricing.js` içinde "güncellenecek" notu). Kesinleşince orayı
  güncelle; hem paket kartları hem karşılaştırma tablosu otomatik yansıtır.
- **Hukuki metinler şablon** (`data/legal.js`) — yürürlük öncesi hukukçu onayı şart
  (sayfalarda uyarı mevcut).
- **İletişim e-postası** `merhaba@aserai.com` olarak konuldu — **gerçek alan adını doğrula**.
- **İberai ayrı:** Marka kuralına uy; İberai'yi yalnızca entegrasyon bağlamında bırak.
- **Konvansiyona sadık kal:** Yeni desen icat etme; mevcut bileşen/CSS token yapısını kullan.
- **Kapsam disiplini:** Bir işi yaparken alakasız sistemlere (auth/veri/ayar) dokunma.

---

## 8. Route Haritası (güncel)

| Route | Sayfa | Durum |
|---|---|---|
| `/` | Home | ✅ |
| `/cozumler` | Çözümler | ✅ |
| `/moduller` | Modüller | ✅ |
| `/ozellikler` | Özellikler | ✅ |
| `/kurumsal` | Kurumsal (+ gömülü LegalReader) | ✅ |
| `/aserai`, `/iberai` | ProductPage | ✅ |
| `/paketler` | Paketler (birleşik tablo) | ✅ |
| `/hakkimizda` | Hakkımızda | ✅ |
| `/referanslar` | Referanslar | ✅ |
| `/iletisim` | İletişim | ✅ (statik form) |
| `/demo` | Demo Talep | ✅ (statik form) |
| `/teklif` | Teklif Talep | ✅ (statik form) — YENİ |
| `/yardim` | Yardım Merkezi | ✅ — YENİ |
| `/blog`, `/blog/:slug` | Blog Liste/Detay | ✅ — YENİ |
| `/kvkk` `/gizlilik` `/kullanim-sartlari` `/cerez-politikasi` `/yasal-uyari` | Hukuki | ✅ — YENİ |
| `/giris` | Giriş | ✅ (statik UI) |
| `*` | 404 Placeholder | ✅ |

**Henüz route'u olmayan (yapılacak):** kayıt, şifre sıfırlama, doğrulama, sepet, ödeme,
sipariş-tamamlandı, müşteri paneli (`/panel/*`), yönetim paneli (`/yonetim/*`).
