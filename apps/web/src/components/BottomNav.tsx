import { NavLink } from 'react-router-dom';
import Icon, { IconName } from './Icon';

const ITEMS: { to: string; label: string; icon: IconName }[] = [
  { to: '/',                          label: 'Inicio',    icon: 'home' },
  { to: '/shop?category=motorcycles', label: 'Motos',     icon: 'moto' },
  { to: '/service',                   label: 'Servicio',  icon: 'wrench' },
  { to: '/shop?category=parts',       label: 'Repuestos', icon: 'nut' },
  { to: '/account',                   label: 'Cuenta',    icon: 'user' },
];

export default function BottomNav() {
  return (
    <nav aria-label="Principal" className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-raised border-t border-[#DADAD5] safe-bottom">
      <div className="grid grid-cols-5">
        {ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 min-h-[64px] text-[11px] transition-colors ${
                isActive ? 'text-brand-600 font-semibold' : 'text-ink-3 font-medium'
              }`
            }
          >
            <Icon name={icon} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
