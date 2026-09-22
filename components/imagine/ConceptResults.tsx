"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";
import { DISCLOSURE } from "@/lib/prompt";
import { labelsForTags } from "@/lib/styles";
import type { PublicGeneration } from "@/lib/types";

export function ConceptResults({
  generation,
  keptIds,
  onToggleKeep,
  busy,
}: {
  generation: PublicGeneration;
  keptIds: Set<string>;
  onToggleKeep: (imageId: string) => void;
  busy?: boolean;
}) {
  return (
    <section className="space-y-8" aria-labelledby="concepts-heading">
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
          Concepts
        </p>
        <h2 id="concepts-heading" className="mt-3 font-display text-4xl text-ink">
          Stills from your note
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">
          {generation.summary}
        </p>
        {generation.styleTags.length > 0 ? (
          <p className="mt-3 text-sm text-muted">
            {labelsForTags(generation.styleTags).join(" · ")}
          </p>
        ) : null}
      </div>

      <ul className="grid gap-6 sm:grid-cols-2">
        {generation.images.map((image) => {
          const kept = keptIds.has(image.id);
          return (
            <li key={image.id} className="space-y-3">
              <div className="relative aspect-[3/2] overflow-hidden bg-paper-2">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="ghost"
                  disabled={busy}
                  onClick={() => onToggleKeep(image.id)}
                >
                  {kept ? "Kept" : "Keep"}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-sm text-muted">{DISCLOSURE}</p>

      <div className="flex flex-wrap gap-4">
        <Link
          href={`/consult?from=${generation.id}`}
          className="inline-flex items-center justify-center bg-ink px-7 py-3 text-[12px] uppercase tracking-[0.18em] text-paper hover:bg-ink-soft"
        >
          Send to the studio
        </Link>
        <Link
          href="/favorites"
          className="inline-flex items-center justify-center border border-ink px-7 py-3 text-[12px] uppercase tracking-[0.18em] text-ink hover:bg-ink hover:text-paper"
        >
          Review kept stills
        </Link>
      </div>
    </section>
  );
}
