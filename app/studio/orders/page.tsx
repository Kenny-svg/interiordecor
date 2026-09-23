import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui";
import { formatNaira } from "@/lib/money";
import { listOrders } from "@/lib/orders";
import { isInboxAuthed } from "@/lib/studio-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Orders",
  robots: { index: false, follow: false },
};

const statusLabel: Record<string, string> = {
  new: "New",
  confirmed: "Confirmed",
  closed: "Closed",
};

export default async function StudioOrdersPage() {
  const rows = (await isInboxAuthed()) ? await listOrders() : [];

  return (
    <Container className="py-10 sm:py-12">
      <Eyebrow>Shop</Eyebrow>
      <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">Orders.</h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">
        From the cart. Confirm availability, then write. Nothing here is a payment.
      </p>
      {rows.length === 0 ? (
        <p className="mt-10 text-sm text-muted">None yet.</p>
      ) : (
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={`/studio/orders/${row.id}`}
                className="flex flex-wrap items-baseline justify-between gap-3 py-4 hover:bg-paper-2/60"
              >
                <span className="text-ink">
                  {row.name}
                  <span className="text-muted">
                    {" "}
                    · {row.city} · {formatNaira(row.totalNaira)}
                  </span>
                </span>
                <span className="text-[12px] uppercase tracking-[0.16em] text-muted">
                  {statusLabel[row.status] ?? row.status} ·{" "}
                  {row.createdAt.toLocaleDateString("en-GB")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
