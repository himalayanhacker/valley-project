import { useEffect, useState } from 'react'
import client from '../api/client'
import { getPackageImage } from '../api/images'

export default function Packages() {
  const [packages, setPackages] = useState([])
  const [form, setForm] = useState({ package: '', check_in: '', check_out: '', adults: 2, children: 0, email: '', special_requests: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

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
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-pine rounded-full" />
            <span className="text-xs font-medium tracking-widest uppercase text-pine">Packages</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">Travel Packages</h1>
          <p className="text-soft max-w-xl">Curated Himalayan experiences in Mandi district. All prices in INR per person.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {packages.map((pkg, i) => (
            <div key={pkg.id} className={`border ${pkg.featured ? 'border-pine' : 'border-line'} rounded-xl overflow-hidden card-hover relative`}>
              {pkg.featured && <div className="absolute top-4 right-4 bg-pine text-on-accent text-xs font-semibold px-3 py-1 rounded z-10">Most Popular</div>}
              <div className="aspect-video overflow-hidden">
                <img src={getPackageImage(i)} alt={pkg.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{pkg.name}</h3>
                <p className="text-sm text-soft mb-4">{pkg.duration_days} Days / {pkg.duration_days - 1} Nights · {pkg.accommodation}</p>
                <ul className="space-y-2 mb-6">
                  {pkg.highlights?.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-soft">
                      <span className="text-pine">✓</span> {h}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-4 border-t border-line">
                  <div>
                    <span className="text-2xl font-semibold text-pine">₹{Number(pkg.price).toLocaleString('en-IN')}</span>
                    <span className="text-xs text-soft"> / person</span>
                  </div>
                  <button onClick={() => setForm(f => ({ ...f, package: pkg.id }))}
                    className="btn-primary px-6 py-2 text-xs rounded">Select</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Form */}
        <div className="border border-line rounded-xl p-6 md:p-10 bg-canvas/50 max-w-2xl mx-auto">
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
                <select id="pkg-select" required value={form.package} onChange={e => setForm({...form, package: e.target.value})}
                  className="w-full bg-surface border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none appearance-none">
                  <option value="">Select a package</option>
                  {packages.map(p => <option key={p.id} value={p.id}>{p.name} — ₹{Number(p.price).toLocaleString('en-IN')}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="check-in" className="text-xs text-soft uppercase tracking-wide mb-2 block">Check-in</label>
                  <input id="check-in" type="date" required value={form.check_in} onChange={e => setForm({...form, check_in: e.target.value})}
                    className="w-full bg-surface border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none" />
                </div>
                <div>
                  <label htmlFor="check-out" className="text-xs text-soft uppercase tracking-wide mb-2 block">Check-out</label>
                  <input id="check-out" type="date" required value={form.check_out} onChange={e => setForm({...form, check_out: e.target.value})}
                    className="w-full bg-surface border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="adults" className="text-xs text-soft uppercase tracking-wide mb-2 block">Adults</label>
                  <select id="adults" value={form.adults} onChange={e => setForm({...form, adults: Number(e.target.value)})}
                    className="w-full bg-surface border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none appearance-none">
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="children" className="text-xs text-soft uppercase tracking-wide mb-2 block">Children</label>
                  <select id="children" value={form.children} onChange={e => setForm({...form, children: Number(e.target.value)})}
                    className="w-full bg-surface border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none appearance-none">
                    {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="email" className="text-xs text-soft uppercase tracking-wide mb-2 block">Email</label>
                <input id="email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="your@email.com"
                  className="w-full bg-surface border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none" />
              </div>
              <div>
                <label htmlFor="special-requests" className="text-xs text-soft uppercase tracking-wide mb-2 block">Special Requests</label>
                <textarea id="special-requests" rows="3" value={form.special_requests} onChange={e => setForm({...form, special_requests: e.target.value})}
                  placeholder="Dietary requirements, mobility needs..."
                  className="w-full bg-surface border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none resize-none" />
              </div>
              <button type="submit" className="btn-primary w-full py-4 text-sm rounded">
                Check Availability & Book
              </button>
            </form>
          )}
        </div>

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
      </div>
    </div>
  )
}
