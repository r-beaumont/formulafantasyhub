import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#080C10',
        surface: '#0E1318',
        surface2: '#141B22',
        surface3: '#1C2630',
        red: '#E8002D',
        green: '#00D47E',
        amber: '#FFB800',
        blue: '#00A8FF',
        'text-primary': '#F0F4F8',
        muted: '#5A6A7A',
        muted2: '#3A4A5A',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.07)',
      },
    },
  },
  plugins: [],
}
export default config
