import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          500: '#f97316',  // naranja moto
          600: '#ea6c00',
          700: '#c2580a',
          900: '#431407',
        },
        dark: {
          800: '#1a1a1a',
          900: '#111111',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
