import { ProviderError } from "@/lib/providers/types";

export async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  ms: number,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new ProviderError("The image studio timed out.", "timeout");
    }
    throw new ProviderError("The image studio could not be reached.", "upstream");
  } finally {
    clearTimeout(timer);
  }
}

export async function fileToDataUri(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const mime = file.type || "image/jpeg";
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

export function viewpointLine(index: number): string {
  const lines = [
    "Viewpoint: from the doorway, full room.",
    "Viewpoint: from a corner, a window in frame.",
    "Viewpoint: closer, the principal wall.",
    "Viewpoint: from near the window, looking back.",
  ];
  return lines[index % lines.length] ?? "Viewpoint: from the doorway, full room.";
}
