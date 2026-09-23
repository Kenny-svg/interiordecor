"use client";

import { useActionState, useEffect } from "react";
import { submitOrder, type CheckoutState } from "@/app/checkout/actions";
import { useCart } from "@/components/cart/CartProvider";
import { Button, ButtonLink, Field, fieldClass, Notice } from "@/components/ui";

const initial: CheckoutState = { status: "idle" };

export function CheckoutForm() {
  const { cart, ready, clear } = useCart();
  const [state, action, pending] = useActionState(submitOrder, initial);

  useEffect(() => {
    if (state.status === "ok") {
      clear();
    }
  }, [state, clear]);

  if (!ready) {
    return <p className="text-ink-soft">A moment…</p>;
  }

  if (cart.items.length === 0 && state.status !== "ok") {
    return (
      <div className="max-w-xl space-y-6">
        <p className="text-lg leading-8 text-ink-soft">The cart is empty.</p>
        <ButtonLink href="/shop">Shop pieces</ButtonLink>
      </div>
    );
  }

  if (state.status === "ok") {
    return (
      <div className="max-w-xl space-y-5 border border-line bg-paper-2/40 p-8 sm:p-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Hale Studio</p>
        <h2 className="font-display text-4xl text-ink">We have the order.</h2>
        <p className="text-base leading-7 text-ink-soft">
          A letter will come to {state.email} within {state.reply}. We will confirm
          the pieces, and how to settle in naira. Nothing has been charged.
        </p>
        <p className="text-sm leading-6 text-muted">
          Keep this page if you like —{" "}
          <a href={`/order/${state.orderId}`} className="underline decoration-line underline-offset-4">
            open the order
          </a>
          .
        </p>
        <ButtonLink href="/shop">Back to the shop</ButtonLink>
      </div>
    );
  }

  const errors = state.status === "error" ? state.fieldErrors ?? {} : {};

  return (
    <form action={action} className="max-w-xl space-y-6">
      {state.status === "error" ? <Notice tone="caution">{state.message}</Notice> : null}
      <input type="hidden" name="cart" value={JSON.stringify(cart.items)} />
      <Field label="Name" htmlFor="name" error={errors.name}>
        <input id="name" name="name" required autoComplete="name" className={fieldClass} />
      </Field>
      <Field label="Email" htmlFor="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
        />
      </Field>
      <Field label="Telephone" htmlFor="phone" hint="Optional." error={errors.phone}>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={fieldClass} />
      </Field>
      <Field label="City" htmlFor="city" error={errors.city}>
        <input id="city" name="city" required autoComplete="address-level2" className={fieldClass} />
      </Field>
      <Field
        label="Address"
        htmlFor="address"
        hint="Street, estate, or a landmark we can find."
        error={errors.address}
      >
        <textarea id="address" name="address" required rows={3} className={fieldClass} />
      </Field>
      <Field label="A note" htmlFor="note" hint="Optional. Timing, stairs, a colour." error={errors.note}>
        <textarea id="note" name="note" rows={4} className={fieldClass} />
      </Field>
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Place the order"}
      </Button>
      <p className="text-sm leading-6 text-muted">
        This is not a payment. The studio confirms the pieces, then you settle.
      </p>
    </form>
  );
}
