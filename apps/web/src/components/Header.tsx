import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TopBar, TextField } from '../design-system';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  { label: 'Motos', href: '/shop?category=motorcycles' },
  { label: 'Servicio técnico', href: '/service' },
  { label: 'Repuestos', href: '/shop?category=parts' },
  { label: 'Accesorios', href: '/shop?category=accessories' },
];

export default function Header() {
  const { count } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searching, setSearching] = useState(false);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState('');
  const here = location.pathname + location.search;

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) { navigate(`/shop?search=${encodeURIComponent(q.trim())}`); setSearching(false); setQ(''); }
  }

  return (
    <div className="sticky top-0 z-50">
      <TopBar
        variant="web"
        tone="dark"
        links={LINKS.map((l) => ({ ...l, active: here === l.href || (l.href === '/service' && location.pathname === '/service') }))}
        actions={[
          { icon: 'search', label: 'Buscar', onClick: () => setSearching((s) => !s) },
          { icon: 'cart', label: 'Carrito', href: '/cart', badge: count || undefined },
          { icon: 'user', label: user ? `Cuenta de ${user.first_name}` : 'Ingresar', href: user ? '/account' : '/login' },
        ]}
        cta={{ label: 'Agendar servicio', href: '/service' }}
        onMenu={() => setMenu((m) => !m)}
      />
      {menu && (
        <nav aria-label="Menú" className="lg:hidden bg-asphalt border-t border-asphalt-raised px-4 pb-4">
          {[...LINKS, ...(user?.role === 'admin' ? [{ label: 'Administración', href: '/admin' }] : [])].map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenu(false)} className="mm-tb-link text-white w-full">{l.label}</a>
          ))}
        </nav>
      )}
      {searching && (
        <form onSubmit={submitSearch} role="search" className="bg-surface-raised border-b border-line px-4 py-3">
          <div className="max-w-content mx-auto">
            <TextField label="Buscar en la tienda" iconStart="search" type="search" autoFocus value={q}
              onChange={(e) => setQ(e.target.value)} placeholder="Nombre, marca o referencia" />
          </div>
        </form>
      )}
    </div>
  );
}
