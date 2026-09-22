import { falImageProvider } from "@/lib/providers/image/fal";
import { mockImageProvider } from "@/lib/providers/image/mock";
import { openaiImageProvider } from "@/lib/providers/image/openai";
import { replicateImageProvider } from "@/lib/providers/image/replicate";
import type { ImageGenProvider } from "@/lib/providers/types";

const providers = {
  mock: mockImageProvider,
  openai: openaiImageProvider,
  fal: falImageProvider,
  replicate: replicateImageProvider,
} as const;

export type ImageProviderName = keyof typeof providers;

function isImageProviderName(value: string): value is ImageProviderName {
  return value in providers;
}

export function requestedImageProvider(): string {
  return process.env.AI_IMAGE_PROVIDER || process.env.IMAGE_PROVIDER || "mock";
}

export function getImageProvider(): ImageGenProvider {
  const requested = requestedImageProvider();
  if (!isImageProviderName(requested)) {
    console.warn(`Unknown AI_IMAGE_PROVIDER "${requested}". Using mock.`);
    return mockImageProvider;
  }

  if (requested === "openai" && !process.env.OPENAI_API_KEY) {
    console.warn("AI_IMAGE_PROVIDER=openai but OPENAI_API_KEY is missing. Using mock.");
    return mockImageProvider;
  }
  if (requested === "fal" && !process.env.FAL_KEY) {
    console.warn("AI_IMAGE_PROVIDER=fal but FAL_KEY is missing. Using mock.");
    return mockImageProvider;
  }
  if (requested === "replicate" && !process.env.REPLICATE_API_TOKEN) {
    console.warn(
      "AI_IMAGE_PROVIDER=replicate but REPLICATE_API_TOKEN is missing. Using mock.",
    );
    return mockImageProvider;
  }

  return providers[requested];
}

export function isImageDemoMode(): boolean {
  return getImageProvider().name === "mock";
}
