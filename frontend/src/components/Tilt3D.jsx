import { useRef } from 'react'

export default function Tilt3D({
  children,
  className = '',
  style,
  intensity = 10,
  scale = 1.03,
  shine = true,
}) {
  const ref    = useRef(null)
  const raf    = useRef(null)
  const shineRef = useRef(null)

  const onMove = e => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rx = ((y / rect.height) - 0.5) * -intensity
    const ry = ((x / rect.width)  - 0.5) *  intensity

    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(${scale},${scale},${scale})`
      el.style.transition = 'transform 60ms linear'

      // Shine highlight follows cursor
      if (shine && shineRef.current) {
        const pctX = (x / rect.width)  * 100
        const pctY = (y / rect.height) * 100
        shineRef.current.style.background =
          `radial-gradient(circle at ${pctX}% ${pctY}%, rgba(255,255,255,0.12) 0%, transparent 65%)`
        shineRef.current.style.opacity = '1'
      }
    })
  }

  const onLeave = () => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(raf.current)
    el.style.transition = 'transform 700ms cubic-bezier(0.16, 1, 0.3, 1)'
    el.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    if (shine && shineRef.current) shineRef.current.style.opacity = '0'
  }

  return (
    <div
      ref={ref}
      className={`${className} relative`}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform', ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {shine && (
        <div
          ref={shineRef}
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit',
            opacity: 0, transition: 'opacity 150ms ease', pointerEvents: 'none', zIndex: 10,
          }}
        />
      )}
      {children}
    </div>
  )
}
