// Animated topographic contour rings — like a live topo map over the hero photo.
// Rings are centered at the mountain peak position in the Prashar Lake photo.
// Negative animation delays put each ring at a unique phase immediately on load.

const RINGS = Array.from({ length: 32 }, (_, i) => ({
  rx: 35 + i * 44,
  ry: 20 + i * 26,
  dash: `${5 + (i % 3) * 2} ${9 + (i % 4) * 3}`,
  delay: -(i * 0.28),
  dur: 9 + i * 0.35,
  opacity: Math.max(0.03, 0.13 - i * 0.003),
}))

export default function TopoBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g style={{ mixBlendMode: 'screen' }}>
        {RINGS.map((r, i) => (
          <ellipse
            key={i}
            cx="680"
            cy="310"
            rx={r.rx}
            ry={r.ry}
            fill="none"
            stroke="rgb(91 190 139)"
            strokeWidth="0.65"
            strokeDasharray={r.dash}
            style={{
              opacity: r.opacity,
              animation: `topo-march ${r.dur}s linear infinite`,
              animationDelay: `${r.delay}s`,
            }}
          />
        ))}
      </g>
    </svg>
  )
}
