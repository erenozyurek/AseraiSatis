import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect, useRef } from 'react'
import Layout from './components/Layout/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'

const Home = lazy(() => import('./pages/Home/Home.jsx'))
const Cozumler = lazy(() => import('./pages/Cozumler/Cozumler.jsx'))
const Moduller = lazy(() => import('./pages/Moduller/Moduller.jsx'))
const Ozellikler = lazy(() => import('./pages/Ozellikler/Ozellikler.jsx'))
const Kurumsal = lazy(() => import('./pages/Kurumsal/Kurumsal.jsx'))
const Akademi = lazy(() => import('./pages/Akademi/Akademi.jsx'))
const ProductPage = lazy(() => import('./pages/ProductPage/ProductPage.jsx'))
const Paketler = lazy(() => import('./pages/Paketler/Paketler.jsx'))
const Hakkimizda = lazy(() => import('./pages/Hakkimizda/Hakkimizda.jsx'))
const Referanslar = lazy(() => import('./pages/Referanslar/Referanslar.jsx'))
const Iletisim = lazy(() => import('./pages/Iletisim/Iletisim.jsx'))
const Demo = lazy(() => import('./pages/Demo/Demo.jsx'))
const Teklif = lazy(() => import('./pages/Teklif/Teklif.jsx'))
const Yardim = lazy(() => import('./pages/Yardim/Yardim.jsx'))
const Blog = lazy(() => import('./pages/Blog/Blog.jsx'))
const BlogDetail = lazy(() => import('./pages/BlogDetail/BlogDetail.jsx'))
const Giris = lazy(() => import('./pages/Giris/Giris.jsx'))
const Kayit = lazy(() => import('./pages/Kayit/Kayit.jsx'))
const SifremiUnuttum = lazy(
  () => import('./pages/SifremiUnuttum/SifremiUnuttum.jsx'),
)
const SifreYenile = lazy(() => import('./pages/SifreYenile/SifreYenile.jsx'))
const Sepet = lazy(() => import('./pages/Sepet/Sepet.jsx'))
const Odeme = lazy(() => import('./pages/Odeme/Odeme.jsx'))
const SiparisTamamlandi = lazy(
  () => import('./pages/SiparisTamamlandi/SiparisTamamlandi.jsx'),
)
const PanelLayout = lazy(
  () => import('./components/PanelLayout/PanelLayout.jsx'),
)
const Dashboard = lazy(() => import('./pages/panel/Dashboard.jsx'))
const Siparislerim = lazy(() => import('./pages/panel/Siparislerim.jsx'))
const Lisanslarim = lazy(() => import('./pages/panel/Lisanslarim.jsx'))
const Faturalarim = lazy(() => import('./pages/panel/Faturalarim.jsx'))
const FaturaDetay = lazy(() => import('./pages/panel/FaturaDetay.jsx'))
const Odemelerim = lazy(() => import('./pages/panel/Odemelerim.jsx'))
const Yenilemelerim = lazy(() => import('./pages/panel/Yenilemelerim.jsx'))
const ApiAnahtarlari = lazy(
  () => import('./pages/panel/ApiAnahtarlari.jsx'),
)
const Bildirimlerim = lazy(() => import('./pages/panel/Bildirimlerim.jsx'))
const DestekTaleplerim = lazy(
  () => import('./pages/panel/DestekTaleplerim.jsx'),
)
const DestekDetay = lazy(() => import('./pages/panel/DestekDetay.jsx'))
const Profil = lazy(() => import('./pages/panel/Profil.jsx'))
const AdminLayout = lazy(
  () => import('./components/AdminLayout/AdminLayout.jsx'),
)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'))
const AdminSiparisler = lazy(() => import('./pages/admin/AdminSiparisler.jsx'))
const AdminOdemeler = lazy(() => import('./pages/admin/AdminOdemeler.jsx'))
const AdminFaturalar = lazy(() => import('./pages/admin/AdminFaturalar.jsx'))
const AdminLisanslar = lazy(() => import('./pages/admin/AdminLisanslar.jsx'))
const AdminYenilemeler = lazy(
  () => import('./pages/admin/AdminYenilemeler.jsx'),
)
const AdminMusteriler = lazy(() => import('./pages/admin/AdminMusteriler.jsx'))
const AdminMusteriDetay = lazy(
  () => import('./pages/admin/AdminMusteriDetay.jsx'),
)
const AdminBildirimler = lazy(
  () => import('./pages/admin/AdminBildirimler.jsx'),
)
const AdminPaketler = lazy(() => import('./pages/admin/AdminPaketler.jsx'))
const AdminModuller = lazy(() => import('./pages/admin/AdminModuller.jsx'))
const AdminBlog = lazy(() => import('./pages/admin/AdminBlog.jsx'))
const AdminDestek = lazy(() => import('./pages/admin/AdminDestek.jsx'))
const AdminDestekDetay = lazy(
  () => import('./pages/admin/AdminDestekDetay.jsx'),
)
const AdminAyarlar = lazy(() => import('./pages/admin/AdminAyarlar.jsx'))
const AdminRoller = lazy(() => import('./pages/admin/AdminRoller.jsx'))
const AdminLoglar = lazy(() => import('./pages/admin/AdminLoglar.jsx'))
const Legal = lazy(() => import('./pages/Legal/Legal.jsx'))
const Placeholder = lazy(() => import('./pages/Placeholder/Placeholder.jsx'))

const REVEAL_SELECTOR = [
  '.section-head',
  '.solution-card',
  '.feature-card',
  '.step-card',
  '.demo-step',
  '.hero-stat',
  '.pp-feature',
  '.pp-stat',
  '.pp-integration',
  '.hk-mv__card',
  '.hk-value',
  '.hk-milestone',
  '.hk-member',
  '.hk-story__stat',
  '.ref-stat',
  '.ref-logo',
  '.ref-case',
  '.ref-quote',
  '.pak-included__card',
  '.il-info__card',
  '.faq__item',
].join(',')

export default function App() {
  const { pathname } = useLocation()
  const previousPathname = useRef(null)

  useEffect(() => {
    const previous = previousPathname.current
    previousPathname.current = pathname
    if (previous?.startsWith('/akademi') && pathname.startsWith('/akademi')) {
      return
    }
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    const els = Array.from(document.querySelectorAll(REVEAL_SELECTOR))
    els.forEach((el) => {
      const siblings = el.parentElement
        ? Array.from(el.parentElement.children)
        : [el]
      const idx = Math.min(siblings.indexOf(el), 5)
      el.style.transitionDelay = `${idx * 75}ms`
      el.classList.add('reveal')
    })
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => {
      io.disconnect()
      els.forEach((el) => {
        el.classList.remove('reveal', 'reveal--in')
        el.style.transitionDelay = ''
      })
    }
  }, [pathname])

  const loading = (
    <div className="route-loading" role="status" aria-live="polite">
      Yükleniyor…
    </div>
  )

  return (
    <Layout>
      <Suspense fallback={loading}>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cozumler" element={<Cozumler />} />
        <Route path="/moduller" element={<Moduller />} />
        <Route path="/ozellikler" element={<Ozellikler />} />
        <Route path="/kurumsal" element={<Kurumsal />} />
        <Route path="/akademi" element={<Akademi />} />
        <Route path="/akademi/:slug" element={<Akademi />} />
        <Route path="/akademi/:slug/:guideSlug" element={<Akademi />} />
        <Route path="/aserai" element={<ProductPage slug="aserai" />} />
        <Route path="/iberai" element={<ProductPage slug="iberai" />} />
        <Route path="/paketler" element={<Paketler />} />
        <Route path="/hakkimizda" element={<Hakkimizda />} />
        <Route path="/referanslar" element={<Referanslar />} />
        <Route path="/iletisim" element={<Iletisim />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/teklif" element={<Teklif />} />
        <Route path="/yardim" element={<Yardim />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/giris" element={<Giris />} />
        <Route path="/kayit" element={<Kayit />} />
        <Route path="/sifremi-unuttum" element={<SifremiUnuttum />} />
        <Route path="/sifre-yenile" element={<SifreYenile />} />
        <Route
          path="/panel"
          element={
            <ProtectedRoute>
              <PanelLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="siparislerim" element={<Siparislerim />} />
          <Route path="lisanslarim" element={<Lisanslarim />} />
          <Route path="faturalarim" element={<Faturalarim />} />
          <Route path="faturalarim/:id" element={<FaturaDetay />} />
          <Route path="odemelerim" element={<Odemelerim />} />
          <Route path="yenilemelerim" element={<Yenilemelerim />} />
          <Route path="api-anahtarlari" element={<ApiAnahtarlari />} />
          <Route path="bildirimlerim" element={<Bildirimlerim />} />
          <Route path="destek" element={<DestekTaleplerim />} />
          <Route path="destek/:id" element={<DestekDetay />} />
          <Route path="profil" element={<Profil />} />
        </Route>
        <Route path="/hesabim" element={<Navigate to="/panel" replace />} />
        <Route
          path="/yonetim"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="siparisler" element={<AdminSiparisler />} />
          <Route path="odemeler" element={<AdminOdemeler />} />
          <Route path="faturalar" element={<AdminFaturalar />} />
          <Route path="lisanslar" element={<AdminLisanslar />} />
          <Route path="yenilemeler" element={<AdminYenilemeler />} />
          <Route path="musteriler" element={<AdminMusteriler />} />
          <Route path="musteriler/:id" element={<AdminMusteriDetay />} />
          <Route path="bildirimler" element={<AdminBildirimler />} />
          <Route path="paketler" element={<AdminPaketler />} />
          <Route path="moduller" element={<AdminModuller />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="destek" element={<AdminDestek />} />
          <Route path="destek/:id" element={<AdminDestekDetay />} />
          <Route path="ayarlar" element={<AdminAyarlar />} />
          <Route path="roller" element={<AdminRoller />} />
          <Route path="loglar" element={<AdminLoglar />} />
        </Route>
        <Route path="/sepet" element={<Sepet />} />
        <Route
          path="/odeme"
          element={
            <ProtectedRoute allowAdmin={false}>
              <Odeme />
            </ProtectedRoute>
          }
        />
        <Route
          path="/siparis-tamamlandi"
          element={
            <ProtectedRoute allowAdmin={false}>
              <SiparisTamamlandi />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mesafeli-satis-sozlesmesi"
          element={<Legal slug="mesafeli-satis-sozlesmesi" />}
        />
        <Route path="/kvkk" element={<Legal slug="kvkk" />} />
        <Route path="/gizlilik" element={<Legal slug="gizlilik" />} />
        <Route
          path="/kvkk-gizlilik-sozlesmesi"
          element={<Legal slug="kvkk-gizlilik-sozlesmesi" />}
        />
        <Route
          path="/uyelik-sozlesmesi"
          element={<Legal slug="uyelik-sozlesmesi" />}
        />
        <Route
          path="/verilerin-silinmesi"
          element={<Legal slug="verilerin-silinmesi" />}
        />
        <Route
          path="/iade-politikasi"
          element={<Legal slug="iade-politikasi" />}
        />
        <Route path="/iade-formu" element={<Legal slug="iade-formu" />} />
        <Route
          path="/kullanim-sartlari"
          element={<Legal slug="kullanim-sartlari" />}
        />
        <Route
          path="/cerez-politikasi"
          element={<Legal slug="cerez-politikasi" />}
        />
        <Route path="/yasal-uyari" element={<Legal slug="yasal-uyari" />} />
        <Route
          path="*"
          element={<Placeholder title="Sayfa bulunamadı" stage="404" />}
        />
        </Routes>
      </Suspense>
    </Layout>
  )
}
