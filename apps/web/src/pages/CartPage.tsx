import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Button, Icon, IconButton, formatCOP } from '../design-system/ui';

export default function CartPage() {
  const { items, remove, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-8 text-center gap-2">
        <span className="text-line-strong mb-2"><Icon name="cart" size={64} /></span>
        <h1 className="t-display-md text-ink">Tu carrito está vacío</h1>
        <p className="t-body-sm text-ink-muted mb-4">Explora el catálogo y agrega productos.</p>
        <Button to="/shop">Ver catálogo</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-read pb-40">
      <div className="px-4 pt-6 pb-4">
        <p className="mm-eyebrow">Carrito</p>
        <h1 className="t-display-lg text-ink">Mi carrito</h1>
        <p className="t-body-sm text-ink-muted">{items.length} {items.length === 1 ? 'producto' : 'productos'}</p>
      </div>

      <ul className="px-4 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.variantId} className="card !p-3 flex items-center gap-3">
            <div className="w-16 h-16 bg-surface-sunken rounded-md flex items-center justify-center shrink-0 overflow-hidden text-line-strong">
              {item.image
                ? <img src={item.image} className="w-full h-full object-cover" alt="" />
                : <Icon name="tag" size={28} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="t-label text-ink line-clamp-2">{item.name}</p>
              <p className="t-caption text-ink-muted mt-0.5">{formatCOP(item.price)} × {item.quantity}</p>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <p className="font-bold tabular-nums text-ink">{formatCOP(item.price * item.quantity)}</p>
              <IconButton icon="close" label={`Quitar ${item.name}`} onClick={() => remove(item.variantId)} />
            </div>
          </li>
        ))}
      </ul>

      <div className="fixed bottom-16 desktop:bottom-0 left-0 right-0 bg-surface-raised border-t border-line shadow-2 px-4 py-4 z-30">
        <div className="mx-auto max-w-read flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <span className="t-body-sm text-ink-muted">Total, IVA incluido</span>
            <span className="text-2xl font-bold tabular-nums text-ink">{formatCOP(total)}</span>
          </div>
          <Button block to="/checkout" iconEnd="arrow-right">Ir a pagar</Button>
          <Link to="/shop" className="t-label text-center text-brand-ink py-3">Seguir comprando</Link>
        </div>
      </div>
    </div>
  );
}
