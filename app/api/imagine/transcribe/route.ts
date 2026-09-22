import { NextResponse } from "next/server";
import { transcribeFailMessage } from "@/lib/imagine/messages";
import { logError, logInfo, requestIdFrom } from "@/lib/log";
import {
  assertTranscribeAllowed,
  clientIp,
  recordTranscribe,
} from "@/lib/imagine/quota";
import { getSttProvider } from "@/lib/providers/stt";
import { logProviderError } from "@/lib/providers/types";
import { site } from "@/lib/site";
import { assertSafeAudio } from "@/lib/uploads";
import { transcribeSchema } from "@/lib/validation";

export const maxDuration = 30;

export async function POST(request: Request) {
  const requestId = requestIdFrom(request.headers);
  const ip = clientIp(request.headers);
  const blocked = await assertTranscribeAllowed(ip);
  if (blocked) {
    return NextResponse.json(
      { error: blocked.error, code: "rate" },
      { status: blocked.status },
    );
  }

  const form = await request.formData();
  const audio = form.get("audio");
  if (!(audio instanceof File) || audio.size === 0) {
    return NextResponse.json({ error: "Attach a voice note first." }, { status: 400 });
  }
  const unsafe = await assertSafeAudio(audio);
  if (unsafe) {
    return NextResponse.json({ error: unsafe.error }, { status: 400 });
  }

  const parsed = transcribeSchema.safeParse({
    hint: optionalString(form.get("hint")),
    durationSeconds: form.get("durationSeconds") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "The note couldn’t be read." }, { status: 400 });
  }

  if (
    parsed.data.durationSeconds !== undefined &&
    parsed.data.durationSeconds > site.voiceMaxSeconds
  ) {
    return NextResponse.json(
      { error: "Keep the note under 45 seconds, then try again." },
      { status: 400 },
    );
  }

  try {
    const result = await getSttProvider().transcribe(
      audio,
      parsed.data.hint ?? null,
    );
    await recordTranscribe(ip);
    logInfo("imagine.transcribe", "ok", { requestId, demo: result.provider === "mock" });
    return NextResponse.json({
      text: result.text,
      words: result.words,
      demo: result.provider === "mock",
    });
  } catch (error) {
    logProviderError("imagine.transcribe", error);
    logError("imagine.transcribe", "fail", { requestId });
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
