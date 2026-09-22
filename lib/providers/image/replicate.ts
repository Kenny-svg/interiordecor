import { fetchWithTimeout, fileToDataUri, viewpointLine } from "@/lib/providers/http";
import {
  ProviderError,
  type ImageGenerateOptions,
  type ImageGenProvider,
  type ImageGenResult,
} from "@/lib/providers/types";

type ReplicatePrediction = {
  status?: string;
  output?: unknown;
  urls?: { get?: string };
};

export const replicateImageProvider: ImageGenProvider = {
  name: "replicate",
  async generate(
    studioPrompt: string,
    options: ImageGenerateOptions = {},
  ): Promise<ImageGenResult> {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
      throw new ProviderError("REPLICATE_API_TOKEN is not set.", "config");
    }

    const n = Math.min(Math.max(options.n ?? 4, 1), 4);
    const image = options.image ?? null;
    const imageUri = image ? await fileToDataUri(image) : null;
    const images: ImageGenResult["images"] = [];

    for (let index = 0; index < n; index += 1) {
      const url = await runReplicate(
        token,
        `${studioPrompt} ${viewpointLine(index)}`,
        imageUri,
      );
      images.push({
        url,
        alt: `Concept still ${index + 1} of the described room`,
      });
    }

    return { provider: "replicate", images };
  },
};

async function runReplicate(
  token: string,
  prompt: string,
  imageUri: string | null,
): Promise<string> {
  const created = await fetchJson(
    "https://api.replicate.com/v1/models/black-forest-labs/flux-dev/predictions",
    token,
    {
      method: "POST",
      body: JSON.stringify({
        input: imageUri
          ? {
              prompt,
              image: imageUri,
              prompt_strength: 0.65,
              aspect_ratio: "3:2",
              output_format: "jpg",
            }
          : {
              prompt,
              aspect_ratio: "3:2",
              output_format: "jpg",
            },
      }),
    },
  );

  const pollUrl = created.urls?.get;
  if (!pollUrl) {
    throw new ProviderError("The image studio returned no stills.", "upstream");
  }

  const started = Date.now();
  while (Date.now() - started < 50_000) {
    const prediction = await fetchJson(pollUrl, token, { method: "GET" });
    if (prediction.status === "succeeded") {
      const url = firstUrl(prediction.output);
      if (!url) {
        throw new ProviderError("The image studio returned no stills.", "upstream");
      }
      return url;
    }
    if (prediction.status === "failed" || prediction.status === "canceled") {
      throw new ProviderError("The image studio refused the request.", "upstream");
    }
    await wait(1200);
  }

  throw new ProviderError("The image studio timed out.", "timeout");
}

async function fetchJson(
  url: string,
  token: string,
  init: RequestInit,
): Promise<ReplicatePrediction> {
  const response = await fetchWithTimeout(
    url,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait=10",
      },
    },
    20_000,
  );
  if (!response.ok) {
    throw new ProviderError("The image studio refused the request.", "upstream");
  }
  return (await response.json()) as ReplicatePrediction;
}

function firstUrl(output: unknown): string | null {
  if (typeof output === "string") {
    return output;
  }
  if (Array.isArray(output) && typeof output[0] === "string") {
    return output[0];
  }
  return null;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
