import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ProductCard as MmProductCard, type ProductKind, type BadgeTone, type IconName } from '../design-system/ui';

export interface Product {
  id: string; slug: string; name: string; brand: string;
  price: number; compare_price?: number; currency: string;
  images?: string[]; total_stock: number; category_slug?: string;
  engine_cc?: number; moto_year?: number;
}

const KIND_BY_CATEGORY: Record<string, ProductKind> = {
  motorcycles: 'moto', motocarros: 'motocarro', parts: 'repuesto', lubricants: 'repuesto',
};

export default function ProductCard({ product, layout }: { product: Product; layout?: 'vertical' | 'horizontal' }) {
  const { add } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const kind = KIND_BY_CATEGORY[product.category_slug || ''] || 'accesorio';
  const isVehicle = kind === 'moto' || kind === 'motocarro';

  function handleAdd() {
    add({ variantId: product.id, productId: product.id, name: product.name, sku: product.id, price: product.price, quantity: 1, image: product.images?.[0] });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const discount = product.compare_price
    ? Math.round((1 - product.price / product.compare_price) * 100)
    : null;

  const badges: { label: string; tone: BadgeTone; icon?: IconName }[] = [];
  if (product.total_stock === 0) badges.push({ label: 'Agotado', tone: 'dark' });
  else if (product.total_stock <= 3) badges.push({ label: `Quedan ${product.total_stock}`, tone: 'warning' });
  if (discount && discount > 5) badges.push({ label: `-${discount}%`, tone: 'solid' });

  const specs = [product.engine_cc && `${product.engine_cc} cc`, product.moto_year && `Modelo ${product.moto_year}`].filter(Boolean) as string[];

  return (
    <MmProductCard
      layout={layout}
      title={product.name}
      category={product.brand}
      kind={kind}
      price={product.price}
      oldPrice={product.compare_price}
      image={product.images?.[0]}
      imageAlt={product.name}
      badges={badges}
      specs={specs}
      to={`/product/${product.slug}`}
      actionLabel={product.total_stock === 0 ? undefined : isVehicle ? 'Cotizar' : added ? 'Agregado' : 'Agregar'}
      onAction={isVehicle ? () => navigate(`/product/${product.slug}`) : handleAdd}
    />
  );
}
