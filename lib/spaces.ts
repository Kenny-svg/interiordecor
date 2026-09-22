export const spaceGroups = [
  { id: "home", label: "Home" },
  { id: "work", label: "Office" },
  { id: "place", label: "A public room" },
] as const;

export type SpaceGroupId = (typeof spaceGroups)[number]["id"];

export type RoomShell = {
  panes: 1 | 2 | 3;
  floor: "timber" | "stone" | "concrete";
  door: "none" | "left" | "right";
  depth: "shallow" | "mid" | "deep";
  height: "low" | "mid" | "tall";
  window: "punched" | "ribbon" | "storefront" | "clerestory" | "french";
  feature: "none" | "fireplace" | "alcoves" | "columns" | "beam" | "counter" | "niche";
};

export const MAX_PAINTS = 3;
export const MAX_PIECES = 8;
export const PIECE_SLOTS = [28, 50, 72, 38, 62, 18, 42, 58];
export const PIECE_DRAG = "application/x-hale-piece";

export const spaces = [
  {
    id: "living-room",
    group: "home",
    label: "Living room",
    emptyAlt: "An empty living room with a fireplace and French windows",
    shell: {
      panes: 2,
      floor: "timber",
      door: "none",
      depth: "mid",
      height: "mid",
      window: "french",
      feature: "fireplace",
    } satisfies RoomShell,
  },
  {
    id: "bedroom",
    group: "home",
    label: "Bedroom",
    emptyAlt: "An empty bedroom, smaller, with one window and a door",
    shell: {
      panes: 1,
      floor: "timber",
      door: "left",
      depth: "shallow",
      height: "low",
      window: "punched",
      feature: "niche",
    } satisfies RoomShell,
  },
  {
    id: "dining-room",
    group: "home",
    label: "Dining room",
    emptyAlt: "An empty dining room with tall windows and a ceiling beam",
    shell: {
      panes: 2,
      floor: "stone",
      door: "none",
      depth: "mid",
      height: "tall",
      window: "french",
      feature: "beam",
    } satisfies RoomShell,
  },
  {
    id: "kitchen",
    group: "home",
    label: "Kitchen",
    emptyAlt: "An empty kitchen with a window over a run of counters",
    shell: {
      panes: 1,
      floor: "stone",
      door: "right",
      depth: "shallow",
      height: "mid",
      window: "punched",
      feature: "counter",
    } satisfies RoomShell,
  },
  {
    id: "study",
    group: "home",
    label: "Study",
    emptyAlt: "An empty study with a tall window and alcoves",
    shell: {
      panes: 1,
      floor: "timber",
      door: "left",
      depth: "shallow",
      height: "mid",
      window: "punched",
      feature: "alcoves",
    } satisfies RoomShell,
  },
  {
    id: "office",
    group: "work",
    label: "Private office",
    emptyAlt: "An empty private office with a door and one window",
    shell: {
      panes: 1,
      floor: "timber",
      door: "left",
      depth: "mid",
      height: "mid",
      window: "punched",
      feature: "none",
    } satisfies RoomShell,
  },
  {
    id: "open-office",
    group: "work",
    label: "Open office",
    emptyAlt: "An empty open office with a run of windows and columns",
    shell: {
      panes: 3,
      floor: "concrete",
      door: "none",
      depth: "deep",
      height: "tall",
      window: "ribbon",
      feature: "columns",
    } satisfies RoomShell,
  },
  {
    id: "meeting-room",
    group: "work",
    label: "Meeting room",
    emptyAlt: "An empty meeting room with a glass wall and a door",
    shell: {
      panes: 1,
      floor: "timber",
      door: "left",
      depth: "mid",
      height: "mid",
      window: "storefront",
      feature: "none",
    } satisfies RoomShell,
  },
  {
    id: "reception",
    group: "work",
    label: "Reception",
    emptyAlt: "An empty reception hall, tall, with a stone floor",
    shell: {
      panes: 2,
      floor: "stone",
      door: "right",
      depth: "deep",
      height: "tall",
      window: "punched",
      feature: "niche",
    } satisfies RoomShell,
  },
  {
    id: "retail",
    group: "place",
    label: "Shop or showroom",
    emptyAlt: "An empty shop with a storefront of glass and a concrete floor",
    shell: {
      panes: 3,
      floor: "concrete",
      door: "none",
      depth: "deep",
      height: "tall",
      window: "storefront",
      feature: "columns",
    } satisfies RoomShell,
  },
  {
    id: "hotel-suite",
    group: "place",
    label: "Hotel suite",
    emptyAlt: "An empty hotel suite with two windows and a door",
    shell: {
      panes: 2,
      floor: "timber",
      door: "left",
      depth: "mid",
      height: "mid",
      window: "french",
      feature: "niche",
    } satisfies RoomShell,
  },
  {
    id: "restaurant",
    group: "place",
    label: "Restaurant or café",
    emptyAlt: "An empty dining hall with high windows and columns",
    shell: {
      panes: 3,
      floor: "stone",
      door: "right",
      depth: "mid",
      height: "tall",
      window: "clerestory",
      feature: "columns",
    } satisfies RoomShell,
  },
] as const;

export type SpaceId = (typeof spaces)[number]["id"];
export type Space = (typeof spaces)[number];

export const paints = [
  { id: "chalk", label: "Chalk", hex: "#e8e2d6" },
  { id: "sand", label: "Sand", hex: "#d4c4a8" },
  { id: "laterite", label: "Laterite", hex: "#b56a4a" },
  { id: "indigo", label: "Indigo", hex: "#3d4a6b" },
  { id: "forest", label: "Forest", hex: "#3f4f3a" },
  { id: "charcoal", label: "Charcoal", hex: "#2c2a28" },
  { id: "cream", label: "Cream", hex: "#f3efe6" },
  { id: "clay", label: "Clay", hex: "#8a6a55" },
] as const;

export type PaintId = (typeof paints)[number]["id"];

export const palettes = [
  {
    id: "laterite",
    label: "Laterite",
    note: "Earth walls. The colour of the city after rain.",
    paintIds: ["laterite", "sand", "chalk", "cream"] as readonly PaintId[],
  },
  {
    id: "lagos-chalk",
    label: "Lagos chalk",
    note: "Plaster, linen, a little clay.",
    paintIds: ["chalk", "cream", "sand", "clay"] as readonly PaintId[],
  },
  {
    id: "indigo",
    label: "Indigo",
    note: "Deep blue against pale plaster.",
    paintIds: ["indigo", "chalk", "cream", "charcoal"] as readonly PaintId[],
  },
  {
    id: "forest",
    label: "Forest",
    note: "Green pigment, cream, timber.",
    paintIds: ["forest", "cream", "sand", "charcoal"] as readonly PaintId[],
  },
  {
    id: "coastal",
    label: "Coastal",
    note: "Salt light. Pale walls.",
    paintIds: ["cream", "chalk", "sand", "indigo"] as readonly PaintId[],
  },
  {
    id: "corporate",
    label: "Corporate quiet",
    note: "Charcoal, chalk, a warm clay.",
    paintIds: ["charcoal", "chalk", "cream", "clay"] as readonly PaintId[],
  },
] as const;

export type PaletteId = (typeof palettes)[number]["id"];

export const furniture = [
  { id: "sofa", label: "Sofa", group: "seating", depth: 22, span: 2.2 },
  { id: "lounge", label: "Lounge chair", group: "seating", depth: 28, span: 1.1 },
  { id: "armchair", label: "Armchair", group: "seating", depth: 30, span: 1 },
  { id: "dining-chair", label: "Dining chair", group: "seating", depth: 48, span: 0.7 },
  { id: "swivel", label: "Task chair", group: "seating", depth: 42, span: 0.8 },
  { id: "visitor", label: "Visitor chair", group: "seating", depth: 52, span: 0.85 },
  { id: "bench", label: "Bench", group: "seating", depth: 40, span: 1.6 },
  { id: "banquette", label: "Banquette", group: "seating", depth: 24, span: 2 },
  { id: "stool", label: "Bar stool", group: "seating", depth: 46, span: 0.55 },
  { id: "coffee-table", label: "Coffee table", group: "table", depth: 48, span: 1.4 },
  { id: "side-table", label: "Side table", group: "table", depth: 32, span: 0.55 },
  { id: "dining-table", label: "Dining table", group: "table", depth: 44, span: 2.2 },
  { id: "conference", label: "Conference table", group: "table", depth: 46, span: 2.6 },
  { id: "desk", label: "Desk", group: "table", depth: 38, span: 1.8 },
  { id: "workstation", label: "Workstation", group: "table", depth: 40, span: 1.6 },
  { id: "bed", label: "Bed", group: "sleep", depth: 26, span: 2.4 },
  { id: "nightstand", label: "Nightstand", group: "storage", depth: 24, span: 0.5 },
  { id: "dresser", label: "Chest", group: "storage", depth: 22, span: 1.2 },
  { id: "sideboard", label: "Sideboard", group: "storage", depth: 20, span: 1.8 },
  { id: "credenza", label: "Credenza", group: "storage", depth: 20, span: 1.7 },
  { id: "console", label: "Console", group: "storage", depth: 18, span: 1.4 },
  { id: "bookcase", label: "Bookcase", group: "storage", depth: 16, span: 1 },
  { id: "reception-desk", label: "Reception desk", group: "table", depth: 42, span: 2.4 },
  { id: "plinth", label: "Display plinth", group: "table", depth: 50, span: 0.7 },
  { id: "rug", label: "Rug", group: "textile", depth: 55, span: 2.8 },
] as const;

export type FurnitureId = (typeof furniture)[number]["id"];
export type FurnitureItem = (typeof furniture)[number];

const KITS: Record<SpaceId, readonly FurnitureId[]> = {
  "living-room": ["sofa", "lounge", "armchair", "coffee-table", "side-table", "rug"],
  bedroom: ["bed", "nightstand", "dresser", "bench", "armchair"],
  "dining-room": ["dining-table", "dining-chair", "sideboard", "bench"],
  kitchen: ["stool", "dining-chair", "sideboard", "side-table"],
  study: ["desk", "swivel", "armchair", "bookcase", "side-table"],
  office: ["desk", "swivel", "visitor", "credenza"],
  "open-office": ["workstation", "swivel", "credenza", "bench"],
  "meeting-room": ["conference", "dining-chair", "credenza"],
  reception: ["reception-desk", "sofa", "armchair", "console"],
  retail: ["plinth", "bench", "console", "armchair"],
  "hotel-suite": ["bed", "sofa", "nightstand", "console", "armchair"],
  restaurant: ["dining-table", "dining-chair", "banquette", "stool"],
};

const LEGACY_CHAIR: Record<string, FurnitureId> = {
  lounge: "lounge",
  armchair: "armchair",
  sofa: "sofa",
  dining: "dining-chair",
  swivel: "swivel",
  bench: "bench",
};

export const chairs = furniture.filter((item) => item.group === "seating");
export type ChairId = FurnitureId;

export const placements = [
  { id: "left", label: "Left", x: 22 },
  { id: "centre", label: "Centre", x: 50 },
  { id: "right", label: "Right", x: 78 },
  { id: "conversation", label: "Conversation", x: 38 },
] as const;

export type PlacementId = (typeof placements)[number]["id"];

export const lights = [
  { id: "none", label: "No hanging light" },
  { id: "chandelier", label: "Chandelier" },
  { id: "pendant", label: "Pendant" },
  { id: "lantern", label: "Lantern" },
] as const;

export type LightId = (typeof lights)[number]["id"];

export const curtains = [
  { id: "none", label: "No curtains" },
  { id: "sheer", label: "Sheers" },
  { id: "lined", label: "Lined curtains" },
  { id: "blinds", label: "Blinds" },
] as const;

export type CurtainId = (typeof curtains)[number]["id"];

export type PlacedPiece = {
  key: string;
  pieceId: FurnitureId;
  x: number;
  y: number;
};

export type SpaceDesign = {
  spaceId: SpaceId | null;
  paletteId: PaletteId | null;
  paintIds: PaintId[];
  customHexes: string[];
  pieces: PlacedPiece[];
  lightId: LightId;
  curtainId: CurtainId;
};

export const PLASTER = "#ebe6dc";

export function defaultDesign(): SpaceDesign {
  return {
    spaceId: null,
    paletteId: null,
    paintIds: [],
    customHexes: [],
    pieces: [],
    lightId: "none",
    curtainId: "none",
  };
}

export function isHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function isPaintId(value: string): value is PaintId {
  return paints.some((item) => item.id === value);
}

export function paintHex(id: PaintId): string {
  return paints.find((item) => item.id === id)?.hex ?? PLASTER;
}

export function wallHexes(design: SpaceDesign): string[] {
  const custom = design.customHexes.filter(isHex).slice(0, MAX_PAINTS);
  if (custom.length > 0) {
    return custom;
  }
  return design.paintIds.map(paintHex);
}

export type SpaceDefault = {
  paletteId: PaletteId;
  paintIds: PaintId[];
  customHexes: string[];
  pieces: Omit<PlacedPiece, "key">[];
  lightId: LightId;
  curtainId: CurtainId;
  tags: string[];
  constraints: string[];
};

const DEFAULTS: Record<SpaceId, SpaceDefault> = {
  "living-room": {
    paletteId: "laterite",
    paintIds: ["laterite", "sand"],
    customHexes: [paintHex("laterite"), paintHex("sand")],
    lightId: "chandelier",
    curtainId: "sheer",
    tags: ["tropical-modern"],
    constraints: ["no-people", "evening-light"],
    pieces: [
      { pieceId: "rug", x: 50, y: 55 },
      { pieceId: "sofa", x: 50, y: 22 },
      { pieceId: "lounge", x: 78, y: 34 },
      { pieceId: "coffee-table", x: 50, y: 48 },
      { pieceId: "side-table", x: 24, y: 32 },
    ],
  },
  bedroom: {
    paletteId: "coastal",
    paintIds: ["cream"],
    customHexes: [paintHex("cream")],
    lightId: "pendant",
    curtainId: "lined",
    tags: ["coastal"],
    constraints: ["no-people"],
    pieces: [
      { pieceId: "bed", x: 48, y: 32 },
      { pieceId: "nightstand", x: 22, y: 26 },
      { pieceId: "nightstand", x: 74, y: 26 },
      { pieceId: "armchair", x: 78, y: 52 },
    ],
  },
  "dining-room": {
    paletteId: "lagos-chalk",
    paintIds: ["chalk", "sand"],
    customHexes: [paintHex("chalk"), paintHex("sand")],
    lightId: "chandelier",
    curtainId: "sheer",
    tags: ["collected"],
    constraints: ["no-people", "evening-light"],
    pieces: [
      { pieceId: "dining-table", x: 50, y: 46 },
      { pieceId: "dining-chair", x: 38, y: 58 },
      { pieceId: "dining-chair", x: 62, y: 58 },
      { pieceId: "dining-chair", x: 38, y: 36 },
      { pieceId: "sideboard", x: 50, y: 18 },
    ],
  },
  kitchen: {
    paletteId: "lagos-chalk",
    paintIds: ["chalk", "clay"],
    customHexes: [paintHex("chalk"), paintHex("clay")],
    lightId: "pendant",
    curtainId: "none",
    tags: ["warm-contemporary"],
    constraints: ["no-people", "keep-windows"],
    pieces: [
      { pieceId: "stool", x: 38, y: 48 },
      { pieceId: "stool", x: 50, y: 50 },
      { pieceId: "stool", x: 62, y: 48 },
      { pieceId: "sideboard", x: 72, y: 20 },
    ],
  },
  study: {
    paletteId: "forest",
    paintIds: ["forest", "cream"],
    customHexes: [paintHex("forest"), paintHex("cream")],
    lightId: "pendant",
    curtainId: "lined",
    tags: ["quiet-contemporary"],
    constraints: ["no-people"],
    pieces: [
      { pieceId: "desk", x: 52, y: 40 },
      { pieceId: "swivel", x: 52, y: 56 },
      { pieceId: "armchair", x: 24, y: 44 },
      { pieceId: "bookcase", x: 78, y: 18 },
    ],
  },
  office: {
    paletteId: "corporate",
    paintIds: ["charcoal", "chalk"],
    customHexes: [paintHex("charcoal"), paintHex("chalk")],
    lightId: "lantern",
    curtainId: "blinds",
    tags: ["corporate-quiet"],
    constraints: ["no-people", "keep-windows"],
    pieces: [
      { pieceId: "desk", x: 50, y: 38 },
      { pieceId: "swivel", x: 50, y: 54 },
      { pieceId: "visitor", x: 28, y: 50 },
      { pieceId: "credenza", x: 72, y: 20 },
    ],
  },
  "open-office": {
    paletteId: "corporate",
    paintIds: ["chalk", "charcoal"],
    customHexes: [paintHex("chalk"), paintHex("charcoal")],
    lightId: "pendant",
    curtainId: "none",
    tags: ["corporate-quiet"],
    constraints: ["no-people", "keep-windows"],
    pieces: [
      { pieceId: "workstation", x: 32, y: 42 },
      { pieceId: "swivel", x: 32, y: 56 },
      { pieceId: "workstation", x: 68, y: 42 },
      { pieceId: "swivel", x: 68, y: 56 },
      { pieceId: "credenza", x: 50, y: 18 },
    ],
  },
  "meeting-room": {
    paletteId: "corporate",
    paintIds: ["chalk"],
    customHexes: [paintHex("chalk")],
    lightId: "lantern",
    curtainId: "none",
    tags: ["quiet-contemporary"],
    constraints: ["no-people", "keep-windows"],
    pieces: [
      { pieceId: "conference", x: 50, y: 46 },
      { pieceId: "dining-chair", x: 32, y: 58 },
      { pieceId: "dining-chair", x: 50, y: 62 },
      { pieceId: "dining-chair", x: 68, y: 58 },
      { pieceId: "credenza", x: 50, y: 18 },
    ],
  },
  reception: {
    paletteId: "lagos-chalk",
    paintIds: ["chalk", "laterite"],
    customHexes: [paintHex("chalk"), paintHex("laterite")],
    lightId: "chandelier",
    curtainId: "sheer",
    tags: ["lagos-apartment"],
    constraints: ["no-people"],
    pieces: [
      { pieceId: "reception-desk", x: 50, y: 42 },
      { pieceId: "sofa", x: 22, y: 50 },
      { pieceId: "armchair", x: 78, y: 48 },
      { pieceId: "console", x: 72, y: 18 },
    ],
  },
  retail: {
    paletteId: "indigo",
    paintIds: ["chalk", "indigo"],
    customHexes: [paintHex("chalk"), paintHex("indigo")],
    lightId: "pendant",
    curtainId: "none",
    tags: ["quiet-contemporary"],
    constraints: ["no-people", "keep-windows"],
    pieces: [
      { pieceId: "plinth", x: 32, y: 48 },
      { pieceId: "plinth", x: 52, y: 44 },
      { pieceId: "bench", x: 50, y: 62 },
      { pieceId: "console", x: 74, y: 22 },
    ],
  },
  "hotel-suite": {
    paletteId: "coastal",
    paintIds: ["cream", "sand"],
    customHexes: [paintHex("cream"), paintHex("sand")],
    lightId: "pendant",
    curtainId: "sheer",
    tags: ["warm-contemporary"],
    constraints: ["no-people", "evening-light"],
    pieces: [
      { pieceId: "bed", x: 38, y: 30 },
      { pieceId: "nightstand", x: 18, y: 26 },
      { pieceId: "sofa", x: 72, y: 48 },
      { pieceId: "console", x: 74, y: 18 },
    ],
  },
  restaurant: {
    paletteId: "laterite",
    paintIds: ["laterite", "chalk"],
    customHexes: [paintHex("laterite"), paintHex("chalk")],
    lightId: "chandelier",
    curtainId: "none",
    tags: ["afro-modern"],
    constraints: ["no-people", "evening-light"],
    pieces: [
      { pieceId: "dining-table", x: 32, y: 48 },
      { pieceId: "dining-chair", x: 22, y: 58 },
      { pieceId: "dining-chair", x: 42, y: 58 },
      { pieceId: "banquette", x: 70, y: 28 },
      { pieceId: "stool", x: 78, y: 52 },
    ],
  },
};

export function defaultLook(spaceId: SpaceId): SpaceDefault {
  return DEFAULTS[spaceId];
}

export function dressedPieces(spaceId: SpaceId): PlacedPiece[] {
  return DEFAULTS[spaceId].pieces.map((piece, index) => ({
    ...piece,
    key: `${spaceId}-${piece.pieceId}-${index}`,
  }));
}

export function isPaletteId(value: string): value is PaletteId {
  return palettes.some((item) => item.id === value);
}

export function isFurnitureId(value: string): value is FurnitureId {
  return furniture.some((item) => item.id === value);
}

export function isChairId(value: string): value is FurnitureId {
  return value in LEGACY_CHAIR || isFurnitureId(value);
}

export function getPalette(id: string | null) {
  return palettes.find((item) => item.id === id);
}

export function getFurniture(id: string | null) {
  return furniture.find((item) => item.id === id);
}

export function kitFor(spaceId: SpaceId | null): FurnitureItem[] {
  if (!spaceId) {
    return [];
  }
  return KITS[spaceId].flatMap((id) => {
    const item = getFurniture(id);
    return item ? [item] : [];
  });
}

export function palettePaints(paletteId: PaletteId | null) {
  const palette = getPalette(paletteId);
  if (!palette) {
    return [];
  }
  return palette.paintIds.flatMap((id) => {
    const paint = paints.find((item) => item.id === id);
    return paint ? [paint] : [];
  });
}

export function nextPieceX(used: number[]): number {
  const found = PIECE_SLOTS.find((slot) =>
    used.every((x) => Math.abs(x - slot) > 8),
  );
  return found ?? 50;
}

export function nextPieceSlot(
  used: { x: number; y: number }[],
  pieceId: FurnitureId,
): { x: number; y: number } {
  const item = getFurniture(pieceId);
  const y = item?.depth ?? 40;
  const x = nextPieceX(used.map((slot) => slot.x));
  return { x, y };
}

export function isSpaceId(value: string): value is SpaceId {
  return spaces.some((item) => item.id === value);
}

export function getSpace(id: string | null) {
  return spaces.find((item) => item.id === id);
}

export function spaceIdFromRoom(room: string): SpaceId | null {
  const match = spaces.find(
    (item) => item.label.toLowerCase() === room.trim().toLowerCase(),
  );
  if (match) {
    return match.id;
  }
  if (/sitting|living/i.test(room)) {
    return "living-room";
  }
  if (/office/i.test(room)) {
    return "office";
  }
  if (/hall|reception/i.test(room)) {
    return "reception";
  }
  return null;
}

export function labelOf<T extends { id: string; label: string }>(
  list: readonly T[],
  id: string | null,
): string {
  return list.find((item) => item.id === id)?.label ?? "";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function resolvePieceId(value: unknown): FurnitureId | null {
  if (typeof value !== "string") {
    return null;
  }
  if (isFurnitureId(value)) {
    return value;
  }
  return LEGACY_CHAIR[value] ?? null;
}

function asPieces(raw: unknown, fallbackChair: string | null, fallbackX: number): PlacedPiece[] {
  if (Array.isArray(raw)) {
    return raw.flatMap((item, index) => {
      if (!item || typeof item !== "object") {
        return [];
      }
      const record = item as {
        key?: unknown;
        pieceId?: unknown;
        chairId?: unknown;
        x?: unknown;
        y?: unknown;
      };
      const pieceId = resolvePieceId(record.pieceId) ?? resolvePieceId(record.chairId);
      if (!pieceId) {
        return [];
      }
      const kind = getFurniture(pieceId);
      const x =
        typeof record.x === "number" && Number.isFinite(record.x)
          ? clamp(record.x, 12, 88)
          : 50;
      const y =
        typeof record.y === "number" && Number.isFinite(record.y)
          ? clamp(record.y, 8, 92)
          : (kind?.depth ?? 40);
      return [
        {
          key:
            typeof record.key === "string" && record.key.length > 0
              ? record.key
              : `piece-${index}`,
          pieceId,
          x,
          y,
        },
      ];
    });
  }
  const legacy = resolvePieceId(fallbackChair);
  if (legacy) {
    return [{ key: "piece-legacy", pieceId: legacy, x: fallbackX, y: getFurniture(legacy)?.depth ?? 40 }];
  }
  return [];
}

export function parseDesign(fields: {
  spaceId?: string | null;
  paletteId?: string | null;
  paintId?: string | null;
  paintIds?: unknown;
  customHexes?: unknown;
  chairId?: string | null;
  pieces?: unknown;
  chairX?: number | null;
  lightId?: string | null;
  curtainId?: string | null;
}): SpaceDesign {
  const light = lights.find((item) => item.id === fields.lightId);
  const curtain = curtains.find((item) => item.id === fields.curtainId);
  const chairX =
    typeof fields.chairX === "number" && Number.isFinite(fields.chairX)
      ? clamp(fields.chairX, 12, 88)
      : 50;
  const fromArray = Array.isArray(fields.paintIds)
    ? fields.paintIds.filter((id): id is string => typeof id === "string").filter(isPaintId)
    : [];
  const paintIds =
    fromArray.length > 0
      ? fromArray.slice(0, MAX_PAINTS)
      : fields.paintId && isPaintId(fields.paintId)
        ? [fields.paintId]
        : [];
  const palette =
    fields.paletteId && isPaletteId(fields.paletteId)
      ? fields.paletteId
        : paintIds[0]
          ? (palettes.find((item) => item.paintIds.includes(paintIds[0]!))?.id ?? null)
        : null;
  const allowed = palette ? new Set(palettePaints(palette).map((item) => item.id)) : null;
  const walls = allowed ? paintIds.filter((id) => allowed.has(id)) : paintIds;
  const kit = new Set(kitFor(fields.spaceId && isSpaceId(fields.spaceId) ? fields.spaceId : null).map((item) => item.id));
  const pieces = asPieces(fields.pieces, fields.chairId ?? null, chairX)
    .filter((piece) => kit.size === 0 || kit.has(piece.pieceId))
    .slice(0, MAX_PIECES);
  const customHexes = Array.isArray(fields.customHexes)
    ? fields.customHexes.filter((item): item is string => typeof item === "string" && isHex(item)).slice(0, MAX_PAINTS)
    : [];
  return {
    spaceId: fields.spaceId && isSpaceId(fields.spaceId) ? fields.spaceId : null,
    paletteId: palette,
    paintIds: walls,
    customHexes,
    pieces,
    lightId: (light?.id ?? "none") as LightId,
    curtainId: (curtain?.id ?? "none") as CurtainId,
  };
}

export function describeDesign(design: SpaceDesign): string {
  const space = getSpace(design.spaceId);
  if (!space) {
    return "";
  }
  const palette = getPalette(design.paletteId);
  const walls = wallHexes(design);
  const counts = new Map<string, number>();
  for (const piece of design.pieces) {
    counts.set(piece.pieceId, (counts.get(piece.pieceId) ?? 0) + 1);
  }
  const furnishing = [...counts.entries()]
    .map(([id, count]) => {
      const name = labelOf(furniture, id).toLowerCase();
      return `${count} ${name}${count > 1 && !name.endsWith("s") ? "s" : ""}`;
    })
    .join(", ");
  const light = labelOf(lights, design.lightId);
  const curtain = labelOf(curtains, design.curtainId);
  const parts = [
    `A dressed ${space.label.toLowerCase()} in Nigeria.`,
    palette ? `Palette: ${palette.label}.` : "",
    walls.length > 0 ? `Walls ${walls.join(" and ")}.` : "Walls left plaster.",
    furnishing ? `Furniture: ${furnishing}.` : "No furniture placed yet.",
    design.lightId !== "none" ? `${light} overhead.` : "",
    design.curtainId !== "none" ? `${curtain} at the window.` : "",
    "Photoreal, quiet, meant to be used. No people.",
  ];
  return parts.filter(Boolean).join(" ");
}
