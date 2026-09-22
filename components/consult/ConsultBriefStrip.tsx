"use client";

import Image from "next/image";
import type { PublicBrief } from "@/lib/imagine/brief-types";
import { labelsForTags } from "@/lib/styles";

export function ConsultBriefStrip({ brief }: { brief: PublicBrief }) {
  const stills = brief.images.filter((item) => item.selected || item.favorite);
  const shown = stills.length > 0 ? stills : brief.images;
  const tags = labelsForTags(brief.tags);

  if (shown.length === 0 && !brief.transcript && !brief.prompt) {
    return null;
  }

  return (
    <aside className="mb-12 space-y-6 border border-line px-5 py-6 sm:px-8">
      <p className="text-[12px] uppercase tracking-[0.16em] text-ink">Your Imagine brief</p>
      {shown.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {shown.map((image) => (
            <li key={image.id} className="space-y-2">
              <div className="relative aspect-[3/2] overflow-hidden bg-paper-2">
                <Still src={image.url} alt={image.alt} />
              </div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-muted">
                {image.favorite ? "Favourite" : image.selected ? "Selected" : "Concept"}
              </p>
            </li>
          ))}
        </ul>
      ) : null}
      {tags.length > 0 ? (
        <p className="text-sm text-muted">{tags.join(" · ")}</p>
      ) : null}
      {brief.transcript ? (
        <div>
          <p className="text-[12px] uppercase tracking-[0.16em] text-ink">Transcript</p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{brief.transcript}</p>
        </div>
      ) : brief.prompt ? (
        <div>
          <p className="text-[12px] uppercase tracking-[0.16em] text-ink">Note</p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">{brief.prompt}</p>
        </div>
      ) : null}
    </aside>
  );
}

function Still({ src, alt }: { src: string; alt: string }) {
  if (src.startsWith("blob:") || src.startsWith("data:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 640px) 20vw, 50vw"
      className="object-cover"
    />
  );
}
