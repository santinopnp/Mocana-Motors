import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard, { type Product } from '../components/ProductCard';
import { Chip, Icon, SectionHeader, type IconName } from '../design-system/ui';

// Las líneas principales tienen ruta propia; el resto filtra /shop por query.
const CATEGORIES: { slug: string; label: string; icon?: IconName; path: string }[] = [
  { slug: '',            label: 'Todo',         path: '/shop' },
  { slug: 'motorcycles', label: 'Motos',        icon: 'moto',      path: '/motos' },
  { slug: 'motocarros',  label: 'Motocarros',   icon: 'motocarro', path: '/shop?category=motocarros' },
  { slug: 'parts',       label: 'Repuestos',    icon: 'nut',       path: '/repuestos' },
  { slug: 'accessories', label: 'Accesorios',   icon: 'tag',       path: '/accesorios' },
  { slug: 'helmets',     label: 'Cascos',       icon: 'shield',    path: '/shop?category=helmets' },
  { slug: 'gear',        label: 'Equipamiento', icon: 'user',      path: '/shop?category=gear' },
  { slug: 'lubricants',  label: 'Lubricantes',  icon: 'oil',       path: '/shop?category=lubricants' },
];

export default function ShopPage({ baseCategory = '' }: { baseCategory?: string }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState(searchParams.get('search') || '');
  const category = searchParams.get('category') || baseCategory;
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
  const title = search ? `“${search}”` : currentCat?.slug ? currentCat.label : 'Catálogo';

  return (
    <div>
      {/* Barra de búsqueda y filtros */}
      <div className="sticky top-14 desktop:top-[72px] z-40 bg-surface-raised border-b border-line">
        <div className="page pt-3 pb-2 flex flex-col gap-3">
          <div className="mm-control has-icon">
            <Icon name="search" size={20} className="mm-control-icon" />
            <label htmlFor="shop-search" className="mm-sr">Buscar en el catálogo</label>
            <input
              id="shop-search"
              type="search"
              placeholder="Buscar motos, repuestos o referencia…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mm-input"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none py-1 -mx-1 px-1">
            {CATEGORIES.map((c) => (
              <Chip
                key={c.slug}
                icon={c.icon}
                selected={category === c.slug}
                onClick={() => { setSearch(''); navigate(c.path); }}
              >
                {c.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div className="page py-6 flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader as="h1" eyebrow="Tienda Mocana" title={title} />
          {!loading && <span className="t-body-sm text-ink-muted pb-1">{products.length} productos</span>}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 tablet:grid-cols-3 wide:grid-cols-4 gap-3 desktop:gap-5" aria-busy="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-surface-sunken animate-pulse aspect-[4/5]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-2">
            <span className="text-line-strong"><Icon name="search" size={56} /></span>
            <p className="t-title text-ink">Sin resultados</p>
            <p className="t-body-sm text-ink-muted">Prueba con otra palabra, referencia o categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 tablet:grid-cols-3 wide:grid-cols-4 gap-3 desktop:gap-5">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
