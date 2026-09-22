import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { prisma } from "@/lib/db";
import { toPublicGeneration } from "@/lib/generations";
import { DISCLOSURE } from "@/lib/prompt";
import { getSessionId } from "@/lib/session";
import type { PublicImage } from "@/lib/types";

export const metadata: Metadata = {
  title: "Kept concepts",
  description: "Stills you asked the studio to keep.",
  robots: { index: false, follow: false },
};

export default async function FavoritesPage() {
  const sessionId = await getSessionId();
  const rows = sessionId
    ? await prisma.favorite.findMany({
        where: { sessionId },
        include: { generation: true },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const items = rows
    .map((row) => {
      const generation = toPublicGeneration(row.generation);
      const image = generation.images.find((item) => item.id === row.imageId);
      if (!image) {
        return null;
      }
      return { favoriteId: row.id, generation, image };
    })
    .filter(
      (item): item is { favoriteId: string; generation: ReturnType<typeof toPublicGeneration>; image: PublicImage } =>
        item !== null,
    );

  return (
    <Container className="py-12 sm:py-16">
      <Eyebrow>Kept concepts</Eyebrow>
      <h1 className="mt-4 font-display text-5xl text-ink sm:text-6xl">
        Stills you asked to&nbsp;keep.
      </h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-ink-soft">
        {DISCLOSURE} They last for this visit.
      </p>

      {items.length === 0 ? (
        <div className="mt-14 max-w-lg space-y-6">
          <p className="text-base leading-7 text-ink-soft">
            Nothing kept yet. Compose a room, then mark a still to hold it for
            the studio.
          </p>
          <ButtonLink href="/imagine">Imagine a space</ButtonLink>
        </div>
      ) : (
        <ul className="mt-14 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.favoriteId} className="space-y-3">
              <div className="relative aspect-[3/2] bg-paper-2">
                <Image
                  src={item.image.url}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="text-sm leading-6 text-ink-soft">
                {item.generation.prompt.slice(0, 140)}
                {item.generation.prompt.length > 140 ? "…" : ""}
              </p>
              <Link
                href={`/consult?from=${item.generation.id}`}
                className="text-sm underline decoration-line underline-offset-4"
              >
                Send with a consult
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
