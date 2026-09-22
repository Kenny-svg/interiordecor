import {
  ProviderError,
  type SttProvider,
  type TranscriptResult,
  type TranscriptWord,
} from "@/lib/providers/types";

type WhisperVerbose = {
  text?: string;
  segments?: Array<{
    text?: string;
    avg_logprob?: number;
    no_speech_prob?: number;
    words?: Array<{ word?: string; probability?: number }>;
  }>;
  words?: Array<{ word?: string; probability?: number }>;
};

const LOW_LOG = -0.55;

export const openaiSttProvider: SttProvider = {
  name: "openai",
  async transcribe(audioFile: File, hint?: string | null): Promise<TranscriptResult> {
    void hint;
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      throw new ProviderError("OPENAI_API_KEY is not set.", "config");
    }

    const body = new FormData();
    body.set("model", "whisper-1");
    body.set("language", "en");
    body.set("response_format", "verbose_json");
    body.set("file", audioFile, audioFile.name || "note.webm");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${key}` },
          body,
          signal: controller.signal,
        },
      );

      if (!response.ok) {
        throw new ProviderError("The transcript could not be made.", "upstream");
      }

      const data = (await response.json()) as WhisperVerbose;
      const text = data.text?.trim();
      if (!text) {
        throw new ProviderError("The transcript was empty.", "upstream");
      }
      return { provider: "openai", text, words: wordsFromVerbose(data, text) };
    } catch (error) {
      if (error instanceof ProviderError) {
        throw error;
      }
      if (error instanceof Error && error.name === "AbortError") {
        throw new ProviderError("The transcript timed out.", "timeout");
      }
      throw new ProviderError("The transcript could not be made.", "upstream");
    } finally {
      clearTimeout(timer);
    }
  },
};

function wordsFromVerbose(data: WhisperVerbose, fallback: string): TranscriptWord[] {
  const top = data.words ?? [];
  if (top.length > 0) {
    return top.flatMap((item) => {
      const text = item.word?.trim();
      if (!text) {
        return [];
      }
      return [{ text, confidence: item.probability ?? null }];
    });
  }

  const segments = data.segments ?? [];
  if (segments.length > 0) {
    return segments.flatMap((segment) => {
      const low =
        (segment.avg_logprob !== undefined && segment.avg_logprob < LOW_LOG) ||
        (segment.no_speech_prob !== undefined && segment.no_speech_prob > 0.45);
      const nested = segment.words ?? [];
      if (nested.length > 0) {
        return nested.flatMap((item) => {
          const text = item.word?.trim();
          if (!text) {
            return [];
          }
          const confidence =
            item.probability ?? (low ? 0.4 : 0.9);
          return [{ text, confidence }];
        });
      }
      return splitWords(segment.text ?? "", low ? 0.4 : 0.9);
    });
  }

  return splitWords(fallback, 0.9);
}

function splitWords(text: string, confidence: number): TranscriptWord[] {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => ({ text: word, confidence }));
}
