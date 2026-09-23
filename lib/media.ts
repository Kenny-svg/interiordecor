import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const dir = path.join(process.cwd(), ".data", "media");
const generatedDir = path.join(process.cwd(), "public", "generated");

const mimeToExt: Record<string, "png" | "jpg" | "webp"> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
};

export async function saveGeneratedImage(
  bytes: Buffer,
  ext: "png" | "jpg" | "webp",
): Promise<string> {
  return saveUpload(bytes, ext);
}

export async function saveUpload(
  bytes: Buffer,
  ext: "png" | "jpg" | "webp",
): Promise<string> {
  await mkdir(dir, { recursive: true });
  const id = randomUUID();
  const filename = `${id}.${ext}`;
  await writeFile(path.join(dir, filename), bytes);
  return `/api/media/${filename}`;
}

export function extensionForMime(mime: string): "png" | "jpg" | "webp" | null {
  return mimeToExt[mime] ?? null;
}

export function mediaPath(filename: string): string {
  return path.join(dir, filename);
}

export async function persistRemoteImage(url: string): Promise<string> {
  if (url.startsWith("/generated/") || url.startsWith("/api/media/")) {
    return url;
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return url;
    }
    const mime = (response.headers.get("content-type") ?? "image/jpeg").split(";")[0] ?? "image/jpeg";
    const ext = extensionForMime(mime) ?? "jpg";
    await mkdir(generatedDir, { recursive: true });
    const filename = `${randomUUID()}.${ext}`;
    await writeFile(path.join(generatedDir, filename), Buffer.from(await response.arrayBuffer()));
    return `/generated/${filename}`;
  } catch {
    return url;
  }
}

export async function persistUploadPublic(
  bytes: Buffer,
  ext: "png" | "jpg" | "webp",
): Promise<string> {
  await mkdir(generatedDir, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  await writeFile(path.join(generatedDir, filename), bytes);
  return `/generated/${filename}`;
}

const productsDir = path.join(process.cwd(), "public", "products");

export async function persistProductPhoto(
  bytes: Buffer,
  ext: "png" | "jpg" | "webp",
): Promise<string> {
  await mkdir(productsDir, { recursive: true });
  const filename = `${randomUUID()}.${ext}`;
  await writeFile(path.join(productsDir, filename), bytes);
  return `/products/${filename}`;
}
