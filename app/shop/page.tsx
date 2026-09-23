import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { ShopPagination } from "@/components/shop/ShopPagination";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import {
  categoryLabel,
  isProductCategory,
  listPublishedPage,
  productCategories,
  SAMPLE_CATALOG,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Furniture for rooms Hale specifies — seating, tables, storage, beds, and rugs. Lagos.",
};

type Props = {
  searchParams: Promise<{ category?: string | string[]; page?: string | string[] }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const raw = await searchParams;
  const requested = Array.isArray(raw.category) ? raw.category[0] : raw.category;
  const category = requested && isProductCategory(requested) ? requested : undefined;
  const pageRaw = Array.isArray(raw.page) ? raw.page[0] : raw.page;
  const page = Math.max(1, Number.parseInt(pageRaw ?? "1", 10) || 1);
  const { items, total, page: current, pageCount } = await listPublishedPage(category, page);

  return (
    <Container className="py-12 sm:py-16">
      <Eyebrow>Shop</Eyebrow>
      <h1 className="mt-4 max-w-3xl font-display text-5xl text-ink sm:text-6xl">
        Pieces for rooms we finish.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">
        Furniture the studio will name in a specification. The figure is what we
        ask for the piece as shown. Delivery in Lagos is arranged after we write
        back — this is not a payment.
      </p>
      {SAMPLE_CATALOG ? (
        <p className="mt-5 max-w-xl text-sm leading-6 text-muted">
          Sample catalogue. Photographs stand in until the studio lists its own
          pieces.
        </p>
      ) : null}

      <nav className="mt-10 flex flex-wrap gap-x-6 gap-y-2" aria-label="Categories">
        <Link
          href="/shop"
          className={cn(
            "text-[12px] uppercase tracking-[0.18em]",
            !category ? "text-ink" : "text-muted hover:text-ink",
          )}
          aria-current={!category ? "page" : undefined}
        >
          All
        </Link>
        {productCategories.map((id) => (
          <Link
            key={id}
            href={`/shop?category=${id}`}
            className={cn(
              "text-[12px] uppercase tracking-[0.18em]",
              category === id ? "text-ink" : "text-muted hover:text-ink",
            )}
            aria-current={category === id ? "page" : undefined}
          >
            {categoryLabel[id]}
          </Link>
        ))}
      </nav>

      {total === 0 ? (
        <div className="mt-16 max-w-lg space-y-6 border border-line p-8 sm:p-10">
          <p className="font-display text-3xl text-ink">
            {category ? "Nothing in this group yet." : "Nothing listed yet."}
          </p>
          <p className="text-base leading-7 text-ink-soft">
            {category
              ? "The studio has not listed a piece here. Look at the whole shop, or write to us."
              : "The shop is empty until the studio photographs a piece and lists it. Write to us if you need something in the meantime."}
          </p>
          <div className="flex flex-wrap gap-3">
            {category ? (
              <ButtonLink href="/shop" variant="outline">
                All pieces
              </ButtonLink>
            ) : null}
            <ButtonLink href="/consult">Write to the studio</ButtonLink>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-10 text-sm text-muted">
            {total} piece{total === 1 ? "" : "s"}
            {category ? ` in ${categoryLabel[category]}` : ""}
            {pageCount > 1 ? ` · Page ${current} of ${pageCount}` : ""}
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          <ShopPagination page={current} pageCount={pageCount} category={category} />
        </>
      )}
    </Container>
  );
}
