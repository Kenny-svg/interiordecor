import { pickMockStills } from "@/lib/mock-stills";
import { buildStudioPrompt } from "@/lib/prompt";

export type MockConcept = {
  id: string;
  url: string;
  alt: string;
  status: "ready" | "failed" | "blocked";
};

export type MockGenerateInput = {
  prompt: string;
  tags: string[];
  constraints: string[];
  hasRoomPhoto: boolean;
  salt?: string;
};

export type MockGenerateResult = {
  images: MockConcept[];
  studioPrompt: string;
};

const MOCK_MS = 1800;

export function mockDelay(): number {
  return MOCK_MS;
}

export async function mockGenerateConcepts(
  input: MockGenerateInput,
): Promise<MockGenerateResult> {
  await wait(MOCK_MS);
  const stills = pickMockStills({
    prompt: `${input.prompt}:${input.salt ?? ""}:${input.constraints.join(",")}`,
    styleTags: expandTags(input.tags),
    count: 4,
  });

  return {
    studioPrompt: studioPromptPreview(input),
    images: stills.map((still, index) => ({
      id: `${Date.now().toString(36)}-${index}`,
      url: still.url,
      alt: still.alt,
      status: "ready" as const,
    })),
  };
}

export async function mockRefineStill(
  input: MockGenerateInput & { currentUrl: string },
): Promise<MockConcept> {
  await wait(1200);
  const stills = pickMockStills({
    prompt: `${input.prompt}:${input.salt ?? "refine"}`,
    styleTags: expandTags(input.tags),
    count: 4,
  });
  const next = stills.find((still) => still.url !== input.currentUrl) ?? stills[0];
  if (!next) {
    throw new Error("No still returned.");
  }
  return {
    id: `${Date.now().toString(36)}-r`,
    url: next.url,
    alt: next.alt,
    status: "ready",
  };
}

function expandTags(tags: string[]): string[] {
  return tags.flatMap((tag) => {
    if (tag === "collected-modern") {
      return ["collected", "quiet-contemporary"];
    }
    if (tag === "japandi") {
      return ["warm-contemporary", "quiet-contemporary"];
    }
    return [tag];
  });
}

function studioPromptPreview(input: MockGenerateInput): string {
  const built = buildStudioPrompt({
    rawText: input.prompt,
    transcript: "",
    photoUrl: input.hasRoomPhoto ? "attached" : undefined,
    styleTags: input.tags,
    constraints: input.constraints,
    source: "text",
  });
  const base = built.ok ? built.prompt : built.reason;
  return [base, "Four stills, four viewpoints. Mock studio — no live model."]
    .filter(Boolean)
    .join(" ");
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
