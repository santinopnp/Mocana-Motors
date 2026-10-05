import { Link, NavLink } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Header() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-dark-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-brand-500 text-2xl">🏍️</span>
          <span className="font-bold text-xl tracking-tight">Mocana Motors</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <NavLink to="/shop" className={({ isActive }) => isActive ? 'text-brand-500' : 'text-gray-300 hover:text-white'}>Catálogo</NavLink>
          <NavLink to="/shop?category=motorcycles" className={({ isActive }) => isActive ? 'text-brand-500' : 'text-gray-300 hover:text-white'}>Motos</NavLink>
          <NavLink to="/shop?category=helmets" className={({ isActive }) => isActive ? 'text-brand-500' : 'text-gray-300 hover:text-white'}>Cascos</NavLink>
          <NavLink to="/shop?category=gear" className={({ isActive }) => isActive ? 'text-brand-500' : 'text-gray-300 hover:text-white'}>Equipamiento</NavLink>
          <NavLink to="/service" className={({ isActive }) => isActive ? 'text-brand-500' : 'text-gray-300 hover:text-white'}>Taller</NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2">
            <ShoppingCartIcon className="h-6 w-6 text-gray-300 hover:text-white" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{count}</span>
            )}
          </Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/account" className="text-gray-300 hover:text-white text-sm">{user.first_name}</Link>
              {user.role === 'admin' && <Link to="/admin" className="text-brand-500 text-sm font-semibold">Admin</Link>}
              <button onClick={logout} className="text-gray-400 hover:text-white text-sm">Salir</button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1 text-gray-300 hover:text-white text-sm">
              <UserIcon className="h-5 w-5" /> Ingresar
            </Link>
          )}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Bars3Icon className="h-6 w-6 text-gray-300" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-dark-800 px-4 pb-4 flex flex-col gap-3 text-sm">
          <NavLink to="/shop" onClick={() => setMenuOpen(false)} className="text-gray-300 py-2">Catálogo</NavLink>
          <NavLink to="/service" onClick={() => setMenuOpen(false)} className="text-gray-300 py-2">Taller</NavLink>
        </div>
      )}
    </header>
  );
}
