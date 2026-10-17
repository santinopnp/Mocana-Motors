import ICONS from './icons.json';
import LOGOS from './logos.json';

const R = () => window.React;
const h = (...a) => R().createElement(...a);
const cx = (...c) => c.filter(Boolean).join(' ');
let uid = 0;
const useId = (given) => {
  const ref = R().useRef(null);
  if (given) return given;
  if (ref.current == null) ref.current = 'mm-' + (++uid);
  return ref.current;
};

export function Icon({ name, size = 24, title, className, ...rest }) {
  const body = ICONS[name] || '';
  return h('svg', {
    viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor',
    strokeWidth: 2, strokeLinecap: 'square', strokeLinejoin: 'miter',
    className: cx('mm-icon', className),
    'aria-hidden': title ? undefined : 'true', role: title ? 'img' : undefined, 'aria-label': title,
    dangerouslySetInnerHTML: { __html: body }, ...rest,
  });
}
Icon.names = Object.keys(ICONS);

export function Logo({ variant = 'horizontal', tone = 'light', height, className, label = 'Mocana Motors' }) {
  const key = variant === 'badge' ? 'badge' : variant + '-' + tone;
  const svg = (LOGOS[key] || LOGOS['horizontal-light'])
    .replace(/ width="\d+" height="\d+"/, '')
    .replace(/ role="img" aria-label="[^"]*"/, ' aria-hidden="true"');
  const hDefault = { horizontal: 40, stacked: 120, emblem: 48, badge: 32 }[variant] || 40;
  return h('span', {
    className: cx('mm-logo', 'mm-logo-' + variant, className), role: 'img', 'aria-label': label,
    style: { height: (height || hDefault) + 'px' }, dangerouslySetInnerHTML: { __html: svg },
  });
}

export function Button({ variant = 'primary', size = 'md', block, iconStart, iconEnd, loading, href, className, children, disabled, ...rest }) {
  const cls = cx('mm-btn', 'mm-btn-' + variant, size === 'sm' && 'mm-btn-sm', block && 'mm-btn-block', loading && 'is-loading', className);
  const inner = [
    loading ? h('span', { key: 's', className: 'mm-spinner', 'aria-hidden': 'true' }) : iconStart && h(Icon, { key: 'a', name: iconStart, size: 20 }),
    h('span', { key: 't' }, children),
    iconEnd && !loading && h(Icon, { key: 'b', name: iconEnd, size: 20 }),
  ];
  if (href && !disabled) return h('a', { href, className: cls, ...rest }, inner);
  return h('button', { type: 'button', className: cls, disabled: disabled || loading, 'aria-busy': loading || undefined, ...rest }, inner);
}

export function IconButton({ icon, label, variant = 'ghost', badge, href, className, ...rest }) {
  const cls = cx('mm-iconbtn', 'mm-iconbtn-' + variant, className);
  const inner = [
    h(Icon, { key: 'i', name: icon, size: 24 }),
    badge != null && badge !== 0 && h('span', { key: 'b', className: 'mm-count', 'aria-hidden': 'true' }, badge),
  ];
  const aria = badge ? label + ' (' + badge + ')' : label;
  if (href) return h('a', { href, className: cls, 'aria-label': aria, ...rest }, inner);
  return h('button', { type: 'button', className: cls, 'aria-label': aria, ...rest }, inner);
}

export function Badge({ tone = 'neutral', icon, className, children }) {
  return h('span', { className: cx('mm-badge', 'mm-badge-' + tone, className) },
    icon && h(Icon, { name: icon, size: 14 }), children);
}

export function Chip({ selected = false, icon, count, className, children, ...rest }) {
  return h('button', { type: 'button', 'aria-pressed': selected, className: cx('mm-chip', selected && 'is-selected', className), ...rest },
    selected ? h(Icon, { name: 'check', size: 18 }) : icon && h(Icon, { name: icon, size: 18 }),
    h('span', null, children),
    count != null && h('span', { className: 'mm-chip-count' }, count));
}

export function SegmentedControl({ options = [], value, onChange, label, name, className }) {
  const n = useId(name);
  return h('div', { role: 'radiogroup', 'aria-label': label, className: cx('mm-seg', className) },
    options.map((o) => h('label', { key: o.value, className: cx('mm-seg-opt', value === o.value && 'is-on') },
      h('input', { type: 'radio', name: n, value: o.value, checked: value === o.value, onChange: () => onChange && onChange(o.value) }),
      h('span', null, o.label))));
}

export function TextField({ label, hint, error, iconStart, suffix, options, id, required, className, ...rest }) {
  const fid = useId(id);
  const hid = fid + '-hint';
  const describedBy = error || hint ? hid : undefined;
  const control = options
    ? h('select', { id: fid, className: 'mm-input', 'aria-invalid': !!error || undefined, 'aria-describedby': describedBy, required, ...rest },
        options.map((o) => typeof o === 'string' ? h('option', { key: o, value: o }, o) : h('option', { key: o.value, value: o.value, disabled: o.disabled }, o.label)))
    : h('input', { id: fid, className: 'mm-input', 'aria-invalid': !!error || undefined, 'aria-describedby': describedBy, required, ...rest });
  return h('div', { className: cx('mm-field', error && 'has-error', className) },
    h('label', { htmlFor: fid, className: 'mm-field-label' }, label, required && h('span', { className: 'mm-req', 'aria-hidden': 'true' }, ' *')),
    h('div', { className: cx('mm-control', iconStart && 'has-icon', options && 'is-select') },
      iconStart && h(Icon, { name: iconStart, size: 20, className: 'mm-control-icon' }),
      control,
      options && h(Icon, { name: 'chevron-down', size: 20, className: 'mm-control-caret' }),
      suffix && h('span', { className: 'mm-control-suffix' }, suffix)),
    (error || hint) && h('p', { id: hid, className: 'mm-field-hint' }, error && h(Icon, { name: 'alert', size: 16 }), error || hint));
}

export function QuantityStepper({ value = 1, min = 1, max = 99, onChange, label = 'Cantidad' }) {
  const set = (v) => onChange && onChange(Math.max(min, Math.min(max, v)));
  return h('div', { className: 'mm-qty', role: 'group', 'aria-label': label },
    h('button', { type: 'button', className: 'mm-qty-btn', 'aria-label': 'Quitar uno', disabled: value <= min, onClick: () => set(value - 1) }, h(Icon, { name: 'minus', size: 20 })),
    h('output', { className: 'mm-qty-val', 'aria-live': 'polite' }, value),
    h('button', { type: 'button', className: 'mm-qty-btn', 'aria-label': 'Agregar uno', disabled: value >= max, onClick: () => set(value + 1) }, h(Icon, { name: 'plus', size: 20 })));
}

export function formatCOP(n) {
  if (typeof n !== 'number') return n;
  return '$ ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function Price({ value, oldValue, note, size = 'md' }) {
  return h('div', { className: cx('mm-price', 'mm-price-' + size) },
    h('div', { className: 'mm-price-row' },
      h('span', { className: cx('mm-price-now', oldValue && 'is-sale') }, formatCOP(value)),
      oldValue && h('s', { className: 'mm-price-old' }, h('span', { className: 'mm-sr' }, 'Antes '), formatCOP(oldValue))),
    note && h('span', { className: 'mm-price-note' }, note));
}

const KIND_ICON = { moto: 'moto', motocarro: 'motocarro', repuesto: 'nut', accesorio: 'tag' };

export function ProductCard({ title, category, kind = 'moto', price, oldPrice, priceNote, image, imageAlt = '', badges = [], specs = [], href, actionLabel, onAction, onFavorite, favorite, layout = 'vertical', className }) {
  const media = h('div', { className: 'mm-pc-media' },
    image ? h('img', { src: image, alt: imageAlt, loading: 'lazy' }) : h(Icon, { name: KIND_ICON[kind] || 'moto', size: 56, className: 'mm-pc-ph' }),
    badges.length > 0 && h('div', { className: 'mm-pc-badges' }, badges.map((b, i) => h(Badge, { key: i, tone: b.tone, icon: b.icon }, b.label))));
  const titleEl = href ? h('a', { href, className: 'mm-pc-link' }, title) : title;
  return h('article', { className: cx('mm-pc', 'mm-pc-' + layout, className) },
    media,
    h('div', { className: 'mm-pc-body' },
      category && h('p', { className: 'mm-pc-cat' }, category),
      h('h3', { className: 'mm-pc-title' }, titleEl),
      specs.length > 0 && h('ul', { className: 'mm-pc-specs' }, specs.map((s, i) => h('li', { key: i }, s))),
      h('div', { className: 'mm-pc-foot' },
        h(Price, { value: price, oldValue: oldPrice, note: priceNote, size: layout === 'horizontal' ? 'sm' : 'md' }),
        actionLabel && h(Button, { size: 'sm', variant: 'primary', onClick: onAction, iconStart: kind === 'repuesto' || kind === 'accesorio' ? 'cart' : undefined }, actionLabel))),
    onFavorite && h(IconButton, { icon: 'heart', label: favorite ? 'Quitar de favoritos' : 'Guardar en favoritos', variant: 'secondary', className: cx('mm-pc-fav', favorite && 'is-on'), 'aria-pressed': !!favorite, onClick: onFavorite }));
}

export function ServiceCard({ icon = 'wrench', title, description, meta, actionLabel, href, onAction, tone = 'light', className }) {
  return h('article', { className: cx('mm-svc', 'mm-svc-' + tone, className) },
    h('span', { className: 'mm-svc-icon' }, h(Icon, { name: icon, size: 28 })),
    h('div', { className: 'mm-svc-body' },
      h('h3', { className: 'mm-svc-title' }, title),
      description && h('p', { className: 'mm-svc-desc' }, description),
      meta && h('p', { className: 'mm-svc-meta' }, h(Icon, { name: 'clock', size: 16 }), meta)),
    actionLabel && (href
      ? h('a', { href, className: 'mm-svc-action' }, actionLabel, h(Icon, { name: 'arrow-right', size: 20 }))
      : h('button', { type: 'button', onClick: onAction, className: 'mm-svc-action' }, actionLabel, h(Icon, { name: 'arrow-right', size: 20 }))));
}

export function SectionHeader({ eyebrow, title, actionLabel, href, as = 'h2', tone = 'light' }) {
  return h('div', { className: cx('mm-sh', 'mm-sh-' + tone) },
    h('div', null,
      eyebrow && h('p', { className: 'mm-eyebrow' }, eyebrow),
      h(as, { className: 'mm-sh-title' }, title)),
    actionLabel && h('a', { href: href || '#', className: 'mm-sh-link' }, actionLabel, h(Icon, { name: 'chevron-right', size: 20 })));
}

export function Hero({ eyebrow, title, body, primary, secondary, image, imageAlt = '', className }) {
  return h('section', { className: cx('mm-hero', className) },
    h('div', { className: 'mm-hero-text' },
      eyebrow && h('p', { className: 'mm-eyebrow mm-hero-eyebrow' }, eyebrow),
      h('h1', { className: 'mm-hero-title' }, title),
      body && h('p', { className: 'mm-hero-body' }, body),
      (primary || secondary) && h('div', { className: 'mm-hero-ctas' },
        primary && h(Button, { variant: 'primary', href: primary.href, onClick: primary.onClick, iconEnd: primary.icon }, primary.label),
        secondary && h(Button, { variant: 'light', href: secondary.href, onClick: secondary.onClick, iconStart: secondary.icon }, secondary.label))),
    h('div', { className: 'mm-hero-media' },
      image ? h('img', { src: image, alt: imageAlt }) : h(Logo, { variant: 'emblem', tone: 'dark', height: 120, label: '' })));
}

export function TopBar({ variant = 'app', tone = 'dark', title, onBack, backLabel = 'Volver', actions = [], links = [], cta, onMenu, className }) {
  const left = onBack
    ? h('div', { className: 'mm-tb-left' }, h(IconButton, { icon: 'chevron-left', label: backLabel, variant: tone === 'dark' ? 'on-dark' : 'ghost', onClick: onBack }), title && h('h1', { className: 'mm-tb-title' }, title))
    : h('a', { href: '/', className: 'mm-tb-brand', 'aria-label': 'Mocana Motors, inicio' }, h(Logo, { variant: 'horizontal', tone: tone === 'dark' ? 'dark' : 'light', height: 36, label: '' }));
  return h('header', { className: cx('mm-tb', 'mm-tb-' + tone, 'mm-tb-' + variant, className) },
    left,
    variant === 'web' && links.length > 0 && h('nav', { className: 'mm-tb-links', 'aria-label': 'Principal' },
      links.map((l, i) => h('a', { key: i, href: l.href || '#', className: cx('mm-tb-link', l.active && 'is-active'), 'aria-current': l.active ? 'page' : undefined }, l.label))),
    h('div', { className: 'mm-tb-actions' },
      actions.map((a, i) => h(IconButton, { key: i, icon: a.icon, label: a.label, badge: a.badge, href: a.href, onClick: a.onClick, variant: tone === 'dark' ? 'on-dark' : 'ghost' })),
      variant === 'web' && cta && h(Button, { variant: 'primary', size: 'sm', href: cta.href, onClick: cta.onClick, className: 'mm-tb-cta' }, cta.label),
      variant === 'web' && h(IconButton, { icon: 'menu', label: 'Menú', variant: tone === 'dark' ? 'on-dark' : 'ghost', className: 'mm-tb-menu', onClick: onMenu })));
}

export function BottomNav({ items = [], fixed = false, label = 'Navegación', className }) {
  return h('nav', { className: cx('mm-bn', fixed && 'is-fixed', className), 'aria-label': label },
    items.map((it, i) => h('a', { key: i, href: it.href || '#', className: cx('mm-bn-item', it.active && 'is-active'), 'aria-current': it.active ? 'page' : undefined },
      h('span', { className: 'mm-bn-icon' }, h(Icon, { name: it.icon, size: 24 }), it.badge ? h('span', { className: 'mm-count', 'aria-hidden': 'true' }, it.badge) : null),
      h('span', { className: 'mm-bn-label' }, it.label, it.badge ? h('span', { className: 'mm-sr' }, ' (' + it.badge + ')') : null))));
}

const ALERT_ICON = { info: 'info', success: 'check', warning: 'alert', danger: 'alert' };
export function Alert({ tone = 'info', title, children, action, onAction, className }) {
  return h('div', { className: cx('mm-alert', 'mm-alert-' + tone, className), role: tone === 'danger' ? 'alert' : 'status' },
    h(Icon, { name: ALERT_ICON[tone], size: 22, className: 'mm-alert-icon' }),
    h('div', { className: 'mm-alert-body' },
      title && h('p', { className: 'mm-alert-title' }, title),
      children && h('div', { className: 'mm-alert-text' }, children),
      action && h('button', { type: 'button', className: 'mm-alert-action', onClick: onAction }, action)));
}

export function TimeSlots({ days = [], slots = [], day, time, onDayChange, onTimeChange, name }) {
  const n = useId(name);
  return h('div', { className: 'mm-slots' },
    h('fieldset', { className: 'mm-slots-set' },
      h('legend', { className: 'mm-field-label' }, 'Día'),
      h('div', { className: 'mm-slots-days' }, days.map((d) => h('label', { key: d.id, className: cx('mm-day', day === d.id && 'is-on', d.disabled && 'is-off') },
        h('input', { type: 'radio', name: n + '-d', value: d.id, checked: day === d.id, disabled: d.disabled, onChange: () => onDayChange && onDayChange(d.id) }),
        h('span', { className: 'mm-day-wd' }, d.weekday), h('span', { className: 'mm-day-n' }, d.date))))),
    h('fieldset', { className: 'mm-slots-set' },
      h('legend', { className: 'mm-field-label' }, 'Hora'),
      h('div', { className: 'mm-slots-times' }, slots.map((s) => h('label', { key: s.time, className: cx('mm-time', time === s.time && 'is-on', s.disabled && 'is-off') },
        h('input', { type: 'radio', name: n + '-t', value: s.time, checked: time === s.time, disabled: s.disabled, onChange: () => onTimeChange && onTimeChange(s.time) }),
        h('span', null, s.time), s.disabled && h('span', { className: 'mm-sr' }, ' (no disponible)'))))));
}

export function StatusTimeline({ steps = [], label = 'Estado del servicio' }) {
  return h('ol', { className: 'mm-tl', 'aria-label': label },
    steps.map((s, i) => h('li', { key: i, className: cx('mm-tl-step', 'is-' + (s.state || 'todo')), 'aria-current': s.state === 'current' ? 'step' : undefined },
      h('span', { className: 'mm-tl-dot', 'aria-hidden': 'true' }, s.state === 'done' ? h(Icon, { name: 'check', size: 16 }) : null),
      h('div', { className: 'mm-tl-text' },
        h('p', { className: 'mm-tl-label' }, s.label, h('span', { className: 'mm-sr' }, s.state === 'done' ? ' (hecho)' : s.state === 'current' ? ' (en curso)' : ' (pendiente)')),
        s.detail && h('p', { className: 'mm-tl-detail' }, s.detail)))));
}
