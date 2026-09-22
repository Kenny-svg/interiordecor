export class ProviderError extends Error {
  readonly code: "config" | "upstream" | "timeout" | "unsupported" | "safety";

  constructor(
    message: string,
    code: "config" | "upstream" | "timeout" | "unsupported" | "safety",
  ) {
    super(message);
    this.name = "ProviderError";
    this.code = code;
  }
}

export type GeneratedStill = {
  url: string;
  alt: string;
};

export type ImageGenResult = {
  images: GeneratedStill[];
  provider: string;
};

export type ImageGenerateOptions = {
  image?: File | null;
  n?: number;
  size?: string;
};

export type ImageGenProvider = {
  name: string;
  generate(
    studioPrompt: string,
    options?: ImageGenerateOptions,
  ): Promise<ImageGenResult>;
};

export type TranscriptWord = {
  text: string;
  confidence: number | null;
};

export type TranscriptResult = {
  text: string;
  provider: string;
  words: TranscriptWord[];
};

export type SttProvider = {
  name: string;
  transcribe(audioFile: File, hint?: string | null): Promise<TranscriptResult>;
};

export function logProviderError(scope: string, error: unknown): void {
  if (error instanceof ProviderError) {
    console.error(`[${scope}]`, error.code);
    return;
  }
  if (error instanceof Error) {
    console.error(`[${scope}]`, error.name);
    return;
  }
  console.error(`[${scope}]`, "unknown");
}
