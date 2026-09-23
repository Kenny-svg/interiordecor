import { briefHasPhoto, briefLanguage, type UserBrief } from "@/lib/brief";
import { constraintChips } from "@/lib/imagine/copy";
import { labelsForTags } from "@/lib/styles";

const BLOCK =
  /\b(nude|nsfw|porn|gore|blood|weapon|gun|knife|kill|child|underage|csam)\b/i;

const CELEBRITY =
  /\b(celebrity|kardashian|beyonc[eé]|architectural digest cover|famous person'?s home)\b/i;

const COPY_DESIGNER =
  /\b(copy|clone|exact(?:ly)?|replica)\b.{0,40}\b(designer|wearstler|yovanovitch|uniacke|vervoordt|mahdavi)\b/i;

const BRANDS =
  /\b(restoration hardware|\brh\b|ikea|west elm|cb2|herman miller|vitra|knoll|lulu and georgia|pottery barn)\b/gi;

export type BuiltStudioPrompt =
  | { ok: true; prompt: string; direction: string }
  | { ok: false; reason: string };

export function buildStudioPrompt(brief: UserBrief): BuiltStudioPrompt {
  const language = briefLanguage(brief);
  if (language.length < 12) {
    return {
      ok: false,
      reason: "A little more about the room is needed — the light, the materials, how it is used.",
    };
  }

  if (BLOCK.test(language)) {
    return {
      ok: false,
      reason:
        "We only make stills of private rooms. Describe the space, not a person, and nothing violent.",
    };
  }

  const direction = toPhotographyDirection(language);
  const tags = labelsForTags(brief.styleTags);
  const constraints = brief.constraints.flatMap((id) => {
    const chip = constraintChips.find((item) => item.id === id);
    return chip ? [chip.label] : [];
  });

  const architecture = briefHasPhoto(brief)
    ? [
        "A photograph of the existing room is attached.",
        "Use image-conditioned generation (img2img).",
        "Keep the architecture, camera angle, and window placement of the attached photograph exactly.",
        "Do not invent openings, move walls, or change the plan.",
        "Change only surfaces, furniture, lighting, and textiles.",
      ]
    : [
        "No site photograph is provided.",
        "This is a mood / concept interior, not a survey.",
        "Do not invent a floor plan as fact.",
        "Compose a photoreal mood image of a complete interior — a home, office, or public room. Invented, but plausible.",
        "It should read as an editorial photograph of a finished room, not a collage or a render farm.",
      ];

  const prompt = [
    "You are a camera for Hale Studio, a Lagos decoration practice working across Nigeria.",
    "A human decorator will specify and make the work. You produce concept stills only.",
    "Photoreal interior photograph, eye-level or slightly above, as if shot on a large-format camera.",
    "Homes, offices, and public rooms. Natural materials: plaster, linen, timber, stone, laterite. Natural light. Quiet, collected, nothing theatrical.",
    "No people, no animals, no watermark, no text, no logos, no celebrity homes, no branded furniture names.",
    "No prices, no products, no SKUs, no retail styling, no moodboards.",
    "Do not present the image as a final design, a quote, or a specification.",
    "Colour: muted and pigmented. No HDR, no neon, no cyberpunk, no sci-fi, no Unreal Engine look.",
    ...architecture,
    tags.length > 0 ? `Taste direction: ${tags.join(", ")}.` : "",
    constraints.length > 0 ? `Client constraints: ${constraints.join(", ")}.` : "",
    `Photography direction, rewritten from the client note: ${direction}`,
    "Single frame, roughly 3:2.",
  ]
    .filter(Boolean)
    .join(" ");

  return { ok: true, prompt, direction };
}

export function isUnsafeBrief(text: string): boolean {
  return BLOCK.test(text);
}

function toPhotographyDirection(text: string): string {
  let direction = text.replace(/\s+/g, " ").trim();
  direction = direction.replace(/https?:\/\/\S+/gi, "");
  direction = direction.replace(/\b(i want|i'd like|we want|make me|please make)\b/gi, "a still of");
  direction = direction.replace(BRANDS, "unbranded furniture");
  direction = direction.replace(COPY_DESIGNER, "an original room in a quiet collected spirit");
  direction = direction.replace(CELEBRITY, "a private interior, not a celebrity home");
  if (!/^photograph|^a still|^photoreal/i.test(direction)) {
    direction = `Photograph an interior: ${direction}`;
  }
  direction = direction.replace(/\bexact(?:ly)? (?:like|copy of)\b/gi, "in the spirit of");

  return direction.replace(/\s+/g, " ").trim();
}

export const DISCLOSURE =
  "An illustration of a space — not a photograph, not a specification, and not a quote." as const;
