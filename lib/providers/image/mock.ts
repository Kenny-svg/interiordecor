import { pickMockStills } from "@/lib/mock-stills";
import type {
  ImageGenerateOptions,
  ImageGenProvider,
  ImageGenResult,
} from "@/lib/providers/types";

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const mockImageProvider: ImageGenProvider = {
  name: "mock",
  async generate(
    studioPrompt: string,
    options: ImageGenerateOptions = {},
  ): Promise<ImageGenResult> {
    await wait(1800);
    const n = Math.min(Math.max(options.n ?? 4, 1), 4);
    const stills = pickMockStills({
      prompt: studioPrompt,
      styleTags: [],
      count: n,
    });

    return {
      provider: "mock",
      images: stills.map((still) => ({
        url: still.url,
        alt: still.alt,
      })),
    };
  },
};
