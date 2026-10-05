import React, { createContext, useContext, useState } from 'react';

interface CartItem { variantId: string; productId: string; name: string; sku: string; price: number; quantity: number; image?: string; }
interface CartCtx { items: CartItem[]; add: (item: CartItem) => void; remove: (variantId: string) => void; clear: () => void; total: number; count: number; }

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function add(item: CartItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) return prev.map((i) => i.variantId === item.variantId ? { ...i, quantity: i.quantity + item.quantity } : i);
      return [...prev, item];
    });
  }

  function remove(variantId: string) {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }

  function clear() { setItems([]); }

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return <CartContext.Provider value={{ items, add, remove, clear, total, count }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
