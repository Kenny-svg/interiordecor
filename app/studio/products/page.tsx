import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui";
import { labelForCategory, listAllProducts } from "@/lib/catalog";
import { formatNaira } from "@/lib/money";
import { isInboxAuthed } from "@/lib/studio-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pieces",
  robots: { index: false, follow: false },
};

export default async function StudioProductsPage() {
  const rows = (await isInboxAuthed()) ? await listAllProducts() : [];

  return (
    <Container className="py-10 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Shop</Eyebrow>
          <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">Pieces.</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">
            Name, figure, your photographs. The public shop currently shows a
            sample catalogue (Unsplash). Replace those pieces from this desk.
          </p>
        </div>
        <Link
          href="/studio/products/new"
          className="inline-flex items-center justify-center bg-ink px-7 py-3 text-[12px] uppercase tracking-[0.18em] text-paper"
        >
          Add a piece
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 text-sm text-muted">
          None yet. Add a piece, a photograph, then list it. That is what the
          shop shows.
        </p>
      ) : (
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={`/studio/products/${row.id}`}
                className="flex flex-wrap items-baseline justify-between gap-3 py-4 hover:bg-paper-2/60"
              >
                <span className="text-ink">
                  {row.name}
                  <span className="text-muted">
                    {" "}
                    · {labelForCategory(row.category)} · {formatNaira(row.priceNaira)}
                  </span>
                </span>
                <span className="text-[12px] uppercase tracking-[0.16em] text-muted">
                  {row.published ? "Listed" : "Hidden"} · {row.images.length} photo
                  {row.images.length === 1 ? "" : "s"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
