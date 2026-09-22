import { saveGeneratedImage } from "@/lib/media";
import { fetchWithTimeout, viewpointLine } from "@/lib/providers/http";
import {
  ProviderError,
  type ImageGenerateOptions,
  type ImageGenProvider,
  type ImageGenResult,
} from "@/lib/providers/types";

type OpenAiImageResponse = {
  data?: Array<{ url?: string; b64_json?: string }>;
};

const DEFAULT_SIZE = "1536x1024";

export const openaiImageProvider: ImageGenProvider = {
  name: "openai",
  async generate(
    studioPrompt: string,
    options: ImageGenerateOptions = {},
  ): Promise<ImageGenResult> {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      throw new ProviderError("OPENAI_API_KEY is not set.", "config");
    }

    const n = clampCount(options.n);
    const size = options.size ?? DEFAULT_SIZE;
    const image = options.image ?? null;

    const urls = image
      ? await editMany(key, studioPrompt, image, n, size)
      : await createMany(key, studioPrompt, n, size);

    return {
      provider: "openai",
      images: urls.map((url, index) => ({
        url,
        alt: `Concept still ${index + 1} of the described room`,
      })),
    };
  },
};

async function createMany(
  key: string,
  prompt: string,
  n: number,
  size: string,
): Promise<string[]> {
  try {
    return await createImage(key, prompt, n, size);
  } catch {
    const urls: string[] = [];
    for (let index = 0; index < n; index += 1) {
      const batch = await createImage(
        key,
        `${prompt} ${viewpointLine(index)}`,
        1,
        size,
      );
      const url = batch[0];
      if (url) {
        urls.push(url);
      }
    }
    if (urls.length === 0) {
      throw new ProviderError("The image studio returned no stills.", "upstream");
    }
    return urls;
  }
}

async function editMany(
  key: string,
  prompt: string,
  image: File,
  n: number,
  size: string,
): Promise<string[]> {
  const urls: string[] = [];
  for (let index = 0; index < n; index += 1) {
    urls.push(await editImage(key, `${prompt} ${viewpointLine(index)}`, image, size));
  }
  return urls;
}

async function createImage(
  key: string,
  prompt: string,
  n: number,
  size: string,
): Promise<string[]> {
  const response = await fetchWithTimeout(
    "https://api.openai.com/v1/images/generations",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        n,
        size,
      }),
    },
    55_000,
  );

  return readImages(response);
}

async function editImage(
  key: string,
  prompt: string,
  photo: File,
  size: string,
): Promise<string> {
  const body = new FormData();
  body.set("model", "gpt-image-1");
  body.set("prompt", prompt);
  body.set("n", "1");
  body.set("size", size);
  body.set("image", photo, photo.name || "room.jpg");

  const response = await fetchWithTimeout(
    "https://api.openai.com/v1/images/edits",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
      },
      body,
    },
    55_000,
  );

  const urls = await readImages(response);
  const first = urls[0];
  if (!first) {
    throw new ProviderError("The image studio returned no stills.", "upstream");
  }
  return first;
}

async function readImages(response: Response): Promise<string[]> {
  if (!response.ok) {
    throw new ProviderError("The image studio refused the request.", "upstream");
  }

  const data = (await response.json()) as OpenAiImageResponse;
  const rows = data.data ?? [];
  const urls: string[] = [];
  for (const row of rows) {
    if (row.url) {
      urls.push(row.url);
    } else if (row.b64_json) {
      urls.push(await saveGeneratedImage(Buffer.from(row.b64_json, "base64"), "png"));
    }
  }
  if (urls.length === 0) {
    throw new ProviderError("The image studio returned no stills.", "upstream");
  }
  return urls;
}

function clampCount(n: number | undefined): number {
  return Math.min(Math.max(n ?? 4, 1), 4);
}
