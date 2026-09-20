"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Dish, CartItem } from "@/types";

type CartContextValue = {
  cart: CartItem[];
  addToCart: (dish: Dish) => void;
  changeQty: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotalCents: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (dish: Dish) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === dish.id);
      if (existing) {
        return prev.map((i) => (i.id === dish.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...dish, qty: 1 }];
    });
  };

  const changeQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotalCents = cart.reduce((sum, i) => sum + i.priceCents * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, changeQty, removeItem, clearCart, cartCount, cartTotalCents }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart має використовуватись всередині <CartProvider>");
  return ctx;
}