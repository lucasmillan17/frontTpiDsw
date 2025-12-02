import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext(null);

function getProductKey(p) {
  if (!p) return undefined;
  return p.id ?? p._id ?? p.sku ?? p.code ?? p.name ?? JSON.stringify({ name: p.name, price: p.currentUnitPrice ?? p.price });
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  // load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cartItems');
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
  }, []);

  // persist changes
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  function addToCart(product, qty = 1) {
    if (!product || qty <= 0) return;

    console.debug('[Cart] addToCart called', { key: getProductKey(product), qty });

    setItems(prev => {
      console.debug('[Cart] prev items', prev);

      const stock = Number(product.stockQuantity ?? product.stock ?? Infinity);
      const hasFiniteStock = Number.isFinite(stock);

      const key = getProductKey(product);
      const index = prev.findIndex(i => getProductKey(i) === key);
      const copy = [...prev];

      if (index >= 0) {
        const existing = { ...copy[index] };
        const newQty = (Number(existing.quantity) || 0) + qty;
        existing.quantity = hasFiniteStock ? Math.min(newQty, Math.max(0, Math.floor(stock))) : newQty;
        copy[index] = existing;
      } else {
        const initialQty = hasFiniteStock ? Math.min(qty, Math.max(0, Math.floor(stock))) : qty;
        // keep original product fields and add `quantity`
        copy.push({ ...product, quantity: initialQty });
      }

      console.debug('[Cart] new items', copy);
      return copy;
    });
  }

  function removeFromCart(productKey) {
    setItems(prev => prev.filter(i => getProductKey(i) !== productKey));
  }

  function updateQuantity(productKey, quantity) {
    setItems(prev => prev.map(i => getProductKey(i) === productKey ? { ...i, quantity: Math.max(0, Math.floor(quantity)) } : i));
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
  const totalPrice = items.reduce((s, it) => s + ((Number(it.currentUnitPrice ?? it.price ?? 0) || 0) * (Number(it.quantity) || 0)), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}
