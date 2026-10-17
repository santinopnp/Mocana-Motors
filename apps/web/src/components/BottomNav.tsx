import { BottomNav as MmBottomNav } from '../design-system/ui';

const ITEMS = [
  { to: '/',        label: 'Inicio',    icon: 'home',   end: true },
  { to: '/motos',   label: 'Motos',     icon: 'moto' },
  { to: '/service', label: 'Servicio',  icon: 'wrench' },
  { to: '/repuestos', label: 'Repuestos', icon: 'nut' },
  { to: '/account', label: 'Cuenta',    icon: 'user' },
] as const;

export default function BottomNav() {
  return <MmBottomNav items={ITEMS.map((i) => ({ ...i }))} />;
}
