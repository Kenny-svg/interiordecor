import { fetchWithTimeout, fileToDataUri, viewpointLine } from "@/lib/providers/http";
import {
  ProviderError,
  type ImageGenerateOptions,
  type ImageGenProvider,
  type ImageGenResult,
} from "@/lib/providers/types";

type FalResponse = {
  images?: Array<{ url?: string }>;
  image?: { url?: string };
};

export const falImageProvider: ImageGenProvider = {
  name: "fal",
  async generate(
    studioPrompt: string,
    options: ImageGenerateOptions = {},
  ): Promise<ImageGenResult> {
    const key = process.env.FAL_KEY;
    if (!key) {
      throw new ProviderError("FAL_KEY is not set.", "config");
    }

    const n = Math.min(Math.max(options.n ?? 4, 1), 4);
    const image = options.image ?? null;
    const imageUrl = image ? await fileToDataUri(image) : null;
    const images: ImageGenResult["images"] = [];

    for (let index = 0; index < n; index += 1) {
      const url = await runFal(
        key,
        `${studioPrompt} ${viewpointLine(index)}`,
        imageUrl,
      );
      images.push({
        url,
        alt: `Concept still ${index + 1} of the described room`,
      });
    }

    return { provider: "fal", images };
  },
};

async function runFal(
  key: string,
  prompt: string,
  imageUrl: string | null,
): Promise<string> {
  const endpoint = imageUrl
    ? "https://fal.run/fal-ai/flux/dev/image-to-image"
    : "https://fal.run/fal-ai/flux/dev";

  const response = await fetchWithTimeout(
    endpoint,
    {
      method: "POST",
      headers: {
        Authorization: `Key ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        imageUrl
          ? {
              prompt,
              image_url: imageUrl,
              strength: 0.55,
              num_images: 1,
              image_size: "landscape_4_3",
            }
          : {
              prompt,
              image_size: "landscape_4_3",
              num_images: 1,
            },
      ),
    },
    55_000,
  );

  if (!response.ok) {
    throw new ProviderError("The image studio refused the request.", "upstream");
  }

  const data = (await response.json()) as FalResponse;
  const url = data.images?.[0]?.url ?? data.image?.url;
  if (!url) {
    throw new ProviderError("The image studio returned no stills.", "upstream");
  }
  return url;
}
