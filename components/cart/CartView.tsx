"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { ProductPhoto } from "@/components/shop/ProductPhoto";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { setLine, writeCart, getCartSnapshot } from "@/lib/cart";
import { formatNaira } from "@/lib/money";

type LineView = {
  productId: string;
  quantity: number;
  name: string;
  slug: string;
  priceNaira: number;
  imageUrl: string;
};

export function CartView() {
  const { cart, ready, setQuantity, remove } = useCart();
  const [lines, setLines] = useState<LineView[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const ids = cart.items.map((item) => item.productId).join(",");

  useEffect(() => {
    if (!ready || !ids) {
      return;
    }
    const current = getCartSnapshot();
    const params = new URLSearchParams();
    for (const item of current.items) {
      params.append("id", item.productId);
    }
    let cancelled = false;
    fetch(`/api/shop/cart?${params.toString()}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("unavailable");
        }
        const data = (await response.json()) as { lines: LineView[] };
        if (cancelled) {
          return;
        }
        setLines(data.lines);
        const missing = current.items.filter(
          (item) => !data.lines.some((line) => line.productId === item.productId),
        );
        if (missing.length > 0) {
          let next = getCartSnapshot();
          for (const item of missing) {
            next = setLine(next, item.productId, 0);
          }
          writeCart(next);
        }
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setError("The cart could not be read. Refresh, or write to the studio.");
        setLines([]);
      });
    return () => {
      cancelled = true;
    };
  }, [ids, ready]);

  if (!ready) {
    return <CartLoading />;
  }

  if (cart.items.length === 0) {
    return (
      <Container className="py-12 sm:py-16">
        <Eyebrow>Cart</Eyebrow>
        <h1 className="mt-4 font-display text-5xl text-ink">The cart is empty.</h1>
        <p className="mt-6 max-w-md text-lg leading-8 text-ink-soft">
          Choose a piece from the shop. We will confirm it after you write.
        </p>
        {error ? <p className="mt-4 text-sm text-muted">{error}</p> : null}
        <p className="mt-10">
          <ButtonLink href="/shop">Shop pieces</ButtonLink>
        </p>
      </Container>
    );
  }

  if (lines === null) {
    return <CartLoading />;
  }

  const qty = new Map(cart.items.map((item) => [item.productId, item.quantity]));
  const shown = lines
    .map((line) => ({ ...line, quantity: qty.get(line.productId) ?? line.quantity }))
    .filter((line) => line.quantity > 0);

  if (shown.length === 0) {
    return (
      <Container className="py-12 sm:py-16">
        <Eyebrow>Cart</Eyebrow>
        <h1 className="mt-4 font-display text-5xl text-ink">The cart is empty.</h1>
        <p className="mt-10">
          <ButtonLink href="/shop">Shop pieces</ButtonLink>
        </p>
      </Container>
    );
  }

  const total = shown.reduce((sum, line) => sum + line.priceNaira * line.quantity, 0);

  return (
    <Container className="py-12 sm:py-16">
      <Eyebrow>Cart</Eyebrow>
      <h1 className="mt-4 font-display text-5xl text-ink sm:text-6xl">Your cart.</h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
        These are the pieces as priced. Checkout is an order to the studio, not a
        payment.
      </p>

      <ul className="mt-12 divide-y divide-line border-y border-line">
        {shown.map((line) => (
          <li key={line.productId} className="grid gap-6 py-8 sm:grid-cols-[8rem_1fr_auto]">
            <Link href={`/shop/${line.slug}`} className="block">
              <ProductPhoto
                src={line.imageUrl || undefined}
                alt={line.name}
                sizes="128px"
                className="aspect-square"
              />
            </Link>
            <div>
              <Link href={`/shop/${line.slug}`} className="font-display text-2xl text-ink">
                {line.name}
              </Link>
              <p className="mt-2 text-sm text-muted">{formatNaira(line.priceNaira)} each</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <label className="text-[12px] uppercase tracking-[0.16em] text-ink" htmlFor={`qty-${line.productId}`}>
                  Quantity
                </label>
                <input
                  id={`qty-${line.productId}`}
                  type="number"
                  min={1}
                  max={8}
                  value={line.quantity}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    setQuantity(line.productId, next);
                  }}
                  className="w-20 border border-line bg-paper px-3 py-2 text-base"
                />
                <button
                  type="button"
                  className="text-sm underline decoration-line underline-offset-4"
                  onClick={() => remove(line.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="font-display text-xl sm:text-right">
              {formatNaira(line.priceNaira * line.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <p className="font-display text-3xl">Total {formatNaira(total)}</p>
        <ButtonLink href="/checkout">Checkout</ButtonLink>
      </div>
      <p className="mt-6 max-w-lg text-sm leading-6 text-muted">
        We write back within two working days with availability, and how to settle
        in naira.
      </p>
    </Container>
  );
}

function CartLoading() {
  return (
    <Container className="py-12 sm:py-16">
      <Eyebrow>Cart</Eyebrow>
      <h1 className="mt-4 font-display text-5xl text-ink">Your cart.</h1>
      <ul className="mt-12 divide-y divide-line border-y border-line" aria-hidden>
        {Array.from({ length: 2 }, (_, index) => (
          <li key={index} className="grid gap-6 py-8 sm:grid-cols-[8rem_1fr]">
            <div className="aspect-square bg-paper-2 motion-safe:animate-pulse" />
            <div className="space-y-3">
              <div className="h-7 w-2/3 bg-paper-2 motion-safe:animate-pulse" />
              <div className="h-4 w-1/3 bg-paper-2 motion-safe:animate-pulse" />
            </div>
          </li>
        ))}
      </ul>
      <p className="sr-only">Loading the cart.</p>
    </Container>
  );
}
