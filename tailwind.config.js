/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-bg-app)',
        surface: 'var(--color-bg-card)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        income: 'var(--color-income)',
        expense: 'var(--color-expense)',
        border: 'var(--color-border)',
        subtle: 'var(--color-text-muted)',
        foreground: 'var(--color-text-main)',
      },
      fontFamily: {
        sans: ['SourceSans3', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}