import type { CartItem, NeonDesignConfig } from "./types";

const KEY = "mudita-cart-v1";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(config: NeonDesignConfig, price: number) {
  const items = getCart();
  items.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    config,
    price,
    createdAt: Date.now(),
  });
  saveCart(items);
}

export function removeFromCart(id: string) {
  saveCart(getCart().filter((i) => i.id !== id));
}

export function clearCart() {
  saveCart([]);
}
