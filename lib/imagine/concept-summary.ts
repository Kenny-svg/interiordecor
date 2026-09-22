import { labelsForTags } from "@/lib/styles";
import { ProviderError } from "@/lib/providers/types";

export type ConceptBullets = {
  palette: string;
  materials: string;
  mood: string;
};

export function templateConceptBullets(input: {
  brief: string;
  tags: string[];
  constraints: string[];
  hasPhoto: boolean;
}): ConceptBullets {
  const labels = labelsForTags(input.tags);
  const brief = input.brief.toLowerCase();

  return {
    palette: paletteFrom(labels, brief),
    materials: materialsFrom(labels, brief, input.hasPhoto),
    mood: moodFrom(labels, brief, input.constraints),
  };
}

export async function writeConceptBullets(input: {
  brief: string;
  tags: string[];
  constraints: string[];
  hasPhoto: boolean;
}): Promise<ConceptBullets> {
  const fallback = templateConceptBullets(input);
  const provider = process.env.SUMMARY_PROVIDER ?? "mock";
  const key = process.env.OPENAI_API_KEY;
  if (provider !== "openai" || !key) {
    return fallback;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 160,
        messages: [
          {
            role: "system",
            content:
              "Return JSON only: {\"palette\":\"...\",\"materials\":\"...\",\"mood\":\"...\"}. Each value is one calm sentence for an interior decorator. British English. No hype, no prices, no AI.",
          },
          {
            role: "user",
            content: JSON.stringify({
              brief: input.brief,
              tags: labelsForTags(input.tags),
              constraints: input.constraints,
              hasPhoto: input.hasPhoto,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new ProviderError("Summary model refused the request.", "upstream");
    }

    const data: unknown = await response.json();
    const parsed = parseBullets(extractChatText(data));
    return parsed ?? fallback;
  } catch {
    return fallback;
  } finally {
    clearTimeout(timer);
  }
}

export function stillAlt(input: {
  brief: string;
  tags: string[];
  index: number;
  refine?: string;
}): string {
  const labels = labelsForTags(input.tags);
  const taste = labels.length > 0 ? labels.join(", ").toLowerCase() : "";
  const refine = input.refine ? ` Refined: ${input.refine}.` : "";
  return `Concept ${input.index + 1}${taste ? `, ${taste}` : ""}.${refine}`.trim();
}

function paletteFrom(labels: string[], brief: string): string {
  if (labels.some((item) => /limewash/i.test(item)) || /plaster|putty|chalk/.test(brief)) {
    return "Plaster, putty, and a little chalk — colour from the walls, not from paint charts.";
  }
  if (labels.some((item) => /coastal/i.test(item)) || /sea|east|weather/.test(brief)) {
    return "Washed blues and sand, as if the weather chose the colour.";
  }
  if (labels.some((item) => /japandi|warm minimal/i.test(item))) {
    return "Ash, ink, and paper-white. Quiet pigment, no contrast for its own sake.";
  }
  if (labels.some((item) => /english country|georgian/i.test(item))) {
    return "Muted earth and faded green, the sort of colour that has already lived here.";
  }
  return "A muted, pigmented range. Nothing that needs a name from a tin.";
}

function materialsFrom(labels: string[], brief: string, hasPhoto: boolean): string {
  const found: string[] = [];
  if (/oak|timber|wood/.test(brief)) {
    found.push("oak");
  }
  if (/linen/.test(brief)) {
    found.push("linen");
  }
  if (/stone/.test(brief)) {
    found.push("stone");
  }
  if (/plaster/.test(brief) || labels.some((item) => /limewash/i.test(item))) {
    found.push("plaster");
  }
  if (found.length === 0) {
    found.push("timber", "linen", "plaster");
  }
  const list = found.join(", ");
  const architecture = hasPhoto
    ? " The existing architecture stays; only the finishes change."
    : "";
  return `${list.charAt(0).toUpperCase()}${list.slice(1)}, used plainly.${architecture}`;
}

function moodFrom(labels: string[], brief: string, constraints: string[]): string {
  if (constraints.includes("evening-light") || /evening|late/.test(brief)) {
    return "Evening light, still, meant to be sat in rather than photographed.";
  }
  if (/quiet|not hotel/.test(brief) || labels.some((item) => /collected|quiet/i.test(item))) {
    return "Quiet and collected. A room that does not perform.";
  }
  if (labels.some((item) => /coastal/i.test(item))) {
    return "Open, a little weathered, and unhurried.";
  }
  return "Calm, domestic, and finished enough to live in tomorrow.";
}

function extractChatText(data: unknown): string {
  if (
    typeof data !== "object" ||
    data === null ||
    !("choices" in data) ||
    !Array.isArray(data.choices)
  ) {
    return "";
  }
  const first = data.choices[0];
  if (
    typeof first !== "object" ||
    first === null ||
    !("message" in first) ||
    typeof first.message !== "object" ||
    first.message === null ||
    !("content" in first.message) ||
    typeof first.message.content !== "string"
  ) {
    return "";
  }
  return first.message.content.trim();
}

function parseBullets(raw: string): ConceptBullets | null {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw.slice(start, end + 1));
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "palette" in parsed &&
      "materials" in parsed &&
      "mood" in parsed &&
      typeof parsed.palette === "string" &&
      typeof parsed.materials === "string" &&
      typeof parsed.mood === "string"
    ) {
      return {
        palette: parsed.palette.trim(),
        materials: parsed.materials.trim(),
        mood: parsed.mood.trim(),
      };
    }
  } catch {
    return null;
  }
  return null;
}
