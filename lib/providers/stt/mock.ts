import type { SttProvider, TranscriptResult, TranscriptWord } from "@/lib/providers/types";

const FALLBACK =
  "A quiet living room in Ikoyi, late afternoon light. Laterite walls, a lounge chair toward the window, sheers, and room for books. Nothing precious. Warm, still, and meant to be used.";

const LOW = /\b(linen|quiet|oak|precious|weather)\b/i;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const mockSttProvider: SttProvider = {
  name: "mock",
  async transcribe(_audioFile: File, hint?: string | null): Promise<TranscriptResult> {
    await wait(700);
    const spoken = hint?.trim();
    const text = spoken && spoken.length > 12 ? spoken : FALLBACK;
    return {
      provider: "mock",
      text,
      words: wordsFrom(text),
    };
  },
};

function wordsFrom(text: string): TranscriptWord[] {
  return text.split(/\s+/).filter(Boolean).map((word) => ({
    text: word,
    confidence: LOW.test(word.replace(/[.,]/g, "")) ? 0.42 : 0.94,
  }));
}
