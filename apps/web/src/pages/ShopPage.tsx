import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

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
  const [search, setSearch]     = useState('');
  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search)   params.set('search', search);
    params.set('limit', '40');
    axios.get(`/api/catalog/products?${params}`)
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-black">Catálogo</h1>
        <input
          type="search"
          placeholder="Buscar motos, cascos, repuestos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm w-full md:w-72 focus:outline-none focus:border-brand-400"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES.map((c) => (
          <button
            key={c.slug}
            onClick={() => setSearchParams(c.slug ? { category: c.slug } : {})}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === c.slug
                ? 'bg-brand-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-100 animate-pulse aspect-square" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p>No encontramos productos con ese criterio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
