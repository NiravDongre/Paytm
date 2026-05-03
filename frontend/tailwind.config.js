/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        ink: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c2d2ff',
          300: '#93adff',
          400: '#6b8fff',
          500: '#3d5afe',
          600: '#2642e8',
          700: '#1a2fb5',
          800: '#0f1d6e',
          900: '#080e3a',
          950: '#03061e',
        },
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        lime: {
          400: '#a3e635',
          500: '#84cc16',
        }
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        pulse2: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease both',
        'fade-up-d1': 'fade-up 0.5s 0.08s ease both',
        'fade-up-d2': 'fade-up 0.5s 0.16s ease both',
        'fade-up-d3': 'fade-up 0.5s 0.24s ease both',
        'fade-up-d4': 'fade-up 0.5s 0.32s ease both',
        'fade-in': 'fade-in 0.4s ease both',
        shimmer: 'shimmer 1.4s linear infinite',
        pulse2: 'pulse2 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
