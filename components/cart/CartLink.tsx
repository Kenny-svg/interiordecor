"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export function CartLink() {
  const { count, ready } = useCart();
  const shown = ready ? count : 0;

  return (
    <Link
      href="/cart"
      className="text-[12px] uppercase tracking-[0.18em] text-ink"
      aria-label={shown > 0 ? `Cart, ${shown} pieces` : "Cart"}
    >
      Cart{shown > 0 ? ` (${shown})` : ""}
    </Link>
  );
}
