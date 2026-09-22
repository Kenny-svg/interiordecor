export const constraintChips = [
  { id: "no-people", label: "no people", hint: "The still stays unoccupied." },
  { id: "keep-windows", label: "keep my windows", hint: "Glass stays clear. Curtains pull aside." },
  { id: "evening-light", label: "evening light", hint: "Warm late light in the room." },
] as const;

export type ConstraintId = (typeof constraintChips)[number]["id"];

export function isConstraintId(value: string): value is ConstraintId {
  return constraintChips.some((chip) => chip.id === value);
}

export const exampleBriefs = [
  {
    id: "ikoyi-living",
    title: "Ikoyi living room",
    prompt:
      "Living room in Ikoyi, laterite walls, a sofa and lounge toward the window, sheers, evening light. Quiet, not hotel-modern.",
    tags: ["tropical-modern", "collected"] as string[],
    constraints: ["no-people", "evening-light"] as string[],
    spaceId: "living-room",
    paletteId: "laterite",
    paintId: "laterite",
    placementId: "right",
    lightId: "pendant",
    curtainId: "sheer",
    pieces: [
      { pieceId: "rug" as const, x: 50, y: 55 },
      { pieceId: "sofa" as const, x: 50, y: 22 },
      { pieceId: "lounge" as const, x: 78, y: 34 },
      { pieceId: "coffee-table" as const, x: 50, y: 48 },
    ],
  },
  {
    id: "vi-office",
    title: "A private office",
    prompt:
      "Private office on Victoria Island. Charcoal walls, a timber desk, a task chair, a visitor chair, a lantern overhead, blinds. For work, not a lounge.",
    tags: ["corporate-quiet", "quiet-contemporary"] as string[],
    constraints: ["no-people", "keep-windows"] as string[],
    spaceId: "office",
    paletteId: "corporate",
    paintId: "charcoal",
    placementId: "centre",
    lightId: "lantern",
    curtainId: "blinds",
    pieces: [
      { pieceId: "desk" as const, x: 50, y: 38 },
      { pieceId: "swivel" as const, x: 50, y: 52 },
      { pieceId: "visitor" as const, x: 28, y: 50 },
      { pieceId: "credenza" as const, x: 72, y: 20 },
    ],
  },
  {
    id: "lekki-bed",
    title: "A still bedroom",
    prompt:
      "Main bedroom in Lekki, cream walls, a bed, a nightstand, one armchair, lined curtains, morning light from the east. Colour from the weather.",
    tags: ["coastal", "warm-contemporary"] as string[],
    constraints: ["no-people"] as string[],
    spaceId: "bedroom",
    paletteId: "coastal",
    paintId: "cream",
    placementId: "left",
    lightId: "none",
    curtainId: "lined",
    pieces: [
      { pieceId: "bed" as const, x: 50, y: 26 },
      { pieceId: "nightstand" as const, x: 22, y: 24 },
      { pieceId: "armchair" as const, x: 78, y: 40 },
    ],
  },
] as const;

export const refinePrompts = [
  { id: "warmer", label: "warmer" },
  { id: "less-clutter", label: "less clutter" },
  { id: "reading-chair", label: "add a reading chair" },
] as const;

export const WRITE_PLACEHOLDER =
  "Living room in Ikoyi, laterite walls, a lounge chair toward the window, sheers.";

const SAFETY =
  /\b(nude|nsfw|porn|gore|blood|weapon|gun|knife|kill|child|underage|csam)\b/i;

export function isSafetyBlocked(prompt: string): boolean {
  return SAFETY.test(prompt);
}
