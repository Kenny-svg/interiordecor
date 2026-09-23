"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { useCart } from "@/components/cart/CartProvider";

export function AddToCart({
  productId,
  name,
}: {
  productId: string;
  name: string;
}) {
  const { add, cart } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const inCart = cart.items.some((line) => line.productId === productId);

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button
        type="button"
        onClick={() => {
          add(productId);
          setJustAdded(true);
        }}
        aria-label={`Add ${name} to cart`}
      >
        {justAdded || inCart ? "Add another" : "Add to cart"}
      </Button>
      {justAdded ? (
        <p className="text-sm text-muted" role="status">
          In the cart.
        </p>
      ) : null}
    </div>
  );
}
