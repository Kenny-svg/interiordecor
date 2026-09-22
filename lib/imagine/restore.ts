import type { PublicBrief } from "@/lib/imagine/brief-types";
import { emptySnapshot, type ImagineSnapshot } from "@/lib/imagine/session-store";

export function snapshotFromBrief(
  brief: PublicBrief,
  existing?: ImagineSnapshot | null,
): ImagineSnapshot {
  const sessionId = existing?.sessionId || brief.sessionId;
  return {
    ...emptySnapshot(),
    ...existing,
    sessionId,
    used: existing?.used ?? 0,
    prompt: brief.prompt,
    transcript: brief.transcript,
    tags: brief.tags,
    constraints: existing?.constraints ?? [],
    photoId: brief.photoUrl ? (existing?.photoId ?? "photo") : null,
    photoName: existing?.photoName ?? null,
    studioPrompt: brief.studioPrompt,
    transcriptWords: existing?.transcriptWords ?? [],
    outputs: brief.images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      status: "ready",
      favorite: image.favorite,
      selected: image.selected,
      history: [
        {
          id: image.id,
          url: image.url,
          alt: image.alt,
          label: "Original",
        },
      ],
      activeHistoryId: image.id,
      summary: image.summary,
    })),
  };
}
