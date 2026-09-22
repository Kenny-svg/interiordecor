import { AUDIO_MAX_BYTES, PHOTO_MAX_BYTES } from "@/lib/validation";

export type ImageExt = "png" | "jpg" | "webp";

const BLOCKED_NAMES = /\.(svg|html?|xml|xhtml|php|js|mjs|wasm|exe|dll|bat|cmd|sh|zip|gz|tgz|7z|rar|pdf)$/i;

export async function prepareImageUpload(
  file: File,
): Promise<{ bytes: Buffer; ext: ImageExt } | { error: string }> {
  if (file.size === 0) {
    return { error: "Choose a photograph first." };
  }
  if (file.size > PHOTO_MAX_BYTES) {
    return { error: "The photograph is too large. Use a file under 10MB." };
  }
  if (BLOCKED_NAMES.test(file.name)) {
    return { error: "Use a JPEG, PNG, or WebP photograph." };
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  if (looksLikeMarkup(bytes)) {
    return { error: "Use a JPEG, PNG, or WebP photograph." };
  }

  const kind = sniffImage(bytes);
  if (!kind) {
    return { error: "Use a JPEG, PNG, or WebP photograph." };
  }

  return {
    bytes: kind === "jpeg" ? stripJpegExif(bytes) : bytes,
    ext: kind === "jpeg" ? "jpg" : kind,
  };
}

export async function assertSafeAudio(
  file: File,
): Promise<{ error: string } | null> {
  if (file.size === 0) {
    return { error: "Attach a voice note first." };
  }
  if (file.size > AUDIO_MAX_BYTES) {
    return { error: "The note is too long. Keep it under 45 seconds." };
  }
  if (BLOCKED_NAMES.test(file.name)) {
    return { error: "That recording format isn’t supported. Type instead." };
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  if (looksLikeMarkup(bytes) || !sniffAudio(bytes, file.type)) {
    return { error: "That recording format isn’t supported. Type instead." };
  }
  return null;
}

export function sniffImage(bytes: Uint8Array): "jpeg" | "png" | "webp" | null {
  if (bytes.length < 12) {
    return null;
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpeg";
  }
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return "png";
  }
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "webp";
  }
  return null;
}

function sniffAudio(bytes: Uint8Array, mime: string): boolean {
  if (bytes.length < 12) {
    return false;
  }
  const webm = bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3;
  const riff = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;
  const id3 = bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33;
  const mp3 = bytes[0] === 0xff && (bytes[1] ?? 0) >= 0xe0;
  const ftyp = bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70;
  const ogg = bytes[0] === 0x4f && bytes[1] === 0x67 && bytes[2] === 0x67 && bytes[3] === 0x53;
  if (webm || riff || id3 || mp3 || ftyp || ogg) {
    return true;
  }
  const base = mime.split(";")[0]?.trim().toLowerCase() ?? "";
  return base === "audio/mp4" || base === "audio/aac" || base === "audio/x-m4a";
}

function looksLikeMarkup(bytes: Uint8Array): boolean {
  const head = new TextDecoder("utf-8", { fatal: false })
    .decode(bytes.slice(0, 256))
    .trimStart()
    .toLowerCase();
  return (
    head.startsWith("<svg") ||
    head.startsWith("<!doctype") ||
    head.startsWith("<html") ||
    head.startsWith("<?xml") ||
    head.startsWith("<script")
  );
}

export function stripJpegExif(bytes: Buffer): Buffer {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return bytes;
  }
  const chunks: Buffer[] = [bytes.subarray(0, 2)];
  let index = 2;
  while (index + 3 < bytes.length) {
    if (bytes[index] !== 0xff) {
      chunks.push(bytes.subarray(index));
      break;
    }
    const marker = bytes[index + 1] ?? 0;
    if (marker === 0xda) {
      chunks.push(bytes.subarray(index));
      break;
    }
    if (marker === 0xd9) {
      chunks.push(Buffer.from([0xff, 0xd9]));
      break;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      chunks.push(bytes.subarray(index, index + 2));
      index += 2;
      continue;
    }
    const length = ((bytes[index + 2] ?? 0) << 8) | (bytes[index + 3] ?? 0);
    const next = index + 2 + length;
    if (length < 2 || next > bytes.length) {
      chunks.push(bytes.subarray(index));
      break;
    }
    const metadata = marker >= 0xe1 && marker <= 0xef;
    if (!metadata) {
      chunks.push(bytes.subarray(index, next));
    }
    index = next;
  }
  return Buffer.concat(chunks);
}
