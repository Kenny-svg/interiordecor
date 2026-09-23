import { isStyleTagId } from "@/lib/styles";

const KEY = "hale_imagine_session";
const LIMIT = 3;

export type ConceptVersion = {
  id: string;
  url: string;
  alt: string;
  label: string;
};

export type ConceptSummary = {
  palette: string;
  materials: string;
  mood: string;
};

export type TranscriptWord = {
  text: string;
  confidence: number | null;
};

export type StoredConcept = {
  id: string;
  url: string;
  alt: string;
  status: "ready" | "failed" | "blocked";
  favorite: boolean;
  selected: boolean;
  history: ConceptVersion[];
  activeHistoryId: string;
  summary: ConceptSummary;
};

export type ImagineSnapshot = {
  sessionId: string;
  used: number;
  prompt: string;
  transcript: string;
  tags: string[];
  constraints: string[];
  photoId: string | null;
  photoName: string | null;
  studioPrompt: string;
  outputs: StoredConcept[];
  transcriptWords: TranscriptWord[];
  spaceId: string | null;
  paletteId: string | null;
  paintId: string | null;
  paintIds: string[];
  customHexes: string[];
  chairId: string | null;
  pieces: { key: string; pieceId: string; chairId?: string; x: number; y: number; size?: number }[];
  placementId: string;
  chairX: number;
  lightId: string;
  curtainId: string;
};

const emptySummary: ConceptSummary = {
  palette: "",
  materials: "",
  mood: "",
};

const listeners = new Set<() => void>();
let memory: ImagineSnapshot | null = null;

export function createSessionId(): string {
  return crypto.randomUUID();
}

export function creditLimit(): number {
  return LIMIT;
}

export function emptySnapshot(): ImagineSnapshot {
  return {
    sessionId: createSessionId(),
    used: 0,
    prompt: "",
    transcript: "",
    tags: [],
    constraints: [],
    photoId: null,
    photoName: null,
    studioPrompt: "",
    outputs: [],
    transcriptWords: [],
    spaceId: null,
    paletteId: null,
    paintId: null,
    paintIds: [],
    customHexes: [],
    chairId: null,
    pieces: [],
    placementId: "centre",
    chairX: 50,
    lightId: "none",
    curtainId: "none",
  };
}

export function subscribeImagine(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getClientSnapshot(): ImagineSnapshot | null {
  return memory;
}

export function getServerSnapshot(): ImagineSnapshot | null {
  return null;
}

export function hydrateImagine(): void {
  if (memory) {
    return;
  }
  memory = loadSnapshot() ?? emptySnapshot();
  listeners.forEach((listener) => listener());
}

export function patchSnapshot(partial: Partial<ImagineSnapshot>): ImagineSnapshot {
  const base = memory ?? loadSnapshot() ?? emptySnapshot();
  const next = { ...base, ...partial };
  memory = next;
  saveSnapshot(next);
  listeners.forEach((listener) => listener());
  return next;
}

export function loadSnapshot(): ImagineSnapshot | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isSnapshot(parsed)) {
      return null;
    }
    return {
      ...emptySnapshot(),
      ...parsed,
      tags: (parsed.tags ?? []).filter((tag) => isStyleTagId(tag)),
      transcriptWords: parsed.transcriptWords ?? [],
      outputs: parsed.outputs.map(normalizeConcept),
      spaceId: parsed.spaceId ?? null,
      paletteId: parsed.paletteId ?? null,
      paintId: parsed.paintId ?? null,
      paintIds: Array.isArray(parsed.paintIds) ? parsed.paintIds : [],
      customHexes: Array.isArray(parsed.customHexes) ? parsed.customHexes : [],
      chairId: parsed.chairId ?? null,
      pieces: Array.isArray(parsed.pieces) ? parsed.pieces : [],
      placementId: parsed.placementId ?? "centre",
      chairX: typeof parsed.chairX === "number" ? parsed.chairX : 50,
      lightId: parsed.lightId ?? "none",
      curtainId: parsed.curtainId ?? "none",
    };
  } catch {
    return null;
  }
}

export function saveSnapshot(snapshot: ImagineSnapshot): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore quota and server renders.
  }
}

export function activeVersion(concept: StoredConcept): ConceptVersion {
  return (
    concept.history.find((item) => item.id === concept.activeHistoryId) ??
    concept.history[0] ?? {
      id: concept.id,
      url: concept.url,
      alt: concept.alt,
      label: "Original",
    }
  );
}

export function studioBriefFrom(snapshot: ImagineSnapshot): string {
  const intro = [
    snapshot.spaceId ? `Space: ${snapshot.spaceId.replace(/-/g, " ")}.` : "",
    snapshot.paletteId ? `Palette: ${snapshot.paletteId.replace(/-/g, " ")}.` : "",
    snapshot.paintIds?.length
      ? `Walls: ${snapshot.paintIds.join(", ")}.`
      : snapshot.paintId
        ? `Walls: ${snapshot.paintId}.`
        : "",
    snapshot.pieces?.length
      ? `Furniture: ${snapshot.pieces.map((piece) => piece.pieceId ?? piece.chairId).join(", ")}.`
      : snapshot.chairId
        ? `Furniture: ${snapshot.chairId}.`
        : "",
    snapshot.lightId && snapshot.lightId !== "none"
      ? `Light: ${snapshot.lightId}.`
      : "",
    snapshot.curtainId && snapshot.curtainId !== "none"
      ? `Window: ${snapshot.curtainId}.`
      : "",
    snapshot.prompt.trim() || snapshot.transcript.trim(),
  ]
    .filter(Boolean)
    .join(" ");
  const cards = snapshot.outputs.filter((item) => item.selected || item.favorite);
  const source = cards.length > 0 ? cards : snapshot.outputs;
  if (source.length === 0) {
    return intro;
  }
  const body = source
    .map((item, index) => {
      const summary = item.summary;
      return [
        `Concept ${index + 1}.`,
        summary.palette ? `Palette: ${summary.palette}` : "",
        summary.materials ? `Materials: ${summary.materials}` : "",
        summary.mood ? `Mood: ${summary.mood}` : "",
      ]
        .filter(Boolean)
        .join(" ");
    })
    .join("\n\n");
  return [intro, body].filter(Boolean).join("\n\n");
}

function normalizeConcept(value: StoredConcept): StoredConcept {
  const history =
    value.history && value.history.length > 0
      ? value.history
      : [
          {
            id: value.id,
            url: value.url,
            alt: value.alt,
            label: "Original",
          },
        ];
  return {
    ...value,
    history,
    activeHistoryId: value.activeHistoryId ?? history[0]?.id ?? value.id,
    summary: value.summary ?? emptySummary,
  };
}

function isSnapshot(value: unknown): value is ImagineSnapshot {
  return (
    typeof value === "object" &&
    value !== null &&
    "sessionId" in value &&
    typeof value.sessionId === "string" &&
    "used" in value &&
    typeof value.used === "number" &&
    "outputs" in value &&
    Array.isArray(value.outputs)
  );
}
