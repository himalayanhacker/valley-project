import useThemeStore from '../store/theme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className="w-9 h-9 rounded-full border border-line-strong flex items-center justify-center text-soft hover:text-pine hover:border-pine transition-colors"
    >
      <span aria-hidden="true">{theme === 'light' ? '🌙' : '☀️'}</span>
    </button>
  )
}
