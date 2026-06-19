import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import client from '../api/client'
import { IMAGES, getArticleImage } from '../api/images'
import Reveal from '../components/Reveal'
import TopoMap, { TREKS } from '../components/TopoMap'

// Hardcoded trek data for the topo section (API has articles, not trek structs)
const TREK_CARDS = [
  {
    id: 'prashar',
    name: 'Prashar Lake Circuit',
    distance: '12 km',
    duration:  '2 Days',
    difficulty: 'Moderate',
    altitude:  '2,730m',
    image: IMAGES.prasharLake,
    elevations: [1450, 1700, 1980, 2200, 2450, 2730],
    labels:     ['Baggi', 'Forest', 'Meadow', 'Ridgeline', 'Camp', 'Prashar'],
  },
  {
    id: 'shikari',
    name: 'Shikari Devi Summit',
    distance: '18 km',
    duration:  '3 Days',
    difficulty: 'Challenging',
    altitude:  '4,200m',
    image: IMAGES.himachalMountain,
    elevations: [1360, 1800, 2300, 2800, 3400, 4200],
    labels:     ['Karsog', 'Oak Forest', 'Chowki', 'Snow Line', 'Ridge', 'Summit'],
  },
  {
    id: 'barot',
    name: 'Barot Valley Walk',
    distance: '8 km',
    duration:  '1 Day',
    difficulty: 'Easy',
    altitude:  '3,300m',
    image: IMAGES.uhlRiver,
    elevations: [1600, 1750, 1900, 2100, 2600, 3300],
    labels:     ['Barot', 'Uhl River', 'Bridge', 'Deodar', 'Alpine', 'Ridge'],
  },
  {
    id: 'mandi',
    name: 'Mandi Temple Circuit',
    distance: '5 km',
    duration:  'Half Day',
    difficulty: 'Easy',
    altitude:  '860m',
    image: IMAGES.panchvaktraTemple,
    elevations: [826, 830, 835, 838, 840, 845],
    labels:     ['Old Mandi', 'Beas', 'Triloknath', 'Panchvaktra', 'Bhootnath', 'Shyamlaji'],
  },
]

const DIFF_COLOR = { Easy: 'text-green-500', Moderate: 'text-yellow-500', Challenging: 'text-orange-500' }

function Sparkline({ elevations, labels }) {
  const svgRef = useRef(null)
  const pathRef = useRef(null)

  const min = Math.min(...elevations)
  const max = Math.max(...elevations)
  const W = 200, H = 44, PAD = 4

  const points = elevations.map((e, i) => {
    const x = PAD + (i / (elevations.length - 1)) * (W - PAD * 2)
    const y = H - PAD - ((e - min) / (max - min || 1)) * (H - PAD * 2)
    return `${x},${y}`
  })

  useEffect(() => {
    const el = pathRef.current
    if (!el) return
    const len = el.getTotalLength()
    el.style.strokeDasharray  = len
    el.style.strokeDashoffset = len
    const parent = el.closest('.trek-card')
    if (!parent) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.strokeDashoffset = '0'
        observer.disconnect()
      }
    }, { threshold: 0.5 })
    observer.observe(parent)
    return () => observer.disconnect()
  }, [])

  const [tooltip, setTooltip] = useState(null)

  const circlePoints = elevations.map((e, i) => {
    const x = PAD + (i / (elevations.length - 1)) * (W - PAD * 2)
    const y = H - PAD - ((e - min) / (max - min || 1)) * (H - PAD * 2)
    return { x, y, e, label: labels[i] }
  })

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: '44px' }}
        aria-label="Elevation profile"
      >
        <polyline
          ref={pathRef}
          points={points.join(' ')}
          fill="none"
          stroke="rgb(var(--pine))"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="sparkline-path"
          style={{ transition: 'stroke-dashoffset 900ms var(--ease-luxury)' }}
        />
        {circlePoints.map((pt, i) => (
          <circle
            key={`${pt.label}-${i}`}
            cx={pt.x} cy={pt.y} r="3"
            fill="rgb(var(--pine))"
            style={{ opacity: 0.7, cursor: 'pointer' }}
            onMouseEnter={() => setTooltip({ ...pt, i })}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </svg>
      {tooltip && (
        <div
          className="absolute z-10 bg-ink text-on-accent text-[10px] font-mono px-2 py-1 rounded pointer-events-none whitespace-nowrap"
          style={{
            left: `${(tooltip.x / W) * 100}%`,
            bottom: '100%',
            transform: 'translateX(-50%)',
          }}
        >
          {tooltip.label} · {tooltip.e.toLocaleString('en-IN')}m
        </div>
      )}
    </div>
  )
}

function TrekCard({ trek, isActive, onActivate }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onActivate(trek.id)
    }, { threshold: 0.45 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [trek.id, onActivate])

  return (
    <button
      ref={cardRef}
      type="button"
      className="trek-card relative overflow-hidden rounded-2xl group cursor-pointer w-full text-left"
      style={{
        outline: isActive ? `2px solid rgb(var(--pine))` : '2px solid transparent',
        transition: 'outline 400ms ease',
        background: 'none',
        border: 'none',
        padding: 0,
      }}
      onClick={() => onActivate(trek.id)}
    >
      {/* Full-bleed photo */}
      <div className="relative overflow-hidden" style={{ height: 'clamp(180px, 40vw, 280px)' }}>
        <img
          src={trek.image}
          alt={trek.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={e => { e.target.style.display = 'none' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }}
        />
        {isActive && (
          <div className="absolute top-4 left-4 bg-pine text-on-accent text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
            Active on Map
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-display text-xl font-semibold text-white mb-1">{trek.name}</h3>
          <div className="flex items-center gap-3 text-white/60 text-[11px] font-mono uppercase tracking-wide">
            <span>{trek.distance}</span>
            <span>·</span>
            <span>{trek.duration}</span>
            <span>·</span>
            <span className={DIFF_COLOR[trek.difficulty] || 'text-white/60'}>{trek.difficulty}</span>
          </div>
        </div>
      </div>

      {/* Elevation sparkline */}
      <div className="bg-surface px-5 pt-4 pb-3 border-t border-line">
        <p className="text-[10px] font-mono text-soft/50 uppercase tracking-widest mb-2">Elevation Profile</p>
        <Sparkline elevations={trek.elevations} labels={trek.labels} />
        <div className="flex justify-between mt-1">
          <span className="font-mono text-[9px] text-soft/40">{trek.elevations[0].toLocaleString('en-IN')}m</span>
          <span className="font-mono text-[9px] text-pine">▲ {trek.altitude}</span>
        </div>
      </div>
    </button>
  )
}

// ─── ArticleList (preserved, used below the topo section) ─────────────────────
const ARTICLE_CATEGORIES = ['all', 'guides', 'culture', 'trekking', 'wildlife', 'history']

export function ArticleList() {
  const [articles, setArticles]   = useState([])
  const [category, setCategory]   = useState('all')
  const [search, setSearch]       = useState('')
  const [activeTrek, setActiveTrek] = useState(TREKS[0]?.id || null)

  useEffect(() => {
    const params = new URLSearchParams()
    if (category !== 'all') params.set('category', category)
    if (search) params.set('search', search)
    client.get(`/articles/?${params}`).then(r => {
      setArticles(r.data.results || r.data)
    })
  }, [category, search])

  return (
    <div className="pt-16 min-h-screen">

      {/* ── Topo Map Section ── */}
      <section className="relative bg-canvas border-b border-line">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-6">
          <Reveal>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 bg-pine rounded-full" />
              <span className="text-xs font-medium tracking-widest uppercase text-pine">Explore</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-tight mb-2">
              Into the Valley
            </h1>
            <p className="text-soft max-w-xl text-sm">
              Scroll the trek cards — each route draws itself onto the living topo map.
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col lg:flex-row lg:min-h-[700px]">
          {/* Sticky map — left half on desktop */}
          <div
            className="hidden lg:block lg:w-1/2 relative"
            style={{ position: 'sticky', top: '64px', height: 'calc(100vh - 64px)', alignSelf: 'flex-start' }}
          >
            <div className="absolute inset-0 p-10 flex items-center justify-center">
              <div className="w-full h-full max-w-xl">
                <TopoMap activeTrekId={activeTrek} />
              </div>
            </div>
            <div className="absolute bottom-8 left-10 font-mono text-[10px] tracking-widest" style={{ color: 'rgb(var(--soft) / 0.3)' }}>
              Uttarshall Valley · Mandi District · HP
            </div>
          </div>

          {/* Mobile map — shown above trek cards on small screens */}
          <div className="lg:hidden px-4 py-4 border-b border-line bg-canvas/50" style={{ height: '220px' }}>
            <TopoMap activeTrekId={activeTrek} />
          </div>

          {/* Trek cards — right half, scrollable */}
          <div className="lg:w-1/2 px-4 md:px-6 lg:px-10 py-6 md:py-8 space-y-6 md:space-y-8">
            {TREK_CARDS.map(trek => (
              <TrekCard
                key={trek.id}
                trek={trek}
                isActive={activeTrek === trek.id}
                onActivate={setActiveTrek}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Articles Section ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-8">
              Stories & Guides
            </h2>
          </Reveal>

          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-8">
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 bg-surface border border-line rounded-lg px-4 py-3 text-sm focus:border-pine focus:outline-none"
            />
            <div className="flex flex-wrap gap-1 md:gap-2">
              {ARTICLE_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide border rounded transition-all ${
                    category === cat ? 'border-pine text-pine' : 'border-line text-soft hover:border-pine hover:text-pine'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-24 text-soft">No articles found.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <Reveal key={article.id} delay={i * 60}>
                  <Link
                    to={`/explore/${article.slug}`}
                    className="border border-line rounded-xl overflow-hidden card-hover group block"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={getArticleImage(article.category)}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6">
                      <span className="category-tag mb-3 inline-block">{article.category}</span>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-pine transition-colors">{article.title}</h3>
                      <p className="text-sm text-soft mb-4 line-clamp-2">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-soft">
                        <span>{article.author_name}</span>
                        <span>{article.read_time} min read · {article.views} views</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// ─── ArticleDetail (unchanged) ─────────────────────────────────────────────────
export function ArticleDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)

  useEffect(() => {
    client.get(`/articles/${slug}/`).then(r => setArticle(r.data))
  }, [slug])

  if (!article) return <div className="pt-32 text-center text-soft">Loading…</div>

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/explore" className="text-pine text-sm hover:underline mb-8 block">← Back to all articles</Link>
        <span className="category-tag mb-4 inline-block">{article.category}</span>
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-4">{article.title}</h1>
        <div className="flex items-center gap-4 text-sm text-soft mb-8">
          <span>By {article.author_name}</span>
          <span>·</span>
          <span>{article.read_time} min read</span>
          <span>·</span>
          <span>{article.views} views</span>
        </div>
        <div className="aspect-video rounded-xl overflow-hidden mb-10">
          <img src={getArticleImage(article.category)} alt={article.title} className="w-full h-full object-cover" />
        </div>
        <div className="text-soft leading-relaxed space-y-4">
          {article.body.split('\n\n').map((para) => (
            <p key={para.slice(0, 40)}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
