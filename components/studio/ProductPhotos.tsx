"use client";

import { addProductPhoto, removeProductPhoto } from "@/app/studio/products/actions";
import { ProductPhoto } from "@/components/shop/ProductPhoto";
import { Button, Field, fieldClass } from "@/components/ui";

export function ProductPhotos({
  productId,
  name,
  images,
  photoError,
}: {
  productId: string;
  name: string;
  images: { id: string; url: string; alt: string }[];
  photoError?: boolean;
}) {
  return (
    <section>
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Photographs</p>
      <p className="mt-3 text-sm leading-6 text-ink-soft">
        The first photograph is the shop card. JPEG, PNG, or WebP, under 10MB.
      </p>
      {photoError ? (
        <p className="mt-4 text-sm text-ink-soft" role="alert">
          That file could not be used. Try a JPEG, PNG, or WebP under 10MB.
        </p>
      ) : null}
      <ul className="mt-6 grid grid-cols-2 gap-4">
        {images.map((image) => (
          <li key={image.id} className="space-y-3">
            <ProductPhoto
              src={image.url}
              alt={image.alt || name}
              sizes="240px"
              className="aspect-square"
            />
            <form action={removeProductPhoto}>
              <input type="hidden" name="id" value={productId} />
              <input type="hidden" name="imageId" value={image.id} />
              <button type="submit" className="text-sm underline decoration-line underline-offset-4">
                Remove
              </button>
            </form>
          </li>
        ))}
      </ul>
      <form action={addProductPhoto} className="mt-8 space-y-4">
        <input type="hidden" name="id" value={productId} />
        <Field label="Add a photograph" htmlFor="photo">
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className={fieldClass}
          />
        </Field>
        <Button type="submit">Add photograph</Button>
      </form>
    </section>
  );
}
