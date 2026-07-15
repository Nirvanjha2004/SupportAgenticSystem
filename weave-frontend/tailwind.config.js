/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0E17',
        surface: '#131A2B',
        'surface-raised': '#1A2338',
        line: '#26314A',
        'text-primary': '#E9ECF4',
        'text-muted': '#8C97B3',
        accent: '#6C63FF',
        'accent-soft': 'rgba(108, 99, 255, 0.1)',
        'signal-amber': '#F5A623',
        'signal-green': '#3DD68C',
        'signal-red': '#F0546A',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '10px',
        btn: '8px',
        chip: '6px',
      },
    },
  },
  plugins: [],
}