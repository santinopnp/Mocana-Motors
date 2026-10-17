import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-asphalt text-chrome mt-16">
      <div className="max-w-content mx-auto px-4 md:px-10 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col gap-3">
          <img src="/brand/mocana-stacked-dark.svg" alt="Mocana Motors" width={360} height={214} className="h-24 w-auto self-start" />
          <p>Motos, taller y repuestos en Bucaramanga.</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="eyebrow text-xs">Tienda</h2>
          <Link to="/shop?category=motorcycles" className="hover:text-white">Motos</Link>
          <Link to="/shop?category=parts" className="hover:text-white">Repuestos</Link>
          <Link to="/shop?category=accessories" className="hover:text-white">Accesorios</Link>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="eyebrow text-xs">Servicio</h2>
          <Link to="/service" className="hover:text-white">Servicio técnico</Link>
          <Link to="/service" className="hover:text-white">Taller y mantenimiento</Link>
          <Link to="/account" className="hover:text-white">Mi cuenta</Link>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="eyebrow text-xs">Contacto</h2>
          <span className="text-white">Bucaramanga, Santander</span>
          <a href="mailto:hola@mocanamotors.com" className="hover:text-white">hola@mocanamotors.com</a>
          <span>+57 300 000 0000</span>
        </div>
      </div>
      <div className="border-t border-asphalt-raised px-4 py-4 text-center text-sm">
        © {new Date().getFullYear()} Mocana Motors. Todos los derechos reservados.
      </div>
    </footer>
  );
}
