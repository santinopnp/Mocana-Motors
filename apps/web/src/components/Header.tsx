import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './Icon';

const NAV = [
  { to: '/shop?category=motorcycles', label: 'Motos' },
  { to: '/service', label: 'Servicio técnico' },
  { to: '/service?tipo=maintenance', label: 'Taller' },
  { to: '/shop?category=parts', label: 'Repuestos' },
];

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
    <header className="bg-asphalt text-white sticky top-0 z-50">
      <div className="max-w-content mx-auto px-4 md:px-10 h-14 lg:h-[72px] flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2.5 shrink-0 min-h-[48px]">
          <img src="/brand/mocana-horizontal-dark.svg" alt="Mocana Motors" width={327} height={80} className="h-9 lg:h-11 w-auto" />
        </Link>

        <nav aria-label="Principal" className="hidden lg:flex items-center gap-1 flex-1">
          {NAV.map(({ to, label }) => (
            <NavLink key={to} to={to} className="text-chrome hover:text-white font-medium px-3 py-3 transition-colors">{label}</NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 shrink-0">
          {searching ? (
            <form onSubmit={submitSearch} className="flex items-center">
              <label className="sr-only" htmlFor="buscar">Buscar</label>
              <input
                id="buscar"
                autoFocus
                value={q}
                onChange={e => setQ(e.target.value)}
                onBlur={() => { if (!q) setSearching(false); }}
                placeholder="Buscar por nombre o referencia"
                className="bg-asphalt-raised text-white placeholder-chrome rounded-md px-3 h-10 w-44 md:w-64"
              />
            </form>
          ) : (
            <button aria-label="Buscar" onClick={() => setSearching(true)} className="w-12 h-12 flex items-center justify-center text-white">
              <Icon name="search" />
            </button>
          )}

          <Link to="/cart" aria-label={`Carrito, ${count} productos`} className="relative w-12 h-12 flex items-center justify-center">
            <Icon name="cart" />
            {count > 0 && (
              <span className="absolute top-1.5 right-1 bg-brand-500 text-white text-[11px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">{count > 9 ? '9+' : count}</span>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-2 pl-2">
            {user ? (
              <>
                <Link to="/account" className="text-chrome hover:text-white px-2 py-3">{user.first_name}</Link>
                {user.role === 'admin' && <Link to="/admin" className="text-brand-400 font-semibold text-sm px-2 py-3">Admin</Link>}
              </>
            ) : (
              <Link to="/login" className="text-chrome hover:text-white px-3 py-3 font-medium">Ingresar</Link>
            )}
            <Link to="/service" className="btn-on-dark !px-5">Agendar</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
