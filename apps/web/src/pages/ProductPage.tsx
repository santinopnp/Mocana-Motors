import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Alert, Badge, Button, Chip, Icon, Price } from '../design-system';
import { useCart } from '../context/CartContext';

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
    <div className="flex items-center justify-center py-32" role="status" aria-label="Cargando">
      <span className="mm-spinner" />
    </div>
  );

  const price = variant?.price || product.price;
  const comparePrice = variant?.compare_price || product.compare_price;
  const stock = variant ? variant.stock : product.total_stock;
  const outOfStock = stock === 0;
  const isVehicle = product.category_slug === 'motorcycles' || product.category_slug === 'motocarros';

  function handleAdd() {
    add({ variantId: variant?.id || product.id, productId: product.id, name: `${product.name}${variant ? ` – ${variant.name}` : ''}`, sku: variant?.sku || product.id, price, quantity: 1, image: product.images?.[0] });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="page py-6 flex flex-col gap-4">
      <a href="/shop" className="mm-sh-link self-start"><Icon name="chevron-left" size={20} /> Catálogo</a>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
        <div className="relative aspect-[4/3] bg-surface-sunken rounded-lg overflow-hidden flex items-center justify-center text-ink-muted">
          {product.images?.[0]
            ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            : <Icon name={isVehicle ? 'moto' : 'nut'} size={120} strokeWidth={1.5} />}
        </div>

        <div className="flex flex-col gap-4">
          <p className="mm-eyebrow">{product.brand}</p>
          <h1 className="m-0 text-[22px] leading-7 font-semibold lg:text-3xl">{product.name}</h1>
          <div className="flex flex-wrap gap-2">
            {outOfStock ? <Badge tone="dark">Agotado</Badge>
              : stock <= 3 ? <Badge tone="warning" icon="alert">{`Quedan ${stock} unidades`}</Badge>
              : <Badge tone="success" icon="check">Disponible</Badge>}
            {product.engine_cc && <Badge>{`${product.engine_cc} cc${product.moto_year ? ` · ${product.moto_year}` : ''}`}</Badge>}
          </div>
          {(product.description || product.short_desc) && <p className="m-0 text-ink-2">{product.description || product.short_desc}</p>}

          {product.variants?.length > 1 && (
            <div className="flex flex-col gap-2">
              <p className="m-0 mm-field-label">Variante</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <Chip key={v.id} selected={variant?.id === v.id} disabled={v.stock === 0} onClick={() => setVariant(v)}>
                    {v.stock === 0 ? `${v.name} · agotado` : v.name}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          <Price value={price} oldValue={comparePrice > price ? comparePrice : undefined}
            note={isVehicle ? 'Precio de contado, IVA incluido' : 'IVA incluido'} />

          {outOfStock ? (
            <>
              <Alert tone="warning" title="Producto agotado">Escríbenos y te avisamos cuando llegue, o lo pedimos por ti.</Alert>
              <Button variant="secondary" block iconStart="wrench" href="/service">Consultar en el taller</Button>
            </>
          ) : isVehicle ? (
            <Button variant="primary" block iconEnd="arrow-right" href="/service">Cotizar esta moto</Button>
          ) : (
            <Button variant="primary" block iconStart={added ? 'check' : 'cart'} onClick={handleAdd}>
              {added ? 'Agregado al carrito' : 'Agregar al carrito'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
