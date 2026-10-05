import { Link } from 'react-router-dom';
import { TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

export default function CartPage() {
  const { items, remove, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
        <ShoppingBagIcon className="h-16 w-16 text-gray-200 mb-4" />
        <h2 className="text-xl font-black text-gray-800 mb-1">Tu carrito está vacío</h2>
        <p className="text-gray-400 text-sm mb-6">Explora nuestro catálogo y agrega productos</p>
        <Link to="/shop" className="btn-primary text-sm">Ver catálogo</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-36">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-black">Mi carrito</h1>
        <p className="text-sm text-gray-400">{items.length} {items.length === 1 ? 'producto' : 'productos'}</p>
      </div>

      <div className="px-4 space-y-3">
        {items.map((item) => (
          <div key={item.variantId} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
            <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
              {item.image
                ? <img src={item.image} className="w-full h-full object-cover" alt="" />
                : <span className="text-2xl">🏍️</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{item.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{fmt(item.price)} × {item.quantity}</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <p className="font-black text-gray-900">{fmt(item.price * item.quantity)}</p>
              <button
                onClick={() => remove(item.variantId)}
                className="p-1.5 text-gray-300 hover:text-red-400 active:text-red-500 transition-colors"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky bottom summary */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-4 py-4 safe-bottom z-30">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-500 text-sm">Total</span>
            <span className="text-2xl font-black text-gray-900">{fmt(total)}</span>
          </div>
          <Link to="/checkout" className="btn-primary w-full text-sm">
            Proceder al pago
          </Link>
        </div>
      </div>
    </div>
  );
}
