"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import {
  addLine,
  cartCount,
  emptyCart,
  getCartSnapshot,
  getServerCartSnapshot,
  setLine,
  subscribeCart,
  writeCart,
  type CartState,
} from "@/lib/cart";

type CartContextValue = {
  cart: CartState;
  count: number;
  ready: boolean;
  add: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useSyncExternalStore(subscribeCart, getCartSnapshot, getServerCartSnapshot);
  const ready = useSyncExternalStore(subscribeCart, () => true, () => false);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      count: cartCount(cart),
      ready,
      add: (productId, quantity = 1) => writeCart(addLine(getCartSnapshot(), productId, quantity)),
      setQuantity: (productId, quantity) => writeCart(setLine(getCartSnapshot(), productId, quantity)),
      remove: (productId) => writeCart(setLine(getCartSnapshot(), productId, 0)),
      clear: () => writeCart(emptyCart),
    }),
    [cart, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used within CartProvider");
  }
  return value;
}
