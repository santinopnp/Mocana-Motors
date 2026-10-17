// Componentes del sistema de diseño Mocana Motors (clases mm-*, ver mocana.css).
// Port en TypeScript de components/bundle.js; los enlaces internos usan react-router.
import React, { useId } from 'react';
import { Link, NavLink } from 'react-router-dom';
import ICONS from './icons.json';
import LOGOS from './logos.json';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

export type IconName = keyof typeof ICONS;

export function formatCOP(n: number) {
  return '$ ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/* ── Icon ── */
export function Icon({ name, size = 24, title, className }: { name: IconName; size?: number; title?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter"
      className={cx('mm-icon', className)}
      aria-hidden={title ? undefined : 'true'} role={title ? 'img' : undefined} aria-label={title}
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}

/* ── Logo ── */
type LogoVariant = 'horizontal' | 'stacked' | 'emblem' | 'badge';
export function Logo({ variant = 'horizontal', tone = 'light', height, className, label = 'Mocana Motors' }:
  { variant?: LogoVariant; tone?: 'light' | 'dark' | 'mono'; height?: number; className?: string; label?: string }) {
  const key = (variant === 'badge' ? 'badge' : `${variant}-${tone}`) as keyof typeof LOGOS;
  const svg = (LOGOS[key] || LOGOS['horizontal-light'])
    .replace(/ width="\d+" height="\d+"/, '')
    .replace(/ role="img" aria-label="[^"]*"/, ' aria-hidden="true"');
  const hDefault = { horizontal: 40, stacked: 120, emblem: 48, badge: 32 }[variant];
  return (
    <span
      className={cx('mm-logo', `mm-logo-${variant}`, className)}
      role={label ? 'img' : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : 'true'}
      style={{ height: (height || hDefault) + 'px' }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

/* ── Button ── */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'light';
type ButtonProps = {
  variant?: ButtonVariant; size?: 'md' | 'sm'; block?: boolean; iconStart?: IconName; iconEnd?: IconName;
  loading?: boolean; to?: string; className?: string; children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export function Button({ variant = 'primary', size = 'md', block, iconStart, iconEnd, loading, to, className, children, disabled, type = 'button', ...rest }: ButtonProps) {
  const cls = cx('mm-btn', `mm-btn-${variant}`, size === 'sm' && 'mm-btn-sm', block && 'mm-btn-block', loading && 'is-loading', className);
  const inner = (
    <>
      {loading ? <span className="mm-spinner" aria-hidden="true" /> : iconStart && <Icon name={iconStart} size={20} />}
      <span>{children}</span>
      {iconEnd && !loading && <Icon name={iconEnd} size={20} />}
    </>
  );
  if (to && !disabled) return <Link to={to} className={cls}>{inner}</Link>;
  return <button type={type} className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>{inner}</button>;
}

/* ── IconButton ── */
export function IconButton({ icon, label, variant = 'ghost', badge, to, className, ...rest }:
  { icon: IconName; label: string; variant?: 'ghost' | 'secondary' | 'dark' | 'on-dark'; badge?: number | string; to?: string; className?: string }
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  const cls = cx('mm-iconbtn', `mm-iconbtn-${variant}`, className);
  const inner = (
    <>
      <Icon name={icon} size={24} />
      {badge != null && badge !== 0 && <span className="mm-count" aria-hidden="true">{badge}</span>}
    </>
  );
  const aria = badge ? `${label} (${badge})` : label;
  if (to) return <Link to={to} className={cls} aria-label={aria}>{inner}</Link>;
  return <button type="button" className={cls} aria-label={aria} {...rest}>{inner}</button>;
}

/* ── Badge ── */
export type BadgeTone = 'neutral' | 'brand' | 'solid' | 'success' | 'warning' | 'info' | 'dark';
export function Badge({ tone = 'neutral', icon, className, children }: { tone?: BadgeTone; icon?: IconName; className?: string; children: React.ReactNode }) {
  return (
    <span className={cx('mm-badge', `mm-badge-${tone}`, className)}>
      {icon && <Icon name={icon} size={14} />}{children}
    </span>
  );
}

/* ── Chip ── */
export function Chip({ selected = false, icon, count, className, children, ...rest }:
  { selected?: boolean; icon?: IconName; count?: number; className?: string; children: React.ReactNode }
  & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  return (
    <button type="button" aria-pressed={selected} className={cx('mm-chip', selected && 'is-selected', className)} {...rest}>
      {selected ? <Icon name="check" size={18} /> : icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {count != null && <span className="mm-chip-count">{count}</span>}
    </button>
  );
}

/* ── SegmentedControl ── */
export function SegmentedControl<T extends string>({ options, value, onChange, label, className }:
  { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; label: string; className?: string }) {
  const name = useId();
  return (
    <div role="radiogroup" aria-label={label} className={cx('mm-seg', className)}>
      {options.map((o) => (
        <label key={o.value} className={cx('mm-seg-opt', value === o.value && 'is-on')}>
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}

/* ── TextField ── */
type TextFieldProps = {
  label: string; hint?: string; error?: string; iconStart?: IconName; suffix?: string;
  options?: (string | { value: string; label: string; disabled?: boolean })[];
  multiline?: boolean; rows?: number; className?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>;

export function TextField({ label, hint, error, iconStart, suffix, options, multiline, rows = 3, id, required, className, ...rest }: TextFieldProps) {
  const autoId = useId();
  const fid = id || autoId;
  const hid = `${fid}-hint`;
  const common = { id: fid, className: 'mm-input', required, 'aria-invalid': !!error || undefined, 'aria-describedby': error || hint ? hid : undefined };
  const control = options ? (
    <select {...common} {...(rest as unknown as React.SelectHTMLAttributes<HTMLSelectElement>)}>
      {options.map((o) => typeof o === 'string'
        ? <option key={o} value={o}>{o}</option>
        : <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}
    </select>
  ) : multiline ? (
    <textarea {...common} rows={rows} style={{ paddingTop: 12, paddingBottom: 12, resize: 'vertical' }}
      {...(rest as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />
  ) : (
    <input {...common} {...rest} />
  );
  return (
    <div className={cx('mm-field', error && 'has-error', className)}>
      <label htmlFor={fid} className="mm-field-label">
        {label}{required && <span className="mm-req" aria-hidden="true"> *</span>}
      </label>
      <div className={cx('mm-control', iconStart && 'has-icon', options && 'is-select')}>
        {iconStart && <Icon name={iconStart} size={20} className="mm-control-icon" />}
        {control}
        {options && <Icon name="chevron-down" size={20} className="mm-control-caret" />}
        {suffix && <span className="mm-control-suffix">{suffix}</span>}
      </div>
      {(error || hint) && (
        <p id={hid} className="mm-field-hint">{error && <Icon name="alert" size={16} />}{error || hint}</p>
      )}
    </div>
  );
}

/* ── QuantityStepper ── */
export function QuantityStepper({ value, min = 1, max = 99, onChange, label = 'Cantidad' }:
  { value: number; min?: number; max?: number; onChange: (v: number) => void; label?: string }) {
  const set = (v: number) => onChange(Math.max(min, Math.min(max, v)));
  return (
    <div className="mm-qty" role="group" aria-label={label}>
      <button type="button" className="mm-qty-btn" aria-label="Quitar uno" disabled={value <= min} onClick={() => set(value - 1)}><Icon name="minus" size={20} /></button>
      <output className="mm-qty-val" aria-live="polite">{value}</output>
      <button type="button" className="mm-qty-btn" aria-label="Agregar uno" disabled={value >= max} onClick={() => set(value + 1)}><Icon name="plus" size={20} /></button>
    </div>
  );
}

/* ── Price ── */
export function Price({ value, oldValue, note, size = 'md' }: { value: number; oldValue?: number | null; note?: string; size?: 'md' | 'sm' | 'lg' }) {
  return (
    <div className={cx('mm-price', `mm-price-${size}`)}>
      <div className="mm-price-row">
        <span className={cx('mm-price-now', !!oldValue && 'is-sale')}>{formatCOP(value)}</span>
        {oldValue ? <s className="mm-price-old"><span className="mm-sr">Antes </span>{formatCOP(oldValue)}</s> : null}
      </div>
      {note && <span className="mm-price-note">{note}</span>}
    </div>
  );
}

/* ── ProductCard ── */
export type ProductKind = 'moto' | 'motocarro' | 'repuesto' | 'accesorio';
const KIND_ICON: Record<ProductKind, IconName> = { moto: 'moto', motocarro: 'motocarro', repuesto: 'nut', accesorio: 'tag' };

export function ProductCard({ title, category, kind = 'moto', price, oldPrice, priceNote, image, imageAlt = '', badges = [], specs = [], to, actionLabel, onAction, actionDisabled, layout = 'vertical', className }: {
  title: string; category?: string; kind?: ProductKind; price: number; oldPrice?: number | null; priceNote?: string;
  image?: string; imageAlt?: string; badges?: { label: string; tone?: BadgeTone; icon?: IconName }[]; specs?: string[];
  to?: string; actionLabel?: string; onAction?: () => void; actionDisabled?: boolean; layout?: 'vertical' | 'horizontal'; className?: string;
}) {
  return (
    <article className={cx('mm-pc', `mm-pc-${layout}`, className)}>
      <div className="mm-pc-media">
        {image ? <img src={image} alt={imageAlt} loading="lazy" /> : <Icon name={KIND_ICON[kind]} size={56} />}
        {badges.length > 0 && (
          <div className="mm-pc-badges">
            {badges.map((b, i) => <Badge key={i} tone={b.tone} icon={b.icon}>{b.label}</Badge>)}
          </div>
        )}
      </div>
      <div className="mm-pc-body">
        {category && <p className="mm-pc-cat">{category}</p>}
        <h3 className="mm-pc-title">{to ? <Link to={to} className="mm-pc-link">{title}</Link> : title}</h3>
        {specs.length > 0 && <ul className="mm-pc-specs">{specs.map((s, i) => <li key={i}>{s}</li>)}</ul>}
        <div className="mm-pc-foot">
          <Price value={price} oldValue={oldPrice} note={priceNote} size={layout === 'horizontal' ? 'sm' : 'md'} />
          {actionLabel && (
            <Button size="sm" onClick={onAction} disabled={actionDisabled}
              iconStart={kind === 'repuesto' || kind === 'accesorio' ? 'cart' : undefined}>
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

/* ── ServiceCard ── */
export function ServiceCard({ icon = 'wrench', title, description, meta, actionLabel, to, onAction, tone = 'light', className }: {
  icon?: IconName; title: string; description?: string; meta?: string; actionLabel?: string; to?: string;
  onAction?: () => void; tone?: 'light' | 'dark'; className?: string;
}) {
  return (
    <article className={cx('mm-svc', `mm-svc-${tone}`, className)}>
      <span className="mm-svc-icon"><Icon name={icon} size={28} /></span>
      <div className="mm-svc-body">
        <h3 className="mm-svc-title">{title}</h3>
        {description && <p className="mm-svc-desc">{description}</p>}
        {meta && <p className="mm-svc-meta"><Icon name="clock" size={16} />{meta}</p>}
      </div>
      {actionLabel && (to
        ? <Link to={to} className="mm-svc-action">{actionLabel}<Icon name="arrow-right" size={20} /></Link>
        : <button type="button" onClick={onAction} className="mm-svc-action">{actionLabel}<Icon name="arrow-right" size={20} /></button>)}
    </article>
  );
}

/* ── SectionHeader ── */
export function SectionHeader({ eyebrow, title, actionLabel, to, as: As = 'h2', tone = 'light' }: {
  eyebrow?: string; title: string; actionLabel?: string; to?: string; as?: 'h1' | 'h2' | 'h3'; tone?: 'light' | 'dark';
}) {
  return (
    <div className={cx('mm-sh', `mm-sh-${tone}`)}>
      <div>
        {eyebrow && <p className="mm-eyebrow">{eyebrow}</p>}
        <As className="mm-sh-title">{title}</As>
      </div>
      {actionLabel && <Link to={to || '#'} className="mm-sh-link">{actionLabel}<Icon name="chevron-right" size={20} /></Link>}
    </div>
  );
}

/* ── Hero ── */
type HeroCta = { label: string; to: string; icon?: IconName };
export function Hero({ eyebrow, title, body, primary, secondary, image, imageAlt = '', className }: {
  eyebrow?: string; title: React.ReactNode; body?: string; primary?: HeroCta; secondary?: HeroCta; image?: string; imageAlt?: string; className?: string;
}) {
  return (
    <section className={cx('mm-hero', className)}>
      <div className="mm-hero-text">
        {eyebrow && <p className="mm-eyebrow mm-hero-eyebrow">{eyebrow}</p>}
        <h1 className="mm-hero-title">{title}</h1>
        {body && <p className="mm-hero-body">{body}</p>}
        {(primary || secondary) && (
          <div className="mm-hero-ctas">
            {primary && <Button variant="primary" to={primary.to} iconEnd={primary.icon}>{primary.label}</Button>}
            {secondary && <Button variant="light" to={secondary.to} iconStart={secondary.icon}>{secondary.label}</Button>}
          </div>
        )}
      </div>
      <div className="mm-hero-media">
        {image ? <img src={image} alt={imageAlt} /> : <Logo variant="emblem" tone="dark" height={120} label="" />}
      </div>
    </section>
  );
}

/* ── BottomNav ── */
export function BottomNav({ items, label = 'Navegación', className }: {
  items: { to: string; label: string; icon: IconName; badge?: number; end?: boolean }[]; label?: string; className?: string;
}) {
  return (
    <nav className={cx('mm-bn', 'is-fixed', className)} aria-label={label}>
      {items.map((it) => (
        <NavLink key={it.to} to={it.to} end={it.end} className={({ isActive }) => cx('mm-bn-item', isActive && 'is-active')}>
          <span className="mm-bn-icon">
            <Icon name={it.icon} size={24} />
            {it.badge ? <span className="mm-count" aria-hidden="true">{it.badge > 9 ? '9+' : it.badge}</span> : null}
          </span>
          <span className="mm-bn-label">{it.label}{it.badge ? <span className="mm-sr"> ({it.badge})</span> : null}</span>
        </NavLink>
      ))}
    </nav>
  );
}

/* ── Alert ── */
const ALERT_ICON: Record<string, IconName> = { info: 'info', success: 'check', warning: 'alert', danger: 'alert' };
export function Alert({ tone = 'info', title, children, action, onAction, className }: {
  tone?: 'info' | 'success' | 'warning' | 'danger'; title?: string; children?: React.ReactNode; action?: string; onAction?: () => void; className?: string;
}) {
  return (
    <div className={cx('mm-alert', `mm-alert-${tone}`, className)} role={tone === 'danger' ? 'alert' : 'status'}>
      <Icon name={ALERT_ICON[tone]} size={22} className="mm-alert-icon" />
      <div className="mm-alert-body">
        {title && <p className="mm-alert-title">{title}</p>}
        {children && <div className="mm-alert-text">{children}</div>}
        {action && <button type="button" className="mm-alert-action" onClick={onAction}>{action}</button>}
      </div>
    </div>
  );
}

/* ── TimeSlots ── */
export function TimeSlots({ days, slots, day, time, onDayChange, onTimeChange }: {
  days: { id: string; weekday: string; date: string; disabled?: boolean }[];
  slots: { time: string; disabled?: boolean }[];
  day?: string; time?: string; onDayChange: (id: string) => void; onTimeChange: (t: string) => void;
}) {
  const n = useId();
  return (
    <div className="mm-slots">
      <fieldset className="mm-slots-set">
        <legend className="mm-field-label">Día</legend>
        <div className="mm-slots-days">
          {days.map((d) => (
            <label key={d.id} className={cx('mm-day', day === d.id && 'is-on', d.disabled && 'is-off')}>
              <input type="radio" name={`${n}-d`} value={d.id} checked={day === d.id} disabled={d.disabled} onChange={() => onDayChange(d.id)} />
              <span className="mm-day-wd">{d.weekday}</span><span className="mm-day-n">{d.date}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="mm-slots-set">
        <legend className="mm-field-label">Hora</legend>
        <div className="mm-slots-times">
          {slots.map((s) => (
            <label key={s.time} className={cx('mm-time', time === s.time && 'is-on', s.disabled && 'is-off')}>
              <input type="radio" name={`${n}-t`} value={s.time} checked={time === s.time} disabled={s.disabled} onChange={() => onTimeChange(s.time)} />
              <span>{s.time}</span>{s.disabled && <span className="mm-sr"> (no disponible)</span>}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

/* ── StatusTimeline ── */
export function StatusTimeline({ steps, label = 'Estado del servicio' }: {
  steps: { label: string; detail?: string; state?: 'done' | 'current' | 'todo' }[]; label?: string;
}) {
  return (
    <ol className="mm-tl" aria-label={label}>
      {steps.map((s, i) => (
        <li key={i} className={cx('mm-tl-step', `is-${s.state || 'todo'}`)} aria-current={s.state === 'current' ? 'step' : undefined}>
          <span className="mm-tl-dot" aria-hidden="true">{s.state === 'done' ? <Icon name="check" size={16} /> : null}</span>
          <div className="mm-tl-text">
            <p className="mm-tl-label">{s.label}<span className="mm-sr">{s.state === 'done' ? ' (hecho)' : s.state === 'current' ? ' (en curso)' : ' (pendiente)'}</span></p>
            {s.detail && <p className="mm-tl-detail">{s.detail}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
