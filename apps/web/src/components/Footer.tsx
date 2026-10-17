import { Link } from 'react-router-dom';
import { Icon, Logo } from '../design-system/ui';

const COLS = [
  { title: 'Tienda', links: [
    { to: '/motos', label: 'Motos y motocarros' },
    { to: '/repuestos', label: 'Repuestos' },
    { to: '/accesorios', label: 'Accesorios' },
    { to: '/shop?category=helmets', label: 'Cascos' },
  ] },
  { title: 'Servicio', links: [
    { to: '/service', label: 'Agendar servicio' },
    { to: '/account', label: 'Mi cuenta' },
  ] },
];

export default function Footer() {
  return (
    <footer className="hidden desktop:block bg-asphalt text-asphalt-muted mt-auto">
      <div className="page py-12 grid grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <Logo variant="stacked" tone="dark" height={96} />
          <p className="t-body-sm">Venta, taller y repuestos en un solo lugar. Bucaramanga, Colombia.</p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h2 className="mm-eyebrow !text-asphalt-muted mb-3">{c.title}</h2>
            <ul className="flex flex-col gap-2 t-body-sm">
              {c.links.map((l) => (
                <li key={l.to}><Link to={l.to} className="hover:text-asphalt-on">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="mm-eyebrow !text-asphalt-muted mb-3">Contacto</h2>
          <ul className="flex flex-col gap-2 t-body-sm">
            <li className="flex items-center gap-2"><Icon name="map-pin" size={18} /> Bucaramanga, Colombia</li>
            <li className="flex items-center gap-2"><Icon name="chat" size={18} /> hola@mocanamotors.com</li>
            <li className="flex items-center gap-2"><Icon name="phone" size={18} /> +57 300 000 0000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-asphalt-raised py-4 text-center t-caption">
        © {new Date().getFullYear()} Mocana Motors. Todos los derechos reservados.
      </div>
    </footer>
  );
}
