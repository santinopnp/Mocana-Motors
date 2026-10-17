import type { Config } from 'tailwindcss';

// Tokens del sistema de diseño Mocana Motors
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FDECEB',
          100: '#FAD4D2',
          200: '#F3A9A5',
          400: '#FF6B60',
          500: '#D9241C',  // Rojo Mocana
          600: '#B3121F',  // brand-ink: rojo como texto
          700: '#8E0E18',
          900: '#3D0709',
        },
        dark: {
          800: '#2A2D33',  // Grafito
          900: '#0E0F11',  // Negro Asfalto
        },
        asphalt: { DEFAULT: '#0E0F11', raised: '#2A2D33' },
        chrome: '#C5CAD1',
        surface: { DEFAULT: '#F3F3F1', raised: '#FFFFFF', sunken: '#E4E4E0' },
        ink: { DEFAULT: '#0E0F11', 2: '#2A2D33', 3: '#565B63' },
        focus: '#2563EB',
      },
      fontFamily: {
        sans: ['Saira', 'system-ui', 'sans-serif'],
        display: ['"Titan One"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        md: '10px',
        lg: '16px',
        xl: '16px',
        '2xl': '16px',
        '3xl': '24px',
      },
      maxWidth: { content: '1200px' },
      screens: { lg: '960px', xl: '1280px' },
    },
  },
  plugins: [],
} satisfies Config;
