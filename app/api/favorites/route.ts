import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureSession, getSessionId } from "@/lib/session";
import { favoriteSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const sessionId = await getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "No session." }, { status: 401 });
  }
  await ensureSession(sessionId);

  const parsed = favoriteSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Choose a still to keep." }, { status: 400 });
  }

  const generation = await prisma.generation.findFirst({
    where: { id: parsed.data.generationId, sessionId },
  });
  if (!generation) {
    return NextResponse.json({ error: "Those stills are no longer here." }, { status: 404 });
  }

  await prisma.favorite.upsert({
    where: {
      sessionId_generationId_imageId: {
        sessionId,
        generationId: parsed.data.generationId,
        imageId: parsed.data.imageId,
      },
    },
    create: {
      sessionId,
      generationId: parsed.data.generationId,
      imageId: parsed.data.imageId,
    },
    update: {},
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const sessionId = await getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "No session." }, { status: 401 });
  }

  const parsed = favoriteSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Choose a still to release." }, { status: 400 });
  }

  await prisma.favorite.deleteMany({
    where: {
      sessionId,
      generationId: parsed.data.generationId,
      imageId: parsed.data.imageId,
    },
  });

  return NextResponse.json({ ok: true });
}
