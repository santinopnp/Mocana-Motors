import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const CATEGORIES = [
  { slug: '', label: 'Todo' },
  { slug: 'motorcycles', label: 'Motos' },
  { slug: 'helmets', label: 'Cascos' },
  { slug: 'gear', label: 'Equipamiento' },
  { slug: 'parts', label: 'Repuestos' },
  { slug: 'accessories', label: 'Accesorios' },
  { slug: 'lubricants', label: 'Lubricantes' },
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
      <div className="sticky top-14 lg:top-[72px] z-40 bg-surface border-b border-[#DADAD5]">
        <div className="max-w-content mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="search"
              placeholder="Buscar por nombre o referencia"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar por nombre o referencia"
              className="w-full bg-surface-raised border border-[#8A8F98] rounded-md pl-9 pr-4 h-12 text-base"
            />
          </div>
          <button aria-label="Filtros" className="w-12 h-12 flex items-center justify-center rounded-md bg-surface-raised border border-[#8A8F98] text-ink shrink-0">
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Category scroll */}
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              aria-pressed={category === c.slug}
              onClick={() => { setSearchParams(c.slug ? { category: c.slug } : {}); setSearch(''); }}
              className={`shrink-0 flex items-center min-h-[48px] px-[18px] rounded-md font-semibold transition-colors ${
                category === c.slug
                  ? 'bg-ink text-white border-2 border-ink'
                  : 'bg-surface-raised text-ink border border-[#8A8F98] hover:border-ink'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 py-5">
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="display text-[24px] lg:text-[28px]">
            {search ? `"${search}"` : currentCat?.slug ? currentCat.label : 'Todo el catálogo'}
          </h1>
          {!loading && <span className="text-sm text-ink-3">{products.length} productos</span>}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-surface-sunken animate-pulse aspect-[4/5]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-ink-3">
            
            <p className="font-semibold text-ink">No encontramos productos</p>
            <p className="text-sm mt-1">Prueba con otra palabra, una referencia o cambia la categoría.</p>
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
