import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', subject: 'General Inquiry', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="pt-16 min-h-screen bg-panel">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-sky rounded-full" />
              <span className="text-xs font-mono font-medium tracking-widest uppercase text-sky">Contact</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6">Get in Touch</h1>
            <p className="text-sub mb-8 leading-relaxed">
              Have questions about visiting Uttarshall Valley? Our team in Mandi is ready to help you plan your perfect Himalayan adventure.
            </p>

            <div className="space-y-6">
              {[
                { icon: '📍', title: 'Visitor Center', info: 'Valley Road, Mandi\nHimachal Pradesh — 175001' },
                { icon: '📞', title: 'Phone', info: '+91 1905 123 456\nMon–Sun: 8:00 AM – 8:00 PM' },
                { icon: '✉️', title: 'Email', info: 'info@uttarshallvalley.in\nbookings@uttarshallvalley.in' },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-void border border-[rgba(56,189,248,0.15)] flex items-center justify-center text-xl">
                    {c.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{c.title}</h4>
                    <p className="text-sm text-sub whitespace-pre-line">{c.info}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h4 className="text-xs text-sub uppercase tracking-wide mb-4">Follow Us</h4>
              <div className="flex gap-3">
                {['Instagram', 'Facebook', 'Twitter', 'YouTube'].map(social => (
                  <a key={social} href="#"
                    className="w-10 h-10 rounded border border-[rgba(56,189,248,0.15)] flex items-center justify-center text-sub hover:text-sky hover:border-sky transition-all text-xs">
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={submit} className="border border-[rgba(56,189,248,0.15)] rounded-xl p-6 md:p-8 bg-void/50">
              <h3 className="text-xl font-semibold mb-6">Send us a Message</h3>
              {submitted ? (
                <div className="text-center py-8">
                  <p className="text-4xl mb-4">✅</p>
                  <h4 className="text-xl font-semibold mb-2">Message Sent!</h4>
                  <p className="text-sub">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-sub uppercase tracking-wide mb-2 block">First Name</label>
                      <input type="text" required value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})}
                        className="w-full bg-panel border border-[rgba(56,189,248,0.15)] rounded px-4 py-3 text-sm focus:border-sky focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-sub uppercase tracking-wide mb-2 block">Last Name</label>
                      <input type="text" required value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})}
                        className="w-full bg-panel border border-[rgba(56,189,248,0.15)] rounded px-4 py-3 text-sm focus:border-sky focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-sub uppercase tracking-wide mb-2 block">Email</label>
                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full bg-panel border border-[rgba(56,189,248,0.15)] rounded px-4 py-3 text-sm focus:border-sky focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-sub uppercase tracking-wide mb-2 block">Subject</label>
                    <select value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                      className="w-full bg-panel border border-[rgba(56,189,248,0.15)] rounded px-4 py-3 text-sm focus:border-sky focus:outline-none appearance-none">
                      <option>General Inquiry</option>
                      <option>Booking Question</option>
                      <option>Photo Submission</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-sub uppercase tracking-wide mb-2 block">Message</label>
                    <textarea rows="5" required value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                      className="w-full bg-panel border border-[rgba(56,189,248,0.15)] rounded px-4 py-3 text-sm focus:border-sky focus:outline-none resize-none" />
                  </div>
                  <button type="submit" className="btn-primary w-full py-4 text-sm rounded">Send Message</button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
