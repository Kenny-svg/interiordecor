import { prisma } from "@/lib/db";
import type { PublicGeneration, PublicImage } from "@/lib/types";
import { parseJsonArray } from "@/lib/utils";

export function toPublicGeneration(row: {
  id: string;
  prompt: string;
  transcript: string | null;
  styleTags: string;
  hasRoomPhoto: boolean;
  summary: string;
  images: string;
  createdAt: Date;
}): PublicGeneration {
  return {
    id: row.id,
    prompt: row.prompt,
    transcript: row.transcript,
    styleTags: parseJsonArray(row.styleTags),
    hasRoomPhoto: row.hasRoomPhoto,
    summary: row.summary,
    images: parseImages(row.images),
    createdAt: row.createdAt.toISOString(),
  };
}

function parseImages(value: string): PublicImage[] {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isPublicImage);
  } catch {
    return [];
  }
}

function isPublicImage(value: unknown): value is PublicImage {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "url" in value &&
    "alt" in value &&
    typeof value.id === "string" &&
    typeof value.url === "string" &&
    typeof value.alt === "string"
  );
}

export async function getLatestGeneration(
  sessionId: string | null,
): Promise<PublicGeneration | null> {
  if (!sessionId) {
    return null;
  }
  const row = await prisma.generation.findFirst({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
  });
  return row ? toPublicGeneration(row) : null;
}

export async function getRecentGenerations(
  sessionId: string | null,
  take = 5,
): Promise<PublicGeneration[]> {
  if (!sessionId) {
    return [];
  }
  const rows = await prisma.generation.findMany({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
    take,
  });
  return rows.map(toPublicGeneration);
}
