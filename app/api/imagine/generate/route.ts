import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { briefLanguage, type UserBrief } from "@/lib/brief";
import { stillAlt, writeConceptBullets } from "@/lib/imagine/concept-summary";
import { generateFailMessage } from "@/lib/imagine/messages";
import {
  assertGenerateAllowed,
  clientIp,
  getImagineQuota,
  recordGeneration,
} from "@/lib/imagine/quota";
import { persistRemoteImage } from "@/lib/media";
import { logError, logInfo, requestIdFrom } from "@/lib/log";
import { prisma } from "@/lib/db";
import { buildStudioPrompt } from "@/lib/prompt";
import { getImageProvider } from "@/lib/providers/image";
import { logProviderError } from "@/lib/providers/types";
import { ensureSession, getSessionId } from "@/lib/session";
import { prepareImageUpload } from "@/lib/uploads";
import { imagineGenerateSchema } from "@/lib/validation";
import { parseJsonArray } from "@/lib/utils";

export const maxDuration = 60;

export async function POST(request: Request) {
  const requestId = requestIdFrom(request.headers);
  const sessionId = await getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "No session." }, { status: 401 });
  }

  await ensureSession(sessionId);
  const ip = clientIp(request.headers);
  const form = await request.formData();

  const parsed = imagineGenerateSchema.safeParse({
    rawText: String(form.get("rawText") ?? ""),
    transcript: String(form.get("transcript") ?? ""),
    styleTags: parseJsonArray(String(form.get("styleTags") ?? "[]")),
    constraints: parseJsonArray(String(form.get("constraints") ?? "[]")),
    source: String(form.get("source") ?? "text"),
    n: form.get("n") ?? 4,
    refine: optionalString(form.get("refine")),
    charge: form.get("charge") === "false" ? "false" : "true",
  });

  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Check the note and try again.";
    return NextResponse.json({ error: first }, { status: 400 });
  }

  const charge = parsed.data.charge === "true";
  if (charge) {
    const gate = await assertGenerateAllowed(sessionId, ip, {
      cooldown: !parsed.data.refine,
    });
    if ("error" in gate) {
      return NextResponse.json(
        { error: gate.error, code: gate.status === 402 ? "budget" : "rate" },
        { status: gate.status },
      );
    }
  }

  const photo = await readImage(form.get("photo"));
  if (photo && "error" in photo) {
    return NextResponse.json({ error: photo.error }, { status: 400 });
  }
  const previous = await readImage(form.get("previous"));
  if (previous && "error" in previous) {
    return NextResponse.json({ error: previous.error }, { status: 400 });
  }

  const sourceImage =
    previous && "file" in previous
      ? previous.file
      : photo && "file" in photo
        ? photo.file
        : null;

  const language = briefLanguage({
    rawText: parsed.data.rawText,
    transcript: parsed.data.transcript,
    styleTags: parsed.data.styleTags,
    constraints: parsed.data.constraints,
    source: parsed.data.source,
  });

  const brief: UserBrief = {
    rawText: parsed.data.refine
      ? `${parsed.data.rawText} ${parsed.data.refine}`.trim()
      : parsed.data.rawText,
    transcript: parsed.data.transcript,
    photoUrl: sourceImage ? "attached" : undefined,
    styleTags: parsed.data.styleTags,
    constraints: parsed.data.constraints,
    source: parsed.data.source,
  };

  if (language.length < 12) {
    return NextResponse.json(
      {
        error:
          "A little more about the room is needed — the light, the materials, how it is used.",
      },
      { status: 400 },
    );
  }

  const built = buildStudioPrompt(brief);
  if (!built.ok) {
    return NextResponse.json(
      { error: built.reason, code: "blocked" },
      { status: 422 },
    );
  }

  const studioPrompt = parsed.data.refine
    ? `${built.prompt} This is a refinement of the attached still. Keep architecture and composition. Apply only: ${parsed.data.refine}.`
    : built.prompt;

  const provider = getImageProvider();

  try {
    const result = await provider.generate(studioPrompt, {
      image: sourceImage,
      n: parsed.data.n,
      size: "1536x1024",
    });

    const images = await Promise.all(
      result.images.map(async (image, index) => ({
        id: randomUUID(),
        url: await persistRemoteImage(image.url),
        alt: stillAlt({
          brief: language,
          tags: parsed.data.styleTags,
          index,
          refine: parsed.data.refine,
        }),
        status: "ready" as const,
      })),
    );

    const summary = await writeConceptBullets({
      brief: language,
      tags: parsed.data.styleTags,
      constraints: parsed.data.constraints,
      hasPhoto: Boolean(photo && "file" in photo),
    });

    if (charge) {
      await recordGeneration(ip);
      try {
        await prisma.$transaction(async (tx) => {
          await tx.generation.create({
            data: {
              sessionId,
              prompt: language,
              transcript: brief.transcript || null,
              styleTags: JSON.stringify(brief.styleTags),
              hasRoomPhoto: Boolean(sourceImage),
              summary: [summary.palette, summary.materials, summary.mood].join(" "),
              studioPrompt,
              images: JSON.stringify(images),
            },
          });
          await tx.session.update({
            where: { id: sessionId },
            data: { generationCount: { increment: 1 } },
          });
        });
      } catch {
        logError("imagine.generate", "persist", { requestId });
      }
    }

    logInfo("imagine.generate", "ok", {
      requestId,
      n: images.length,
      demo: provider.name === "mock",
    });

    return NextResponse.json({
      images,
      studioPrompt,
      summary,
      demo: provider.name === "mock",
      budget: await getImagineQuota(sessionId, ip),
    });
  } catch (error) {
    logProviderError("imagine.generate", error);
    logError("imagine.generate", "fail", { requestId });
    return NextResponse.json(
      { error: generateFailMessage(error) },
      { status: 502 },
    );
  }
}

async function readImage(
  value: FormDataEntryValue | null,
): Promise<{ file: File } | { error: string } | null> {
  if (!(value instanceof File) || value.size === 0) {
    return null;
  }
  const prepared = await prepareImageUpload(value);
  if ("error" in prepared) {
    return prepared;
  }
  const type =
    prepared.ext === "jpg" ? "image/jpeg" : prepared.ext === "png" ? "image/png" : "image/webp";
  const file = new File([new Uint8Array(prepared.bytes)], `room.${prepared.ext}`, { type });
  return { file };
}

function optionalString(value: FormDataEntryValue | null): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
