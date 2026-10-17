import { Link } from 'react-router-dom';
import Icon from './Icon';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

interface Product {
  id: string; slug: string; name: string; brand: string;
  price: number; compare_price?: number; currency: string;
  images?: string[]; total_stock: number; category_slug?: string;
}

// Formato del sistema: $ 7.890.000
const fmt = (n: number) => '$ ' + Math.round(n).toLocaleString('es-CO').replace(/,/g, '.');

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
    <Link to={`/product/${product.slug}`} className="group flex flex-col bg-surface-raised rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-surface-sunken overflow-hidden">
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-3"><Icon name={product.category_slug === 'motorcycles' ? 'moto' : 'nut'} size={56} strokeWidth={1.5} /></div>
        )}
        {discount && discount > 5 && (
          <span className="absolute top-2.5 left-2.5 bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-[6px]">-{discount}%</span>
        )}
        {product.total_stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-ink text-white text-xs font-semibold px-3 py-1.5 rounded-[6px]">Agotado</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        <p className="font-mono text-[12px] text-ink-3 uppercase mb-0.5">{product.brand}</p>
        <h3 className="font-bold text-ink text-base leading-tight line-clamp-2 mb-2">{product.name}</h3>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            <p className="font-bold text-ink text-lg tabular-nums">{fmt(product.price)}</p>
            {product.compare_price && (
              <p className="text-xs text-ink-3 line-through leading-none">{fmt(product.compare_price)}</p>
            )}
          </div>
          {product.total_stock > 0 && (
            <button
              onClick={handleAdd}
              aria-label={added ? 'Agregado al carrito' : 'Agregar al carrito'}
              className={`shrink-0 w-12 h-12 rounded-md flex items-center justify-center transition-colors border-2 ${
                added ? 'bg-[#1D7A3B] border-[#1D7A3B] text-white' : 'border-ink text-ink hover:bg-ink hover:text-white'
              }`}
            >
              <Icon name={added ? 'check' : 'cart'} size={20} />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
