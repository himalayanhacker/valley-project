import { useEffect, useRef } from 'react'

const DIRECTION_STYLES = {
  up:    { opacity: 0, transform: 'translateY(28px)' },
  down:  { opacity: 0, transform: 'translateY(-28px)' },
  left:  { opacity: 0, transform: 'translateX(-32px)' },
  right: { opacity: 0, transform: 'translateX(32px)' },
  fade:  { opacity: 0, transform: 'none' },
}

export default function Reveal({ children, className = '', delay = 0, direction = 'up', once = true }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = ''
      el.style.transform = ''
      return
    }

    const styles = DIRECTION_STYLES[direction] || DIRECTION_STYLES.up
    Object.assign(el.style, styles, {
      transition: `opacity var(--dur-slow) var(--ease-luxury), transform var(--dur-slow) var(--ease-luxury)`,
    })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const activate = () => {
            el.style.opacity = '1'
            el.style.transform = 'none'
          }
          if (delay) setTimeout(activate, delay)
          else activate()
          if (once) observer.disconnect()
        } else if (!once) {
          Object.assign(el.style, styles)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, direction, once])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
