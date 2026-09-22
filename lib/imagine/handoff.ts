import { prisma } from "@/lib/db";
import {
  parseBriefImages,
  parseStringArray,
  type BriefStill,
  type PublicBrief,
} from "@/lib/imagine/brief-types";
import { persistRemoteImage, persistUploadPublic } from "@/lib/media";
import { createMagicToken, hashToken, magicExpiry, tokensMatch } from "@/lib/magic";
import { prepareImageUpload } from "@/lib/uploads";

export async function magicUrlFor(
  briefId: string,
  token: string,
  origin: string,
): Promise<string | null> {
  const row = await prisma.imagineBrief.findUnique({ where: { id: briefId } });
  if (!row?.magicTokenHash || !row.magicExpiresAt) {
    return null;
  }
  if (row.magicExpiresAt.getTime() < Date.now()) {
    return null;
  }
  if (!tokensMatch(token, row.magicTokenHash)) {
    return null;
  }
  return `${origin}/imagine?resume=${token}`;
}

export async function persistHandoff(input: {
  sessionId: string;
  prompt: string;
  transcript: string;
  studioPrompt: string;
  tags: string[];
  selectedIds: string[];
  images: BriefStill[];
  photo?: File | null;
}): Promise<{ briefId: string; token: string; expiresAt: Date }> {
  const images = await Promise.all(
    input.images.map(async (image) => ({
      ...image,
      url: await persistRemoteImage(image.url),
    })),
  );

  let photoUrl: string | null = null;
  if (input.photo && input.photo.size > 0) {
    const prepared = await prepareImageUpload(input.photo);
    if (!("error" in prepared)) {
      photoUrl = await persistUploadPublic(prepared.bytes, prepared.ext);
    }
  }

  const token = createMagicToken();
  const expiresAt = magicExpiry();
  const summary = images
    .map((item) => [item.summary.palette, item.summary.materials, item.summary.mood].filter(Boolean).join(" "))
    .filter(Boolean)
    .join("\n\n");

  const row = await prisma.imagineBrief.create({
    data: {
      sessionId: input.sessionId,
      prompt: input.prompt.trim() || input.transcript,
      transcript: input.transcript,
      studioPrompt: input.studioPrompt,
      styleTags: JSON.stringify(input.tags),
      summary,
      selectedIds: JSON.stringify(input.selectedIds),
      images: JSON.stringify(images),
      photoUrl,
      magicTokenHash: hashToken(token),
      magicExpiresAt: expiresAt,
    },
  });

  return { briefId: row.id, token, expiresAt };
}

export async function getPublicBrief(id: string): Promise<PublicBrief | null> {
  const row = await prisma.imagineBrief.findUnique({ where: { id } });
  if (!row) {
    return null;
  }
  return toPublicBrief(row);
}

export async function getBriefByMagicHash(hash: string): Promise<PublicBrief | null> {
  const row = await prisma.imagineBrief.findUnique({
    where: { magicTokenHash: hash },
  });
  if (!row || !row.magicExpiresAt || row.magicExpiresAt.getTime() < Date.now()) {
    return null;
  }
  return toPublicBrief(row);
}

export function toPublicBrief(row: {
  id: string;
  sessionId: string;
  prompt: string;
  transcript: string;
  studioPrompt: string;
  styleTags: string;
  summary: string;
  selectedIds: string;
  images: string;
  photoUrl: string | null;
  magicExpiresAt: Date | null;
}): PublicBrief {
  return {
    id: row.id,
    sessionId: row.sessionId,
    prompt: row.prompt,
    transcript: row.transcript,
    studioPrompt: row.studioPrompt,
    tags: parseStringArray(row.styleTags),
    summary: row.summary,
    selectedIds: parseStringArray(row.selectedIds),
    images: parseBriefImages(row.images),
    photoUrl: row.photoUrl,
    magicExpiresAt: row.magicExpiresAt?.toISOString() ?? null,
  };
}
