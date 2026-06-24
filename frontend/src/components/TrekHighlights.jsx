import { useEffect, useRef, useState } from 'react'
import { IMAGES } from '../api/images'

const TREKS = [
  {
    name: 'Prashar Lake Trek',
    duration: '2D · 1N',
    difficulty: 3,
    altitude: '2,730 m',
    distance: '8 km',
    season: 'Apr – Oct',
    category: 'LAKES',
    description: 'Sacred alpine lake with floating island sanctuary, ringed by Himalayan peaks and dense oak forest. Trek starts from Baggi village via Kataula–Shagli road.',
    image: IMAGES.prasharLake,
    badge: 'Iconic',
  },
  {
    name: 'IIT Mandi Kamand Campus',
    duration: '1D',
    difficulty: 1,
    altitude: '1,020 m',
    distance: '5 km',
    season: 'Year Round',
    category: 'LANDMARK',
    description: "India's premier IIT campus set on the Uhl riverbank, officially addressed 'Near Kataula, Kamand.' 538 acres of modern architecture immersed in Himalayan wilderness.",
    image: IMAGES.iitMandiCampus,
    badge: 'Iconic',
  },
  {
    name: 'Chandi Mata Temple',
    duration: '½D',
    difficulty: 1,
    altitude: '1,100 m',
    distance: '2 km',
    season: 'Year Round',
    category: 'SACRED',
    description: 'Ancient Shakti shrine dedicated to the divine Mother Chandi at the heart of Kataula village — a revered spiritual site for the Uttarshall community.',
    image: IMAGES.panchvaktraTemple,
    badge: 'Sacred',
  },
  {
    name: 'Kataula Heritage Trail',
    duration: '1D',
    difficulty: 2,
    altitude: '1,300 m',
    distance: '12 km',
    season: 'Mar – Nov',
    category: 'PILGRIMAGE',
    description: 'Sacred circuit through Aadi Brahma (Aadi Purkha) near Parashar Hill, Baba Virnath Rishi, Mahurigan Rishi, and the village devta shrines of Halgarh and Suhra — ancient hilltop temples woven through Kataula Tehsil.',
    image: IMAGES.kataulaTrail,
    badge: 'Heritage',
  },
]

function DifficultyDots({ level, max = 5 }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Difficulty ${level} of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: i < level ? 'rgb(47 111 79)' : 'rgb(47 111 79 / 0.2)',
            transition: 'background 200ms ease',
          }}
        />
      ))}
    </div>
  )
}

function TrekCard({ trek, index, isActive, onActivate }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      card.style.opacity = '1'
      card.style.transform = 'none'
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            card.style.opacity   = '1'
            card.style.transform = 'translateY(0) scale(1)'
          }, index * 80)
          observer.disconnect()
        }
      },
      { threshold: 0.15, root: card.closest('.trek-scroll-container') }
    )
    observer.observe(card)
    return () => observer.disconnect()
  }, [index])

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onKeyDown={e => e.key === 'Enter' && onActivate()}
      style={{
        flexShrink: 0,
        width: 'clamp(260px, 30vw, 320px)',
        opacity: 0,
        transform: 'translateY(24px) scale(0.97)',
        transition: 'opacity 500ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          border: `1px solid ${isActive ? 'rgb(47 111 79 / 0.6)' : 'rgb(228 231 226)'}`,
          background: 'rgb(var(--surface))',
          boxShadow: isActive
            ? '0 20px 60px rgb(47 111 79 / 0.15), 0 4px 16px rgb(0 0 0 / 0.08)'
            : '0 4px 16px rgb(0 0 0 / 0.04)',
          transition: 'box-shadow 300ms ease, border-color 300ms ease',
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
          <img
            src={trek.image}
            alt={trek.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 600ms cubic-bezier(0.16,1,0.3,1)',
              transform: isActive ? 'scale(1.06)' : 'scale(1)',
            }}
          />
          {/* Category chip */}
          <div
            style={{
              position: 'absolute',
              top: 12, left: 12,
              background: 'rgb(0 0 0 / 0.55)',
              backdropFilter: 'blur(8px)',
              borderRadius: 999,
              padding: '3px 10px',
              fontFamily: 'monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.18em',
              color: 'rgb(91 190 139)',
              fontWeight: 700,
            }}
          >
            {trek.category}
          </div>
          {/* Badge */}
          <div
            style={{
              position: 'absolute',
              top: 12, right: 12,
              background: 'rgb(47 111 79)',
              borderRadius: 999,
              padding: '3px 10px',
              fontSize: '0.65rem',
              color: 'white',
              fontWeight: 600,
            }}
          >
            {trek.badge}
          </div>
          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgb(0 0 0 / 0.55) 0%, transparent 50%)',
            }}
          />
          {/* Altitude overlay on image bottom */}
          <div
            style={{
              position: 'absolute',
              bottom: 10, left: 12,
              fontFamily: 'monospace',
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 700,
            }}
          >
            ▲ {trek.altitude}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '1.125rem 1.25rem 1.25rem' }}>
          <h3
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: '1.1rem',
              fontWeight: 600,
              marginBottom: '0.35rem',
              color: 'rgb(var(--ink))',
              lineHeight: 1.25,
            }}
          >
            {trek.name}
          </h3>
          <p
            style={{
              fontSize: '0.78rem',
              color: 'rgb(var(--soft))',
              marginBottom: '0.85rem',
              lineHeight: 1.5,
            }}
          >
            {trek.description}
          </p>

          {/* Meta row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.85rem',
              flexWrap: 'wrap',
            }}
          >
            <DifficultyDots level={trek.difficulty} />
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.6rem',
                color: 'rgb(var(--soft))',
                opacity: 0.7,
              }}
            >
              {trek.difficulty === 1 ? 'Easy' : trek.difficulty === 2 ? 'Moderate' : trek.difficulty === 3 ? 'Challenging' : trek.difficulty === 4 ? 'Hard' : 'Expert'}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgb(var(--line))',
            }}
          >
            {[
              { icon: '⏱', label: trek.duration },
              { icon: '↔', label: trek.distance },
              { icon: '☀', label: trek.season },
            ].map(m => (
              <div key={m.label}>
                <p style={{ fontSize: '0.6rem', color: 'rgb(var(--soft))', opacity: 0.55, marginBottom: 2 }}>{m.icon}</p>
                <p style={{ fontSize: '0.7rem', color: 'rgb(var(--ink))', fontWeight: 500 }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TrekHighlights() {
  const [active, setActive] = useState(0)
  const containerRef = useRef(null)
  const headerRef    = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = headerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity   = '1'
          el.style.transform = 'translateY(0)'
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -340, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 340, behavior: 'smooth' })
    }
  }

  return (
    <section
      style={{
        padding: 'clamp(2.5rem, 5vw, 5rem) 0 clamp(2rem, 4vw, 4rem)',
        overflow: 'hidden',
        background: 'rgb(var(--canvas))',
      }}
    >
      {/* Header */}
      <div
        ref={headerRef}
        style={{
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2.5rem',
          opacity: 0,
          transform: 'translateY(20px)',
          transition: 'opacity 600ms ease, transform 600ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.75rem',
            }}
          >
            <span
              style={{
                width: 8, height: 8,
                borderRadius: '50%',
                background: 'rgb(47 111 79)',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'rgb(47 111 79)',
              }}
            >
              Trek Routes
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'rgb(var(--ink))',
              lineHeight: 1.1,
            }}
          >
            Choose Your Adventure
          </h2>
        </div>

        {/* Arrow controls */}
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          {[
            { label: '← Previous', action: scrollLeft, symbol: '←' },
            { label: '→ Next',     action: scrollRight, symbol: '→' },
          ].map(btn => (
            <button
              key={btn.label}
              onClick={btn.action}
              aria-label={btn.label}
              style={{
                width: 44, height: 44,
                borderRadius: '50%',
                border: '1px solid rgb(var(--line-strong))',
                background: 'rgb(var(--surface))',
                cursor: 'pointer',
                fontSize: '1rem',
                color: 'rgb(var(--ink))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 200ms, background 200ms',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgb(47 111 79)'
                e.currentTarget.style.background  = 'rgb(47 111 79 / 0.05)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgb(var(--line-strong))'
                e.currentTarget.style.background  = 'rgb(var(--surface))'
              }}
            >
              {btn.symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal scroll track */}
      <div
        ref={containerRef}
        className="trek-scroll-container"
        style={{
          display: 'flex',
          gap: '1.25rem',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '0.5rem 1.5rem 1.5rem',
          paddingLeft: 'max(1.5rem, calc((100vw - 80rem) / 2 + 1.5rem))',
        }}
      >
        {TREKS.map((trek, i) => (
          <div key={trek.name} style={{ scrollSnapAlign: 'start' }}>
            <TrekCard
              trek={trek}
              index={i}
              isActive={active === i}
              onActivate={() => setActive(i)}
            />
          </div>
        ))}

      </div>

      {/* Progress dots */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.4rem',
          marginTop: '1.25rem',
        }}
      >
        {TREKS.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to trek ${i + 1}`}
            onClick={() => {
              setActive(i)
              const cards = containerRef.current?.querySelectorAll('[style*="scroll-snap-align"]')
              cards?.[i]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
            }}
            style={{
              width: active === i ? 20 : 6,
              height: 6,
              borderRadius: 999,
              border: 'none',
              background: active === i ? 'rgb(47 111 79)' : 'rgb(47 111 79 / 0.25)',
              cursor: 'pointer',
              padding: 0,
              transition: 'width 300ms cubic-bezier(0.16,1,0.3,1), background 200ms ease',
            }}
          />
        ))}
      </div>
    </section>
  )
}
