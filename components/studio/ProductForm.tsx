"use client";

import { useActionState } from "react";
import {
  createProduct,
  updateProduct,
  type ProductFormState,
} from "@/app/studio/products/actions";
import { Button, Field, fieldClass, Notice } from "@/components/ui";
import { categoryLabel, productCategories } from "@/lib/catalog-meta";

const initial: ProductFormState = { status: "idle" };

export function ProductForm({
  product,
}: {
  product?: {
    id: string;
    name: string;
    slug: string;
    category: string;
    summary: string;
    description: string;
    priceNaira: number;
    published: boolean;
    sort: number;
  };
}) {
  const action = product ? updateProduct : createProduct;
  const [state, formAction, pending] = useActionState(action, initial);
  const errors = state.status === "error" ? state.fieldErrors ?? {} : {};

  return (
    <form action={formAction} className="max-w-xl space-y-6">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      {state.status === "error" ? <Notice tone="caution">{state.message}</Notice> : null}
      {state.status === "ok" ? <Notice>Saved.</Notice> : null}
      <Field label="Name" htmlFor="name" error={errors.name}>
        <input
          id="name"
          name="name"
          required
          defaultValue={product?.name}
          className={fieldClass}
        />
      </Field>
      <Field label="Slug" htmlFor="slug" hint="Leave blank to take it from the name." error={errors.slug}>
        <input id="slug" name="slug" defaultValue={product?.slug} className={fieldClass} />
      </Field>
      <Field label="Group" htmlFor="category" error={errors.category}>
        <select
          id="category"
          name="category"
          required
          defaultValue={product?.category ?? "seating"}
          className={fieldClass}
        >
          {productCategories.map((id) => (
            <option key={id} value={id}>
              {categoryLabel[id]}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Short line" htmlFor="summary" error={errors.summary}>
        <input
          id="summary"
          name="summary"
          required
          defaultValue={product?.summary}
          className={fieldClass}
        />
      </Field>
      <Field label="Description" htmlFor="description" error={errors.description}>
        <textarea
          id="description"
          name="description"
          required
          rows={6}
          defaultValue={product?.description}
          className={fieldClass}
        />
      </Field>
      <Field label="Price, naira" htmlFor="priceNaira" error={errors.priceNaira}>
        <input
          id="priceNaira"
          name="priceNaira"
          type="number"
          min={1000}
          step={1000}
          required
          defaultValue={product?.priceNaira}
          className={fieldClass}
        />
      </Field>
      <Field label="Order" htmlFor="sort" hint="Lower numbers come first." error={errors.sort}>
        <input
          id="sort"
          name="sort"
          type="number"
          min={0}
          defaultValue={product?.sort ?? 0}
          className={fieldClass}
        />
      </Field>
      <label className="flex items-center gap-3 text-sm text-ink">
        <input
          type="checkbox"
          name="published"
          defaultChecked={product?.published ?? true}
          className="size-4 accent-ink"
        />
        Listed in the shop
      </label>
      {!product ? (
        <Field
          label="Photograph"
          htmlFor="photo"
          hint="JPEG, PNG, or WebP. This is what the shop shows. You can add more after."
          error={errors.photo}
        >
          <input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" className={fieldClass} />
        </Field>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : product ? "Save" : "Add the piece"}
      </Button>
    </form>
  );
}
