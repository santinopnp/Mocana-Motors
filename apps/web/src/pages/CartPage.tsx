import { Alert, Button, IconButton, Icon, Price, SectionHeader, formatCOP } from '../design-system';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, remove, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="page max-w-read py-16 flex flex-col gap-6">
        <SectionHeader as="h1" title="Tu carrito" />
        <Alert tone="info" title="Tu carrito está vacío">Explora el catálogo y agrega repuestos o accesorios.</Alert>
        <Button variant="primary" href="/shop">Ver catálogo</Button>
      </div>
    );
  }

  return (
    <div className="page max-w-read py-8 pb-48 flex flex-col gap-4">
      <SectionHeader as="h1" eyebrow={`${items.length} ${items.length === 1 ? 'producto' : 'productos'}`} title="Tu carrito" />
      {items.map((item) => (
        <div key={item.variantId} className="card !p-3 flex items-center gap-3">
          <div className="w-16 h-16 bg-surface-sunken rounded-md flex items-center justify-center shrink-0 overflow-hidden text-ink-muted">
            {item.image ? <img src={item.image} className="w-full h-full object-cover" alt="" /> : <Icon name="nut" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="m-0 font-semibold leading-tight line-clamp-2">{item.name}</p>
            <p className="m-0 text-sm text-ink-muted">{formatCOP(item.price)} × {item.quantity}</p>
          </div>
          <Price size="sm" value={item.price * item.quantity} />
          <IconButton icon="close" label={`Quitar ${item.name}`} onClick={() => remove(item.variantId)} />
        </div>
      ))}

      <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 bg-surface-raised shadow-md px-4 py-4 z-30">
        <div className="max-w-read mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-ink-muted">Total, IVA incluido</span>
            <Price value={total} />
          </div>
          <Button variant="primary" block href="/checkout">Ir a pagar</Button>
        </div>
      </div>
    </div>
  );
}
