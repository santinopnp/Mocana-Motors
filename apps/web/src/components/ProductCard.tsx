import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard as MmProductCard, ProductCardProps } from '../design-system';
import { useCart } from '../context/CartContext';

export interface Product {
  id: string; slug: string; name: string; brand: string;
  price: number; compare_price?: number; currency: string;
  images?: string[]; total_stock: number; category_slug?: string;
}

const KIND: Record<string, ProductCardProps['kind']> = { motorcycles: 'moto', motocarros: 'motocarro', parts: 'repuesto', lubricants: 'repuesto' };

// Tarjeta de producto del sistema de diseño alimentada con un producto del catálogo
export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const kind = KIND[product.category_slug || ''] || 'accesorio';
  const isVehicle = kind === 'moto' || kind === 'motocarro';
  const soldOut = product.total_stock === 0;

  const badges: ProductCardProps['badges'] = [];
  if (soldOut) badges.push({ tone: 'dark', label: 'Agotado' });
  else if (product.total_stock <= 3) badges.push({ tone: 'warning', label: `Quedan ${product.total_stock} unidades` });
  else badges.push({ tone: 'success', label: 'Disponible' });
  if (product.compare_price && product.compare_price > product.price) badges.push({ tone: 'brand', label: 'Oferta', icon: 'tag' });

  function onAction() {
    if (isVehicle) return navigate(`/product/${product.slug}`);
    add({ variantId: product.id, productId: product.id, name: product.name, sku: product.id, price: product.price, quantity: 1, image: product.images?.[0] });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <MmProductCard
      title={product.name}
      category={product.brand}
      kind={kind}
      price={product.price}
      oldPrice={product.compare_price && product.compare_price > product.price ? product.compare_price : undefined}
      priceNote={isVehicle ? 'Precio de contado, IVA incluido' : 'IVA incluido'}
      image={product.images?.[0]}
      imageAlt={product.name}
      href={`/product/${product.slug}`}
      badges={badges}
      actionLabel={soldOut ? undefined : isVehicle ? 'Cotizar' : added ? 'Agregado' : 'Agregar al carrito'}
      onAction={onAction}
    />
  );
}
