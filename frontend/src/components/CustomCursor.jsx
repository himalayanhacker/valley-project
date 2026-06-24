import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const mouse   = useRef({ x: -200, y: -200 })
  const ring    = useRef({ x: -200, y: -200 })
  const rafRef  = useRef(null)
  const hovered = useRef(false)
  const visible = useRef(false)

  useEffect(() => {
    // Only on fine-pointer (mouse) devices
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot  = dotRef.current
    const ring_ = ringRef.current
    if (!dot || !ring_) return

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      dot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
      if (!visible.current) {
        visible.current = true
        dot.style.opacity  = '1'
        ring_.style.opacity = '1'
      }
    }

    const onOver = (e) => {
      if (e.target.closest('a, button, [role="button"], [tabindex]')) {
        hovered.current = true
        ring_.style.width  = '48px'
        ring_.style.height = '48px'
        ring_.style.borderColor = 'rgb(47 111 79)'
        dot.style.transform = `translate(${mouse.current.x - 3}px, ${mouse.current.y - 3}px) scale(1.5)`
      }
    }

    const onOut = (e) => {
      if (e.target.closest('a, button, [role="button"], [tabindex]')) {
        hovered.current = false
        ring_.style.width  = '32px'
        ring_.style.height = '32px'
        ring_.style.borderColor = 'rgb(47 111 79 / 0.45)'
        dot.style.transform = `translate(${mouse.current.x - 4}px, ${mouse.current.y - 4}px) scale(1)`
      }
    }

    const onLeave = () => {
      visible.current = false
      dot.style.opacity  = '0'
      ring_.style.opacity = '0'
    }

    const loop = () => {
      const dx = mouse.current.x - ring.current.x
      const dy = mouse.current.y - ring.current.y
      ring.current.x += dx * 0.14
      ring.current.y += dy * 0.14
      const hw = hovered.current ? 24 : 16
      ring_.style.transform = `translate(${ring.current.x - hw}px, ${ring.current.y - hw}px)`
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    document.addEventListener('mousemove',  onMove,  { passive: true })
    document.addEventListener('mouseover',  onOver)
    document.addEventListener('mouseout',   onOut)
    document.addEventListener('mouseleave', onLeave)

    return () => {
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mouseover',  onOver)
      document.removeEventListener('mouseout',   onOut)
      document.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 8, height: 8,
          background: 'rgb(47 111 79)',
          borderRadius: '50%',
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: 0,
          willChange: 'transform, opacity',
          transition: 'opacity 250ms ease',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 32, height: 32,
          border: '1px solid rgb(47 111 79 / 0.45)',
          borderRadius: '50%',
          zIndex: 9998,
          pointerEvents: 'none',
          opacity: 0,
          willChange: 'transform, opacity',
          transition: 'opacity 250ms ease, width 200ms cubic-bezier(0.16,1,0.3,1), height 200ms cubic-bezier(0.16,1,0.3,1), border-color 200ms ease',
        }}
      />
    </>
  )
}
