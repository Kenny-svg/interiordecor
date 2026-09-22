"use client";

import { fieldClass } from "@/components/ui";
import type { TranscriptWord } from "@/lib/imagine/session-store";
import { cn } from "@/lib/utils";

const LOW = 0.72;

export function TranscriptField({
  id,
  value,
  words,
  disabled,
  transcribing,
  onChange,
}: {
  id: string;
  value: string;
  words: TranscriptWord[];
  disabled?: boolean;
  transcribing?: boolean;
  onChange: (value: string) => void;
}) {
  const joined = words.map((item) => item.text).join(" ").replace(/\s+/g, " ").trim();
  const current = value.replace(/\s+/g, " ").trim();
  const showMarks = words.length > 0 && joined === current;
  const uncertain = words.filter(
    (item) => item.confidence !== null && item.confidence < LOW,
  );

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[12px] uppercase tracking-[0.16em] text-ink">
        Transcript
      </label>
      {showMarks ? (
        <p className="text-base leading-7 text-ink" aria-hidden="true">
          {words.map((word, index) => {
            const low = word.confidence !== null && word.confidence < LOW;
            return (
              <span key={`${word.text}-${index}`}>
                {index > 0 ? " " : null}
                <span
                  className={cn(
                    low && "underline decoration-dotted decoration-danger underline-offset-4",
                  )}
                >
                  {word.text}
                </span>
              </span>
            );
          })}
        </p>
      ) : null}
      <textarea
        id={id}
        rows={6}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClass} resize-y`}
        placeholder="Paste or edit the note here before we generate."
        aria-describedby={uncertain.length > 0 && showMarks ? `${id}-hint` : undefined}
      />
      {showMarks && uncertain.length > 0 ? (
        <p id={`${id}-hint`} className="text-sm leading-6 text-muted">
          Dotted words were uncertain. Edit anything that is wrong — the note is
          yours.
        </p>
      ) : (
        <p className="text-sm leading-6 text-muted">
          Always editable. Generate needs twelve characters.
        </p>
      )}
      {transcribing ? (
        <p className="text-sm text-muted" role="status">
          Writing the note down…
        </p>
      ) : null}
    </div>
  );
}
