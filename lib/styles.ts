export const styleTags = [
  { id: "tropical-modern", label: "Tropical modern" },
  { id: "lagos-apartment", label: "Lagos apartment" },
  { id: "warm-contemporary", label: "Warm contemporary" },
  { id: "collected", label: "Collected" },
  { id: "quiet-contemporary", label: "Quiet contemporary" },
  { id: "coastal", label: "Coastal" },
  { id: "afro-modern", label: "Afro-modern" },
  { id: "corporate-quiet", label: "Corporate quiet" },
  { id: "laterite", label: "Laterite" },
  { id: "garden-city", label: "Garden city" },
] as const;

export type StyleTagId = (typeof styleTags)[number]["id"];

export function isStyleTagId(value: string): value is StyleTagId {
  return styleTags.some((tag) => tag.id === value);
}

export function lookForStyle(id: string): {
  paletteId: string;
  hexes: string[];
  curtainId?: string;
  lightId?: string;
} | null {
  if (!isStyleTagId(id)) {
    return null;
  }
  const looks: Record<
    string,
    { paletteId: string; hexes: string[]; curtainId?: string; lightId?: string }
  > = {
    "tropical-modern": {
      paletteId: "laterite",
      hexes: ["#b56a4a", "#d4c4a8"],
      curtainId: "sheer",
      lightId: "pendant",
    },
    "lagos-apartment": {
      paletteId: "lagos-chalk",
      hexes: ["#e8e2d6", "#8a6a55"],
      curtainId: "lined",
    },
    "warm-contemporary": {
      paletteId: "lagos-chalk",
      hexes: ["#d4c4a8", "#f3efe6"],
      lightId: "pendant",
    },
    collected: {
      paletteId: "laterite",
      hexes: ["#e8e2d6", "#b56a4a"],
      curtainId: "lined",
    },
    "quiet-contemporary": {
      paletteId: "lagos-chalk",
      hexes: ["#e8e2d6", "#f3efe6"],
      curtainId: "none",
    },
    coastal: {
      paletteId: "coastal",
      hexes: ["#f3efe6", "#e8e2d6", "#3d4a6b"],
      curtainId: "sheer",
    },
    "afro-modern": {
      paletteId: "laterite",
      hexes: ["#b56a4a", "#3d4a6b"],
      curtainId: "sheer",
      lightId: "chandelier",
    },
    "corporate-quiet": {
      paletteId: "corporate",
      hexes: ["#2c2a28", "#e8e2d6"],
      curtainId: "blinds",
      lightId: "lantern",
    },
    laterite: {
      paletteId: "laterite",
      hexes: ["#b56a4a", "#d4c4a8"],
    },
    "garden-city": {
      paletteId: "forest",
      hexes: ["#3f4f3a", "#f3efe6"],
      curtainId: "sheer",
    },
  };
  return looks[id] ?? null;
}

export function labelsForTags(ids: string[]): string[] {
  return ids.flatMap((id) => {
    const tag = styleTags.find((item) => item.id === id);
    return tag ? [tag.label] : [];
  });
}
