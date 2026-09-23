"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isProductCategory, slugify } from "@/lib/catalog";
import { prisma } from "@/lib/db";
import { persistProductPhoto } from "@/lib/media";
import { isInboxAuthed } from "@/lib/studio-auth";
import { prepareImageUpload } from "@/lib/uploads";

export type ProductFormState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  | { status: "ok"; id: string };

const productSchema = z.object({
  name: z.string().trim().min(2, "A name.").max(80),
  slug: z.string().trim().max(64).optional(),
  category: z.string().refine(isProductCategory, "Choose a group."),
  summary: z.string().trim().min(8, "A short line.").max(160),
  description: z.string().trim().min(20, "A paragraph about the piece.").max(2000),
  priceNaira: z.coerce.number().int().min(1000, "A figure in naira.").max(200_000_000),
  published: z.enum(["on", "off"]).optional(),
  sort: z.coerce.number().int().min(0).max(999).default(0),
});

function fieldErrorsFromZod(
  issues: Array<{ path: PropertyKey[]; message: string }>,
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}

async function requireStudio() {
  if (!(await isInboxAuthed())) {
    redirect("/studio/inbox");
  }
}

export async function createProduct(
  _previous: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireStudio();
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    priceNaira: formData.get("priceNaira"),
    published: formData.get("published") ? "on" : "off",
    sort: formData.get("sort") || 0,
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please look over the piece.",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const slug = slugify(parsed.data.slug || parsed.data.name);
  if (!slug) {
    return { status: "error", message: "A slug is needed.", fieldErrors: { slug: "A slug." } };
  }

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return {
      status: "error",
      message: "That slug is already used.",
      fieldErrors: { slug: "Choose another slug." },
    };
  }

  const photo = await readPhoto(formData.get("photo"));
  if (photo.status === "error") {
    return { status: "error", message: photo.message, fieldErrors: { photo: photo.message } };
  }

  const product = await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug,
      category: parsed.data.category,
      summary: parsed.data.summary,
      description: parsed.data.description,
      priceNaira: parsed.data.priceNaira,
      published: parsed.data.published === "on",
      sort: parsed.data.sort,
      images: photo.url
        ? { create: { url: photo.url, alt: parsed.data.name, sort: 0 } }
        : undefined,
    },
  });

  revalidatePath("/shop");
  revalidatePath("/studio/products");
  redirect(`/studio/products/${product.id}`);
}

export async function updateProduct(
  _previous: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireStudio();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return { status: "error", message: "Missing piece." };
  }
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    category: formData.get("category"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    priceNaira: formData.get("priceNaira"),
    published: formData.get("published") ? "on" : "off",
    sort: formData.get("sort") || 0,
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please look over the piece.",
      fieldErrors: fieldErrorsFromZod(parsed.error.issues),
    };
  }

  const slug = slugify(parsed.data.slug || parsed.data.name);
  const clash = await prisma.product.findFirst({
    where: { slug, NOT: { id } },
  });
  if (clash) {
    return {
      status: "error",
      message: "That slug is already used.",
      fieldErrors: { slug: "Choose another slug." },
    };
  }

  await prisma.product.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug,
      category: parsed.data.category,
      summary: parsed.data.summary,
      description: parsed.data.description,
      priceNaira: parsed.data.priceNaira,
      published: parsed.data.published === "on",
      sort: parsed.data.sort,
    },
  });

  revalidatePath("/shop");
  revalidatePath(`/shop/${slug}`);
  revalidatePath("/studio/products");
  revalidatePath(`/studio/products/${id}`);
  return { status: "ok", id };
}

export async function addProductPhoto(formData: FormData): Promise<void> {
  await requireStudio();
  const id = String(formData.get("id") ?? "");
  if (!id) {
    return;
  }
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!product) {
    return;
  }
  const photo = await readPhoto(formData.get("photo"));
  if (photo.status !== "ok" || !photo.url) {
    redirect(`/studio/products/${id}?photo=1`);
  }
  const sort = product.images.length;
  await prisma.productImage.create({
    data: {
      productId: id,
      url: photo.url,
      alt: product.name,
      sort,
    },
  });
  revalidatePath("/shop");
  revalidatePath(`/shop/${product.slug}`);
  revalidatePath(`/studio/products/${id}`);
  redirect(`/studio/products/${id}`);
}

export async function removeProductPhoto(formData: FormData): Promise<void> {
  await requireStudio();
  const id = String(formData.get("id") ?? "");
  const imageId = String(formData.get("imageId") ?? "");
  if (!id || !imageId) {
    return;
  }
  await prisma.productImage.delete({ where: { id: imageId } });
  revalidatePath("/shop");
  revalidatePath(`/studio/products/${id}`);
  redirect(`/studio/products/${id}`);
}

async function readPhoto(
  value: FormDataEntryValue | null,
): Promise<{ status: "ok"; url?: string } | { status: "error"; message: string }> {
  if (!(value instanceof File) || value.size === 0) {
    return { status: "ok" };
  }
  const prepared = await prepareImageUpload(value);
  if ("error" in prepared) {
    return { status: "error", message: prepared.error };
  }
  const url = await persistProductPhoto(prepared.bytes, prepared.ext);
  return { status: "ok", url };
}
