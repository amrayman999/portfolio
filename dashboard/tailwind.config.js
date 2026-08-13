/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          700: '#1e3f96',
          800: '#152c63',
          900: '#0d1b3a',
          950: '#070f22',
        },
        brand: {
          50: '#eef4ff',
          100: '#dbe7fe',
          200: '#bfd3fe',
          300: '#94b4fd',
          400: '#608ffa',
          500: '#3b6df6',
          600: '#2563eb',
          700: '#1d4fc8',
          800: '#1e3f96',
          900: '#1a3069',
          950: '#111f45',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Tajawal', 'system-ui', 'sans-serif'],
        heading: ['Sora', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
        'fade-in': 'fadeIn 0.8s ease-out both',
        blob: 'blob 12s ease-in-out infinite',
        'spin-slow': 'spin 18s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(30px,-40px) scale(1.1)' },
          '66%': { transform: 'translate(-20px,20px) scale(0.95)' },
        },
      },
    },
  },
  plugins: [],
};