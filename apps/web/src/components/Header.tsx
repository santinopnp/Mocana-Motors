import { Link } from 'react-router-dom';
import { ShoppingCartIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { count } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState('');

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) { navigate(`/shop?search=${encodeURIComponent(q.trim())}`); setSearching(false); setQ(''); }
  }

  return (
    <header className="bg-dark-900 text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-brand-500 text-xl">🏍️</span>
          <span className="font-black text-base tracking-tight leading-none">Mocana<br /><span className="text-brand-500 text-xs font-semibold tracking-widest uppercase">Motors</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium flex-1 justify-center">
          {[
            { to: '/shop', label: 'Catálogo' },
            { to: '/shop?category=motorcycles', label: 'Motos' },
            { to: '/shop?category=helmets', label: 'Cascos' },
            { to: '/shop?category=gear', label: 'Equipamiento' },
            { to: '/service', label: 'Taller' },
          ].map(({ to, label }) => (
            <Link key={to} to={to} className="text-gray-300 hover:text-white transition-colors">{label}</Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Search toggle */}
          {searching ? (
            <form onSubmit={submitSearch} className="flex items-center">
              <input
                autoFocus
                value={q}
                onChange={e => setQ(e.target.value)}
                onBlur={() => { if (!q) setSearching(false); }}
                placeholder="Buscar…"
                className="bg-dark-800 text-white placeholder-gray-500 text-sm rounded-xl px-3 py-1.5 w-40 md:w-56 focus:ring-1 ring-brand-500 outline-none"
              />
            </form>
          ) : (
            <button onClick={() => setSearching(true)} className="p-2 text-gray-300 hover:text-white">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          )}

          {/* Cart */}
          <Link to="/cart" className="relative p-2">
            <ShoppingCartIcon className="h-5 w-5 text-gray-300 hover:text-white" />
            {count > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-brand-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{count > 9 ? '9+' : count}</span>
            )}
          </Link>

          {/* User - desktop only */}
          <div className="hidden md:flex items-center gap-2 text-sm pl-1">
            {user ? (
              <>
                <Link to="/account" className="text-gray-300 hover:text-white">{user.first_name}</Link>
                {user.role === 'admin' && <Link to="/admin" className="text-brand-500 font-semibold text-xs">Admin</Link>}
              </>
            ) : (
              <Link to="/login" className="text-gray-300 hover:text-white px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors text-xs font-medium">Ingresar</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
