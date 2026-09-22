import { labelsForTags } from "@/lib/styles";
import { ProviderError } from "@/lib/providers/types";

export function buildConceptSummary(input: {
  userLanguage: string;
  styleTags: string[];
  hasRoomPhoto: boolean;
}): string {
  const tags = labelsForTags(input.styleTags);
  const trimmed = input.userLanguage.trim().replace(/\s+/g, " ");
  const firstStop = trimmed.search(/[.!?]/);
  const opening =
    firstStop > 24
      ? trimmed.slice(0, firstStop + 1)
      : trimmed.length > 160
        ? `${trimmed.slice(0, 157).trim()}…`
        : trimmed;

  const direction =
    tags.length > 0
      ? ` Direction: ${tags.join(", ").toLowerCase()}.`
      : "";
  const site = input.hasRoomPhoto
    ? " The stills keep the existing architecture and try the decoration on top."
    : " No site photograph was given, so these are mood images, not a measured room.";

  return `${opening}${direction}${site} The studio will treat this as a starting brief, nothing more.`;
}

export async function writeConceptSummary(input: {
  userLanguage: string;
  styleTags: string[];
  hasRoomPhoto: boolean;
}): Promise<string> {
  const provider = process.env.SUMMARY_PROVIDER ?? "mock";
  const key = process.env.OPENAI_API_KEY;

  if (provider !== "openai" || !key) {
    return buildConceptSummary(input);
  }

  const tags = labelsForTags(input.styleTags);
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
        temperature: 0.4,
        max_tokens: 140,
        messages: [
          {
            role: "system",
            content:
              "Write two short sentences for an interior decorator's briefing note. Calm, specific, British English. No hype, no prices, no mention of AI, no claim that this is a final design.",
          },
          {
            role: "user",
            content: JSON.stringify({
              client: input.userLanguage,
              tags,
              hasRoomPhoto: input.hasRoomPhoto,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new ProviderError("Summary model refused the request.", "upstream");
    }

    const data: unknown = await response.json();
    const text = extractChatText(data);
    return text || buildConceptSummary(input);
  } catch {
    return buildConceptSummary(input);
  } finally {
    clearTimeout(timer);
  }
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
