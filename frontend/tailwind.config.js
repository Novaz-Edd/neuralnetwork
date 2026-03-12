/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // ── Custom dark palette ────────────────────────────────────────────────
      colors: {
        dark: {
          950: '#04060d',
          900: '#080d1a',
          800: '#0d1427',
          700: '#111c38',
          600: '#172344',
          500: '#1e2e56',
        },
        brand: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
        },
      },

      // ── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },

      // ── Animations ────────────────────────────────────────────────────────
      animation: {
        'fade-in':  'fadeIn 0.4s ease-out both',
        'slide-up': 'slideUp 0.4s ease-out both',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },

      // ── Shadows ───────────────────────────────────────────────────────────
      boxShadow: {
        card:      '0 4px 24px rgba(0,0,0,0.45)',
        'card-lg': '0 8px 40px rgba(0,0,0,0.55)',
        glow:      '0 0 24px rgba(59,130,246,0.25)',
        'glow-lg': '0 0 48px rgba(59,130,246,0.40)',
      },
    },
  },
  plugins: [],
}
