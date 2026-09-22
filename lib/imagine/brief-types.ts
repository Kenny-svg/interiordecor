import type { ConceptSummary } from "@/lib/imagine/session-store";

export type BriefStill = {
  id: string;
  url: string;
  alt: string;
  favorite: boolean;
  selected: boolean;
  summary: ConceptSummary;
};

export type PublicBrief = {
  id: string;
  sessionId: string;
  prompt: string;
  transcript: string;
  studioPrompt: string;
  tags: string[];
  summary: string;
  selectedIds: string[];
  images: BriefStill[];
  photoUrl: string | null;
  magicExpiresAt: string | null;
};

export function parseBriefImages(raw: string): BriefStill[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.flatMap((item) => {
      if (
        typeof item !== "object" ||
        item === null ||
        !("id" in item) ||
        !("url" in item) ||
        typeof item.id !== "string" ||
        typeof item.url !== "string"
      ) {
        return [];
      }
      const summary =
        "summary" in item && typeof item.summary === "object" && item.summary !== null
          ? {
              palette: String("palette" in item.summary ? item.summary.palette : ""),
              materials: String("materials" in item.summary ? item.summary.materials : ""),
              mood: String("mood" in item.summary ? item.summary.mood : ""),
            }
          : { palette: "", materials: "", mood: "" };
      return [
        {
          id: item.id,
          url: item.url,
          alt: "alt" in item && typeof item.alt === "string" ? item.alt : "",
          favorite: "favorite" in item && item.favorite === true,
          selected: "selected" in item && item.selected === true,
          summary,
        },
      ];
    });
  } catch {
    return [];
  }
}

export function parseStringArray(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function summaryText(images: BriefStill[]): string {
  const cards = images.filter((item) => item.selected || item.favorite);
  const source = cards.length > 0 ? cards : images;
  return source
    .map((item, index) => {
      const bullets = item.summary;
      return [
        `Concept ${index + 1}.`,
        bullets.palette ? `Palette: ${bullets.palette}` : "",
        bullets.materials ? `Materials: ${bullets.materials}` : "",
        bullets.mood ? `Mood: ${bullets.mood}` : "",
      ]
        .filter(Boolean)
        .join(" ");
    })
    .join("\n\n");
}
