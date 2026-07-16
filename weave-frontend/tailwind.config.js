/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FBF9F5',
          100: '#F5F1E8',
          150: '#EEE7DA',
          200: '#E8E2D8',
          300: '#DDD5C8',
          400: '#C5BBAA',
          500: '#A89D8A',
          600: '#8A857D',
          700: '#6D685F',
          800: '#4A4740',
          900: '#2B2A26',
        },
        // Primary palette
        bg: {
          primary: '#F5F1E8',
          secondary: '#EEE7DA',
          card: '#FBF9F5',
        },
        text: {
          primary: '#2B2A26',
          secondary: '#6D685F',
          muted: '#8A857D',
        },
        accent: {
          DEFAULT: '#5E6B3F',
          hover: '#49552F',
          soft: '#A8B18A',
          light: '#C5CDB0',
          pale: '#E2E6D5',
        },
        highlight: '#DCCB9A',
        border: '#DDD5C8',
        divider: '#E8E2D8',
        signal: {
          success: '#567D46',
          warning: '#C68A32',
          danger: '#A84F3A',
        },
        // Material-inspired natural tones
        clay: '#C4A882',
        linen: '#D4C9B8',
        stone: '#B8B0A0',
        wood: '#8B7355',
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.12em' }],
        'display-sm': ['0.75rem', { lineHeight: '1.25rem', letterSpacing: '0.1em' }],
        'hero': ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'hero-md': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'hero-lg': ['5.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'hero-xl': ['6.5rem', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'heading': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'heading-md': ['3rem', { lineHeight: '1.08', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
        chip: '8px',
        lg: '20px',
        xl: '24px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(43, 42, 38, 0.06), 0 1px 4px rgba(43, 42, 38, 0.04)',
        'card': '0 2px 8px rgba(43, 42, 38, 0.06), 0 1px 2px rgba(43, 42, 38, 0.04)',
        'card-hover': '0 4px 16px rgba(43, 42, 38, 0.09), 0 2px 4px rgba(43, 42, 38, 0.05)',
        'elevated': '0 8px 32px rgba(43, 42, 38, 0.1), 0 2px 8px rgba(43, 42, 38, 0.05)',
        'button': '0 1px 2px rgba(43, 42, 38, 0.06)',
        'button-hover': '0 2px 8px rgba(43, 42, 38, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-up-slow': 'fadeUp 1.2s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'drift': 'drift 10s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'blur-in': 'blurIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '33%': { transform: 'translate(8px, -8px)' },
          '66%': { transform: 'translate(-4px, 4px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
          '100%': { opacity: '0.4' },
        },
        blurIn: {
          '0%': { opacity: '0', filter: 'blur(8px)', transform: 'translateY(12px)' },
          '100%': { opacity: '1', filter: 'blur(0)', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring-slow': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
