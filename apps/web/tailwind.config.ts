import type { Config } from 'tailwindcss';

// Colores, tipografía y radios salen de los tokens del sistema de diseño
// (src/design-system/tokens.css), así el tema claro/oscuro cambia solo.
const v = (name: string) => `var(--${name})`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: v('surface'), raised: v('surface-raised'), sunken: v('surface-sunken') },
        line: { DEFAULT: v('line'), strong: v('line-strong') },
        ink: { DEFAULT: v('ink'), 2: v('ink-2'), muted: v('ink-muted') },
        brand: { DEFAULT: v('brand'), strong: v('brand-strong'), ink: v('brand-ink'), soft: v('brand-soft'), on: v('on-brand') },
        asphalt: { DEFAULT: v('asphalt'), raised: v('asphalt-raised'), on: v('on-asphalt'), muted: v('on-asphalt-muted') },
        chrome: v('chrome'),
        success: { DEFAULT: v('success'), soft: v('success-soft') },
        warning: { DEFAULT: v('warning'), soft: v('warning-soft') },
        info: { DEFAULT: v('info'), soft: v('info-soft') },
        danger: { DEFAULT: v('danger'), soft: v('danger-soft') },
        focus: v('focus'),
      },
      fontFamily: {
        display: ['"Titan One"', '"Arial Black"', 'Impact', 'sans-serif'],
        sans: ['Saira', '"Segoe UI"', 'Roboto', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      borderRadius: { sm: v('radius-sm'), md: v('radius-md'), lg: v('radius-lg'), xl: v('radius-xl') },
      boxShadow: { 1: v('shadow-1'), 2: v('shadow-2') },
      maxWidth: { content: v('content-max'), read: v('read-max') },
      screens: { tablet: '640px', desktop: '960px', wide: '1280px' },
    },
  },
  plugins: [],
} satisfies Config;
