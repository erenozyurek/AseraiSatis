import Navbar from '../Navbar/Navbar.jsx'
import Footer from '../Footer/Footer.jsx'
import WhatsappButton from '../WhatsappButton/WhatsappButton.jsx'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsappButton />
    </>
  )
}
