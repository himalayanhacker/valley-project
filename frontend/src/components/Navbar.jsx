import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import useAuthStore from '../store/auth'
import ThemeToggle from './ThemeToggle'
import gsap from 'gsap'

const LINKS = [
  { to: '/',         label: 'Overview',  icon: '🏔' },
  { to: '/gallery',  label: 'Gallery',   icon: '📸' },
  { to: '/explore',  label: 'Explore',   icon: '🗺' },
  { to: '/packages', label: 'Packages',  icon: '🎒' },
  { to: '/contact',  label: 'Contact',   icon: '✉' },
]

export default function Navbar({ onLoginClick }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const { isAuthenticated, logout }  = useAuthStore()
  const mobileMenuRef  = useRef(null)
  const backdropRef    = useRef(null)
  const location       = useLocation()

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Scroll-aware background
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Animate mobile menu + backdrop
  useEffect(() => {
    const panel    = mobileMenuRef.current
    const backdrop = backdropRef.current
    if (!panel) return

    if (mobileOpen) {
      // Show backdrop
      if (backdrop) gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      // Slide panel in
      gsap.fromTo(panel,
        { x: '100%' },
        { x: '0%', duration: 0.38, ease: 'power3.out' }
      )
      // Stagger links
      gsap.fromTo(panel.querySelectorAll('.mobile-link'),
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.32, stagger: 0.06, delay: 0.18, ease: 'power2.out' }
      )
    } else {
      if (backdrop) gsap.to(backdrop, { opacity: 0, duration: 0.25 })
      gsap.to(panel, { x: '100%', duration: 0.3, ease: 'power2.in' })
    }
  }, [mobileOpen])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          background: scrolled || mobileOpen ? 'rgb(var(--surface))' : 'transparent',
          borderColor: scrolled || mobileOpen ? 'rgb(var(--line))' : 'transparent',
          transition: 'background 500ms var(--ease-luxury), border-color 500ms var(--ease-luxury)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-pine to-moss flex items-center justify-center text-on-accent font-bold text-sm">
              UV
            </div>
            <span className="text-sm font-semibold tracking-wide uppercase">Uttarshall Valley</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `nav-link text-xs font-semibold uppercase tracking-wide transition-colors ${
                    isActive ? 'text-pine active' : 'text-soft hover:text-pine'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <button onClick={logout} className="btn-secondary px-5 py-2 text-xs font-semibold uppercase tracking-wide rounded">
                Sign Out
              </button>
            ) : (
              <button onClick={onLoginClick} className="btn-secondary px-5 py-2 text-xs font-semibold uppercase tracking-wide rounded">
                Sign In
              </button>
            )}
            <Link to="/packages" className="btn-primary px-5 py-2 text-xs rounded">
              Book Now
            </Link>
          </div>

          <button
            className="md:hidden text-ink w-10 h-10 flex items-center justify-center rounded hover:text-pine transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="text-xl">{mobileOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {/* Backdrop — dims and closes menu on tap */}
      <div
        ref={backdropRef}
        className="md:hidden fixed inset-0 top-16 z-40 pointer-events-none"
        style={{
          background: 'rgb(0 0 0 / 0.45)',
          opacity: 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
        }}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu panel */}
      <div
        ref={mobileMenuRef}
        className="md:hidden fixed top-16 right-0 bottom-0 w-[85vw] max-w-[300px] z-50 border-l overflow-y-auto"
        style={{
          transform: 'translateX(100%)',
          background: 'rgb(var(--surface))',
          borderColor: 'rgb(var(--line))',
          boxShadow: '-8px 0 32px rgb(0 0 0 / 0.18)',
        }}
      >
        {/* Panel header */}
        <div className="px-6 pt-8 pb-4 border-b" style={{ borderColor: 'rgb(var(--line))' }}>
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: 'rgb(var(--pine) / 0.6)' }}>
            31.58°N · 77.13°E
          </p>
          <p className="text-xs font-semibold uppercase tracking-widest mt-1" style={{ color: 'rgb(var(--soft))' }}>
            Mandi · Himachal Pradesh
          </p>
        </div>

        {/* Nav links */}
        <div className="px-6 py-6 flex flex-col gap-1">
          {LINKS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `mobile-link flex items-center gap-4 px-3 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'text-pine bg-pine/8'
                    : 'text-ink hover:text-pine hover:bg-pine/5'
                }`
              }
            >
              <span className="text-base w-6 text-center">{icon}</span>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Divider + auth */}
        <div className="px-6 pb-8">
          <div className="divider mb-6" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-soft uppercase tracking-widest">Theme</span>
            <ThemeToggle />
          </div>
          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <button onClick={logout} className="btn-secondary px-5 py-3 text-sm font-semibold rounded w-full">Sign Out</button>
            ) : (
              <button onClick={() => { onLoginClick(); setMobileOpen(false) }}
                className="btn-secondary px-5 py-3 text-sm font-semibold rounded w-full">Sign In</button>
            )}
            <Link to="/packages" className="btn-primary px-5 py-3 text-sm text-center rounded w-full block">
              Book Now
            </Link>
          </div>

          {/* Elevation stamp */}
          <div className="mt-8 font-mono text-[9px] text-center" style={{ color: 'rgb(var(--soft) / 0.35)' }}>
            Uttarshall Valley · Peak 4,200m
          </div>
        </div>
      </div>
    </>
  )
}
