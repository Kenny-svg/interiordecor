import { NextResponse } from "next/server";
import { transcribeFailMessage } from "@/lib/imagine/messages";
import { getSttProvider } from "@/lib/providers/stt";
import { logProviderError } from "@/lib/providers/types";
import {
  AUDIO_MAX_BYTES,
  isAllowedAudioType,
  transcribeSchema,
} from "@/lib/validation";

export const maxDuration = 30;

export async function POST(request: Request) {
  const form = await request.formData();
  const audio = form.get("audio");
  if (!(audio instanceof File) || audio.size === 0) {
    return NextResponse.json(
      { error: "Attach a voice note first." },
      { status: 400 },
    );
  }
  if (audio.size > AUDIO_MAX_BYTES) {
    return NextResponse.json(
      { error: "The note is too long. Keep it under 45 seconds." },
      { status: 400 },
    );
  }
  if (!isAllowedAudioType(audio.type || "audio/webm")) {
    return NextResponse.json(
      { error: "That recording format isn’t supported. Type instead." },
      { status: 400 },
    );
  }

  const parsed = transcribeSchema.safeParse({
    hint: optionalString(form.get("hint")),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "The note couldn’t be read." }, { status: 400 });
  }

  try {
    const result = await getSttProvider().transcribe(
      audio,
      parsed.data.hint ?? null,
    );
    return NextResponse.json({ text: result.text, provider: result.provider });
  } catch (error) {
    logProviderError("transcribe", error);
    return NextResponse.json({ error: transcribeFailMessage() }, { status: 502 });
  }
}

function optionalString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
