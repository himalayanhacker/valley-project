import { useState } from 'react'
import useAuthStore from '../store/auth'

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', email: '', password: '', first_name: '', last_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuthStore()

  if (!isOpen) return null

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(form.username, form.password)
      } else {
        await register(form)
        await login(form.username, form.password)
      }
      onClose()
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
      <div className="bg-panel border border-[rgba(56,189,248,0.15)] rounded-xl p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-sub hover:text-white transition-colors text-xl">✕</button>

        <h3 className="text-2xl font-semibold mb-2">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h3>
        <p className="text-sub text-sm mb-6">
          {mode === 'login' ? 'Sign in to manage bookings and upload photos' : 'Join our community of Himalayan adventurers'}
        </p>

        {error && <p className="text-red-400 text-sm mb-4 p-3 bg-red-400/10 rounded">{error}</p>}

        <form onSubmit={handle} className="space-y-4">
          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-sub uppercase tracking-wide mb-2 block">First Name</label>
                <input type="text" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})}
                  className="w-full bg-void border border-[rgba(56,189,248,0.15)] rounded px-4 py-3 text-sm focus:border-sky focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-sub uppercase tracking-wide mb-2 block">Last Name</label>
                <input type="text" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})}
                  className="w-full bg-void border border-[rgba(56,189,248,0.15)] rounded px-4 py-3 text-sm focus:border-sky focus:outline-none" />
              </div>
            </div>
          )}
          {mode === 'register' && (
            <div>
              <label className="text-xs text-sub uppercase tracking-wide mb-2 block">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-void border border-[rgba(56,189,248,0.15)] rounded px-4 py-3 text-sm focus:border-sky focus:outline-none" />
            </div>
          )}
          <div>
            <label className="text-xs text-sub uppercase tracking-wide mb-2 block">Username</label>
            <input type="text" required value={form.username} onChange={e => setForm({...form, username: e.target.value})}
              className="w-full bg-void border border-[rgba(56,189,248,0.15)] rounded px-4 py-3 text-sm focus:border-sky focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-sub uppercase tracking-wide mb-2 block">Password</label>
            <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})}
              className="w-full bg-void border border-[rgba(56,189,248,0.15)] rounded px-4 py-3 text-sm focus:border-sky focus:outline-none" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm rounded disabled:opacity-50">
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
          <p className="text-center text-sm text-sub">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-sky hover:underline">
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
