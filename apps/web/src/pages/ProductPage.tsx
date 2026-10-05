import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct]     = useState<any>(null);
  const [variant, setVariant]     = useState<any>(null);
  const [added, setAdded]         = useState(false);
  const { add } = useCart();

  useEffect(() => {
    axios.get(`/api/catalog/products/${slug}`)
      .then(({ data }) => {
        setProduct(data);
        if (data.variants?.length) setVariant(data.variants[0]);
      })
      .catch(() => {});
  }, [slug]);

  if (!product) return <div className="flex items-center justify-center py-32 text-gray-400">Cargando…</div>;

  const price = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(variant?.price || product.price);

  function handleAdd() {
    if (!variant && !product) return;
    add({
      variantId: variant?.id || product.id,
      productId: product.id,
      name: `${product.name}${variant ? ` – ${variant.name}` : ''}`,
      sku: variant?.sku || product.sku,
      price: variant?.price || product.price,
      quantity: 1,
      image: product.images?.[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center">
          {product.images?.[0]
            ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            : <span className="text-8xl">🏍️</span>}
        </div>

        <div>
          <p className="text-brand-600 font-semibold text-sm uppercase tracking-wide">{product.brand}</p>
          <h1 className="text-3xl font-black mt-1 mb-2">{product.name}</h1>
          {product.engine_cc && <p className="text-gray-500 text-sm mb-4">{product.engine_cc}cc</p>}
          <p className="text-gray-600 leading-relaxed mb-6">{product.description || product.short_desc}</p>

          {product.variants?.length > 1 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Variante</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setVariant(v)}
                    disabled={v.stock === 0}
                    className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                      variant?.id === v.id
                        ? 'border-brand-500 bg-brand-50 text-brand-700'
                        : v.stock === 0
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                        : 'border-gray-200 hover:border-brand-300 text-gray-700'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-4xl font-black text-gray-900">{price}</span>
            {(variant?.compare_price || product.compare_price) && (
              <span className="text-lg text-gray-400 line-through">
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(variant?.compare_price || product.compare_price)}
              </span>
            )}
          </div>

          {(variant?.stock === 0 || (!variant && product.total_stock === 0)) ? (
            <p className="text-red-500 font-semibold">Agotado</p>
          ) : (
            <button onClick={handleAdd} className="w-full btn-primary flex items-center justify-center gap-2">
              {added ? <><CheckIcon className="h-5 w-5" /> Agregado</> : <><ShoppingCartIcon className="h-5 w-5" /> Agregar al carrito</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
