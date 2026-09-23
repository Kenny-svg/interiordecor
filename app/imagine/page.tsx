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
    "A simple illustration of a living room, an office, a suite. Not a photograph, and not a specification — a brief for the studio in Lagos.",
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
      <Eyebrow>Illustration</Eyebrow>
      <h1 className="mt-4 max-w-3xl font-display text-5xl text-ink sm:text-6xl">
        Choose the space. This is an illustration.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">
        A living room, a private office, a reception — drawn simply, so we can
        talk. It is not a photograph of your room, not a specification, and not
        a quote. The studio in Lagos still writes the work.
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
