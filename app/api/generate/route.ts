import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { type UserBrief } from "@/lib/brief";
import { prisma } from "@/lib/db";
import { toPublicGeneration } from "@/lib/generations";
import { generateFailMessage } from "@/lib/imagine/messages";
import { buildStudioPrompt } from "@/lib/prompt";
import { getImageProvider } from "@/lib/providers/image";
import { logProviderError, ProviderError } from "@/lib/providers/types";
import { ensureSession, getBudget, getSessionId } from "@/lib/session";
import { writeConceptSummary } from "@/lib/summary";
import type { PublicImage } from "@/lib/types";
import {
  generateSchema,
  isAllowedPhotoType,
  PHOTO_MAX_BYTES,
} from "@/lib/validation";
import { parseJsonArray } from "@/lib/utils";

export const maxDuration = 60;

export async function POST(request: Request) {
  const sessionId = await getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "No session." }, { status: 401 });
  }

  const session = await ensureSession(sessionId);
  const budget = await getBudget(sessionId);
  if (budget.remaining <= 0) {
    return NextResponse.json(
      {
        error:
          "Complimentary concepts for this visit are used. Send the brief, or request a small pack.",
        code: "budget",
      },
      { status: 402 },
    );
  }

  const latest = await prisma.generation.findFirst({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });
  if (latest && Date.now() - latest.createdAt.getTime() < 8_000) {
    return NextResponse.json(
      { error: "Give the last stills a moment before composing again." },
      { status: 429 },
    );
  }

  const form = await request.formData();
  const parsedTags = parseJsonArray(String(form.get("styleTags") ?? "[]"));
  const parsed = generateSchema.safeParse({
    prompt: String(form.get("prompt") ?? ""),
    transcript: optionalString(form.get("transcript")),
    styleTags: parsedTags,
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Check the note and try again.";
    return NextResponse.json({ error: first }, { status: 400 });
  }

  let photo: File | null = null;
  const uploaded = form.get("photo");
  if (uploaded instanceof File && uploaded.size > 0) {
    if (uploaded.size > PHOTO_MAX_BYTES) {
      return NextResponse.json(
        { error: "The photograph is too large. Use a file under 10MB." },
        { status: 400 },
      );
    }
    if (!isAllowedPhotoType(uploaded.type)) {
      return NextResponse.json(
        { error: "Use a JPEG, PNG, or WebP photograph." },
        { status: 400 },
      );
    }
    photo = uploaded;
  }

  const brief: UserBrief = {
    rawText: parsed.data.prompt,
    transcript: parsed.data.transcript ?? "",
    photoUrl: photo ? "attached" : undefined,
    styleTags: parsed.data.styleTags,
    constraints: [],
    source: "text",
  };

  const built = buildStudioPrompt(brief);
  if (!built.ok) {
    return NextResponse.json({ error: built.reason, code: "blocked" }, { status: 422 });
  }

  try {
    const result = await getImageProvider().generate(built.prompt, {
      image: photo,
      n: 3,
      size: "1536x1024",
    });

    const images: PublicImage[] = result.images.map((image) => ({
      id: randomUUID(),
      url: image.url,
      alt: image.alt,
    }));

    const summary = await writeConceptSummary({
      userLanguage: parsed.data.prompt,
      styleTags: parsed.data.styleTags,
      hasRoomPhoto: Boolean(photo),
    });

    const row = await prisma.$transaction(async (tx) => {
      const generation = await tx.generation.create({
        data: {
          sessionId: session.id,
          prompt: parsed.data.prompt,
          transcript: parsed.data.transcript ?? null,
          styleTags: JSON.stringify(parsed.data.styleTags),
          hasRoomPhoto: Boolean(photo),
          summary,
          studioPrompt: built.prompt,
          images: JSON.stringify(images),
        },
      });
      await tx.session.update({
        where: { id: session.id },
        data: { generationCount: { increment: 1 } },
      });
      return generation;
    });

    return NextResponse.json({
      generation: toPublicGeneration(row),
      budget: await getBudget(sessionId),
    });
  } catch (error) {
    logProviderError("generate", error);
    const message =
      error instanceof ProviderError
        ? generateFailMessage(error)
        : "The studio couldn’t compose stills just now.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

function optionalString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
