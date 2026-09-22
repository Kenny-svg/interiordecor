import type { Metadata } from "next";
import { ConsultBriefStrip } from "@/components/consult/ConsultBriefStrip";
import { ConsultForm } from "@/components/consult/ConsultForm";
import { Container, Eyebrow } from "@/components/ui";
import { getPublicBrief } from "@/lib/imagine/handoff";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Consult",
  description: "Write to the studio. We reply within two working days.",
};

type Props = {
  searchParams: Promise<{ from?: string; kind?: string; resume?: string }>;
};

export default async function ConsultPage({ searchParams }: Props) {
  const params = await searchParams;
  const kind = params.kind === "pack" ? "pack" : "consult";
  const brief = params.from ? await getPublicBrief(params.from) : null;

  return (
    <Container className="py-12 sm:py-16">
      <Eyebrow>Consult</Eyebrow>
      <h1 className="mt-4 max-w-2xl font-display text-5xl text-ink sm:text-6xl">
        {kind === "pack" ? "A small pack of six concepts." : "Write to the studio."}
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">
        {kind === "pack"
          ? "Tell us about the rooms. We will confirm a pack by letter — this is not a checkout."
          : `Imagine is optional. A photograph helps. We write back within ${site.reply}.`}
      </p>
      <div className="mt-12">
        {brief ? <ConsultBriefStrip brief={brief} /> : null}
        <ConsultForm
          kind={kind}
          imagineSessionId={brief?.sessionId ?? params.from ?? null}
          briefId={brief?.id ?? null}
          resumeToken={params.resume ?? null}
          initialMessage={brief ? noteFromBrief(brief.prompt, brief.transcript, brief.summary) : ""}
        />
      </div>
    </Container>
  );
}

function noteFromBrief(prompt: string, transcript: string, summary: string): string {
  return [prompt.trim() || transcript.trim(), summary.trim()].filter(Boolean).join("\n\n");
}
