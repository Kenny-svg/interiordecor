import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/shop/AddToCart";
import { ProductPhoto } from "@/components/shop/ProductPhoto";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { getPublishedProduct, labelForCategory } from "@/lib/catalog";
import { formatNaira } from "@/lib/money";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  if (!product) {
    return { title: "Shop" };
  }
  return {
    title: product.name,
    description: product.summary,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  if (!product) {
    notFound();
  }
  const gallery = product.images.length > 0 ? product.images : [];

  return (
    <Container className="py-12 sm:py-16">
      <p className="text-sm">
        <Link href="/shop" className="underline decoration-line underline-offset-4">
          Shop
        </Link>
        <span className="text-muted"> · {labelForCategory(product.category)}</span>
      </p>

      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          {gallery.length > 0 ? (
            gallery.map((image, index) => (
              <ProductPhoto
                key={image.id}
                src={image.url}
                alt={image.alt || product.name}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority={index === 0}
                className="aspect-[4/5]"
              />
            ))
          ) : (
            <ProductPhoto
              src={null}
              alt={product.name}
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="aspect-[4/5]"
            />
          )}
        </div>

        <div>
          <Eyebrow>{labelForCategory(product.category)}</Eyebrow>
          <h1 className="mt-4 font-display text-5xl text-ink sm:text-6xl">{product.name}</h1>
          <p className="mt-4 font-display text-3xl text-ink">{formatNaira(product.priceNaira)}</p>
          <p className="mt-6 max-w-md text-base leading-7 text-ink-soft">{product.description}</p>
          <p className="mt-6 max-w-md text-sm leading-6 text-muted">
            The figure is for the piece as photographed. We confirm availability
            and delivery in Lagos after you place the order. Nothing is paid on
            this page.
          </p>
          <div className="mt-10">
            <AddToCart productId={product.id} name={product.name} />
          </div>
          <p className="mt-8">
            <ButtonLink href="/cart" variant="outline">
              View cart
            </ButtonLink>
          </p>
        </div>
      </div>
    </Container>
  );
}
