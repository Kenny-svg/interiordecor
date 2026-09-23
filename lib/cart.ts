export const CART_STORAGE_KEY = "hale_cart";
export const MAX_CART_QTY = 8;
export const MAX_CART_LINES = 16;

export type CartLine = {
  productId: string;
  quantity: number;
};

export type CartState = {
  items: CartLine[];
};

export const emptyCart: CartState = { items: [] };

export function clampQty(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.min(MAX_CART_QTY, Math.max(1, Math.round(value)));
}

export function parseCart(raw: unknown): CartState {
  if (!raw || typeof raw !== "object" || !("items" in raw)) {
    return emptyCart;
  }
  const items = Array.isArray((raw as { items: unknown }).items)
    ? (raw as { items: unknown[] }).items
    : [];
  const lines: CartLine[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    if (!item || typeof item !== "object") {
      continue;
    }
    const productId = (item as { productId?: unknown }).productId;
    const quantity = (item as { quantity?: unknown }).quantity;
    if (typeof productId !== "string" || productId.length < 8) {
      continue;
    }
    if (seen.has(productId)) {
      continue;
    }
    seen.add(productId);
    lines.push({ productId, quantity: clampQty(Number(quantity)) });
    if (lines.length >= MAX_CART_LINES) {
      break;
    }
  }
  return { items: lines };
}

export function cartCount(cart: CartState): number {
  return cart.items.reduce((sum, line) => sum + line.quantity, 0);
}

export function setLine(cart: CartState, productId: string, quantity: number): CartState {
  const next = cart.items.filter((line) => line.productId !== productId);
  if (quantity <= 0) {
    return { items: next };
  }
  if (next.length >= MAX_CART_LINES && !cart.items.some((line) => line.productId === productId)) {
    return cart;
  }
  next.push({ productId, quantity: clampQty(quantity) });
  return { items: next };
}

export function addLine(cart: CartState, productId: string, quantity = 1): CartState {
  const existing = cart.items.find((line) => line.productId === productId);
  const nextQty = clampQty((existing?.quantity ?? 0) + quantity);
  return setLine(cart, productId, nextQty);
}

const listeners = new Set<() => void>();
let memory: CartState | null = null;

function emit() {
  listeners.forEach((listener) => listener());
}

function readStored(): CartState {
  if (typeof window === "undefined") {
    return emptyCart;
  }
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return emptyCart;
    }
    return parseCart(JSON.parse(raw) as unknown);
  } catch {
    return emptyCart;
  }
}

export function subscribeCart(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCartSnapshot(): CartState {
  if (!memory) {
    memory = readStored();
  }
  return memory;
}

export function getServerCartSnapshot(): CartState {
  return emptyCart;
}

export function writeCart(next: CartState): void {
  memory = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
  }
  emit();
}
