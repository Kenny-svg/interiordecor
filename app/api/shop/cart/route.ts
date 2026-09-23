import { NextResponse } from "next/server";
import { coverOf, productsByIds } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const ids = url.searchParams.getAll("id").filter((id) => id.length >= 8).slice(0, 16);
  const products = await productsByIds(ids);
  const order = new Map(ids.map((id, index) => [id, index]));
  const lines = [...products]
    .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
    .map((product) => {
      const cover = coverOf(product);
      return {
        productId: product.id,
        quantity: 1,
        name: product.name,
        slug: product.slug,
        priceNaira: product.priceNaira,
        imageUrl: cover?.src ?? "",
      };
    });
  return NextResponse.json({ lines });
}
