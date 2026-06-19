import { useRef } from 'react'
import gsap from 'gsap'

export default function MagneticBtn({ children, className, strength = 0.38 }) {
  const ref = useRef(null)

  const onMove = e => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width  / 2) * strength
    const y = (e.clientY - rect.top  - rect.height / 2) * strength
    gsap.to(el, { x, y, duration: 0.35, ease: 'power2.out' })
  }

  const onLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.75, ease: 'elastic.out(1, 0.45)' })
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  )
}
