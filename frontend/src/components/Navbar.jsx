import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAuthStore from '../store/auth'
import ThemeToggle from './ThemeToggle'

export default function Navbar({ onLoginClick }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, logout } = useAuthStore()

  const links = [
    { to: '/', label: 'Overview' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/explore', label: 'Explore' },
    { to: '/packages', label: 'Packages' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-canvas/90 backdrop-blur-xl border-b border-line">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-pine to-moss flex items-center justify-center text-on-accent font-bold text-sm">
            UV
          </div>
          <span className="text-sm font-semibold tracking-wide uppercase">Uttarshall Valley</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link text-xs font-semibold uppercase tracking-wide transition-colors ${
                location.pathname === to ? 'text-pine active' : 'text-soft hover:text-pine'
              }`}
            >
              {label}
            </Link>
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

        <button className="md:hidden text-2xl" onClick={() => setMobileOpen(!mobileOpen)}>
          ☰
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-line">
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map(({ to, label }) => (
              <Link key={to} to={to} className="text-sm font-medium text-soft hover:text-pine transition-colors"
                onClick={() => setMobileOpen(false)}>
                {label}
              </Link>
            ))}
            <div className="divider my-2" />
            <ThemeToggle />
            {isAuthenticated ? (
              <button onClick={logout} className="btn-secondary px-5 py-3 text-sm font-semibold rounded">Sign Out</button>
            ) : (
              <button onClick={() => { onLoginClick(); setMobileOpen(false) }} className="btn-secondary px-5 py-3 text-sm font-semibold rounded">Sign In</button>
            )}
            <Link to="/packages" className="btn-primary px-5 py-3 text-sm text-center rounded" onClick={() => setMobileOpen(false)}>
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
