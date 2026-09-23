import type { Metadata } from "next";
import Link from "next/link";
import { ProductForm } from "@/components/studio/ProductForm";
import { Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "Add a piece",
  robots: { index: false, follow: false },
};

export default function NewProductPage() {
  return (
    <Container className="py-10 sm:py-12">
      <p className="text-sm">
        <Link href="/studio/products" className="underline decoration-line underline-offset-4">
          Pieces
        </Link>
      </p>
      <Eyebrow>Shop</Eyebrow>
      <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">A new piece.</h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-ink-soft">
        Name, figure, and a photograph you prefer. The public shop shows only
        what you list here.
      </p>
      <div className="mt-10">
        <ProductForm />
      </div>
    </Container>
  );
}
