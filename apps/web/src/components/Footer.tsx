import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-brand-500 text-xl">🏍️</span>
            <span className="font-bold text-white">Mocana Motors</span>
          </div>
          <p className="text-sm leading-relaxed">Tu tienda de motos y accesorios en Colombia. Pasión sobre dos ruedas.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Catálogo</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop?category=motorcycles" className="hover:text-white">Motocicletas</Link></li>
            <li><Link to="/shop?category=helmets" className="hover:text-white">Cascos</Link></li>
            <li><Link to="/shop?category=gear" className="hover:text-white">Equipamiento</Link></li>
            <li><Link to="/shop?category=parts" className="hover:text-white">Repuestos</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Servicios</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/service" className="hover:text-white">Taller</Link></li>
            <li><Link to="/account" className="hover:text-white">Mi cuenta</Link></li>
            <li><Link to="/account/orders" className="hover:text-white">Mis órdenes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contacto</h4>
          <ul className="space-y-2 text-sm">
            <li>📍 Colombia</li>
            <li>📧 hola@mocanamotors.com</li>
            <li>📞 +57 300 000 0000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 px-4 py-4 text-center text-xs">
        © {new Date().getFullYear()} Mocana Motors. Todos los derechos reservados.
      </div>
    </footer>
  );
}
