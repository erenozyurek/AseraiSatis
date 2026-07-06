import { Routes, Route, useLocation } from 'react-router-dom'
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
import Giris from './pages/Giris/Giris.jsx'
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
        <Route path="/giris" element={<Giris />} />
        <Route
          path="*"
          element={<Placeholder title="Sayfa bulunamadı" stage="404" />}
        />
      </Routes>
    </Layout>
  )
}
