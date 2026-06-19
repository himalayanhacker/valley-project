import { useEffect, useRef } from 'react'

// Trek routes defined as SVG path data on a 700×500 viewBox
// Paths are hand-crafted to represent approximate geographical routes
export const TREKS = [
  {
    id: 'prashar',
    name: 'Prashar Lake Circuit',
    path: 'M 120,380 C 140,340 165,310 190,280 C 215,250 235,230 260,210 C 285,190 310,178 340,170',
    pins: [
      { x: 120, y: 380, label: 'Baggi', alt: '1,450m' },
      { x: 260, y: 210, label: 'Kamand', alt: '2,100m' },
      { x: 340, y: 170, label: 'Prashar Lake', alt: '2,730m' },
    ],
  },
  {
    id: 'shikari',
    name: 'Shikari Devi Summit',
    path: 'M 200,420 C 215,390 230,360 248,330 C 266,300 280,275 295,248 C 310,222 325,200 348,180 C 370,160 392,145 420,132',
    pins: [
      { x: 200, y: 420, label: 'Karsog', alt: '1,360m' },
      { x: 295, y: 248, label: 'Jungle Chowki', alt: '2,800m' },
      { x: 420, y: 132, label: 'Shikari Devi', alt: '4,200m' },
    ],
  },
  {
    id: 'barot',
    name: 'Barot Valley Walk',
    path: 'M 480,350 C 495,325 505,300 510,270 C 515,240 510,215 505,188 C 500,162 492,142 480,122',
    pins: [
      { x: 480, y: 350, label: 'Barot', alt: '1,600m' },
      { x: 510, y: 270, label: 'Uhl River', alt: '1,900m' },
      { x: 480, y: 122, label: 'Nargu Ridge', alt: '3,300m' },
    ],
  },
  {
    id: 'mandi',
    name: 'Mandi Temple Circuit',
    path: 'M 80,440 C 95,430 112,420 130,415 C 148,410 165,408 182,405',
    pins: [
      { x: 80,  y: 440, label: 'Old Mandi', alt: '826m' },
      { x: 182, y: 405, label: 'Panchvaktra', alt: '840m' },
    ],
  },
]

// Static contour elevation lines — ellipses centered at mountain region
const CONTOURS = Array.from({ length: 10 }, (_, i) => ({
  cx: 320, cy: 220,
  rx: 60  + i * 38,
  ry: 35  + i * 22,
  opacity: 0.06 + (9 - i) * 0.012,
}))

export default function TopoMap({ activeTrekId }) {
  const pathRefs = useRef({})
  const pinRefs  = useRef({})

  // Initialise stroke-dasharray on mount
  useEffect(() => {
    TREKS.forEach(trek => {
      const el = pathRefs.current[trek.id]
      if (!el) return
      const len = el.getTotalLength()
      el.style.strokeDasharray  = len
      el.style.strokeDashoffset = len
      el.dataset.length = len
    })
  }, [])

  // Animate active trek route + pins
  useEffect(() => {
    TREKS.forEach(trek => {
      const pathEl = pathRefs.current[trek.id]
      const isActive = trek.id === activeTrekId

      if (pathEl) {
        pathEl.style.stroke       = isActive ? 'rgb(var(--pine))'       : 'rgb(var(--soft) / 0.18)'
        pathEl.style.strokeWidth  = isActive ? '2.5'                    : '1'
        pathEl.style.strokeDashoffset = isActive ? '0' : pathEl.dataset.length || '1000'
      }

      // Pins
      trek.pins.forEach((_, j) => {
        const pinEl = pinRefs.current[`${trek.id}-${j}`]
        if (!pinEl) return
        if (isActive) {
          setTimeout(() => pinEl.classList.add('visible'), j * 110)
        } else {
          pinEl.classList.remove('visible')
        }
      })
    })
  }, [activeTrekId])

  return (
    <svg
      viewBox="0 0 700 500"
      className="w-full h-full"
      style={{ overflow: 'visible' }}
      aria-label="Uttarshall Valley topographic map"
    >
      {/* Valley floor fill */}
      <ellipse cx="340" cy="340" rx="280" ry="120" fill="rgb(var(--pine) / 0.04)" />

      {/* River / water body */}
      <path
        d="M 80,440 C 160,420 260,400 360,390 C 460,380 550,375 610,365"
        fill="none" stroke="rgb(var(--pine) / 0.2)" strokeWidth="1.5"
        strokeDasharray="6 4"
      />

      {/* Contour elevation lines */}
      {CONTOURS.map((c, i) => (
        <ellipse
          key={i}
          cx={c.cx} cy={c.cy}
          rx={c.rx} ry={c.ry}
          fill="none"
          stroke="rgb(var(--soft))"
          strokeWidth="0.6"
          strokeDasharray="4 8"
          style={{ opacity: c.opacity }}
        />
      ))}

      {/* Trek routes */}
      {TREKS.map(trek => (
        <path
          key={trek.id}
          ref={el => { if (el) pathRefs.current[trek.id] = el }}
          d={trek.path}
          fill="none"
          stroke="rgb(var(--soft) / 0.18)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="topo-route"
          style={{ transition: 'stroke-dashoffset var(--dur-cinematic) var(--ease-luxury), stroke var(--dur-base) ease, stroke-width var(--dur-base) ease' }}
        />
      ))}

      {/* Location pins */}
      {TREKS.map(trek =>
        trek.pins.map((pin, j) => (
          <g
            key={`${trek.id}-${j}`}
            ref={el => { if (el) pinRefs.current[`${trek.id}-${j}`] = el }}
            className="topo-pin"
            style={{ transition: `opacity var(--dur-slow) var(--ease-luxury) ${j * 110}ms, transform var(--dur-slow) var(--ease-luxury) ${j * 110}ms` }}
          >
            <circle
              cx={pin.x} cy={pin.y} r="4"
              fill={trek.id === 'shikari' && j === trek.pins.length - 1 ? 'rgb(var(--sun))' : 'rgb(var(--pine))'}
              stroke="rgb(var(--surface))" strokeWidth="1.5"
            />
            <text
              x={pin.x + 8} y={pin.y - 6}
              fontSize="9" fontFamily="monospace"
              fill="rgb(var(--ink))"
              style={{ opacity: 0.8 }}
            >
              {pin.label}
            </text>
            <text
              x={pin.x + 8} y={pin.y + 4}
              fontSize="7.5" fontFamily="monospace"
              fill="rgb(var(--soft))"
              style={{ opacity: 0.5 }}
            >
              {pin.alt}
            </text>
          </g>
        ))
      )}

      {/* North indicator */}
      <g transform="translate(650, 50)">
        <line x1="0" y1="12" x2="0" y2="-12" stroke="rgb(var(--soft))" strokeWidth="1" style={{ opacity: 0.3 }} />
        <polygon points="0,-14 -4,-6 4,-6" fill="rgb(var(--pine))" style={{ opacity: 0.5 }} />
        <text x="0" y="22" textAnchor="middle" fontSize="8" fontFamily="monospace" fill="rgb(var(--soft))" style={{ opacity: 0.4 }}>N</text>
      </g>

      {/* Scale bar */}
      <g transform="translate(30, 470)">
        <line x1="0" y1="0" x2="60" y2="0" stroke="rgb(var(--soft))" strokeWidth="1" style={{ opacity: 0.3 }} />
        <line x1="0" y1="-3" x2="0" y2="3" stroke="rgb(var(--soft))" strokeWidth="1" style={{ opacity: 0.3 }} />
        <line x1="60" y1="-3" x2="60" y2="3" stroke="rgb(var(--soft))" strokeWidth="1" style={{ opacity: 0.3 }} />
        <text x="30" y="-6" textAnchor="middle" fontSize="7" fontFamily="monospace" fill="rgb(var(--soft))" style={{ opacity: 0.35 }}>5 km</text>
      </g>
    </svg>
  )
}
