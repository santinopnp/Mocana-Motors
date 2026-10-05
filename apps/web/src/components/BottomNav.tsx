import { NavLink } from 'react-router-dom';
import { HomeIcon, ShoppingBagIcon, WrenchScrewdriverIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, ShoppingBagIcon as ShopSolid, WrenchScrewdriverIcon as WrenchSolid, ShoppingCartIcon as CartSolid, UserIcon as UserSolid } from '@heroicons/react/24/solid';
import { useCart } from '../context/CartContext';

const ITEMS = [
  { to: '/',       label: 'Inicio',   Icon: HomeIcon,               IconActive: HomeIconSolid },
  { to: '/shop',   label: 'Tienda',   Icon: ShoppingBagIcon,        IconActive: ShopSolid },
  { to: '/service',label: 'Taller',   Icon: WrenchScrewdriverIcon,  IconActive: WrenchSolid },
  { to: '/cart',   label: 'Carrito',  Icon: ShoppingCartIcon,       IconActive: CartSolid,  cart: true },
  { to: '/account',label: 'Cuenta',   Icon: UserIcon,               IconActive: UserSolid },
];

export default function BottomNav() {
  const { count } = useCart();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg safe-bottom">
      <div className="flex">
        {ITEMS.map(({ to, label, Icon, IconActive, cart }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 relative transition-colors min-h-[56px] ${
                isActive ? 'text-brand-500' : 'text-gray-400 active:text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  {isActive
                    ? <IconActive className="h-6 w-6" />
                    : <Icon className="h-6 w-6" />
                  }
                  {cart && count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-brand-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {count > 9 ? '9+' : count}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
