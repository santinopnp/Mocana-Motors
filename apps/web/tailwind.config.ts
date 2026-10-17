import type { Config } from 'tailwindcss';

// Colores y medidas desde los tokens del sistema de diseño Mocana (src/design-system/tokens.css)
const v = (name: string) => `var(--${name})`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: v('brand-soft'), 100: v('brand-soft'), 200: v('brand-soft'),
          400: v('brand'), 500: v('brand'), 600: v('brand-ink'), 700: v('brand-strong'), 900: v('brand-strong'),
          DEFAULT: v('brand'), ink: v('brand-ink'), strong: v('brand-strong'), soft: v('brand-soft'),
        },
        dark: { 800: v('asphalt-raised'), 900: v('asphalt') },
        asphalt: { DEFAULT: v('asphalt'), raised: v('asphalt-raised') },
        chrome: v('chrome'),
        surface: { DEFAULT: v('surface'), raised: v('surface-raised'), sunken: v('surface-sunken') },
        ink: { DEFAULT: v('ink'), 2: v('ink-2'), muted: v('ink-muted') },
        line: { DEFAULT: v('line'), strong: v('line-strong') },
        success: v('success'), warning: v('warning'), info: v('info'), danger: v('danger'),
        focus: v('focus'),
      },
      fontFamily: {
        sans: [v('font-sans')],
        display: [v('font-display')],
        mono: [v('font-mono')],
      },
      borderRadius: { sm: v('radius-sm'), md: v('radius-md'), lg: v('radius-lg'), xl: v('radius-lg'), '2xl': v('radius-lg'), '3xl': v('radius-xl') },
      boxShadow: { sm: v('shadow-1'), md: v('shadow-2') },
      maxWidth: { content: v('content-max'), read: v('read-max') },
      screens: { sm: '640px', lg: '960px', xl: '1280px' },
    },
  },
  plugins: [],
} satisfies Config;
