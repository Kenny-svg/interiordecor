export type BriefSource = "voice" | "text" | "photo";

export type UserBrief = {
  rawText: string;
  transcript: string;
  photoUrl?: string;
  styleTags: string[];
  constraints: string[];
  source: BriefSource;
};

export function briefLanguage(brief: UserBrief): string {
  const spoken = brief.transcript.trim();
  const written = brief.rawText.trim();
  if (brief.source === "voice") {
    return preferReady(spoken, written);
  }
  return preferReady(written, spoken);
}

function preferReady(primary: string, secondary: string): string {
  if (primary.length >= 12) {
    return primary;
  }
  if (secondary.length >= 12) {
    return secondary;
  }
  return primary || secondary;
}

export function briefHasPhoto(brief: UserBrief): boolean {
  return Boolean(brief.photoUrl && brief.photoUrl.length > 0);
}
