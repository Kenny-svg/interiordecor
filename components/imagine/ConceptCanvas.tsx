"use client";

import { Button, fieldClass, Notice } from "@/components/ui";
import { refinePrompts } from "@/lib/imagine/copy";
import { DISCLOSURE } from "@/lib/prompt";
import {
  activeVersion,
  type ConceptSummary,
  type StoredConcept,
} from "@/lib/imagine/session-store";
import { cn } from "@/lib/utils";

export type CanvasStatus =
  | "empty"
  | "generating"
  | "ready"
  | "failed"
  | "blocked"
  | "limited";

const FRAME = "relative aspect-[3/2] overflow-hidden bg-paper-2";

export function ConceptCanvas({
  status,
  concepts,
  studioPrompt,
  refiningId,
  photoUrl,
  canRefine,
  onFavorite,
  onSelect,
  onRefine,
  onRetryOne,
  onRetryAll,
  onDownload,
  onSelectVersion,
  onSummaryChange,
  errorMessage,
}: {
  status: CanvasStatus;
  concepts: StoredConcept[];
  studioPrompt: string;
  refiningId: string | null;
  photoUrl: string | null;
  canRefine: boolean;
  onFavorite: (id: string) => void;
  onSelect: (id: string) => void;
  onRefine: (id: string, prompt: string) => void;
  onRetryOne: (id: string) => void;
  onRetryAll: () => void;
  onDownload: (concept: StoredConcept) => void;
  onSelectVersion: (conceptId: string, versionId: string) => void;
  onSummaryChange: (id: string, field: keyof ConceptSummary, value: string) => void;
  errorMessage?: string | null;
}) {
  const first = concepts[0];
  const firstStill = first ? activeVersion(first) : null;
  const live =
    status === "generating"
      ? "Composing light and materials"
      : refiningId
        ? "Refining this still"
        : "";

  return (
    <section className="flex min-h-full flex-col" aria-label="Concept canvas">
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {live}
      </p>

      {photoUrl && firstStill && status === "ready" ? (
        <div className="mb-12 space-y-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
            Your architecture, imagined finishes.
          </p>
          <div className="grid grid-cols-2 items-start gap-8">
            <figure>
              <div className={FRAME}>
                <RoomStill src={photoUrl} alt="The room photograph you attached" />
              </div>
              <figcaption className="mt-2 text-sm text-muted">The room as it is.</figcaption>
            </figure>
            <figure>
              <div className={FRAME}>
                <RoomStill src={firstStill.url} alt={firstStill.alt} />
              </div>
              <figcaption className="mt-2 text-sm text-muted">Concept 1, on that plan.</figcaption>
            </figure>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-2 items-start gap-x-8 gap-y-12">
        {status === "generating"
          ? [0, 1, 2, 3].map((slot) => (
              <div
                key={slot}
                className={cn(FRAME, "motion-safe:animate-pulse")}
              />
            ))
          : null}

        {(status === "ready" ||
          status === "limited" ||
          (status === "failed" && concepts.length > 0)) &&
          concepts.map((concept) => {
            const version = activeVersion(concept);
            return (
              <article key={concept.id} className="min-w-0">
                <div className={FRAME}>
                  {concept.status === "ready" && refiningId !== concept.id ? (
                    <RoomStill src={version.url} alt={version.alt} />
                  ) : (
                    <div
                      className={cn(
                        "absolute inset-0 bg-paper-2",
                        refiningId === concept.id && "motion-safe:animate-pulse",
                      )}
                    />
                  )}
                </div>
                {concept.history.length > 1 ? (
                  <div
                    className="mt-4 flex gap-3 overflow-x-auto"
                    role="group"
                    aria-label="Versions of this still"
                  >
                    {concept.history.map((item) => {
                      const active = item.id === concept.activeHistoryId;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          aria-pressed={active}
                          aria-label={`${item.label} version`}
                          className="shrink-0 text-left"
                          onClick={() => onSelectVersion(concept.id, item.id)}
                        >
                          <span
                            className={cn(
                              "relative block h-12 w-[4.5rem] overflow-hidden bg-paper-2",
                              active ? "outline outline-1 outline-ink outline-offset-2" : "",
                            )}
                          >
                            <RoomStill src={item.url} alt="" />
                          </span>
                          <span className="mt-1 block text-[11px] uppercase tracking-[0.12em] text-muted">
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : null}
                {concept.status === "failed" ? (
                  <p className="mt-3">
                    <Button variant="ghost" onClick={() => onRetryOne(concept.id)}>
                      Retry this frame
                    </Button>
                  </p>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
                    <button
                      type="button"
                      className="hover:text-ink"
                      onClick={() => onFavorite(concept.id)}
                    >
                      {concept.favorite ? "Favourited" : "Favourite"}
                    </button>
                    <button
                      type="button"
                      className="hover:text-ink"
                      onClick={() => onSelect(concept.id)}
                    >
                      {concept.selected ? "Selected" : "Select"}
                    </button>
                    <button
                      type="button"
                      className="hover:text-ink"
                      onClick={() => onDownload(concept)}
                    >
                      Download
                    </button>
                  </div>
                )}
                {concept.status === "ready" ? (
                  <div className="mt-4 space-y-3">
                    <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted">
                      {refinePrompts.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          disabled={refiningId === concept.id || !canRefine}
                          className="text-ink-soft underline decoration-line underline-offset-4 hover:text-ink disabled:opacity-40"
                          onClick={() => onRefine(concept.id, item.label)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </p>
                    <details className="text-sm">
                      <summary className="cursor-pointer text-muted hover:text-ink">
                        Palette, materials, mood
                      </summary>
                      <div className="mt-3 space-y-2">
                        <label className="block text-sm text-muted">
                          Palette
                          <textarea
                            rows={2}
                            value={concept.summary.palette}
                            className={`${fieldClass} mt-1 resize-y text-sm`}
                            onChange={(event) =>
                              onSummaryChange(concept.id, "palette", event.target.value)
                            }
                          />
                        </label>
                        <label className="block text-sm text-muted">
                          Materials
                          <textarea
                            rows={2}
                            value={concept.summary.materials}
                            className={`${fieldClass} mt-1 resize-y text-sm`}
                            onChange={(event) =>
                              onSummaryChange(concept.id, "materials", event.target.value)
                            }
                          />
                        </label>
                        <label className="block text-sm text-muted">
                          Mood
                          <textarea
                            rows={2}
                            value={concept.summary.mood}
                            className={`${fieldClass} mt-1 resize-y text-sm`}
                            onChange={(event) =>
                              onSummaryChange(concept.id, "mood", event.target.value)
                            }
                          />
                        </label>
                      </div>
                    </details>
                  </div>
                ) : null}
              </article>
            );
          })}
      </div>

      <div className="mt-10 space-y-4">
        {status === "generating" ? (
          <p className="text-sm tracking-[0.01em] text-muted">
            Composing light and materials…
          </p>
        ) : null}
        {status === "empty" ? (
          <p className="text-sm leading-6 text-muted">
            The room above is empty until you dress it. Compose stills when the
            canvas is ready.
          </p>
        ) : null}
        {status === "ready" && errorMessage ? (
          <Notice tone="caution">{errorMessage}</Notice>
        ) : null}
        {status === "blocked" ? (
          <Notice tone="caution">
            {errorMessage ??
              "We couldn’t make stills from that note. Describe a room — the light, the materials, how it is used. Nothing of a person."}
          </Notice>
        ) : null}
        {status === "limited" ? (
          <Notice>
            {errorMessage ??
              "Give the last stills a moment before composing again."}
          </Notice>
        ) : null}
        {status === "failed" ? (
          <div className="space-y-3">
            <Notice tone="caution">
              {errorMessage ??
                "The canvas didn’t return stills. Retry one frame, or compose all four again."}
            </Notice>
            <Button variant="ghost" onClick={onRetryAll}>
              Retry all
            </Button>
          </div>
        ) : null}
        {studioPrompt ? (
          <details className="text-sm text-muted">
            <summary className="cursor-pointer hover:text-ink">
              Direction written for the stills
            </summary>
            <p className="mt-3 leading-6">{studioPrompt}</p>
          </details>
        ) : null}
        <p className="text-sm text-muted">{DISCLOSURE}</p>
      </div>
    </section>
  );
}

function RoomStill({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      {/* Native img so expired optimiser URLs cannot blank the frame. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.style.opacity = "0";
        }}
      />
      <span className="pointer-events-none absolute bottom-2 left-2 font-display text-[11px] tracking-[0.2em] text-paper drop-shadow">
        HALE
      </span>
    </>
  );
}
