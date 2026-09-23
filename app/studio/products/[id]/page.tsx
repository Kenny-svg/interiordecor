import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/studio/ProductForm";
import { ProductPhotos } from "@/components/studio/ProductPhotos";
import { Container, Eyebrow } from "@/components/ui";
import { getProductById } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Edit piece",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ photo?: string }>;
};

export default async function EditProductPage({ params, searchParams }: Props) {
  const { id } = await params;
  const query = await searchParams;
  const product = await getProductById(id);
  if (!product) {
    notFound();
  }

  return (
    <Container className="py-10 sm:py-12">
      <p className="text-sm">
        <Link href="/studio/products" className="underline decoration-line underline-offset-4">
          Pieces
        </Link>
      </p>
      <Eyebrow>{product.published ? "Listed" : "Hidden"}</Eyebrow>
      <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">{product.name}</h1>
      <p className="mt-3 text-sm text-muted">
        <Link href={`/shop/${product.slug}`} className="underline decoration-line underline-offset-4">
          View in the shop
        </Link>
      </p>

      <div className="mt-12 grid gap-16 lg:grid-cols-2">
        <ProductForm product={product} />
        <ProductPhotos
          productId={product.id}
          name={product.name}
          images={product.images}
          photoError={query.photo === "1"}
        />
      </div>
    </Container>
  );
}
