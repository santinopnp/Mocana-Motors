import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button, IconButton, Logo } from '../design-system/ui';

const LINKS = [
  { to: '/motos',      label: 'Motos' },
  { to: '/service',    label: 'Servicio técnico' },
  { to: '/repuestos',  label: 'Repuestos' },
  { to: '/accesorios', label: 'Accesorios' },
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
    <header className="mm-tb mm-tb-dark mm-tb-web sticky top-0 z-50">
      <Link to="/" className="mm-tb-brand" aria-label="Mocana Motors, inicio">
        <Logo variant="horizontal" tone="dark" height={36} label="" />
      </Link>

      <nav className="mm-tb-links" aria-label="Principal">
        {LINKS.map(({ to, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `mm-tb-link${isActive ? ' is-active' : ''}`}>{label}</NavLink>
        ))}
      </nav>

      <div className="mm-tb-actions">
        {searching ? (
          <form onSubmit={submitSearch} role="search">
            <label htmlFor="tb-search" className="mm-sr">Buscar</label>
            <input
              id="tb-search"
              autoFocus
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onBlur={() => { if (!q) setSearching(false); }}
              placeholder="Buscar motos, repuestos…"
              className="mm-input w-44 tablet:w-64 !min-h-[40px] !bg-asphalt-raised !text-asphalt-on !border-asphalt-raised placeholder:!text-asphalt-muted"
            />
          </form>
        ) : (
          <IconButton icon="search" label="Buscar" variant="on-dark" onClick={() => setSearching(true)} />
        )}
        <IconButton icon="cart" label="Carrito" variant="on-dark" to="/cart" badge={count > 9 ? '9+' : count} />
        <span className="hidden desktop:inline-flex">
          {user ? (
            <IconButton icon="user" label={`Cuenta de ${user.first_name}`} variant="on-dark" to={user.role === 'admin' ? '/admin' : '/account'} />
          ) : (
            <IconButton icon="user" label="Ingresar" variant="on-dark" to="/login" />
          )}
        </span>
        <Button size="sm" to="/service" className="mm-tb-cta">Agendar</Button>
      </div>
    </header>
  );
}
