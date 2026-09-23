import Link from "next/link";
import { coverOf, labelForCategory, type CatalogProduct } from "@/lib/catalog";
import { formatNaira } from "@/lib/money";
import { ProductPhoto } from "@/components/shop/ProductPhoto";

export function ProductCard({ product }: { product: CatalogProduct }) {
  const cover = coverOf(product);

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <ProductPhoto
        src={cover?.src}
        alt={cover?.alt ?? product.name}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="aspect-[4/5] motion-safe:[&_img]:transition-transform motion-safe:[&_img]:duration-700 motion-safe:group-hover:[&_img]:scale-[1.03]"
      />
      <p className="mt-4 font-display text-2xl">{product.name}</p>
      <p className="mt-1 text-sm text-muted">
        {labelForCategory(product.category)} · {formatNaira(product.priceNaira)}
      </p>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{product.summary}</p>
    </Link>
  );
}
