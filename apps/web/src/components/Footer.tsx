import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="hidden md:block bg-dark-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-brand-500">🏍️</span>
            <span className="font-bold text-white text-sm">Mocana Motors</span>
          </div>
          <p className="text-xs leading-relaxed">Tu tienda de motos y accesorios en Colombia.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">Catálogo</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/shop?category=motorcycles" className="hover:text-white transition-colors">Motocicletas</Link></li>
            <li><Link to="/shop?category=helmets"     className="hover:text-white transition-colors">Cascos</Link></li>
            <li><Link to="/shop?category=gear"        className="hover:text-white transition-colors">Equipamiento</Link></li>
            <li><Link to="/shop?category=parts"       className="hover:text-white transition-colors">Repuestos</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">Servicios</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/service" className="hover:text-white transition-colors">Taller</Link></li>
            <li><Link to="/account" className="hover:text-white transition-colors">Mi cuenta</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-wide mb-3">Contacto</h4>
          <ul className="space-y-2 text-xs">
            <li>📍 Colombia</li>
            <li>📧 hola@mocanamotors.com</li>
            <li>📞 +57 300 000 0000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 px-6 py-3 text-center text-xs">
        © {new Date().getFullYear()} Mocana Motors. Todos los derechos reservados.
      </div>
    </footer>
  );
}
