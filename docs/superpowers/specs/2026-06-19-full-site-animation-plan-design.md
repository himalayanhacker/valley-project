# Full-Site Animation & Interactivity Plan — Uttarshall Valley

**Date:** 2026-06-19
**Branch:** feat/light-airy-theme
**Stack:** React 18, Tailwind CSS 3.4, Vite, React Router

---

## Philosophy

**Luxury Travel Magazine.** Slow, deliberate, cinematic. Easing curves 800ms–1200ms. Content breathes onto the page. Not everything animates — frequency is low, impact is high. Think Condé Nast Traveller digital. The valley is a destination you savour, not rush through.

---

## Section 1: Architecture & Shared Animation System

### Animation tokens

Add to `frontend/src/index.css` `:root`:

```css
--ease-luxury: cubic-bezier(0.16, 1, 0.3, 1);
--dur-fast:      350ms;
--dur-base:      650ms;
--dur-slow:      950ms;
--dur-cinematic: 1200ms;
```

All new transitions default to `--dur-slow` + `--ease-luxury` unless specified otherwise.

### Page crossfade transitions

New file: `frontend/src/components/PageTransition.jsx`

- Wrap React Router `<Outlet>` in Framer Motion `<AnimatePresence mode="wait">`
- Each page wrapped in `<motion.div>` with:
  - Exit: `opacity: 0, y: 12, transition: { duration: 0.35, ease: 'easeIn' }`
  - Enter: `opacity: 1, y: 0, initial: { opacity: 0, y: -12 }, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }`
- Navbar sits outside `AnimatePresence` — never transitions

Install: `npm install framer-motion`

### `Reveal.jsx` upgrade

Add props:
- `direction`: `'up'` (default, current) | `'left'` | `'right'` | `'fade'`
- `once`: boolean (default `true`) — don't re-animate on scroll-up
- `delay`: number in ms (existing)

Direction-to-transform map:
- `up`: `translateY(28px) → 0`
- `left`: `translateX(-32px) → 0`
- `right`: `translateX(32px) → 0`
- `fade`: no transform, opacity only

### `useReducedMotion` hook

New file: `frontend/src/hooks/useReducedMotion.js`

```js
import { useEffect, useState } from 'react'
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = e => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}
```

All animation components read this hook. When `true`: durations collapse to `1ms`, parallax skipped, path draw skipped (paths appear fully drawn immediately).

---

## Section 2: Home Page Additions

### Hero text dissolve on scroll

- Split the hero headline into individual `<span>` elements per character (space chars get `&nbsp;`)
- On `scroll` event, compute progress `p = scrollY / heroHeight`, clamped to `[0, 1]`
- Per character at index `i` of total `n`: local progress = `clamp((p - i/(n*1.5)) * 2.5, 0, 1)`
- Apply: `opacity: 1 - localP`, `filter: blur(${localP * 8}px)`
- Photo `brightness`: `0.85 + 0.15 * p` (sharpens as text disappears)
- `useReducedMotion`: skip per-char animation, text stays opaque

### Overview / stats section

- Add horizontal reveal line: `div` with `width: 0 → 100%`, `height: 1px`, pine gradient, `1200ms --ease-luxury`, triggered by parent Reveal entering view
- Stat count-up already built — add: unit label (e.g. "m", "km", "°C") fades in 200ms after count lands
- Section heading sweep underline timing: upgrade to `--dur-cinematic`

### Article / editorial strip

- Card hover: topo-ring SVG pattern appears as `background-image` on `::before` pseudo-element, `opacity: 0 → 0.06`, `500ms`
- Reading time + category tag: on hover, slide in from left (`translateX(-8px) → 0`, `opacity 0 → 1`, `300ms`)

---

## Section 3: Gallery Page (Cinematic Full-Width Scroll)

New file: `frontend/src/pages/Gallery.jsx` (currently may be stub — full rewrite).

### Layout

- Each photo: `100vw` wide, `90vh` tall, stacked vertically
- Desktop: `65vw` photo + `35vw` editorial sidebar, side by side
- Mobile: full-width photo, caption below

### Parallax

- Photo `<img>` rendered at `110%` height, centered
- `useRef` + scroll listener: `translateY = (sectionTop - scrollY) * 0.4`
- Applied via direct DOM mutation (no re-render) — same pattern as Home hero
- `useReducedMotion`: set `translateY = 0` always

### Sidebar content (per photo)

- Location name: Fraunces, 48px, ink
- Altitude + GPS: monospace, soft/60, same token style as AltitudeMeter
- Editorial caption: 2–3 sentences, Inter, soft
- Category tag + photo counter: `04 / 24 · Landscapes`
- Ghost button: `"View full screen ↗"`

### Reveal sequence (IntersectionObserver, threshold 0.3)

- Photo: `clip-path: inset(0 100% 0 0 → 0 0 0 0)`, `--dur-cinematic`
- Sidebar items staggered: `0ms`, `150ms`, `300ms`, `450ms`

### Lightbox

- Full-screen overlay (`position: fixed, inset: 0, bg: ink/90, backdrop-blur: 4px`)
- Opens on photo click or ghost button
- Crossfade in: `opacity 0 → 1, 350ms`
- Same editorial content as sidebar
- Keyboard: `←` `→` navigate, `Esc` closes
- Touch: swipe left/right (pointer events, no library needed)
- Close button top-right: `×`, hover `text-pine`

### Filter bar

- Options: `All · Landscapes · Wildlife · Villages · Treks`
- Active tab: pine underline sweep (`.nav-link::after` pattern)
- Filter: matched photos `opacity 0 → 1, 400ms`; unmatched `opacity 1 → 0, 300ms`
- No layout shift — all photos rendered, unmatched set `display: none` after fade-out

---

## Section 4: Explore Page — Signature Topo Map

New file: `frontend/src/pages/Explore.jsx` (full implementation).
New component: `frontend/src/components/TopoMap.jsx`

### Page structure

- Sticky map panel: `position: sticky, top: 0, height: 100vh`, left `50%` of screen
- Trek cards: right `50%`, scroll past the sticky map
- On mobile: map collapses to a decorative header illustration, cards stack below

### SVG topo map (`TopoMap.jsx`)

- `viewBox="0 0 800 600"`, `preserveAspectRatio="xMidYMid meet"`
- Static layer: elevation contour lines (dashed, `soft/15`, 8–12 lines)
- Static layer: valley floor fill, river path, forest patches (decorative SVG shapes)
- Dynamic layer: trek route `<path>` elements — one per trek
- Dynamic layer: location `<circle>` + `<text>` pin per point of interest

**Route draw animation:**
- Each route path: compute `getTotalLength()` on mount, set `strokeDasharray = strokeDashoffset = length`
- On activation: `strokeDashoffset` transitions to `0` via CSS transition `1200ms --ease-luxury`
- Active route: stroke `rgb(var(--pine))`, `strokeWidth: 2.5`
- Inactive routes: stroke `rgb(var(--soft) / 0.15)`, `strokeWidth: 1`
- `useReducedMotion`: all routes shown fully drawn, no animation

**Location pins:**
- On trek activation, pins for that route's waypoints drop in: `translateY(-8px) → 0`, `opacity 0 → 1`, `500ms`, staggered `100ms` per pin
- Hover on pin: tooltip with name + altitude

### Trek card

- Full-bleed photo, dark scrim `linear-gradient(to top, ink/80, transparent)`
- Trek name: Fraunces, white, 28px
- Stats row: distance · duration · difficulty, small caps, white/70
- Altitude sparkline (see below)
- `"Explore Trek →"` link, pine color

### Altitude sparkline

- `<svg>` inline, `width: 100%, height: 48px`
- `<polyline>` with 6–8 elevation waypoints, normalized to SVG height
- Stroke-dashoffset draw animation on card reveal: `800ms --ease-luxury`
- Hover on waypoint `<circle>`: tooltip `"Prashar Lake · 2,730m"`
- `useReducedMotion`: polyline shown fully, no draw animation

### Scroll binding

- `IntersectionObserver` on each trek card (`threshold: 0.4`)
- On enter: call `setActiveTrek(id)` → map updates active route + pins
- One active trek at a time; previous route fades to inactive

---

## Section 5: Packages Page

New/upgraded: `frontend/src/pages/Packages.jsx`

### Package cards — curtain reveal

- Card size: `aspect-ratio: 3/4`, full-bleed landscape photo background
- Default: photo + package name in small white type pinned to bottom, `font-size: 14px`, `letter-spacing: 0.08em`
- Hover trigger: `clip-path: inset(100% 0 0 0)` on overlay `div` → `inset(0 0 0 0)`, `600ms --ease-luxury`
- Overlay: `background: linear-gradient(to top, rgb(var(--pine) / 0.92), rgb(var(--pine) / 0.75))`
- Overlay content (all white, staggered):
  - `0ms`: Package name, Fraunces, 32px
  - `80ms`: Price, `"₹18,500 / person"`, Inter semibold
  - `160ms`: 4 key inclusions, small bulleted list
  - `350ms`: `"Book Now →"` CTA button (white border, white text, hover fills white/ink)
- Mobile (touch): overlay always visible at 60% height — no hover dependency

### Page header

- Large Fraunces heading, sweep underline
- Subtitle: `"Curated journeys into Uttarshall Valley — crafted for those who travel with intention"`
- Horizontal divider line draws left-to-right on reveal

### Grid

- 3 columns desktop (`gap: 24px`), 2 columns tablet, 1 column mobile
- Cards stagger reveal: `delay: i * 120ms`

---

## Section 6: Contact Page

### Form interactions

- Field underline: on focus, pine `::after` pseudo-element sweeps in from left (`width: 0 → 100%`, `400ms`)
- Label: floats up on focus (standard float-label pattern), `300ms`
- Submit button: `.btn-primary` with existing lift hover — no additional animation

### Layout

- Left column: large Fraunces pull quote about the valley, `direction: 'right'` Reveal
- Right column: form, `direction: 'left'` Reveal, `delay: 200ms`
- Below form: coordinate stamp `"31.71°N · 76.92°E · Mandi, Himachal Pradesh"`, monospace, soft/40

---

## Section 7: Navbar Upgrades

- **Scroll-aware bg:** transparent when `scrollY < 80`, transition to `surface/90 + backdrop-blur(12px)` when scrolled — verify current implementation covers all pages, not just Home
- **Active page indicator:** `nav-link.active` underline stays extended (already using `.active` class from React Router `<NavLink>`)
- **Mobile menu:** slides in from right (`translateX(100%) → 0`, `400ms --ease-luxury`), backdrop closes on tap
- **Link stagger:** menu links stagger in `delay: i * 50ms`, `direction: 'right'` Reveal

---

## File Inventory

| File | Action |
|------|--------|
| `frontend/src/index.css` | Add animation tokens |
| `frontend/src/hooks/useReducedMotion.js` | New |
| `frontend/src/components/PageTransition.jsx` | New |
| `frontend/src/components/Reveal.jsx` | Upgrade (direction, once props) |
| `frontend/src/components/TopoMap.jsx` | New |
| `frontend/src/pages/Home.jsx` | Upgrade (hero dissolve, article hover) |
| `frontend/src/pages/Gallery.jsx` | Full rewrite |
| `frontend/src/pages/Explore.jsx` | Full rewrite |
| `frontend/src/pages/Packages.jsx` | Full rewrite |
| `frontend/src/pages/Contact.jsx` | Upgrade |
| `frontend/src/App.jsx` or router file | Add PageTransition wrapper |
| `package.json` | Add `framer-motion` |

---

## Out of Scope

- Cursor proximity effects (too heavy for luxury tone)
- Particle systems or canvas-based animations
- Video background on hero
- Any animation that requires a backend change
