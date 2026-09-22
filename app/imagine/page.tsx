import type { Metadata } from "next";
import { headers } from "next/headers";
import { ImagineStudio } from "@/components/imagine/ImagineStudio";
import { RestoreBrief } from "@/components/imagine/RestoreBrief";
import { Container, Eyebrow } from "@/components/ui";
import { getBriefByMagicHash } from "@/lib/imagine/handoff";
import { hashToken } from "@/lib/magic";
import { clientIp, getImagineQuota } from "@/lib/imagine/quota";
import { getProject } from "@/lib/projects";
import { isImageDemoMode } from "@/lib/providers/image";
import { isSttDemoMode } from "@/lib/providers/stt";
import { getSessionId } from "@/lib/session";
import { spaceIdFromRoom } from "@/lib/spaces";
import { isStyleTagId } from "@/lib/styles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Imagine a space",
  description:
    "Choose a living room, an office, a suite. Pick a palette, place the furniture that belongs there, light, and dress it. Stills come back as a brief — not a specification.",
};

type Props = {
  searchParams: Promise<{
    tags?: string | string[];
    from?: string | string[];
    resume?: string | string[];
  }>;
};

export default async function ImaginePage({ searchParams }: Props) {
  const params = await searchParams;
  const initialTags = parseTags(params.tags);
  const fromSlug = Array.isArray(params.from) ? params.from[0] : params.from;
  const fromProject = fromSlug ? getProject(fromSlug) : undefined;
  const resumeRaw = Array.isArray(params.resume) ? params.resume[0] : params.resume;
  const resumeBrief = resumeRaw ? await getBriefByMagicHash(hashToken(resumeRaw)) : null;
  const demoMode = isImageDemoMode();
  const sessionId = await getSessionId();
  const quota = await getImagineQuota(sessionId, clientIp(await headers()));

  return (
    <Container className="pt-12 pb-16 sm:pt-16">
      <Eyebrow>Imagine</Eyebrow>
      <h1 className="mt-4 max-w-3xl font-display text-5xl text-ink sm:text-6xl">
        Choose the space. A palette, the furniture that belongs, then light.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">
        A living room, a private office, a reception — any place that needs a
        professional finish. What you make on the canvas becomes a brief for the
        studio in Lagos. Not a specification, and not a quote.
      </p>
      {resumeBrief ? (
        <div className="mt-10">
          <RestoreBrief brief={resumeBrief} />
        </div>
      ) : null}
      <div className="mt-12 border-t border-line sm:mt-16">
        <ImagineStudio
          initialTags={initialTags}
          initialPrompt={fromProject?.brief}
          initialSpace={fromProject ? spaceIdFromRoom(fromProject.room) : null}
          lookFrom={fromProject?.title}
          demoMode={demoMode}
          sttLive={!isSttDemoMode()}
          initialQuota={quota}
        />
      </div>
    </Container>
  );
}

function parseTags(raw: string | string[] | undefined): string[] {
  const value = Array.isArray(raw) ? raw.join(",") : raw;
  if (!value) {
    return [];
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(isStyleTagId)
    .slice(0, 3);
}
