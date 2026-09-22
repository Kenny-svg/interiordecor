import { ProviderError } from "@/lib/providers/types";

export function generateFailMessage(error: unknown): string {
  if (error instanceof ProviderError) {
    if (error.code === "timeout") {
      return "The stills took too long. Try again in a moment.";
    }
    if (error.code === "unsupported") {
      return "That photograph couldn’t be used. Try a JPEG or PNG, or generate without it.";
    }
  }
  return "The studio couldn’t compose stills just now. Try again, or send the brief as written.";
}

export function transcribeFailMessage(): string {
  return "The transcript could not be made. Edit the note, or paste it.";
}
