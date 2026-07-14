import type { CartItem, NeonDesignConfig } from "./types";
import { sanitiseConfigDecorations } from "./svgSanitize";

const KEY = "mudita-cart-v1";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    return parsed.map((item) => ({
      ...item,
      config: sanitiseConfigDecorations(item.config),
    }));
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
    config: sanitiseConfigDecorations(config),
    price,
    createdAt: Date.now(),
  });
  saveCart(items);
}

export function removeFromCart(id: string) {
  saveCart(getCart().filter((i) => i.id !== id));
}

export function updateCartItem(id: string, config: NeonDesignConfig, price: number) {
  const items = getCart();
  const idx = items.findIndex((i) => i.id === id);
  if (idx >= 0) {
    items[idx] = {
      ...items[idx],
      config: sanitiseConfigDecorations(config),
      price,
    };
    saveCart(items);
    return true;
  }
  return false;
}

export function clearCart() {
  saveCart([]);
}
