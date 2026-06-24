import { useEffect, useRef } from 'react'

const WORDS = [
  'Every', 'summit', 'a', 'prayer.', 'Every', 'trail', 'a', 'story.', 'The',
  'Himalayas', 'do', 'not', 'offer', 'easy', 'paths', '—', 'only', 'honest', 'ones.',
]

const STATS = [
  { value: '2,730', unit: 'm', label: 'Prashar Lake' },
  { value: '32',    unit: '',  label: 'Trek Routes' },
  { value: '180+',  unit: '',  label: 'Wildlife Species' },
  { value: '5,000', unit: 'yr', label: 'Cultural History' },
]

export default function ManifestoSection() {
  const sectionRef = useRef(null)
  const wordRefs   = useRef([])
  const statRefs   = useRef([])
  const lineRef    = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      wordRefs.current.forEach(el => el && (el.style.opacity = '1', el.style.transform = 'none'))
      statRefs.current.forEach(el => el && (el.style.opacity = '1', el.style.transform = 'none'))
      return
    }

    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        // Stagger word reveal
        wordRefs.current.filter(Boolean).forEach((el, i) => {
          setTimeout(() => {
            el.style.opacity   = '1'
            el.style.transform = 'translateY(0) skewY(0deg)'
          }, 60 + i * 65)
        })

        // Animate divider line
        if (lineRef.current) {
          setTimeout(() => {
            lineRef.current.style.transform = 'scaleX(1)'
          }, 300)
        }

        // Stats appear after text
        statRefs.current.filter(Boolean).forEach((el, i) => {
          setTimeout(() => {
            el.style.opacity   = '1'
            el.style.transform = 'translateY(0)'
          }, 800 + i * 120)
        })

        observer.disconnect()
      },
      { threshold: 0.25 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'linear-gradient(to bottom, rgb(6 14 9), rgb(10 22 14) 60%, rgb(8 18 11))',
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(3.5rem, 7vw, 7rem) 0',
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', borderRadius: '50%',
          width: 700, height: 700,
          background: 'radial-gradient(circle, rgb(47 111 79 / 0.12), transparent 70%)',
          top: '40%', left: '15%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', borderRadius: '50%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgb(217 119 6 / 0.07), transparent 70%)',
          top: '20%', right: '5%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Subtle grain overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, opacity: 0.025,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        {/* Overline */}
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: '0.625rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgb(91 190 139 / 0.55)',
            marginBottom: '3rem',
            textAlign: 'center',
          }}
        >
          31.58°N · 77.13°E · Valley Manifesto
        </p>

        {/* Word-reveal quote */}
        <p
          style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontSize: 'clamp(2rem, 4.5vw, 3.75rem)',
            fontWeight: 300,
            lineHeight: 1.35,
            color: 'rgb(232 240 235 / 0.92)',
            textAlign: 'center',
          }}
        >
          {WORDS.map((word, i) => (
            <span
              key={i}
              ref={el => { wordRefs.current[i] = el }}
              style={{
                display: 'inline-block',
                marginRight: word === '—' ? '0.4em' : '0.28em',
                opacity: 0,
                transform: 'translateY(24px) skewY(2deg)',
                transition: 'opacity 550ms cubic-bezier(0.16,1,0.3,1), transform 550ms cubic-bezier(0.16,1,0.3,1)',
                fontStyle: ['prayer.', 'story.', 'honest', 'ones.'].includes(word) ? 'italic' : 'normal',
                color: word === '—' ? 'rgb(91 190 139 / 0.7)' : undefined,
              }}
            >
              {word}
            </span>
          ))}
        </p>

        {/* Divider line */}
        <div
          style={{
            margin: '3.5rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <div
            ref={lineRef}
            style={{
              width: 80, height: 1,
              background: 'linear-gradient(to right, transparent, rgb(91 190 139 / 0.5), transparent)',
              transform: 'scaleX(0)',
              transformOrigin: 'center',
              transition: 'transform 800ms cubic-bezier(0.16,1,0.3,1)',
            }}
          />
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.2em',
              color: 'rgb(91 190 139 / 0.45)',
              textTransform: 'uppercase',
            }}
          >
            Uttarshall Valley
          </span>
          <div
            style={{
              width: 80, height: 1,
              background: 'linear-gradient(to left, transparent, rgb(91 190 139 / 0.5), transparent)',
              transform: 'scaleX(0)',
              transformOrigin: 'center',
              transition: 'transform 800ms cubic-bezier(0.16,1,0.3,1) 200ms',
            }}
            ref={el => {
              if (el && lineRef.current?.style.transform === 'scaleX(1)') {
                el.style.transform = 'scaleX(1)'
              }
            }}
          />
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              ref={el => { statRefs.current[i] = el }}
              style={{
                opacity: 0,
                transform: 'translateY(16px)',
                transition: 'opacity 500ms ease, transform 500ms cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <p
                style={{
                  fontFamily: 'Fraunces, Georgia, serif',
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                  fontWeight: 600,
                  color: 'rgb(91 190 139)',
                  lineHeight: 1,
                  marginBottom: '0.4rem',
                }}
              >
                {stat.value}
                {stat.unit && (
                  <span style={{ fontSize: '0.55em', marginLeft: '0.15em', opacity: 0.7 }}>
                    {stat.unit}
                  </span>
                )}
              </p>
              <p
                style={{
                  fontFamily: 'monospace',
                  fontSize: '0.6rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgb(154 168 160 / 0.65)',
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
