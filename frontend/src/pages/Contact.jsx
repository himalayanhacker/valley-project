import { useState } from 'react'
import Reveal from '../components/Reveal'

const CONTACT_INFO = [
  { icon: '📍', title: 'Visitor Center', info: 'Valley Road, Mandi\nHimachal Pradesh — 175001', delay: 0 },
  { icon: '📞', title: 'Phone',          info: '+91 1905 123 456\nMon–Sun: 8:00 AM – 8:00 PM', delay: 80 },
  { icon: '✉️', title: 'Email',          info: 'info@uttarshallvalley.in\nbookings@uttarshallvalley.in', delay: 160 },
]

const SOCIALS = ['Instagram', 'Facebook', 'Twitter', 'YouTube']

export default function Contact() {
  const [form, setForm]           = useState({ first_name: '', last_name: '', email: '', subject: 'General Inquiry', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="pt-16 min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-20">

          {/* Left column — editorial */}
          <Reveal direction="right">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-pine rounded-full" />
              <span className="text-xs font-medium tracking-widest uppercase text-pine">Contact</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-tight">
              Let's Plan Your Journey
            </h1>
            <p className="text-soft mb-4 leading-relaxed italic font-display text-lg" style={{ color: 'rgb(var(--pine) / 0.8)' }}>
              "The mountains are calling and I must go."
            </p>
            <p className="text-soft mb-10 leading-relaxed text-sm">
              Our team in Mandi is ready to help you plan your perfect Himalayan experience —
              from trail selection to accommodation in the heart of Uttarshall Valley.
            </p>

            <div className="space-y-6">
              {CONTACT_INFO.map((c) => (
                <Reveal key={c.title} delay={c.delay} direction="right">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-canvas border border-line flex items-center justify-center text-xl flex-shrink-0">
                      {c.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{c.title}</h4>
                      <p className="text-sm text-soft whitespace-pre-line">{c.info}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-10">
              <h4 className="text-xs text-soft uppercase tracking-widest mb-4">Follow the Valley</h4>
              <div className="flex gap-3">
                {SOCIALS.map(social => (
                  <button
                    key={social}
                    type="button"
                    aria-label={social}
                    className="w-10 h-10 rounded border border-line flex items-center justify-center text-soft hover:text-pine hover:border-pine transition-all text-xs"
                  >
                    {social[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-12 font-mono text-xs" style={{ color: 'rgb(var(--soft) / 0.35)' }}>
              31.71°N · 76.92°E · Mandi, Himachal Pradesh
            </div>
          </Reveal>

          {/* Right column — form */}
          <Reveal direction="left" delay={200}>
            <form onSubmit={submit} className="border border-line rounded-2xl p-6 md:p-8 bg-canvas/50">
              <h3 className="text-xl font-semibold mb-6">Send us a Message</h3>
              {submitted ? (
                <div className="text-center py-10">
                  <p className="text-4xl mb-4">✅</p>
                  <h4 className="text-xl font-semibold mb-2">Message Sent!</h4>
                  <p className="text-soft">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="form-field">
                      <label htmlFor="first-name" className="text-xs text-soft uppercase tracking-wide mb-2 block">First Name</label>
                      <input
                        id="first-name" type="text" required value={form.first_name}
                        onChange={e => setForm({ ...form, first_name: e.target.value })}
                        className="w-full bg-surface border-0 border-b border-line-strong px-0 py-2 text-sm focus:outline-none focus:border-pine transition-colors rounded-none"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="last-name" className="text-xs text-soft uppercase tracking-wide mb-2 block">Last Name</label>
                      <input
                        id="last-name" type="text" required value={form.last_name}
                        onChange={e => setForm({ ...form, last_name: e.target.value })}
                        className="w-full bg-surface border-0 border-b border-line-strong px-0 py-2 text-sm focus:outline-none focus:border-pine transition-colors rounded-none"
                      />
                    </div>
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-email" className="text-xs text-soft uppercase tracking-wide mb-2 block">Email</label>
                    <input
                      id="contact-email" type="email" required value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-surface border-0 border-b border-line-strong px-0 py-2 text-sm focus:outline-none focus:border-pine transition-colors rounded-none"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-subject" className="text-xs text-soft uppercase tracking-wide mb-2 block">Subject</label>
                    <select
                      id="contact-subject" value={form.subject}
                      onChange={e => setForm({ ...form, subject: e.target.value })}
                      className="w-full bg-surface border-0 border-b border-line-strong px-0 py-2 text-sm focus:outline-none appearance-none rounded-none"
                    >
                      <option>General Inquiry</option>
                      <option>Booking Question</option>
                      <option>Photo Submission</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="contact-message" className="text-xs text-soft uppercase tracking-wide mb-2 block">Message</label>
                    <textarea
                      id="contact-message" rows="5" required value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-surface border-0 border-b border-line-strong px-0 py-2 text-sm focus:outline-none resize-none rounded-none"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full py-4 text-sm rounded-lg mt-2">
                    Send Message
                  </button>
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
