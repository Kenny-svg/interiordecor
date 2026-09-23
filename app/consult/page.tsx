import type { Metadata } from "next";
import Image from "next/image";
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
          : `A photograph helps. We write back within ${site.reply}.`}
      </p>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-16">
        <figure className="max-w-[22rem]">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
            Principal
          </p>
          <div className="relative mt-4 aspect-[4/5] overflow-hidden border border-line bg-paper-2">
            <Image
              src={site.principalPortrait.src}
              alt={site.principalPortrait.alt}
              fill
              sizes="(min-width: 1024px) 22rem, 100vw"
              className="object-cover object-[center_20%]"
              priority
            />
          </div>
          <figcaption className="mt-5">
            <p className="font-display text-2xl text-ink">{site.principal}</p>
            <p className="mt-1 text-sm leading-6 text-muted">
              Principal, {site.legalName}. Lagos.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-ink-soft">
              Letters are read here. If we can help, we will suggest a time. If
              we cannot, we will say so.
            </p>
          </figcaption>
        </figure>
        <div>
          {brief ? <ConsultBriefStrip brief={brief} /> : null}
          <ConsultForm
            kind={kind}
            imagineSessionId={brief?.sessionId ?? params.from ?? null}
            briefId={brief?.id ?? null}
            resumeToken={params.resume ?? null}
            initialMessage={brief ? noteFromBrief(brief.prompt, brief.transcript, brief.summary) : ""}
          />
        </div>
      </div>
    </Container>
  );
}

function noteFromBrief(prompt: string, transcript: string, summary: string): string {
  return [prompt.trim() || transcript.trim(), summary.trim()].filter(Boolean).join("\n\n");
}
