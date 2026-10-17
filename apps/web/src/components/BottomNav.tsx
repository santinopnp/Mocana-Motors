import { useLocation } from 'react-router-dom';
import { BottomNav as MmBottomNav, IconName } from '../design-system';

const ITEMS: { icon: IconName; label: string; href: string }[] = [
  { icon: 'home',   label: 'Inicio',    href: '/' },
  { icon: 'moto',   label: 'Motos',     href: '/shop?category=motorcycles' },
  { icon: 'wrench', label: 'Servicio',  href: '/service' },
  { icon: 'nut',    label: 'Repuestos', href: '/shop?category=parts' },
  { icon: 'user',   label: 'Cuenta',    href: '/account' },
];

export default function BottomNav() {
  const { pathname, search } = useLocation();
  const here = pathname + search;
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : href.includes('?') ? here === href : pathname.startsWith(href);
  return <MmBottomNav fixed label="Principal" items={ITEMS.map((it) => ({ ...it, active: isActive(it.href) }))} />;
}
