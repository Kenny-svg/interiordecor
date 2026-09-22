import { NextResponse } from "next/server";
import { persistHandoff } from "@/lib/imagine/handoff";
import { handoffPayloadSchema } from "@/lib/imagine/handoff-schema";
import { publicOrigin } from "@/lib/origin";
import { ensureSession, getSessionId } from "@/lib/session";
import { isAllowedPhotoType, PHOTO_MAX_BYTES } from "@/lib/validation";

export const maxDuration = 60;

export async function POST(request: Request) {
  const sessionId = await getSessionId();
  if (!sessionId) {
    return NextResponse.json({ error: "No session." }, { status: 401 });
  }
  await ensureSession(sessionId);

  const form = await request.formData();
  let payload: unknown = {};
  try {
    payload = JSON.parse(String(form.get("payload") ?? "{}"));
  } catch {
    return NextResponse.json({ error: "The brief could not be read." }, { status: 400 });
  }

  const parsed = handoffPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "The brief is incomplete." }, { status: 400 });
  }

  const photo = form.get("photo");
  if (photo instanceof File && photo.size > 0) {
    if (photo.size > PHOTO_MAX_BYTES) {
      return NextResponse.json(
        { error: "The photograph is too large. Use a file under 10MB." },
        { status: 400 },
      );
    }
    if (!isAllowedPhotoType(photo.type)) {
      return NextResponse.json({ error: "Use a JPEG, PNG, or WebP photograph." }, { status: 400 });
    }
  }

  try {
    const saved = await persistHandoff({
      ...parsed.data,
      sessionId,
      photo: photo instanceof File && photo.size > 0 ? photo : null,
    });
    const origin = await publicOrigin();
    return NextResponse.json({
      briefId: saved.briefId,
      token: saved.token,
      magicUrl: `${origin}/imagine?resume=${saved.token}`,
      expiresAt: saved.expiresAt.toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "The brief could not be sent just now." },
      { status: 502 },
    );
  }
}
