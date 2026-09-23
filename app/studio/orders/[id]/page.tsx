import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateOrderStatus } from "@/app/studio/orders/actions";
import { ProductPhoto } from "@/components/shop/ProductPhoto";
import { Button, Container, Eyebrow } from "@/components/ui";
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

export default async function StudioOrderPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) {
    notFound();
  }

  return (
    <Container className="py-10 sm:py-12">
      <p className="text-sm">
        <Link href="/studio/orders" className="underline decoration-line underline-offset-4">
          Orders
        </Link>
      </p>
      <Eyebrow>{order.createdAt.toLocaleDateString("en-GB")}</Eyebrow>
      <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">{order.name}</h1>
      <p className="mt-3 text-base text-ink-soft">
        {order.city} · {formatNaira(order.totalNaira)}
      </p>

      <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-[12px] uppercase tracking-[0.16em] text-ink">Email</dt>
          <dd className="mt-1">
            <a href={`mailto:${order.email}`} className="underline decoration-line underline-offset-4">
              {order.email}
            </a>
          </dd>
        </div>
        {order.phone ? (
          <div>
            <dt className="text-[12px] uppercase tracking-[0.16em] text-ink">Telephone</dt>
            <dd className="mt-1">{order.phone}</dd>
          </div>
        ) : null}
        <div className="sm:col-span-2">
          <dt className="text-[12px] uppercase tracking-[0.16em] text-ink">Address</dt>
          <dd className="mt-1">{order.address}</dd>
        </div>
      </dl>

      {order.note ? (
        <p className="mt-8 max-w-xl text-base leading-7 text-ink-soft">{order.note}</p>
      ) : null}

      <ul className="mt-10 divide-y divide-line border-y border-line">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center gap-6 py-5">
            {item.imageUrl ? (
              <ProductPhoto
                src={item.imageUrl}
                alt={item.name}
                sizes="80px"
                className="h-20 w-20 shrink-0"
              />
            ) : null}
            <div className="flex-1">
              <p className="font-display text-xl">{item.name}</p>
              <p className="text-sm text-muted">
                {item.quantity} × {formatNaira(item.priceNaira)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <form action={updateOrderStatus} className="mt-8 flex flex-wrap gap-3">
        <input type="hidden" name="id" value={order.id} />
        {order.status !== "confirmed" ? (
          <>
            <input type="hidden" name="status" value="confirmed" />
            <Button type="submit">Mark confirmed</Button>
          </>
        ) : null}
      </form>
      {order.status !== "closed" ? (
        <form action={updateOrderStatus} className="mt-3">
          <input type="hidden" name="id" value={order.id} />
          <input type="hidden" name="status" value="closed" />
          <Button type="submit" variant="outline">
            Close
          </Button>
        </form>
      ) : null}
    </Container>
  );
}
