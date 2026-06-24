import { useEffect, useRef } from 'react'

// Pseudo-random heights for pine tree silhouette (avoids Math.random for SSR safety)
const SEEDS = [0.72, 0.31, 0.88, 0.45, 0.19, 0.63, 0.92, 0.37, 0.55, 0.78,
               0.24, 0.67, 0.41, 0.83, 0.12, 0.59, 0.96, 0.34, 0.71, 0.48,
               0.15, 0.87, 0.52, 0.29, 0.64, 0.93, 0.08, 0.76, 0.39, 0.61,
               0.22, 0.85, 0.44, 0.17, 0.73, 0.56, 0.98, 0.33, 0.69, 0.42]

function PineTrees({ count = 38, width = 1440, height = 120 }) {
  const spacing = width / count
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: `${height}px` }}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => {
        const s = SEEDS[i % SEEDS.length]
        const s2 = SEEDS[(i + 7) % SEEDS.length]
        const cx   = i * spacing + spacing / 2 + (s - 0.5) * spacing * 0.6
        const tH   = 55 + s * 45          // 55-100px
        const tW   = 18 + s2 * 14         // 18-32px
        const base = height - 2 + (s - 0.5) * 4
        // Three-tier pine: bottom, middle, tip
        return (
          <g key={i} fill="rgb(6 16 10)">
            <polygon points={`${cx},${base - tH} ${cx - tW},${base} ${cx + tW},${base}`} />
            <polygon points={`${cx},${base - tH * 0.62} ${cx - tW * 0.72},${base - tH * 0.22} ${cx + tW * 0.72},${base - tH * 0.22}`} />
            <polygon points={`${cx},${base - tH * 0.38} ${cx - tW * 0.52},${base - tH * 0.44} ${cx + tW * 0.52},${base - tH * 0.44}`} />
          </g>
        )
      })}
    </svg>
  )
}

export default function ParallaxMountains() {
  const farRef  = useRef(null)
  const midRef  = useRef(null)
  const nearRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onScroll = () => {
      const y = window.scrollY
      // Far peaks move a bit — gives impression of great distance
      if (farRef.current)  farRef.current.style.transform  = `translateY(${y * 0.07}px)`
      // Mid ridges — medium speed
      if (midRef.current)  midRef.current.style.transform  = `translateY(${y * 0.13}px)`
      // Near pines — fastest = appears closest
      if (nearRef.current) nearRef.current.style.transform = `translateY(${y * 0.22}px)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
      style={{ zIndex: 3 }}
    >
      {/* ── Layer 1: Distant snowcapped peaks (misty, high up) ── */}
      <div ref={farRef} style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', willChange: 'transform' }}>
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '320px', display: 'block' }}
        >
          {/* Snow glow on tallest peak */}
          <defs>
            <radialGradient id="snowglow" cx="53%" cy="20%" r="18%">
              <stop offset="0%" stopColor="rgba(230,245,238,0.35)" />
              <stop offset="100%" stopColor="rgba(230,245,238,0)" />
            </radialGradient>
          </defs>
          <path
            d="M0,260 C70,220 140,205 210,182 C275,162 325,175 390,152 C450,131 495,144 555,120 C615,96 650,112 710,88 C768,65 800,80 855,95 C910,110 955,94 1015,75 C1072,57 1118,72 1175,92 C1228,110 1278,94 1330,78 C1380,63 1418,72 1440,78 L1440,320 L0,320 Z"
            fill="rgba(175, 210, 192, 0.28)"
          />
          {/* Snow cap highlight on the tallest peak */}
          <ellipse cx="762" cy="88" rx="38" ry="18" fill="rgba(230,248,240,0.22)" />
          <rect x="0" y="0" width="1440" height="320" fill="url(#snowglow)" />
        </svg>
      </div>

      {/* ── Layer 2: Pine-covered ridgeline (mid distance, deep green) ── */}
      <div ref={midRef} style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', willChange: 'transform' }}>
        <svg
          viewBox="0 0 1440 220"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '220px', display: 'block' }}
        >
          <path
            d="M0,200 C55,174 115,162 185,148 C260,133 315,144 390,132 C460,121 515,133 585,120 C655,107 705,120 775,130 C845,140 895,128 970,118 C1040,108 1095,120 1165,130 C1230,139 1285,128 1355,135 C1400,140 1430,133 1440,132 L1440,220 L0,220 Z"
            fill="rgba(22, 58, 36, 0.82)"
          />
          {/* Subtle lighter ridge behind */}
          <path
            d="M0,210 C80,192 160,185 240,175 C320,165 390,178 465,168 C535,159 600,170 670,160 C740,150 800,163 875,172 C945,181 1005,168 1080,158 C1150,149 1215,162 1290,170 C1345,176 1400,166 1440,165 L1440,220 L0,220 Z"
            fill="rgba(30, 72, 48, 0.55)"
          />
        </svg>
      </div>

      {/* ── Layer 3: Foreground pine silhouettes (darkest, closest) ── */}
      <div ref={nearRef} style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', willChange: 'transform' }}>
        <PineTrees count={38} width={1440} height={110} />
      </div>
    </div>
  )
}
