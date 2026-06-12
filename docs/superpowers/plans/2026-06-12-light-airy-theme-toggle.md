# Light Airy Nature Theme + Dark/Light Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dark cyberpunk theme (near-black + neon blue/green) with a light, airy nature palette as the default, and add a persistent dark/light theme toggle in the navbar.

**Architecture:** All colors move to CSS custom properties (RGB triplets) consumed by Tailwind semantic tokens (`canvas`, `surface`, `ink`, `soft`, `pine`, `moss`, `sun`, `line`). Light values live on `:root`, dark values on `.dark` (Tailwind `darkMode: 'class'`). A zustand store persists the choice to localStorage; `App.jsx` syncs it to `<html class="dark">`. Component JSX is migrated mechanically (sed) from old tokens (`void`, `panel`, `sky`, `leaf`, `sub`) to the new semantic ones, then hand-cleaned for inline styles, grayscale filters, and tech-y effects (scan-line, grid background, mono font).

**Tech Stack:** React 18, Vite 5, Tailwind 3.4 (class dark mode), zustand 4 (`persist` middleware). No test runner exists in this project — verification is via `vite build`, grep sweeps, and browser checks against the running dev container (http://localhost:5180).

**Working directory for all commands:** `/home/server/Desktop/amit-projects/valley-project` (repo root). Frontend dev server runs in docker compose with a volume mount, so file edits hot-reload at http://localhost:5180.

---

## Color System Reference (used by every task)

| Token | Class examples | Light (`:root`) | Dark (`.dark`) | Role |
|---|---|---|---|---|
| `canvas` | `bg-canvas` | `250 250 247` (#FAFAF7 warm off-white) | `15 21 18` (#0F1512 forest charcoal) | page background |
| `surface` | `bg-surface` | `255 255 255` (#FFFFFF) | `22 32 27` (#16201B) | cards, panels, navbar |
| `ink` | `text-ink` | `28 43 34` (#1C2B22) | `232 237 233` (#E8EDE9) | primary text |
| `soft` | `text-soft` | `92 107 97` (#5C6B61) | `154 168 160` (#9AA8A0) | secondary text |
| `pine` | `text-pine`, `bg-pine` | `47 111 79` (#2F6F4F) | `91 190 139` (#5BBE8B) | primary accent (green) |
| `moss` | `to-moss` | `35 82 57` (#235239) | `62 146 104` (#3E9268) | darker green, gradient end |
| `sun` | `text-sun` | `217 119 6` (#D97706 amber) | `245 165 36` (#F5A524) | warm secondary accent |
| `line` | `border-line` | `228 231 226` (#E4E7E2) | `36 48 41` (#243029) | hairline borders |
| `line-strong` | `border-line-strong` | `201 208 202` (#C9D0CA) | `51 69 59` (#33453B) | emphasized borders |

Old → new token mapping (Task 3 applies this): `bg-void`→`bg-canvas`, `text-void`→`text-white` (only used on accent buttons), `bg-panel`→`bg-surface`, `text-sub`→`text-soft`, `*-sky`→`*-pine`, `to-leaf`→`to-moss`, `border-[rgba(56,189,248,0.15)]`→`border-line`, `border-[rgba(56,189,248,0.3)]`→`border-line-strong`.

---

### Task 1: Theme foundation — Tailwind config, CSS variables, fonts

**Files:**
- Modify: `frontend/tailwind.config.js` (whole file)
- Modify: `frontend/src/index.css` (whole file)
- Modify: `frontend/index.html:10` (font link)

- [ ] **Step 1: Replace `frontend/tailwind.config.js` entirely**

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        soft: 'rgb(var(--soft) / <alpha-value>)',
        pine: 'rgb(var(--pine) / <alpha-value>)',
        moss: 'rgb(var(--moss) / <alpha-value>)',
        sun: 'rgb(var(--sun) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        'line-strong': 'rgb(var(--line-strong) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 2: Replace `frontend/src/index.css` entirely**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --canvas: 250 250 247;
  --surface: 255 255 255;
  --ink: 28 43 34;
  --soft: 92 107 97;
  --pine: 47 111 79;
  --moss: 35 82 57;
  --sun: 217 119 6;
  --line: 228 231 226;
  --line-strong: 201 208 202;
  color-scheme: light;
}

.dark {
  --canvas: 15 21 18;
  --surface: 22 32 27;
  --ink: 232 237 233;
  --soft: 154 168 160;
  --pine: 91 190 139;
  --moss: 62 146 104;
  --sun: 245 165 36;
  --line: 36 48 41;
  --line-strong: 51 69 59;
  color-scheme: dark;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: rgb(var(--canvas));
  color: rgb(var(--ink));
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Buttons */
.btn-primary {
  background: linear-gradient(135deg, rgb(var(--pine)), rgb(var(--moss)));
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary:hover {
  box-shadow: 0 8px 24px rgb(var(--pine) / 0.35);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  border: 1px solid rgb(var(--line-strong));
  color: rgb(var(--ink));
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  border-color: rgb(var(--pine));
  color: rgb(var(--pine));
  background: rgb(var(--pine) / 0.05);
}

/* Card hover */
.card-hover {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-hover:hover {
  background: rgb(var(--pine) / 0.04);
  border-color: rgb(var(--pine) / 0.5);
}

/* Divider */
.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgb(var(--line-strong)), transparent);
}

/* Nav link underline */
.nav-link {
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: linear-gradient(to right, rgb(var(--pine)), rgb(var(--sun)));
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 100%;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: rgb(var(--canvas)); }
::-webkit-scrollbar-thumb { background: rgb(var(--pine) / 0.3); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgb(var(--pine)); }

/* Category tag */
.category-tag {
  background: rgb(var(--pine) / 0.1);
  color: rgb(var(--pine));
  border: 1px solid rgb(var(--pine) / 0.2);
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  border-radius: 9999px;
}
```

Note what was deliberately removed: `.grid-bg` and `.scan-line` (and its `@keyframes scan`) are deleted — Task 4 removes their JSX usages. `.btn-primary` no longer forces `text-transform: uppercase`.

- [ ] **Step 3: Drop JetBrains Mono from `frontend/index.html`**

Replace line 10:

```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

with:

```html
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

- [ ] **Step 4: Verify the app still compiles (old tokens are now undefined — pages will look broken; that is expected until Task 3)**

Run: `docker compose exec frontend npm run build`
Expected: `✓ built in ...` with no errors. (Tailwind silently ignores unknown classes like `bg-void`, so the build succeeds.)

- [ ] **Step 5: Commit**

```bash
git add frontend/tailwind.config.js frontend/src/index.css frontend/index.html
git commit -m "feat(theme): add CSS-variable color system with light default and dark palette"
```

---

### Task 2: Theme store, toggle component, App wiring

**Files:**
- Create: `frontend/src/store/theme.js`
- Create: `frontend/src/components/ThemeToggle.jsx`
- Modify: `frontend/src/App.jsx`
- Modify: `frontend/src/components/Navbar.jsx`

- [ ] **Step 1: Create `frontend/src/store/theme.js`**

```js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
    }),
    { name: 'uv-theme' }
  )
)

export default useThemeStore
```

- [ ] **Step 2: Create `frontend/src/components/ThemeToggle.jsx`**

```jsx
import useThemeStore from '../store/theme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className="w-9 h-9 rounded-full border border-line-strong flex items-center justify-center text-soft hover:text-pine hover:border-pine transition-colors"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
```

- [ ] **Step 3: Wire the theme class in `frontend/src/App.jsx`**

Add the import below the existing `useAuthStore` import (line 12):

```js
import useThemeStore from './store/theme'
```

Inside `App()`, after `const { fetchMe } = useAuthStore()`, add:

```js
const { theme } = useThemeStore()

useEffect(() => {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}, [theme])
```

- [ ] **Step 4: Add the toggle to `frontend/src/components/Navbar.jsx`**

Add the import after the `useAuthStore` import (line 3):

```js
import ThemeToggle from './ThemeToggle'
```

Desktop: in the `<div className="hidden md:flex items-center gap-4">` block (line 42), add `<ThemeToggle />` as the FIRST child, before the Sign In/Out button.

Mobile: in the mobile menu (`{mobileOpen && (...)}` block), add `<ThemeToggle />` on its own line directly after `<div className="divider my-2" />` (line 71).

- [ ] **Step 5: Verify the toggle works**

Run: `curl -s -o /dev/null -w "%{http_code}" http://localhost:5180/`
Expected: `200`

Then in a browser at http://localhost:5180: click the moon/sun button in the navbar. Expected: `<html>` gains/loses the `dark` class (DevTools), the body background flips between off-white and dark forest, and after a page reload the chosen theme persists (localStorage key `uv-theme`).

- [ ] **Step 6: Commit**

```bash
git add frontend/src/store/theme.js frontend/src/components/ThemeToggle.jsx frontend/src/App.jsx frontend/src/components/Navbar.jsx
git commit -m "feat(theme): add persistent dark/light toggle in navbar"
```

---

### Task 3: Mechanical token migration across all JSX

**Files:**
- Modify: all of `frontend/src/pages/*.jsx` and `frontend/src/components/*.jsx` (9 files, ~230 class occurrences)

- [ ] **Step 1: Run the sed migration (order matters — arbitrary-value patterns first, then named tokens, then the gradient fix)**

```bash
cd /home/server/Desktop/amit-projects/valley-project/frontend/src
find . -name '*.jsx' -print0 | xargs -0 sed -i \
  -e 's/border-\[rgba(56,189,248,0\.15)\]/border-line/g' \
  -e 's/border-\[rgba(56,189,248,0\.3)\]/border-line-strong/g' \
  -e 's/border-\[rgba(56,189,248,0\.05)\]/border-line/g' \
  -e 's/bg-void/bg-canvas/g' \
  -e 's/text-void/text-white/g' \
  -e 's/bg-panel/bg-surface/g' \
  -e 's/text-sub/text-soft/g' \
  -e 's/text-sky/text-pine/g' \
  -e 's/border-sky/border-pine/g' \
  -e 's/bg-sky/bg-pine/g' \
  -e 's/from-sky/from-pine/g' \
  -e 's/to-sky/to-pine/g' \
  -e 's/to-leaf/to-moss/g' \
  -e 's/from-white to-pine/from-pine to-moss/g' \
  -e 's/font-mono //g'
```

Explanation of the two non-obvious lines: `from-white to-sky` (hero "VALLEY" gradient text) first becomes `from-white to-pine` via the `to-sky` rule, then the dedicated rule rewrites it to `from-pine to-moss` so it stays visible on a light page. `font-mono ` is stripped because JetBrains Mono was removed in Task 1.

- [ ] **Step 2: Verify no old tokens remain**

```bash
cd /home/server/Desktop/amit-projects/valley-project/frontend/src
grep -rnE '(void|panel|-sky|-leaf|-sub|font-mono|56,189,248)' --include='*.jsx' .
```

Expected: only matches that are NOT class tokens — i.e. inline `style={{...}}` values containing `56,189,248` or `#010409` (those are fixed in Task 4) and nothing else. If any `bg-void`/`text-sky`-style class survives, fix it by hand using the mapping table at the top of this plan.

- [ ] **Step 3: Verify build and pages render**

Run: `docker compose exec frontend npm run build`
Expected: `✓ built in ...`

Run: `for p in / /gallery /explore /packages /contact; do curl -s -o /dev/null -w "$p %{http_code}\n" http://localhost:5180$p; done`
Expected: `200` for every path.

- [ ] **Step 4: Commit**

```bash
git add frontend/src
git commit -m "refactor(theme): migrate all components to semantic color tokens"
```

---

### Task 4: De-cyberpunk cleanup — inline styles, grayscale, scan-line, grid background

**Files:**
- Modify: `frontend/src/pages/Home.jsx:23,28-32,45,64,114,121,130,137` (line numbers pre-edit)
- Modify: `frontend/src/pages/Explore.jsx:23,90`
- Modify: `frontend/src/pages/Gallery.jsx:75,77`

- [ ] **Step 1: Remove all grayscale photo filters (Home + Gallery)**

```bash
cd /home/server/Desktop/amit-projects/valley-project/frontend/src
find . -name '*.jsx' -print0 | xargs -0 sed -i \
  -e 's/ grayscale contrast-125 opacity-60//g' \
  -e 's/ grayscale hover:grayscale-0//g' \
  -e 's/ grayscale group-hover:grayscale-0//g'
```

Verify: `grep -rn grayscale --include='*.jsx' .` Expected: no output.

- [ ] **Step 2: Remove the grid background and scan line**

In `Home.jsx` line 23, change `<div className="grid-bg">` to `<div>`.
In `Home.jsx`, delete line 32: `<div className="scan-line" />`.
In `Explore.jsx` lines 23 and 90, change `className="pt-16 min-h-screen grid-bg"` to `className="pt-16 min-h-screen"`.

- [ ] **Step 3: Fix the Home hero overlays and heading (lines 29–30, 38)**

The hero must blend into the page background in BOTH themes, so the bottom gradient uses the `--canvas` variable; the neon radial glow is deleted; the heading uses theme text color since the backdrop is now light in light mode. Replace:

```jsx
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #010409, rgba(1,4,9,0.6), transparent)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(56,189,248,0.08), transparent 70%)' }} />
```

with:

```jsx
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgb(var(--canvas)), rgb(var(--canvas) / 0.6), transparent)' }} />
```

and change the heading line 38 from `<span className="block text-white">UTTARSHALL</span>` to `<span className="block text-ink">UTTARSHALL</span>`.

- [ ] **Step 4: Remove the neon button glow (Home line 45)**

Change:

```jsx
            <Link to="/packages" className="btn-primary px-10 py-4 text-sm rounded" style={{ boxShadow: '0 0 15px rgba(56,189,248,0.3)' }}>
```

to:

```jsx
            <Link to="/packages" className="btn-primary px-10 py-4 text-sm rounded">
```

- [ ] **Step 5: Fix the stats-bar gradient text (Home line 64)**

Change:

```jsx
              <p className="text-2xl md:text-3xl font-semibold mb-1" style={{ background: 'linear-gradient(to right, #fff, #38bdf8, #4ade80)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
```

to:

```jsx
              <p className="text-2xl md:text-3xl font-semibold mb-1 bg-gradient-to-r from-pine to-sun bg-clip-text text-transparent">
```

- [ ] **Step 6: Neutralize photo caption overlays (they sit on photos, so they stay dark in both themes)**

```bash
cd /home/server/Desktop/amit-projects/valley-project/frontend/src
find . -name '*.jsx' -print0 | xargs -0 sed -i \
  -e "s/linear-gradient(to top, #010409, transparent)/linear-gradient(to top, rgba(0,0,0,0.75), transparent)/g" \
  -e "s/linear-gradient(to top, rgba(1,4,9,0.9), transparent)/linear-gradient(to top, rgba(0,0,0,0.8), transparent)/g"
```

This covers Home lines 114/121/130/137 and Gallery line 77. Caption text inside these overlays is `text-white`/`text-soft` on a dark scrim — `text-white` stays correct; if any caption uses `text-soft` and looks dim over a photo, change that one to `text-white/80`.

- [ ] **Step 7: Verify no hardcoded theme colors remain anywhere in JSX**

```bash
cd /home/server/Desktop/amit-projects/valley-project/frontend/src
grep -rnE '#010409|#0d1117|#38bdf8|#4ade80|56,189,248|1,4,9' --include='*.jsx' .
```

Expected: no output. Fix any stragglers with the same substitutions as above.

Run: `docker compose exec frontend npm run build`
Expected: `✓ built in ...`

- [ ] **Step 8: Commit**

```bash
git add frontend/src
git commit -m "refactor(theme): full-color photos, theme-aware hero, remove cyberpunk effects"
```

---

### Task 5: Visual verification in both themes

**Files:** none (verification only; fix-forward edits allowed)

- [ ] **Step 1: Confirm all routes render**

Run: `for p in / /gallery /explore /packages /contact; do curl -s -o /dev/null -w "$p %{http_code}\n" http://localhost:5180$p; done`
Expected: `200` for every path.

- [ ] **Step 2: Browser pass — light theme (default)**

Open http://localhost:5180 (clear the `uv-theme` localStorage key first to test the default). Check on each page:
- Page background is warm off-white; text is dark green-charcoal and readable.
- Hero photo is full color; the heading is legible over it.
- Buttons are pine-green; tags are green pills; no neon blue anywhere.
- Cards/panels are white with subtle hairline borders.

- [ ] **Step 3: Browser pass — dark theme**

Click the navbar toggle. Check:
- Background flips to dark forest charcoal (not pure black), text flips light.
- Photos stay full color; caption overlays still readable.
- Toggle icon switches moon↔sun; reload keeps the dark theme; toggling back returns to light.

- [ ] **Step 4: Mobile menu check**

Narrow the window below 768px, open the ☰ menu: links, Sign In, Book Now, and the theme toggle all present and styled.

- [ ] **Step 5: Fix anything found, then final commit if fixes were made**

```bash
git add frontend/src
git commit -m "fix(theme): visual polish from both-theme verification pass"
```

---

## Self-Review Notes

- Spec coverage: light airy default ✓ (Task 1 `:root` = light), whole-site migration ✓ (Tasks 3–4 cover all 9 JSX files, index.css, tailwind config, index.html), toggle ✓ (Task 2, persisted, both desktop and mobile navbar).
- `text-void` (4×) becomes `text-white` — correct because all 4 sit on pine-gradient `btn-primary`/logo-badge backgrounds, which keep white foreground in both themes.
- `bg-black/90|95` modal/lightbox backdrops (AuthModal, AgentWidget, Gallery lightbox) are intentionally left dark — standard for both light and dark UIs.
- `bg-void/30|50|90` become `bg-canvas/...` via sed and stay theme-correct automatically.
