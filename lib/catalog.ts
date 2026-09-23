import { isMissingSchemaError, prisma } from "@/lib/db";
import { isProductCategory } from "@/lib/catalog-meta";

export {
  SAMPLE_CATALOG,
  productCategories,
  categoryLabel,
  isProductCategory,
  labelForCategory,
  slugify,
} from "@/lib/catalog-meta";
export type { ProductCategory } from "@/lib/catalog-meta";

const productInclude = {
  images: { orderBy: { sort: "asc" as const } },
} as const;

export const SHOP_PAGE_SIZE = 9;

export type CatalogProduct = Awaited<ReturnType<typeof listPublishedProducts>>[number];

export async function listPublishedProducts(category?: string) {
  try {
    return await prisma.product.findMany({
      where: {
        published: true,
        ...(category && isProductCategory(category) ? { category } : {}),
      },
      include: productInclude,
      orderBy: [{ sort: "asc" }, { name: "asc" }],
    });
  } catch (error) {
    if (isMissingSchemaError(error)) {
      return [];
    }
    throw error;
  }
}

export async function listPublishedPage(category: string | undefined, page: number) {
  const requested = Math.max(1, Math.floor(Number.isFinite(page) ? page : 1));
  const empty = { items: [] as CatalogProduct[], total: 0, page: 1, pageCount: 1 };
  try {
    const where = {
      published: true,
      ...(category && isProductCategory(category) ? { category } : {}),
    };
    const total = await prisma.product.count({ where });
    const pageCount = Math.max(1, Math.ceil(total / SHOP_PAGE_SIZE));
    const current = Math.min(requested, pageCount);
    const items = await prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: [{ sort: "asc" }, { name: "asc" }],
      skip: (current - 1) * SHOP_PAGE_SIZE,
      take: SHOP_PAGE_SIZE,
    });
    return { items, total, page: current, pageCount };
  } catch (error) {
    if (isMissingSchemaError(error)) {
      return empty;
    }
    throw error;
  }
}

export async function getPublishedProduct(slug: string) {
  try {
    return await prisma.product.findFirst({
      where: { slug, published: true },
      include: productInclude,
    });
  } catch (error) {
    if (isMissingSchemaError(error)) {
      return null;
    }
    throw error;
  }
}

export async function listAllProducts() {
  try {
    return await prisma.product.findMany({
      include: productInclude,
      orderBy: [{ sort: "asc" }, { name: "asc" }],
    });
  } catch (error) {
    if (isMissingSchemaError(error)) {
      return [];
    }
    throw error;
  }
}

export async function getProductById(id: string) {
  try {
    return await prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });
  } catch (error) {
    if (isMissingSchemaError(error)) {
      return null;
    }
    throw error;
  }
}

export async function productsByIds(ids: string[]) {
  if (ids.length === 0) {
    return [];
  }
  try {
    return await prisma.product.findMany({
      where: { id: { in: ids }, published: true },
      include: productInclude,
    });
  } catch (error) {
    if (isMissingSchemaError(error)) {
      return [];
    }
    throw error;
  }
}

export function coverOf(product: {
  name: string;
  images: { url: string; alt: string }[];
}): { src: string; alt: string } | null {
  const image = product.images[0];
  if (!image) {
    return null;
  }
  return { src: image.url, alt: image.alt || product.name };
}
