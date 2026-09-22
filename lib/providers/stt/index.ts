import { mockSttProvider } from "@/lib/providers/stt/mock";
import { openaiSttProvider } from "@/lib/providers/stt/openai";
import type { SttProvider } from "@/lib/providers/types";

const providers = {
  mock: mockSttProvider,
  openai: openaiSttProvider,
} as const;

export type SttProviderName = keyof typeof providers;

function isSttProviderName(value: string): value is SttProviderName {
  return value in providers;
}

export function requestedSttProvider(): string {
  return process.env.AI_STT_PROVIDER || process.env.STT_PROVIDER || "mock";
}

export function getSttProvider(): SttProvider {
  const requested = requestedSttProvider();
  if (!isSttProviderName(requested)) {
    console.warn(`Unknown AI_STT_PROVIDER "${requested}". Using mock.`);
    return mockSttProvider;
  }
  if (requested === "openai" && !process.env.OPENAI_API_KEY) {
    console.warn("AI_STT_PROVIDER=openai but OPENAI_API_KEY is missing. Using mock.");
    return mockSttProvider;
  }
  return providers[requested];
}

export function isSttDemoMode(): boolean {
  return getSttProvider().name === "mock";
}
