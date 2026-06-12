import { useEffect, useState } from 'react'
import client from '../api/client'
import useAuthStore from '../store/auth'

const CATEGORIES = ['all', 'landscapes', 'wildlife', 'activities', 'seasons']

export default function Gallery({ onLoginClick }) {
  const [photos, setPhotos] = useState([])
  const [category, setCategory] = useState('all')
  const [lightbox, setLightbox] = useState(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()

  const fetchPhotos = (cat) => {
    const params = cat !== 'all' ? `?category=${cat}` : ''
    client.get(`/gallery/${params}`).then(r => {
      const data = r.data.results || r.data
      setPhotos(data)
    })
  }

  useEffect(() => { fetchPhotos(category) }, [category])

  const lightboxIdx = lightbox !== null ? lightbox : -1
  const prev = () => setLightbox((lightboxIdx - 1 + photos.length) % photos.length)
  const next = () => setLightbox((lightboxIdx + 1) % photos.length)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="pt-16 min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-pine rounded-full" />
              <span className="text-xs font-medium tracking-widest uppercase text-pine">Gallery</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">Visitor Photo Gallery</h1>
            <p className="text-soft max-w-xl">Stunning moments from Uttarshall Valley captured by our visitors.</p>
          </div>
          <button onClick={() => isAuthenticated ? setUploadOpen(true) : onLoginClick()}
            className="btn-primary px-6 py-3 text-xs rounded flex items-center gap-2 self-start">
            📷 Upload Your Photos
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide border rounded transition-all ${
                category === cat ? 'border-pine text-pine' : 'border-line text-soft hover:border-pine hover:text-pine'
              }`}>
              {cat === 'all' ? 'All Photos' : cat}
            </button>
          ))}
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-24 text-soft">
            <p className="text-4xl mb-4">📸</p>
            <p>No photos yet. Be the first to share your Uttarshall Valley moments!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {photos.map((photo, i) => (
              <div key={photo.id} onClick={() => setLightbox(i)}
                className={`relative overflow-hidden rounded-lg cursor-pointer group ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                style={{ height: i === 0 ? '420px' : '200px' }}>
                <img src={photo.image} alt={photo.caption}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(to top, rgba(1,4,9,0.9), transparent)' }}>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-xs text-pine uppercase tracking-wide mb-1">{photo.location}</p>
                    <p className="text-sm">{photo.caption}</p>
                    <p className="text-xs text-soft mt-1">by {photo.author_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && photos[lightbox] && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center"
          onClick={() => setLightbox(null)}>
          <button onClick={e => { e.stopPropagation(); prev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-pine z-10">‹</button>
          <img src={photos[lightbox].image} alt={photos[lightbox].caption}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={e => e.stopPropagation()} />
          <button onClick={e => { e.stopPropagation(); next() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-pine z-10">›</button>
          <button onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white text-3xl hover:text-pine z-10">✕</button>
        </div>
      )}

      {/* Upload Modal */}
      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} onSuccess={() => { setUploadOpen(false); fetchPhotos(category) }} />}
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
      <div className="bg-surface border border-line rounded-xl p-8 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-soft hover:text-white text-xl">✕</button>
        <h3 className="text-2xl font-semibold mb-2">Upload Your Photo</h3>
        <p className="text-soft text-sm mb-6">Photos are reviewed before appearing in the gallery.</p>
        {error && <p className="text-red-400 text-sm mb-4 p-3 bg-red-400/10 rounded">{error}</p>}
        <form onSubmit={submit} className="space-y-4">
          <div className="border-2 border-dashed border-line-strong rounded-lg p-8 text-center hover:border-pine transition-colors cursor-pointer"
            onClick={() => document.getElementById('photo-file').click()}>
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
            <input type="text" required value={form.caption} onChange={e => setForm({...form, caption: e.target.value})}
              placeholder="Describe your photo..."
              className="w-full bg-canvas border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-soft uppercase tracking-wide mb-2 block">Location</label>
            <input type="text" required value={form.location} onChange={e => setForm({...form, location: e.target.value})}
              placeholder="e.g. Prashar Lake, Barot Valley"
              className="w-full bg-canvas border border-line rounded px-4 py-3 text-sm focus:border-pine focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-soft uppercase tracking-wide mb-2 block">Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
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
