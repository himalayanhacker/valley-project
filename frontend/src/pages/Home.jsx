import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import client from '../api/client'
import { IMAGES, getArticleImage, getPackageImage } from '../api/images'
import Reveal from '../components/Reveal'
import AltitudeMeter from '../components/AltitudeMeter'
import TopoBackground from '../components/TopoBackground'
import Tilt3D from '../components/Tilt3D'
import MagneticBtn from '../components/MagneticBtn'

function DissolveText({ text, className, charClassName, style }) {
  return (
    <span className={className} style={style} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className={charClassName ? `dissolve-char ${charClassName}` : 'dissolve-char'}
          style={{ display: 'inline-block', willChange: 'opacity, filter' }}
        >
          {char === ' ' ? '\xa0' : char}
        </span>
      ))}
    </span>
  )
}

const STATS = [
  { numeric: 4200, suffix: 'm', label: 'Peak Elevation (Shikari Devi)' },
  { numeric: 1200, suffix: ' km²', label: 'Valley Spread' },
  { numeric: 32, suffix: '', label: 'Trekking Routes' },
  { numeric: 180, suffix: '+', label: 'Wildlife Species' },
]

function StatCounter({ numeric, suffix, label }) {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setCount(numeric); return }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const dur = 1400
        const t0 = performance.now()
        const tick = now => {
          const p = Math.min((now - t0) / dur, 1)
          const ease = 1 - (1 - p) ** 3
          setCount(Math.floor(ease * numeric))
          if (p < 1) requestAnimationFrame(tick)
          else { setCount(numeric); setDone(true) }
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [numeric])

  const formatted = numeric >= 1000 ? count.toLocaleString('en-IN') : count
  return (
    <div ref={ref} className="text-center">
      <p className={`text-xl sm:text-2xl md:text-3xl font-semibold mb-1 bg-gradient-to-r from-pine to-sun bg-clip-text text-transparent tabular-nums${done ? ' stat-done' : ''}`}>
        {formatted}{suffix}
      </p>
      <p className="text-xs text-soft uppercase tracking-wide">{label}</p>
    </div>
  )
}

const PHOTOS = [
  { src: IMAGES.prasharLake,      alt: 'Prashar Lake',           label: 'Prashar Lake',      meta: '2,730m · 31.78°N', aspect: 'aspect-[4/5]', col: 0 },
  { src: IMAGES.uhlRiver,         alt: 'Uhl River, Barot',       label: 'Uhl River, Barot',  meta: '1,600m · 32.10°N', aspect: 'aspect-square', col: 0 },
  { src: IMAGES.himachalForest,   alt: 'Deodar Forest',          label: 'Deodar Forests',    meta: '2,100m · 31.75°N', aspect: 'aspect-square', col: 1 },
  { src: IMAGES.panchvaktraTemple,alt: 'Panchvaktra Temple',     label: 'Panchvaktra Temple',meta: '826m · 31.71°N',   aspect: 'aspect-[4/5]', objPos: 'object-top', col: 1 },
]

function PhotoCard({ photo, globalIdx, hovered, setHovered }) {
  const isDimmed = hovered !== null && hovered !== globalIdx
  const isActive = hovered === globalIdx
  const elev = photo.meta.split('·')[0].trim()

  return (
    <Tilt3D intensity={8} scale={1.04} className={`photo-item rounded-lg ${photo.aspect}`}>
      <figure
        className={`relative overflow-hidden rounded-lg w-full h-full group photo-topo cursor-pointer`}
        onMouseEnter={() => setHovered(globalIdx)}
        onMouseLeave={() => setHovered(null)}
        style={{
          filter: isDimmed ? 'brightness(0.38) saturate(0.25)' : 'brightness(1) saturate(1)',
          transition: 'filter 0.35s ease, box-shadow 0.35s ease',
          boxShadow: isActive ? '0 20px 60px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className={`w-full h-full object-cover ${photo.objPos || ''} transition-transform duration-700 group-hover:scale-105`}
        />
        {/* Elevation badge — slides in on hover */}
        <div
          className="absolute top-3 right-3 transition-all duration-300"
          style={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateY(0)' : 'translateY(-8px)',
          }}
        >
          <div className="bg-pine text-on-accent text-[9px] font-mono font-bold px-2 py-[3px] rounded flex items-center gap-1">
            <span>▲</span> {elev}
          </div>
        </div>
        {/* Pine border pulse on active */}
        <div
          className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300"
          style={{ border: '2px solid rgb(var(--pine))', opacity: isActive ? 0.7 : 0 }}
        />
        <figcaption className="absolute bottom-0 left-0 right-0 p-4 card-3d-inner" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.78), transparent)' }}>
          <p className="text-xs font-medium text-white">{photo.label}</p>
          <p className="font-mono text-[8px] text-white/40">{photo.meta}</p>
        </figcaption>
      </figure>
    </Tilt3D>
  )
}

function PhotoGrid() {
  const [hovered, setHovered] = useState(null)
  const gridRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = gridRef.current
    if (!el) return
    if (reduced) {
      el.querySelectorAll('.photo-item').forEach(p => p.classList.add('photo-revealed'))
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.photo-item').forEach((p, i) => {
          setTimeout(() => p.classList.add('photo-revealed'), i * 140)
        })
        observer.disconnect()
      }
    }, { threshold: 0.12 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const col0 = PHOTOS.filter(p => p.col === 0)
  const col1 = PHOTOS.filter(p => p.col === 1)

  return (
    <div ref={gridRef} className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-4">
      <div className="space-y-4">
        {col0.map((p, i) => <PhotoCard key={i} photo={p} globalIdx={i} hovered={hovered} setHovered={setHovered} />)}
      </div>
      <div className="space-y-4 pt-8">
        {col1.map((p, i) => <PhotoCard key={i} photo={p} globalIdx={i + 2} hovered={hovered} setHovered={setHovered} />)}
      </div>
    </div>
  )
}

function CoordStamp({ coord }) {
  return (
    <span className="hidden sm:inline font-mono text-[9px] tracking-wider ml-auto" style={{ color: 'rgb(var(--soft) / 0.3)' }}>
      {coord}
    </span>
  )
}

export default function Home() {
  const [packages, setPackages] = useState([])
  const [articles, setArticles] = useState([])
  const heroImgRef    = useRef(null)
  const heroSectRef   = useRef(null)
  const heroTopoRef   = useRef(null)
  const heroTextRef   = useRef(null)
  const mouseRaf      = useRef(null)

  useEffect(() => {
    client.get('/packages/').then(r => setPackages(r.data.slice(0, 3)))
    client.get('/articles/').then(r => setArticles(r.data.results?.slice(0, 3) || r.data.slice(0, 3)))
  }, [])

  /* Scroll: parallax + text dissolve */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (window.innerWidth >= 768 && heroImgRef.current) {
        heroImgRef.current.style.transform = `translateY(${scrollY * 0.35}px)`
      }
      const sect = heroSectRef.current
      if (!sect) return
      const chars = sect.querySelectorAll('.dissolve-char')
      if (!chars.length) return
      const heroH = sect.offsetHeight
      const p = Math.min(scrollY / (heroH * 0.65), 1)
      const n = chars.length
      chars.forEach((char, i) => {
        const localP = Math.max(0, Math.min((p - (i / (n * 1.5))) * 2.2, 1))
        char.style.opacity = 1 - localP
        char.style.filter  = `blur(${localP * 7}px)`
      })
      if (heroImgRef.current) {
        heroImgRef.current.style.filter = `brightness(${0.85 + 0.15 * p})`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* Mouse: multi-layer parallax on hero */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const sect = heroSectRef.current
    if (!sect) return
    const handleMouse = e => {
      const rect = sect.getBoundingClientRect()
      const cx = e.clientX - rect.left - rect.width  / 2
      const cy = e.clientY - rect.top  - rect.height / 2
      cancelAnimationFrame(mouseRaf.current)
      mouseRaf.current = requestAnimationFrame(() => {
        if (heroTopoRef.current) {
          heroTopoRef.current.style.transform = `translate(${cx * 0.028}px, ${cy * 0.028}px)`
        }
        if (heroTextRef.current) {
          heroTextRef.current.style.transform = `translate(${cx * 0.016}px, ${cy * 0.016}px)`
        }
      })
    }
    sect.addEventListener('mousemove', handleMouse, { passive: true })
    return () => { sect.removeEventListener('mousemove', handleMouse); cancelAnimationFrame(mouseRaf.current) }
  }, [])

  return (
    <div>
      <AltitudeMeter />

      {/* ── Hero ── */}
      <section ref={heroSectRef} id="section-hero" className="relative h-screen flex flex-col items-center justify-end pb-8 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img
            ref={heroImgRef}
            src={IMAGES.hero}
            alt="Prashar Lake, Uttarshall Valley"
            className="w-full object-cover absolute left-0"
            style={{ height: '120%', top: '-10%' }}
          />

          {/* Topo layer — moves faster on mouse for depth */}
          <div ref={heroTopoRef} className="absolute inset-0 pointer-events-none" style={{ willChange: 'transform' }}>
            <TopoBackground />
          </div>

          {/* Ambient floating orbs */}
          <div aria-hidden="true" className="hero-orb" style={{ width: '520px', height: '520px', top: '8%', left: '-12%', background: 'rgb(var(--pine) / 0.18)', animationDuration: '18s' }} />
          <div aria-hidden="true" className="hero-orb" style={{ width: '380px', height: '380px', top: '20%', right: '-8%', background: 'rgb(var(--sun) / 0.12)', animationDuration: '24s', animationDelay: '-8s' }} />
          <div aria-hidden="true" className="hero-orb" style={{ width: '260px', height: '260px', bottom: '22%', left: '30%', background: 'rgb(var(--moss) / 0.14)', animationDuration: '20s', animationDelay: '-14s' }} />

          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgb(var(--canvas)) 0%, rgb(var(--canvas) / 0.72) 32%, rgb(var(--canvas) / 0.18) 62%, transparent 100%)' }}
          />
        </div>

        {/* Mountain ridge terrain wave */}
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full z-10" style={{ height: '80px' }} aria-hidden="true">
          <path className="terrain-fill"
            d="M0,80 C60,60 120,70 200,45 C260,28 300,52 380,38 C440,26 480,48 560,32 C620,20 680,44 760,28 C820,16 880,38 960,26 C1020,16 1080,40 1160,32 C1220,26 1300,48 1360,40 C1400,35 1430,50 1440,45 L1440,80 L0,80 Z" />
        </svg>

        {/* Floating ambient badges */}
        <div className="hero-badge absolute left-8 top-1/4 hidden lg:flex items-center gap-2 z-20 pointer-events-none"
          style={{ background: 'rgb(var(--surface) / 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgb(var(--line-strong))', borderRadius: '9999px', padding: '8px 16px' }}>
          <span className="text-pine text-sm">▲</span>
          <div>
            <p className="font-mono text-[10px] font-bold text-ink">4,200 m</p>
            <p className="font-mono text-[8px] text-soft/60 leading-none">Shikari Devi Summit</p>
          </div>
        </div>

        <div className="hero-badge-2 absolute right-8 top-1/3 hidden lg:flex items-center gap-2 z-20 pointer-events-none"
          style={{ background: 'rgb(var(--surface) / 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgb(var(--line-strong))', borderRadius: '9999px', padding: '8px 16px' }}>
          <span className="text-sun text-sm">🦅</span>
          <div>
            <p className="font-mono text-[10px] font-bold text-ink">180+ Species</p>
            <p className="font-mono text-[8px] text-soft/60 leading-none">Wildlife · Himalayan</p>
          </div>
        </div>

        <div className="hero-badge-3 absolute left-12 bottom-36 hidden lg:flex items-center gap-2 z-20 pointer-events-none"
          style={{ background: 'rgb(var(--surface) / 0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgb(var(--line-strong))', borderRadius: '9999px', padding: '8px 16px' }}>
          <span className="text-pine text-sm">📍</span>
          <div>
            <p className="font-mono text-[10px] font-bold text-ink">31.58°N · 77.13°E</p>
            <p className="font-mono text-[8px] text-soft/60 leading-none">Mandi District, HP</p>
          </div>
        </div>

        {/* Hero text — separate layer for slower parallax */}
        <div ref={heroTextRef} className="relative z-10 text-center px-5 max-w-5xl w-full" style={{ willChange: 'transform' }}>
          <p className="font-mono text-[10px] tracking-[0.25em] uppercase mb-1 sm:mb-2 hidden sm:block" style={{ color: 'rgb(var(--pine) / 0.7)' }}>
            31.58°N · 77.13°E · 4,200m
          </p>
          <p className="text-[10px] sm:text-xs font-medium tracking-widest uppercase mb-2 sm:mb-4" style={{ color: 'rgb(var(--pine))' }}>
            Mandi District · Himachal Pradesh
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-9xl font-black tracking-tight leading-none mb-2 sm:mb-4 md:mb-6">
            <DissolveText text="Uttarshall" className="block text-ink" />
            <DissolveText text="Valley" className="block italic" charClassName="bg-gradient-to-r from-pine to-moss bg-clip-text text-transparent" />
          </h1>
          <p className="text-soft text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-4 sm:mb-8 leading-relaxed line-clamp-3 sm:line-clamp-none">
            A pristine Himalayan paradise where snow leopards roam ancient forests, sacred lakes mirror towering peaks, and every trail leads to breathtaking discovery.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center mb-6 sm:mb-0">
            <MagneticBtn className="w-full sm:w-auto">
              <Link to="/packages" className="btn-primary px-8 sm:px-10 py-3 sm:py-4 text-sm rounded mag-btn w-full sm:w-auto inline-flex items-center justify-center">Plan Your Visit</Link>
            </MagneticBtn>
            <MagneticBtn className="w-full sm:w-auto">
              <Link to="/explore" className="btn-secondary px-8 sm:px-10 py-3 sm:py-4 text-sm rounded mag-btn w-full sm:w-auto flex items-center justify-center gap-2">Explore Guides</Link>
            </MagneticBtn>
          </div>
          {/* Scroll hint — inline on mobile so it never overlaps buttons */}
          <button
            type="button"
            onClick={() => document.getElementById('section-stats')?.scrollIntoView({ behavior: 'smooth' })}
            className="sm:hidden flex flex-col items-center gap-1 text-soft mx-auto cursor-pointer hover:text-pine transition-colors"
            aria-label="Scroll to next section"
          >
            <span className="text-[10px] uppercase tracking-widest">Scroll</span>
            <span className="animate-bounce text-sm">↓</span>
          </button>
        </div>

        {/* Scroll hint — absolute on sm+ screens only */}
        <button
          type="button"
          onClick={() => document.getElementById('section-stats')?.scrollIntoView({ behavior: 'smooth' })}
          className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-soft z-20 cursor-pointer hover:text-pine transition-colors"
          aria-label="Scroll to next section"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <span className="animate-bounce">↓</span>
        </button>
      </section>

      {/* ── Stats ── */}
      <section id="section-stats" className="bg-surface border-y border-line py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {STATS.map((s, i) => <StatCounter key={i} {...s} />)}
        </div>
      </section>

      {/* ── Overview ── */}
      <section id="section-overview" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 bg-pine rounded-full" />
                <span className="text-xs font-medium tracking-widest uppercase text-pine">Overview</span>
                <CoordStamp coord="32.10°N · 76.97°E · 1,840m" />
              </div>
              <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight mb-6">A Himalayan Wonder</h2>
              <div className="divider w-24 mb-6" />
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div>
                <h3 className="sweep-heading text-xl md:text-2xl font-medium tracking-tight mb-6">Where Himalayas Meet the Sky</h3>
                <div className="space-y-4 text-soft leading-relaxed mt-6">
                  <p>Nestled in the heart of Mandi district, Himachal Pradesh, Uttarshall Valley spans over 1,200 square kilometres of pristine Himalayan wilderness. The valley's unique geography creates diverse ecosystems — from subtropical forests along the Beas river to alpine meadows and glaciated peaks above 4,000 metres.</p>
                  <p>Home to the elusive snow leopard, Himalayan brown bear, and the vibrant monal pheasant (Himachal Pradesh's state bird), the valley is a sanctuary for wildlife. Ancient deodar cedar forests cover the mid-elevation slopes, while rhododendron and oak forests burst into colour each spring.</p>
                  <p>The valley is deeply intertwined with the cultural fabric of Mandi district — famous for its 81 ancient stone temples, the Shivratri festival of gods, and the indigenous Gaddi pastoral communities who have inhabited these mountains for centuries.</p>
                </div>
                <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-4 mt-8">
                  {[
                    { icon: '☀️', title: 'Best Seasons', desc: 'May – Oct (trekking), Dec – Mar (snow)' },
                    { icon: '🚗', title: 'Accessibility', desc: '5hr from Delhi, 2hr from Chandigarh' },
                    { icon: '✈️', title: 'Nearest Airport', desc: 'Bhuntar (Kullu), ~70 km' },
                    { icon: '🛡️', title: 'Conservation', desc: 'Shikari Devi Wildlife Sanctuary' },
                  ].map((f, i) => (
                    <Reveal key={i} delay={i * 80}>
                      <div className="info-card p-4 border border-line rounded-lg card-hover h-full">
                        <span className="card-icon text-2xl mb-2 block">{f.icon}</span>
                        <h4 className="text-sm font-semibold mb-1">{f.title}</h4>
                        <p className="text-xs text-soft">{f.desc}</p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>

            <PhotoGrid />
          </div>
        </div>
      </section>

      {/* ── Packages ── */}
      <section id="section-packages" className="py-24 md:py-32 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-pine rounded-full" />
                  <span className="text-xs font-medium tracking-widest uppercase text-pine">Packages</span>
                  <CoordStamp coord="31.75°N · 77.05°E · 1,200m" />
                </div>
                <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight">Travel Packages</h2>
              </div>
              <Link to="/packages" className="btn-secondary px-6 py-3 text-xs font-semibold uppercase tracking-wide rounded">
                View All Packages
              </Link>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 100}>
                <Tilt3D intensity={6} scale={1.03}>
                  <div className={`border ${pkg.featured ? 'border-pine' : 'border-line'} rounded-xl overflow-hidden relative h-full`}
                    style={{ background: 'rgb(var(--surface))', transition: 'box-shadow 0.35s ease', cursor: 'pointer' }}>
                    {pkg.featured && <div className="absolute top-4 right-4 bg-pine text-on-accent text-xs font-semibold px-3 py-1 rounded z-10">Most Popular</div>}
                    <div className="aspect-video overflow-hidden group photo-topo">
                      <img src={getPackageImage(i)} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <div className="p-6 card-3d-inner">
                      <h3 className="text-xl font-semibold mb-1">{pkg.name}</h3>
                      <p className="text-sm text-soft mb-4">{pkg.duration_days} Days / {pkg.duration_days - 1} Nights</p>
                      <ul className="space-y-2 mb-6">
                        {pkg.highlights?.slice(0, 3).map(h => (
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
                        <Link to="/packages" className="btn-primary px-6 py-2 text-xs rounded">Book Now</Link>
                      </div>
                    </div>
                  </div>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Articles ── */}
      <section id="section-articles" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-pine rounded-full" />
                  <span className="text-xs font-medium tracking-widest uppercase text-pine">Stories & Guides</span>
                  <CoordStamp coord="31.71°N · 76.92°E · 826m" />
                </div>
                <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight">Explore the Valley</h2>
              </div>
              <Link to="/explore" className="btn-secondary px-6 py-3 text-xs font-semibold uppercase tracking-wide rounded">
                All Articles
              </Link>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {articles.map((article, i) => (
              <Reveal key={article.id} delay={i * 100}>
                <Tilt3D intensity={6} scale={1.03}>
                  <Link to={`/explore/${article.slug}`}
                    className="border border-line rounded-xl overflow-hidden card-hover group cursor-pointer block h-full">
                    <div className="aspect-video overflow-hidden photo-topo">
                      <img src={getArticleImage(article.category)} alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-6 card-3d-inner">
                      <span className="category-tag mb-3 inline-block">{article.category}</span>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-pine transition-colors line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-soft line-clamp-2">{article.excerpt}</p>
                      <div
                        className="flex items-center gap-2 mt-4 text-xs text-soft"
                        style={{
                          transform: 'translateX(-8px)',
                          opacity: 0,
                          transition: 'transform 300ms var(--ease-luxury), opacity 300ms var(--ease-luxury)',
                        }}
                        ref={el => {
                          if (!el) return
                          const card = el.closest('.group')
                          if (!card) return
                          const show = () => { el.style.transform = 'translateX(0)'; el.style.opacity = '1' }
                          const hide = () => { el.style.transform = 'translateX(-8px)'; el.style.opacity = '0' }
                          card.addEventListener('mouseenter', show)
                          card.addEventListener('mouseleave', hide)
                        }}
                      >
                        <span>{article.author_name}</span>
                        <span>·</span>
                        <span>{article.read_time} min read</span>
                      </div>
                    </div>
                  </Link>
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="text-center py-4 text-xs text-soft/50 bg-canvas border-t border-line">
        Photos: Wikimedia Commons (CC BY-SA 4.0) · Unsplash (free to use)
      </div>
    </div>
  )
}
