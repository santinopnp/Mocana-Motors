import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { Alert, Badge, Button, Icon, Price } from '../design-system/ui';

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
    <div className="flex items-center justify-center py-32 text-brand" aria-busy="true">
      <span className="mm-spinner" aria-hidden="true" />
      <span className="mm-sr">Cargando producto</span>
    </div>
  );

  const price: number = variant?.price || product.price;
  const comparePrice: number | null = variant?.compare_price || product.compare_price || null;
  const stock: number = variant ? variant.stock : product.total_stock;
  const outOfStock = stock === 0;
  const discount = comparePrice ? Math.round((1 - price / comparePrice) * 100) : 0;

  function handleAdd() {
    add({ variantId: variant?.id || product.id, productId: product.id, name: `${product.name}${variant ? ` – ${variant.name}` : ''}`, sku: variant?.sku || product.id, price, quantity: 1, image: product.images?.[0] });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="page !px-0 tablet:!px-6 desktop:!px-10">
      <div className="px-4 tablet:px-0 pt-2">
        <Link to="/shop" className="mm-sh-link">
          <Icon name="chevron-left" size={20} /> Catálogo
        </Link>
      </div>

      <div className="grid grid-cols-1 desktop:grid-cols-2 desktop:gap-12 desktop:py-6">
        <div className="relative aspect-[4/3] bg-surface-sunken tablet:rounded-lg overflow-hidden flex items-center justify-center text-line-strong">
          {product.images?.[0]
            ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            : <Icon name="moto" size={120} />}
          {discount > 5 && (
            <span className="absolute top-4 left-4"><Badge tone="solid">-{discount}%</Badge></span>
          )}
        </div>

        <div className="px-4 tablet:px-0 py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="mm-eyebrow">{product.brand}</p>
            <h1 className="t-title-lg desktop:text-[28px] desktop:leading-[34px] text-ink">{product.name}</h1>
            {product.engine_cc && (
              <p className="t-body-sm text-ink-muted">{product.engine_cc} cc{product.moto_year ? ` · Modelo ${product.moto_year}` : ''}</p>
            )}
          </div>

          <Price value={price} oldValue={comparePrice} note="Precio de contado, IVA incluido" />

          {(product.description || product.short_desc) && (
            <p className="text-ink-2">{product.description || product.short_desc}</p>
          )}

          {product.variants?.length > 1 && (
            <fieldset className="flex flex-col gap-2">
              <legend className="mm-field-label mb-2">Variante</legend>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={variant?.id === v.id}
                    onClick={() => setVariant(v)}
                    disabled={v.stock === 0}
                    className={`mm-chip ${variant?.id === v.id ? 'is-selected' : ''} disabled:bg-surface-sunken disabled:text-ink-muted disabled:border-line disabled:line-through disabled:cursor-not-allowed`}
                  >
                    {variant?.id === v.id && <Icon name="check" size={18} />}
                    <span>{v.name}</span>
                    {v.stock === 0 && <span className="mm-sr"> (agotado)</span>}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {!outOfStock && stock <= 5 && (
            <p><Badge tone="warning" icon="alert">Quedan {stock} unidades</Badge></p>
          )}

          {outOfStock ? (
            <div className="flex flex-col gap-3">
              <Alert tone="warning" title="Producto agotado">Te avisamos cuando vuelva, o consúltalo en el taller.</Alert>
              <Button variant="secondary" block to="/service" iconStart="wrench">Consultar en taller</Button>
            </div>
          ) : (
            <Button block onClick={handleAdd} iconStart={added ? 'check' : 'cart'}>
              {added ? 'Agregado al carrito' : 'Agregar al carrito'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
