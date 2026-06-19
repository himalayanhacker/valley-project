import { useEffect, useRef, useState } from 'react'

const SECTIONS = [
  { id: 'section-hero',     altitude: 4200, label: 'Shikari Devi',  coord: '31.58°N · 77.13°E' },
  { id: 'section-stats',    altitude: 2730, label: 'Prashar Lake',  coord: '31.78°N · 76.97°E' },
  { id: 'section-overview', altitude: 1840, label: 'Barot Forest',  coord: '32.10°N · 76.97°E' },
  { id: 'section-packages', altitude: 1200, label: 'Cedar Ridge',   coord: '31.75°N · 77.05°E' },
  { id: 'section-articles', altitude: 826,  label: 'Mandi Valley',  coord: '31.71°N · 76.92°E' },
]

const MIN = 826
const MAX = 4200

export default function AltitudeMeter() {
  const [altitude, setAltitude] = useState(4200)
  const [label, setLabel] = useState('Shikari Devi')
  const [coord, setCoord] = useState('31.58°N · 77.13°E')
  const [displayed, setDisplayed] = useState(4200)
  const animRef = useRef(null)
  const altRef = useRef(4200)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        const sec = SECTIONS.find(s => s.id === entry.target.id)
        if (!sec) return
        setLabel(sec.label)
        setCoord(sec.coord)
        setAltitude(sec.altitude)

        cancelAnimationFrame(animRef.current)
        const from = altRef.current
        const to = sec.altitude
        const dur = 900
        const t0 = performance.now()
        const tick = now => {
          const p = Math.min((now - t0) / dur, 1)
          const ease = 1 - (1 - p) ** 3
          const v = Math.round(from + (to - from) * ease)
          altRef.current = v
          setDisplayed(v)
          if (p < 1) animRef.current = requestAnimationFrame(tick)
        }
        animRef.current = requestAnimationFrame(tick)
      })
    }, { threshold: 0.35, rootMargin: '-10% 0px -10% 0px' })

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => { observer.disconnect(); cancelAnimationFrame(animRef.current) }
  }, [])

  const progress = (altitude - MIN) / (MAX - MIN)

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-2 select-none pointer-events-none">
      <div className="text-[8px] font-mono text-soft/30 tracking-widest">4,200m</div>

      {/* Gauge */}
      <div className="relative w-4 h-40">
        <div className="absolute left-[7px] top-0 bottom-0 w-[1.5px] bg-line-strong/40 rounded-full" />
        <div
          className="absolute left-[7px] bottom-0 w-[1.5px] rounded-full"
          style={{
            height: `${progress * 100}%`,
            background: 'linear-gradient(to top, rgb(var(--pine)), rgb(var(--sun) / 0.6))',
            transition: 'height 700ms cubic-bezier(0.16,1,0.3,1)',
          }}
        />
        {/* Glowing dot */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[10px] h-[10px] rounded-full border-2 border-canvas"
          style={{
            bottom: `calc(${progress * 100}% - 5px)`,
            background: 'rgb(var(--pine))',
            boxShadow: '0 0 10px 2px rgb(var(--pine) / 0.6)',
            transition: 'bottom 700ms cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>

      <div className="text-[8px] font-mono text-soft/30 tracking-widest">826m</div>

      {/* Readout block */}
      <div className="flex flex-col items-center gap-[3px] mt-1 pt-2 border-t border-pine/15">
        <div className="font-mono text-[11px] font-bold tabular-nums" style={{ color: 'rgb(var(--pine))' }}>
          {displayed.toLocaleString('en-IN')}m
        </div>
        <div className="font-mono text-[8px] text-center leading-tight" style={{ color: 'rgb(var(--soft) / 0.5)' }}>
          {label}
        </div>
        <div className="font-mono text-[7px] text-center leading-tight" style={{ color: 'rgb(var(--soft) / 0.3)' }}>
          {coord}
        </div>
      </div>
    </div>
  )
}
