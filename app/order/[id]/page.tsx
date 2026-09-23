import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductPhoto } from "@/components/shop/ProductPhoto";
import { Container, Eyebrow } from "@/components/ui";
import { formatNaira } from "@/lib/money";
import { getOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    notFound();
  }

  return (
    <Container className="py-12 sm:py-16">
      <p className="text-sm">
        <Link href="/shop" className="underline decoration-line underline-offset-4">
          Shop
        </Link>
      </p>
      <Eyebrow>
        {order.status === "new" ? "Received" : order.status} ·{" "}
        {order.createdAt.toLocaleDateString("en-GB")}
      </Eyebrow>
      <h1 className="mt-4 font-display text-5xl text-ink">The order.</h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft">
        {order.name}, {order.city}. A reply will come to {order.email}. This is
        not a receipt of payment.
      </p>

      <ul className="mt-12 divide-y divide-line border-y border-line">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center gap-6 py-6">
            {item.imageUrl ? (
              <ProductPhoto
                src={item.imageUrl}
                alt={item.name}
                sizes="96px"
                className="h-24 w-24 shrink-0"
              />
            ) : null}
            <div className="flex-1">
              <p className="font-display text-2xl">{item.name}</p>
              <p className="mt-1 text-sm text-muted">
                {item.quantity} × {formatNaira(item.priceNaira)}
              </p>
            </div>
            <p className="font-display text-xl">
              {formatNaira(item.priceNaira * item.quantity)}
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-8 font-display text-3xl">Total {formatNaira(order.totalNaira)}</p>
      <p className="mt-4 text-sm text-muted">{order.address}</p>
    </Container>
  );
}
