import { Link } from 'react-router-dom';
import { ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

interface Product {
  id: string; slug: string; name: string; brand: string;
  price: number; compare_price?: number; currency: string;
  images?: string[]; total_stock: number; category_slug?: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    add({ variantId: product.id, productId: product.id, name: product.name, sku: product.id, price: product.price, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const discount = product.compare_price
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : null;

  return (
    <Link to={`/product/${product.slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm active:scale-[.98] transition-transform">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🏍️</div>
        )}
        {discount && discount > 5 && (
          <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
        )}
        {product.total_stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full">Agotado</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[10px] text-brand-500 font-bold uppercase tracking-wider mb-0.5">{product.brand}</p>
        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-2">{product.name}</h3>
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="font-black text-gray-900 text-base">{fmt(product.price)}</p>
            {product.compare_price && (
              <p className="text-xs text-gray-400 line-through leading-none">{fmt(product.compare_price)}</p>
            )}
          </div>
          {product.total_stock > 0 && (
            <button
              onClick={handleAdd}
              className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                added ? 'bg-green-500 text-white' : 'bg-brand-500 hover:bg-brand-600 text-white'
              }`}
            >
              {added ? <CheckIcon className="h-4 w-4" /> : <ShoppingCartIcon className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
