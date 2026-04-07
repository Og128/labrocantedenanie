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
        terracotta: {
          50: '#fdf4f0',
          100: '#fae4d9',
          200: '#f5c5ad',
          300: '#eda07d',
          400: '#e27a4d',
          500: '#C4623A',
          600: '#b54e2a',
          700: '#963d22',
          800: '#7a3220',
          900: '#652c1f',
        },
        cream: '#FAF7F2',
        beige: '#E8DDD0',
        offwhite: '#FDFBF8',
        brown: {
          DEFAULT: '#6B4F3A',
          light: '#8B6A50',
          dark: '#4A3526',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}

export default config
