/** Demo shop photographs (Unsplash) until the studio lists its own. */
export const SAMPLE_CATALOG = true;

export const productCategories = [
  "seating",
  "table",
  "storage",
  "sleep",
  "textile",
] as const;

export type ProductCategory = (typeof productCategories)[number];

export const categoryLabel: Record<ProductCategory, string> = {
  seating: "Seating",
  table: "Tables",
  storage: "Storage",
  sleep: "Sleep",
  textile: "Textiles",
};

export function isProductCategory(value: string): value is ProductCategory {
  return (productCategories as readonly string[]).includes(value);
}

export function labelForCategory(value: string): string {
  return isProductCategory(value) ? categoryLabel[value] : value;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 64);
}
