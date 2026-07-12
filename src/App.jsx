import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect, useLayoutEffect } from 'react'
import Layout from './components/Layout/Layout.jsx'
import Home from './pages/Home/Home.jsx'
import Cozumler from './pages/Cozumler/Cozumler.jsx'
import Moduller from './pages/Moduller/Moduller.jsx'
import Ozellikler from './pages/Ozellikler/Ozellikler.jsx'
import Kurumsal from './pages/Kurumsal/Kurumsal.jsx'
import ProductPage from './pages/ProductPage/ProductPage.jsx'
import Paketler from './pages/Paketler/Paketler.jsx'
import Hakkimizda from './pages/Hakkimizda/Hakkimizda.jsx'
import Referanslar from './pages/Referanslar/Referanslar.jsx'
import Iletisim from './pages/Iletisim/Iletisim.jsx'
import Demo from './pages/Demo/Demo.jsx'
import Teklif from './pages/Teklif/Teklif.jsx'
import Yardim from './pages/Yardim/Yardim.jsx'
import Blog from './pages/Blog/Blog.jsx'
import BlogDetail from './pages/BlogDetail/BlogDetail.jsx'
import Giris from './pages/Giris/Giris.jsx'
import Kayit from './pages/Kayit/Kayit.jsx'
import SifremiUnuttum from './pages/SifremiUnuttum/SifremiUnuttum.jsx'
import SifreYenile from './pages/SifreYenile/SifreYenile.jsx'
import Sepet from './pages/Sepet/Sepet.jsx'
import Odeme from './pages/Odeme/Odeme.jsx'
import SiparisTamamlandi from './pages/SiparisTamamlandi/SiparisTamamlandi.jsx'
import PanelLayout from './components/PanelLayout/PanelLayout.jsx'
import Dashboard from './pages/panel/Dashboard.jsx'
import Siparislerim from './pages/panel/Siparislerim.jsx'
import DestekTaleplerim from './pages/panel/DestekTaleplerim.jsx'
import DestekDetay from './pages/panel/DestekDetay.jsx'
import Profil from './pages/panel/Profil.jsx'
import AdminLayout from './components/AdminLayout/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminSiparisler from './pages/admin/AdminSiparisler.jsx'
import AdminPaketler from './pages/admin/AdminPaketler.jsx'
import AdminModuller from './pages/admin/AdminModuller.jsx'
import AdminDestek from './pages/admin/AdminDestek.jsx'
import AdminDestekDetay from './pages/admin/AdminDestekDetay.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import Legal from './pages/Legal/Legal.jsx'
import Placeholder from './pages/Placeholder/Placeholder.jsx'

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
  '.pcard',
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

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useLayoutEffect(() => {
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

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cozumler" element={<Cozumler />} />
        <Route path="/moduller" element={<Moduller />} />
        <Route path="/ozellikler" element={<Ozellikler />} />
        <Route path="/kurumsal" element={<Kurumsal />} />
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
          <Route path="paketler" element={<AdminPaketler />} />
          <Route path="moduller" element={<AdminModuller />} />
          <Route path="destek" element={<AdminDestek />} />
          <Route path="destek/:id" element={<AdminDestekDetay />} />
        </Route>
        <Route path="/sepet" element={<Sepet />} />
        <Route
          path="/odeme"
          element={
            <ProtectedRoute>
              <Odeme />
            </ProtectedRoute>
          }
        />
        <Route path="/siparis-tamamlandi" element={<SiparisTamamlandi />} />
        <Route path="/kvkk" element={<Legal slug="kvkk" />} />
        <Route path="/gizlilik" element={<Legal slug="gizlilik" />} />
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
    </Layout>
  )
}
