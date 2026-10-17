import { Logo } from '../design-system';

const COLS = [
  { title: 'Tienda', links: [['Motos', '/shop?category=motorcycles'], ['Repuestos', '/shop?category=parts'], ['Accesorios', '/shop?category=accessories']] },
  { title: 'Servicio', links: [['Servicio técnico', '/service'], ['Taller y mantenimiento', '/service'], ['Mi cuenta', '/account']] },
];

export default function Footer() {
  return (
    <footer className="bg-asphalt text-chrome mt-16">
      <div className="page py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <Logo variant="stacked" tone="dark" height={96} />
          <p className="m-0">Motos, taller y repuestos en Bucaramanga.</p>
        </div>
        {COLS.map((c) => (
          <div key={c.title} className="flex flex-col gap-2">
            <h2 className="mm-eyebrow !text-chrome">{c.title}</h2>
            {c.links.map(([label, href]) => <a key={label} href={href} className="text-chrome hover:text-white no-underline">{label}</a>)}
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <h2 className="mm-eyebrow !text-chrome">Contacto</h2>
          <span className="text-white">Bucaramanga, Santander</span>
          <a href="mailto:hola@mocanamotors.com" className="text-chrome hover:text-white no-underline">hola@mocanamotors.com</a>
          <span>+57 300 000 0000</span>
        </div>
      </div>
      <div className="border-t border-asphalt-raised px-4 py-4 text-center text-sm">
        © {new Date().getFullYear()} Mocana Motors. Todos los derechos reservados.
      </div>
    </footer>
  );
}
