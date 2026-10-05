import { Link } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, remove, total } = useCart();
  const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <Link to="/shop" className="btn-primary">Ver catálogo</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">Tu carrito</h1>
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={item.variantId} className="card flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-3xl shrink-0">
              {item.image ? <img src={item.image} className="w-full h-full object-cover rounded-lg" alt="" /> : '🏍️'}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">{item.sku}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">{fmt(item.price * item.quantity)}</p>
              <p className="text-sm text-gray-400">x{item.quantity} · {fmt(item.price)}</p>
            </div>
            <button onClick={() => remove(item.variantId)} className="p-2 text-gray-400 hover:text-red-500">
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex justify-between text-lg font-bold mb-6">
          <span>Total</span>
          <span>{fmt(total)}</span>
        </div>
        <Link to="/checkout" className="btn-primary w-full text-center block">Proceder al pago</Link>
      </div>
    </div>
  );
}
