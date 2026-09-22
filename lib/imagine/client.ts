import type { ConceptSummary } from "@/lib/imagine/session-store";
import type { TranscriptWord } from "@/lib/providers/types";

export type ImagineBudget = {
  remaining: number;
  used: number;
  limit: number;
};

export type ImagineImage = {
  id: string;
  url: string;
  alt: string;
  status: "ready" | "failed" | "blocked";
};

export type ImagineGenerateResult =
  | {
      ok: true;
      images: ImagineImage[];
      studioPrompt: string;
      summary: ConceptSummary;
      demo: boolean;
      budget: ImagineBudget;
    }
  | { ok: false; error: string; code?: string; status: number };

export type ImagineTranscribeResult =
  | { ok: true; text: string; words: TranscriptWord[]; demo: boolean }
  | { ok: false; error: string; status: number };

export async function postImagineGenerate(
  body: FormData,
): Promise<ImagineGenerateResult> {
  const response = await fetch("/api/imagine/generate", {
    method: "POST",
    body,
  });
  const data = (await readJson(response)) as {
    images?: ImagineImage[];
    studioPrompt?: string;
    summary?: ConceptSummary;
    demo?: boolean;
    budget?: ImagineBudget;
    error?: string;
    code?: string;
  };

  if (!response.ok || !data.images || !data.studioPrompt || !data.budget) {
    return {
      ok: false,
      error: data.error ?? "The studio couldn’t compose stills just now.",
      code: data.code,
      status: response.status,
    };
  }

  return {
    ok: true,
    images: data.images.map((image) => ({
      ...image,
      status: image.status ?? "ready",
    })),
    studioPrompt: data.studioPrompt,
    summary: data.summary ?? { palette: "", materials: "", mood: "" },
    demo: Boolean(data.demo),
    budget: data.budget,
  };
}

export async function postImagineTranscribe(input: {
  audio: File;
  hint: string | null;
  durationSeconds: number;
}): Promise<ImagineTranscribeResult> {
  const body = new FormData();
  body.set("audio", input.audio);
  if (input.hint) {
    body.set("hint", input.hint);
  }
  body.set("durationSeconds", String(Math.round(input.durationSeconds)));

  const response = await fetch("/api/imagine/transcribe", {
    method: "POST",
    body,
  });
  const data = (await readJson(response)) as {
    text?: string;
    words?: TranscriptWord[];
    demo?: boolean;
    error?: string;
  };

  if (!response.ok || !data.text) {
    return {
      ok: false,
      error: data.error ?? "The transcript could not be made. Edit the note, or paste it.",
      status: response.status,
    };
  }

  return {
    ok: true,
    text: data.text,
    words: data.words ?? [],
    demo: Boolean(data.demo),
  };
}

export async function fileFromImageUrl(url: string, filename: string): Promise<File | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const blob = await response.blob();
    const type = blob.type || "image/jpeg";
    return new File([blob], filename, { type });
  } catch {
    return null;
  }
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}
