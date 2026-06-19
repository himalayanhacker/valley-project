import { useEffect, useState } from 'react'
import client from '../api/client'
import { getPackageImage } from '../api/images'
import Reveal from '../components/Reveal'

export default function Packages() {
  const [packages, setPackages]   = useState([])
  const [form, setForm]           = useState({ package: '', check_in: '', check_out: '', adults: 2, children: 0, email: '', special_requests: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    client.get('/packages/').then(r => setPackages(r.data))
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await client.post('/bookings/', form)
      setSubmitted(true)
    } catch {
      setError('Booking failed. Please check your details and try again.')
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            <div className="w-2 h-2 bg-pine rounded-full" />
            <span className="text-xs font-medium tracking-widest uppercase text-pine">Packages</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight mb-3">
            Curated Journeys
          </h1>
          <p className="text-soft max-w-xl mb-2">
            Crafted for those who travel with intention — into the heart of Uttarshall Valley.
          </p>
          {/* Divider draw */}
          <div
            className="mt-6 h-px bg-gradient-to-r from-pine to-sun"
            style={{
              width: 0,
              transition: 'width 1200ms var(--ease-luxury)',
            }}
            ref={el => {
              if (!el) return
              const mo = new MutationObserver(() => {
                const parent = el.closest('.reveal-wrapper') || el.parentElement?.parentElement
                if (parent && getComputedStyle(parent).opacity === '1') {
                  el.style.width = '80px'
                  mo.disconnect()
                }
              })
              setTimeout(() => { el.style.width = '80px' }, 800)
            }}
          />
        </Reveal>

        {/* Package cards — curtain reveal */}
        <div className="grid md:grid-cols-3 gap-6 mt-14 mb-20">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={i * 120}>
              <div
                className="pkg-card relative overflow-hidden rounded-2xl group"
                style={{ aspectRatio: '3/4' }}
              >
                {/* Base: full-bleed photo */}
                <img
                  src={getPackageImage(i)}
                  alt={pkg.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Default label at bottom */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-5"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }}
                >
                  <p className="text-white text-sm font-semibold tracking-wide">{pkg.name}</p>
                  <p className="text-white/50 text-xs font-mono mt-1">{pkg.duration_days}D · ₹{Number(pkg.price).toLocaleString('en-IN')}</p>
                </div>

                {/* Curtain overlay — slides up on hover */}
                <div
                  className="pkg-card-overlay absolute inset-0 flex flex-col justify-end p-6"
                  style={{ background: 'linear-gradient(to top, rgb(var(--pine) / 0.93) 0%, rgb(var(--pine) / 0.78) 100%)' }}
                >
                  {pkg.featured && (
                    <div className="absolute top-4 right-4 bg-white/20 text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
                      Most Popular
                    </div>
                  )}
                  {/* Package name */}
                  <h3
                    className="font-display text-2xl font-semibold text-white mb-1"
                    style={{ transition: 'opacity 300ms ease, transform 300ms ease' }}
                  >
                    {pkg.name}
                  </h3>
                  {/* Price */}
                  <p
                    className="text-white/90 text-xl font-semibold mb-3"
                    style={{ transitionDelay: '80ms', transition: 'opacity 300ms ease' }}
                  >
                    ₹{Number(pkg.price).toLocaleString('en-IN')} <span className="text-sm font-normal text-white/60">/ person</span>
                  </p>
                  {/* Highlights */}
                  <ul className="space-y-1 mb-4" style={{ transitionDelay: '160ms' }}>
                    {pkg.highlights?.slice(0, 4).map(h => (
                      <li key={h} className="flex items-center gap-2 text-white/80 text-xs">
                        <span className="text-white/50">✓</span> {h}
                      </li>
                    ))}
                  </ul>
                  {/* CTA */}
                  <button
                    className="mt-2 border border-white/50 text-white text-xs font-semibold uppercase tracking-widest px-5 py-2.5 rounded hover:bg-white hover:text-pine transition-colors self-start"
                    style={{ transitionDelay: '350ms' }}
                    onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, package: pkg.id })) }}
                  >
                    Select Package
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Booking Form */}
        <Reveal direction="up">
          <div className="border border-line rounded-2xl p-6 md:p-10 bg-canvas/50 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-6">Quick Booking</h3>
            {submitted ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-4">✅</p>
                <h4 className="text-xl font-semibold mb-2">Booking Received!</h4>
                <p className="text-soft">We'll contact you at {form.email} shortly to confirm your booking.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                {error && <p className="text-red-400 text-sm p-3 bg-red-400/10 rounded">{error}</p>}
                <div>
                  <label htmlFor="pkg-select" className="text-xs text-soft uppercase tracking-wide mb-2 block">Package</label>
                  <select id="pkg-select" required value={form.package} onChange={e => setForm({ ...form, package: e.target.value })}
                    className="w-full bg-surface border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none appearance-none">
                    <option value="">Select a package</option>
                    {packages.map(p => <option key={p.id} value={p.id}>{p.name} — ₹{Number(p.price).toLocaleString('en-IN')}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-field">
                    <label htmlFor="check-in" className="text-xs text-soft uppercase tracking-wide mb-2 block">Check-in</label>
                    <input id="check-in" type="date" required value={form.check_in} onChange={e => setForm({ ...form, check_in: e.target.value })}
                      className="w-full bg-surface border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="check-out" className="text-xs text-soft uppercase tracking-wide mb-2 block">Check-out</label>
                    <input id="check-out" type="date" required value={form.check_out} onChange={e => setForm({ ...form, check_out: e.target.value })}
                      className="w-full bg-surface border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="adults" className="text-xs text-soft uppercase tracking-wide mb-2 block">Adults</label>
                    <select id="adults" value={form.adults} onChange={e => setForm({ ...form, adults: Number(e.target.value) })}
                      className="w-full bg-surface border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none appearance-none">
                      {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="children" className="text-xs text-soft uppercase tracking-wide mb-2 block">Children</label>
                    <select id="children" value={form.children} onChange={e => setForm({ ...form, children: Number(e.target.value) })}
                      className="w-full bg-surface border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none appearance-none">
                      {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="email" className="text-xs text-soft uppercase tracking-wide mb-2 block">Email</label>
                  <input id="email" type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full bg-surface border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="special-requests" className="text-xs text-soft uppercase tracking-wide mb-2 block">Special Requests</label>
                  <textarea id="special-requests" rows="3" value={form.special_requests} onChange={e => setForm({ ...form, special_requests: e.target.value })}
                    placeholder="Dietary requirements, mobility needs..."
                    className="w-full bg-surface border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none resize-none" />
                </div>
                <button type="submit" className="btn-primary w-full py-4 text-sm rounded">
                  Check Availability & Book
                </button>
              </form>
            )}
          </div>
        </Reveal>

        <Reveal direction="up" delay={100}>
          <div className="mt-10 p-6 border border-line rounded-lg bg-canvas/30 max-w-2xl mx-auto">
            <div className="flex items-start gap-4">
              <span className="text-pine text-2xl mt-1">🛡️</span>
              <div>
                <h4 className="font-semibold mb-2">Flexible Cancellation Policy</h4>
                <p className="text-sm text-soft leading-relaxed">
                  Cancel up to 48 hours before check-in for a full refund. Cancellations within 48 hours receive 50% refund or full credit. Extreme weather? All bookings can be rescheduled at no cost.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
