"use server";

import { z } from "zod";
import { productsByIds } from "@/lib/catalog";
import { clampQty } from "@/lib/cart";
import { placeOrder } from "@/lib/orders";
import { site } from "@/lib/site";

export type CheckoutState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  | { status: "ok"; orderId: string; email: string; reply: string };

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Your name.").max(80),
  email: z.string().trim().email("A working email, so we can write back."),
  phone: z.preprocess(
    emptyToUndefined,
    z.string().min(7, "A telephone number, or leave it blank.").max(40).optional(),
  ),
  city: z.string().trim().min(2, "The city, or the nearest town.").max(80),
  address: z
    .string()
    .trim()
    .min(8, "A street or estate, so we know where the pieces should go.")
    .max(240),
  note: z.preprocess(emptyToUndefined, z.string().max(2000).optional()),
  cart: z.string().min(2, "The cart is empty."),
});

function fieldErrorsFromZod(
  issues: Array<{ path: PropertyKey[]; message: string }>,
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

function parseCartField(raw: string): { productId: string; quantity: number }[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const lines: { productId: string; quantity: number }[] = [];
    const seen = new Set<string>();
    for (const item of parsed) {
      if (!item || typeof item !== "object") {
        continue;
      }
      const productId = (item as { productId?: unknown }).productId;
      const quantity = (item as { quantity?: unknown }).quantity;
      if (typeof productId !== "string" || productId.length < 8 || seen.has(productId)) {
        continue;
      }
      seen.add(productId);
      lines.push({ productId, quantity: clampQty(Number(quantity)) });
    }
    return lines;
  } catch {
    return [];
  }
}

export async function submitOrder(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const parsed = checkoutSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    address: formData.get("address"),
    note: formData.get("note"),
    cart: formData.get("cart"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please look over the order.",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const requested = parseCartField(parsed.data.cart);
  if (requested.length === 0) {
    return { status: "error", message: "The cart is empty." };
  }

  const products = await productsByIds(requested.map((line) => line.productId));
  const byId = new Map(products.map((product) => [product.id, product]));
  const lines = requested.flatMap((line) => {
    const product = byId.get(line.productId);
    if (!product) {
      return [];
    }
    const image = product.images[0];
    return [
      {
        productId: product.id,
        name: product.name,
        priceNaira: product.priceNaira,
        quantity: line.quantity,
        imageUrl: image?.url ?? "",
      },
    ];
  });

  if (lines.length === 0) {
    return {
      status: "error",
      message: "Those pieces are no longer listed. Return to the shop.",
    };
  }

  const order = await placeOrder({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    city: parsed.data.city,
    address: parsed.data.address,
    note: parsed.data.note ?? "",
    lines,
  });

  return {
    status: "ok",
    orderId: order.id,
    email: order.email,
    reply: site.reply,
  };
}
