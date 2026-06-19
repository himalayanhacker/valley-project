import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'

export default function PageTransition({ children }) {
  const ref = useRef(null)
  const location = useLocation()
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    gsap.fromTo(el,
      { opacity: 0, y: -14 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', clearProps: 'all' }
    )
  }, [location.pathname, reduced])

  return <div ref={ref}>{children}</div>
}
