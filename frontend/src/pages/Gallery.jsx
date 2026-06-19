import { useEffect, useRef, useState, useCallback } from 'react'
import client from '../api/client'
import useAuthStore from '../store/auth'

const CATEGORIES = ['all', 'landscapes', 'wildlife', 'activities', 'seasons']

// Per-photo editorial metadata
const EDITORIAL = [
  { altitude: '2,730m', coord: '31.78°N · 76.97°E', caption: 'The sacred Prashar Lake reflects the Dhauladhar peaks at dawn — a mirror of ice and sky above the Mandi valley.' },
  { altitude: '1,600m', coord: '32.10°N · 76.92°E', caption: 'The Uhl river carves through deodar cedar forests in Barot, one of the valley\'s most pristine hidden corridors.' },
  { altitude: '4,200m', coord: '31.58°N · 77.13°E', caption: 'Shikari Devi summit at golden hour — the highest accessible peak in the sanctuary, home to the Himalayan brown bear.' },
  { altitude: '826m',   coord: '31.71°N · 76.92°E', caption: 'The ancient Panchvaktra temple, dedicated to Lord Shiva\'s five-faced form, stands guard over Mandi town.' },
  { altitude: '2,100m', coord: '31.75°N · 76.98°E', caption: 'A rhododendron canopy frames a distant ridgeline in the cedar forests above Barot — spring ablaze in crimson.' },
  { altitude: '3,100m', coord: '31.65°N · 77.08°E', caption: 'Nomadic Gaddi shepherds move their flocks through high alpine meadows as monsoon retreats south.' },
]

function getEditorial(index) {
  return EDITORIAL[index % EDITORIAL.length]
}

function GallerySection({ photo, index, totalCount, onOpen }) {
  const sectionRef  = useRef(null)
  const imgRef      = useRef(null)
  const editorial   = getEditorial(index)

  // Parallax on image
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = imgRef.current
    const section = sectionRef.current
    if (!el || !section) return
    const handler = () => {
      const rect = section.getBoundingClientRect()
      const progress = (window.innerHeight / 2 - rect.top - rect.height / 2) / (window.innerHeight / 2)
      el.style.transform = `translateY(${progress * 40}px)`
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Clip-wipe + sidebar reveal via IntersectionObserver
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add('in-view')
        observer.disconnect()
      }
    }, { threshold: 0.25 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const isEven = index % 2 === 0

  return (
    <div
      ref={sectionRef}
      className="gallery-section relative flex flex-col md:flex-row items-stretch"
      style={{ minHeight: '90vh' }}
    >
      {/* Photo — clip-wipe reveal */}
      <div
        className={`relative overflow-hidden flex-1 ${isEven ? 'md:order-1' : 'md:order-2'}`}
        style={{
          clipPath: 'inset(0 100% 0 0)',
          transition: 'clip-path var(--dur-cinematic) var(--ease-luxury)',
        }}
        ref={el => {
          if (el) {
            const section = sectionRef.current
            if (!section) return
            const mo = new MutationObserver(() => {
              if (section.classList.contains('in-view')) {
                el.style.clipPath = 'inset(0 0% 0 0)'
                mo.disconnect()
              }
            })
            mo.observe(section, { attributes: true, attributeFilter: ['class'] })
          }
        }}
      >
        <div className="absolute inset-0 overflow-hidden" style={{ height: '120%', top: '-10%' }}>
          <img
            ref={imgRef}
            src={photo.image}
            alt={photo.caption || photo.location}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => onOpen(index)}
            style={{ willChange: 'transform' }}
          />
        </div>
        {/* Topo ring overlay on hover */}
        <div className="photo-topo absolute inset-0 cursor-pointer" onClick={() => onOpen(index)} />
        {/* Counter */}
        <div className="absolute top-6 left-6 font-mono text-[11px] text-white/50 tracking-widest">
          {String(index + 1).padStart(2, '0')} / {String(totalCount).padStart(2, '0')}
        </div>
      </div>

      {/* Editorial sidebar */}
      <div
        className={`flex flex-col justify-center px-6 py-10 md:px-10 md:py-16 md:w-[38%] ${isEven ? 'md:order-2' : 'md:order-1'}`}
        style={{ background: 'rgb(var(--surface))' }}
      >
        <div className="gallery-sidebar-item">
          <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: 'rgb(var(--pine))' }}>
            {photo.location || 'Uttarshall Valley'}
          </p>
        </div>
        <div className="gallery-sidebar-item">
          <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-ink mb-4 leading-tight">
            {photo.caption || `Frame ${index + 1}`}
          </h2>
        </div>
        <div className="gallery-sidebar-item">
          <p className="text-sm text-soft leading-relaxed mb-6">{editorial.caption}</p>
        </div>
        <div className="gallery-sidebar-item flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-soft/50">▲</span>
            <span className="font-mono text-sm font-semibold" style={{ color: 'rgb(var(--pine))' }}>{editorial.altitude}</span>
          </div>
          <div className="font-mono text-[10px] tracking-widest" style={{ color: 'rgb(var(--soft) / 0.4)' }}>
            {editorial.coord}
          </div>
          <div className="mt-1">
            <span className="category-tag">{photo.category || 'landscapes'}</span>
          </div>
          <button
            onClick={() => onOpen(index)}
            className="mt-4 self-start text-xs font-semibold uppercase tracking-widest text-pine hover:text-moss transition-colors flex items-center gap-2"
          >
            View full screen <span>↗</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  const editorial = getEditorial(index)

  useEffect(() => {
    const handler = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext])

  // Touch swipe
  const touchStart = useRef(null)
  const handleTouchStart = e => { touchStart.current = e.touches[0].clientX }
  const handleTouchEnd   = e => {
    if (touchStart.current === null) return
    const dx = e.changedTouches[0].clientX - touchStart.current
    if (dx > 50) onPrev()
    else if (dx < -50) onNext()
    touchStart.current = null
  }

  const photo = photos[index]
  if (!photo) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        background: 'rgb(var(--ink) / 0.94)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeInLightbox 350ms ease forwards',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <style>{`@keyframes fadeInLightbox { from { opacity: 0 } to { opacity: 1 } }`}</style>

      <button onClick={e => { e.stopPropagation(); onPrev() }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl z-10 transition-colors">‹</button>

      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 max-w-6xl w-full px-4 md:px-16">
        <img
          src={photo.image}
          alt={photo.caption}
          className="w-full md:max-w-[65vw] max-h-[60vh] md:max-h-[80vh] object-contain rounded-lg flex-1"
        />
        <div className="w-full md:w-64 flex-shrink-0 text-white">
          <p className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: 'rgb(var(--pine))' }}>
            {photo.location}
          </p>
          <h3 className="font-display text-2xl font-semibold mb-3">{photo.caption}</h3>
          <p className="text-sm text-white/60 leading-relaxed mb-4">{editorial.caption}</p>
          <div className="font-mono text-xs text-white/30">{editorial.altitude} · {editorial.coord}</div>
          <div className="font-mono text-xs text-white/30 mt-1">by {photo.author_name}</div>
        </div>
      </div>

      <button onClick={e => { e.stopPropagation(); onNext() }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-4xl z-10 transition-colors">›</button>
      <button onClick={onClose}
        className="absolute top-5 right-5 text-white/60 hover:text-white text-2xl z-10 transition-colors">✕</button>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-xs text-white/30">
        {index + 1} / {photos.length} · Use ← → to navigate
      </div>
    </div>
  )
}

function UploadModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ caption: '', location: '', category: 'landscapes' })
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!file) { setError('Please select a photo.'); return }
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('caption', form.caption)
      fd.append('location', form.location)
      fd.append('category', form.category)
      await client.post('/gallery/', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      onSuccess()
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4">
      <div className="bg-surface border border-line rounded-xl p-4 md:p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-soft hover:text-ink text-xl">✕</button>
        <h3 className="text-2xl font-semibold mb-2">Upload Your Photo</h3>
        <p className="text-soft text-sm mb-6">Photos are reviewed before appearing in the gallery.</p>
        {error && <p className="text-red-400 text-sm mb-4 p-3 bg-red-400/10 rounded">{error}</p>}
        <form onSubmit={submit} className="space-y-4">
          <div
            className="border-2 border-dashed border-line-strong rounded-lg p-5 md:p-8 text-center hover:border-pine transition-colors cursor-pointer"
            onClick={() => document.getElementById('photo-file').click()}
          >
            {file ? <p className="text-sm text-pine">{file.name}</p> : (
              <>
                <p className="text-4xl mb-2">📤</p>
                <p className="text-sm text-soft">Click to browse your photo</p>
                <p className="text-xs text-soft mt-2">JPG, PNG up to 10MB</p>
              </>
            )}
            <input id="photo-file" type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
          </div>
          <div>
            <label className="text-xs text-soft uppercase tracking-wide mb-2 block">Caption</label>
            <input type="text" required value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })}
              placeholder="Describe your photo..."
              className="w-full bg-canvas border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-soft uppercase tracking-wide mb-2 block">Location</label>
            <input type="text" required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Prashar Lake, Barot Valley"
              className="w-full bg-canvas border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-soft uppercase tracking-wide mb-2 block">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full bg-canvas border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none appearance-none">
              <option value="landscapes">Landscapes</option>
              <option value="wildlife">Wildlife</option>
              <option value="activities">Activities</option>
              <option value="seasons">Seasons</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm rounded disabled:opacity-50">
            {loading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Gallery({ onLoginClick }) {
  const [photos, setPhotos]       = useState([])
  const [category, setCategory]   = useState('all')
  const [lightbox, setLightbox]   = useState(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const { isAuthenticated }        = useAuthStore()

  const fetchPhotos = useCallback((cat) => {
    const params = cat !== 'all' ? `?category=${cat}` : ''
    client.get(`/gallery/${params}`).then(r => {
      setPhotos(r.data.results || r.data)
    })
  }, [])

  useEffect(() => { fetchPhotos(category) }, [category, fetchPhotos])

  const prev = () => setLightbox(i => (i - 1 + photos.length) % photos.length)
  const next = () => setLightbox(i => (i + 1) % photos.length)

  return (
    <div className="pt-16 min-h-screen bg-surface">
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-pine rounded-full" />
            <span className="text-xs font-medium tracking-widest uppercase text-pine">Gallery</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight">
            Valley Through the Lens
          </h1>
          <p className="text-soft mt-3 max-w-xl">
            Uttarshall Valley through the eyes of those who wandered its trails.
          </p>
        </div>
        <button
          onClick={() => isAuthenticated ? setUploadOpen(true) : onLoginClick()}
          className="btn-primary px-6 py-3 text-xs rounded flex items-center gap-2 self-start"
        >
          📷 Share Your Photo
        </button>
      </div>

      {/* Filter bar */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 text-xs font-semibold uppercase tracking-widest border rounded-full transition-all ${
                category === cat
                  ? 'border-pine text-pine bg-pine/5'
                  : 'border-line text-soft hover:border-pine hover:text-pine'
              }`}
            >
              {cat === 'all' ? 'All Photos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cinematic full-width sections */}
      {photos.length === 0 ? (
        <div className="text-center py-32 text-soft">
          <p className="text-4xl mb-4">📸</p>
          <p>No photos yet. Be the first to share your Uttarshall Valley moments!</p>
        </div>
      ) : (
        <div className="border-t border-line">
          {photos.map((photo, i) => (
            <div key={photo.id} className="border-b border-line">
              <GallerySection
                photo={photo}
                index={i}
                totalCount={photos.length}
                onOpen={setLightbox}
              />
            </div>
          ))}
        </div>
      )}

      {lightbox !== null && (
        <Lightbox
          photos={photos}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onPrev={prev}
          onNext={next}
        />
      )}

      {uploadOpen && (
        <UploadModal
          onClose={() => setUploadOpen(false)}
          onSuccess={() => { setUploadOpen(false); fetchPhotos(category) }}
        />
      )}
    </div>
  )
}
