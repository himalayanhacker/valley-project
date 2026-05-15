/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#010409',
        panel: '#0d1117',
        sky: '#38bdf8',
        'sky-dark': '#0ea5e9',
        leaf: '#4ade80',
        'leaf-dark': '#22c55e',
        mint: '#38bdf8',
        sub: '#8b949e',
        border: 'rgba(56,189,248,0.15)',
        'border-strong': 'rgba(56,189,248,0.3)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [],
}
