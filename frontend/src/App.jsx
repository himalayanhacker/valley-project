import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import AgentWidget from './components/AgentWidget'
import PageTransition from './components/PageTransition'
import Home from './pages/Home'
import Gallery from './pages/Gallery'
import { ArticleList, ArticleDetail } from './pages/Explore'
import Packages from './pages/Packages'
import Contact from './pages/Contact'
import useAuthStore from './store/auth'
import useThemeStore from './store/theme'

export default function App() {
  const [authOpen, setAuthOpen] = useState(false)
  const { fetchMe } = useAuthStore()
  const { theme } = useThemeStore()
  const location = useLocation()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      fetchMe()
    }
  }, [fetchMe])

  return (
    <>
      <Navbar onLoginClick={() => setAuthOpen(true)} />
      <main>
        <PageTransition key={location.pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery onLoginClick={() => setAuthOpen(true)} />} />
            <Route path="/explore" element={<ArticleList />} />
            <Route path="/explore/:slug" element={<ArticleDetail />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <AgentWidget />
    </>
  )
}
