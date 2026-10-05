import { Link } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  model?: string;
  price: number;
  compare_price?: number;
  currency: string;
  images?: string[];
  total_stock: number;
  category_slug?: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  const price = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price);
  const comparePrice = product.compare_price
    ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.compare_price)
    : null;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      <Link to={`/product/${product.slug}`}>
        <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          ) : (
            <span className="text-6xl">🏍️</span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-brand-600 font-medium uppercase tracking-wide">{product.brand}</p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 mt-1 hover:text-brand-600 leading-tight">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2 mt-3">
          <span className="font-bold text-gray-900">{price}</span>
          {comparePrice && <span className="text-sm text-gray-400 line-through">{comparePrice}</span>}
        </div>
        {product.total_stock === 0 ? (
          <p className="mt-3 text-sm text-red-500 font-medium">Agotado</p>
        ) : (
          <button
            onClick={() => add({ variantId: product.id, productId: product.id, name: product.name, sku: product.id, price: product.price, quantity: 1 })}
            className="mt-3 w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
          >
            <ShoppingCartIcon className="h-4 w-4" />
            Agregar
          </button>
        )}
      </div>
    </div>
  );
}
