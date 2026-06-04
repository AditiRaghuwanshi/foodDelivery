"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import { MENU } from "@/lib/data";

type CartState = Record<string, number>;

type CartContextType = {
  cart: CartState;
  add: (id: string) => void;
  sub: (id: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>({});

  const add = useCallback((id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }, []);

  const sub = useCallback((id: string) => {
    setCart((c) => {
      const qty = (c[id] || 0) - 1;
      const next = { ...c };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
  }, []);

  const clear = useCallback(() => setCart({}), []);

  const count = useMemo(
    () => Object.values(cart).reduce((n, q) => n + q, 0),
    [cart]
  );

  const subtotal = useMemo(
    () =>
      Object.entries(cart).reduce((sum, [id, qty]) => {
        const item = MENU.find((m) => m.id === id);
        return sum + (item?.price || 0) * qty;
      }, 0),
    [cart]
  );

  const deliveryFee = subtotal > 0 && subtotal < 35 ? 2.99 : 0;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = parseFloat((subtotal + deliveryFee + tax).toFixed(2));

  return (
    <CartContext.Provider
      value={{ cart, add, sub, clear, count, subtotal, deliveryFee, tax, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}