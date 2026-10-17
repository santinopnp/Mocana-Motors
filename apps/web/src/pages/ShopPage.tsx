import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Chip, SectionHeader, TextField, Alert, IconName } from '../design-system';
import ProductCard, { Product } from '../components/ProductCard';

const CATEGORIES: { slug: string; label: string; icon?: IconName }[] = [
  { slug: '', label: 'Todo' },
  { slug: 'motorcycles', label: 'Motos', icon: 'moto' },
  { slug: 'helmets', label: 'Cascos', icon: 'shield' },
  { slug: 'gear', label: 'Equipamiento', icon: 'tag' },
  { slug: 'parts', label: 'Repuestos', icon: 'nut' },
  { slug: 'accessories', label: 'Accesorios', icon: 'tag' },
  { slug: 'lubricants', label: 'Lubricantes', icon: 'oil' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState(searchParams.get('search') || '');
  const category = searchParams.get('category') || '';
  const searchRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => { setSearch(searchParams.get('search') || ''); }, [searchParams]);

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
  const title = search ? `Resultados para “${search}”` : currentCat?.slug ? currentCat.label : 'Todo el catálogo';

  return (
    <div className="page py-8 flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <SectionHeader as="h1" eyebrow="Catálogo" title={title} />
        <div className="lg:w-[380px]">
          <TextField label="Buscar por nombre o referencia" iconStart="search" type="search" value={search}
            onChange={(e) => setSearch(e.target.value)} placeholder="Ej. kit de arrastre" />
        </div>
      </div>

      <div role="group" aria-label="Categorías" className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        {CATEGORIES.map((c) => (
          <Chip key={c.slug} selected={category === c.slug} icon={c.icon}
            onClick={() => { setSearchParams(c.slug ? { category: c.slug } : {}); setSearch(''); }}>
            {c.label}
          </Chip>
        ))}
      </div>

      {!loading && <p className="m-0 text-ink-muted">{products.length} {products.length === 1 ? 'producto' : 'productos'}</p>}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="rounded-lg bg-surface-sunken animate-pulse aspect-[3/4]" />)}
        </div>
      ) : products.length === 0 ? (
        <Alert tone="info" title="No encontramos productos">Prueba con otra palabra, una referencia o cambia la categoría.</Alert>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
