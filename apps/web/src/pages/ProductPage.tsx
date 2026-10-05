import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ShoppingCartIcon, CheckIcon, ChevronLeftIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [variant, setVariant] = useState<any>(null);
  const [added,   setAdded]   = useState(false);
  const { add } = useCart();

  useEffect(() => {
    axios.get(`/api/catalog/products/${slug}`)
      .then(({ data }) => { setProduct(data); if (data.variants?.length) setVariant(data.variants[0]); })
      .catch(() => {});
  }, [slug]);

  if (!product) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const price = fmt(variant?.price || product.price);
  const comparePrice = (variant?.compare_price || product.compare_price)
    ? fmt(variant?.compare_price || product.compare_price) : null;
  const outOfStock = variant?.stock === 0 || (!variant && product.total_stock === 0);

  function handleAdd() {
    add({ variantId: variant?.id || product.id, productId: product.id, name: `${product.name}${variant ? ` – ${variant.name}` : ''}`, sku: variant?.sku || product.id, price: variant?.price || product.price, quantity: 1, image: product.images?.[0] });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back button */}
      <div className="px-4 pt-4">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ChevronLeftIcon className="h-4 w-4" /> Catálogo
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 md:px-8 md:py-10">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 md:rounded-3xl overflow-hidden">
          {product.images?.[0]
            ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-9xl">🏍️</div>}
          {comparePrice && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-full">
              -{Math.round((1 - (variant?.price || product.price) / (variant?.compare_price || product.compare_price)) * 100)}%
            </span>
          )}
        </div>

        {/* Details */}
        <div className="px-5 py-6 md:px-0">
          <p className="text-brand-500 font-bold text-xs uppercase tracking-widest mb-1">{product.brand}</p>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 leading-tight">{product.name}</h1>
          {product.engine_cc && <p className="text-gray-400 text-sm mb-3">{product.engine_cc}cc · {product.moto_year || ''}</p>}
          <p className="text-gray-600 text-sm leading-relaxed mb-5">{product.description || product.short_desc}</p>

          {/* Variants */}
          {product.variants?.length > 1 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2">Variante</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setVariant(v)}
                    disabled={v.stock === 0}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-colors ${
                      variant?.id === v.id ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : v.stock === 0 ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                      : 'border-gray-200 hover:border-brand-300 text-gray-700'
                    }`}
                  >
                    {v.name}
                    {v.stock === 0 && <span className="ml-1 text-xs text-gray-400">· Agotado</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-black">{price}</span>
            {comparePrice && <span className="text-lg text-gray-400 line-through">{comparePrice}</span>}
          </div>

          {/* CTA */}
          {outOfStock ? (
            <div className="space-y-3">
              <p className="bg-gray-100 text-gray-500 font-semibold text-center py-3.5 rounded-xl text-sm">Producto agotado</p>
              <Link to="/service" className="btn-secondary w-full gap-2 text-sm">
                <WrenchScrewdriverIcon className="h-4 w-4" /> Consultar en taller
              </Link>
            </div>
          ) : (
            <button onClick={handleAdd} className={`w-full gap-2 text-sm ${added ? 'bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center min-h-[48px]' : 'btn-primary'}`}>
              {added ? <><CheckIcon className="h-5 w-5" /> ¡Agregado al carrito!</> : <><ShoppingCartIcon className="h-5 w-5" /> Agregar al carrito</>}
            </button>
          )}

          {/* Stock hint */}
          {!outOfStock && (variant?.stock || product.total_stock) <= 5 && (
            <p className="text-orange-500 text-xs text-center mt-3 font-medium">
              ⚠️ Últimas {variant?.stock || product.total_stock} unidades
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
