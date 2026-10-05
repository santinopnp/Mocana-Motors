import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const CATEGORIES = [
  { slug: '', label: 'Todo', emoji: '✨' },
  { slug: 'motorcycles', label: 'Motos', emoji: '🏍️' },
  { slug: 'helmets', label: 'Cascos', emoji: '🪖' },
  { slug: 'gear', label: 'Equipamiento', emoji: '🧤' },
  { slug: 'parts', label: 'Repuestos', emoji: '⚙️' },
  { slug: 'accessories', label: 'Accesorios', emoji: '🔦' },
  { slug: 'lubricants', label: 'Lubricantes', emoji: '🛢️' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState(searchParams.get('search') || '');
  const category = searchParams.get('category') || '';
  const searchRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search)   params.set('search', search);
      params.set('limit', '40');
      axios.get(`/api/catalog/products?${params}`)
        .then(({ data }) => setProducts(data.products || []))
        .catch(() => setProducts([]))
        .finally(() => setLoading(false));
    }, search ? 350 : 0);
  }, [category, search]);

  const currentCat = CATEGORIES.find(c => c.slug === category);

  return (
    <div>
      {/* Sticky search + filter bar */}
      <div className="sticky top-14 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Buscar motos, cascos, repuestos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-400 focus:bg-white transition-colors"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 shrink-0">
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Category scroll */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => { setSearchParams(c.slug ? { category: c.slug } : {}); setSearch(''); }}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === c.slug
                  ? 'bg-brand-500 text-white shadow-sm shadow-brand-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{c.emoji}</span> {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5">
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-black">
            {search ? `"${search}"` : currentCat?.label || 'Catálogo'}
          </h1>
          {!loading && <span className="text-sm text-gray-400">{products.length} productos</span>}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse aspect-[4/5]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="font-semibold text-gray-500">Sin resultados</p>
            <p className="text-sm mt-1">Intenta con otro término o categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
