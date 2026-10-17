// Íconos del sistema de diseño Mocana (31): grilla 24px, 2px, puntas cuadradas e ingletes rectos.
// Fuente: components/src/icons.json del sistema.
const PATHS = {
  'home': <><path d="M3 11l9-7 9 7" /><path d="M5 9.5V20h14V9.5" /><path d="M10 20v-6h4v6" /></>,
  'search': <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l5 5" /></>,
  'menu': <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  'close': <><path d="M6 6l12 12M18 6L6 18" /></>,
  'user': <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></>,
  'cart': <><path d="M3 4h2.5l2.2 11h10.6L21 8H6.3" /><circle cx="9" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></>,
  'calendar': <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
  'clock': <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  'phone': <><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z" /></>,
  'chat': <><path d="M4 5h16v11H9.5L4 20z" /><path d="M8 9.5h8M8 12.5h5" /></>,
  'map-pin': <><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  'check': <><path d="M5 12.5l4.5 4.5L19 7" /></>,
  'alert': <><path d="M12 3.5l9.5 17h-19z" /><path d="M12 10v5M12 17.5v.5" /></>,
  'info': <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.5" /></>,
  'chevron-right': <><path d="M9 5l7 7-7 7" /></>,
  'chevron-left': <><path d="M15 5l-7 7 7 7" /></>,
  'chevron-down': <><path d="M5 9l7 7 7-7" /></>,
  'arrow-right': <><path d="M4 12h15M13 6l6 6-6 6" /></>,
  'plus': <><path d="M12 5v14M5 12h14" /></>,
  'minus': <><path d="M5 12h14" /></>,
  'filter': <><path d="M4 6h16M7 12h10M10 18h4" /></>,
  'heart': <><path d="M12 20s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 9c0 6-8 11-8 11z" /></>,
  'tag': <><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1.5" /></>,
  'shield': <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>,
  'moto': <><circle cx="5.5" cy="16" r="3.5" /><circle cx="18.5" cy="16" r="3.5" /><path d="M5.5 16L9 10h6.5l3 6" /><path d="M15.5 10l-1.5-4h3M7.5 10h4M9.5 16h5" /></>,
  'motocarro': <><path d="M2 15V6h11v9z" /><path d="M13 9h4l3.5 4v2H13" /><circle cx="6" cy="17.5" r="2" /><circle cx="17" cy="17.5" r="2" /></>,
  'wrench': <><path d="M14.5 3.5a5 5 0 00-4.6 6.9L3.5 16.8 7.2 20.5l6.4-6.4a5 5 0 006.6-5.6l-3 3-3.4-.9-.9-3.4 3-3a5 5 0 00-1.4-.7z" /></>,
  'toolbox': <><rect x="3" y="9" width="18" height="11" rx="1" /><path d="M9 9V6h6v3M3 14h18M10 14v2h4v-2" /></>,
  'tire': <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /></>,
  'nut': <><path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z" /><circle cx="12" cy="12" r="3.5" /></>,
  'oil': <><path d="M12 3s6 6.5 6 11a6 6 0 01-12 0c0-4.5 6-11 6-11z" /></>,
} satisfies Record<string, JSX.Element>;

export type IconName = keyof typeof PATHS;

export default function Icon({ name, size = 24, className = '', strokeWidth = 2, title }: { name: IconName; size?: number; className?: string; strokeWidth?: number; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="square" strokeLinejoin="miter" className={className}
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}>
      {PATHS[name]}
    </svg>
  );
}
