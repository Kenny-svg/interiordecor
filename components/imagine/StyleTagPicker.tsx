"use client";

import { styleTags } from "@/lib/styles";
import { cn } from "@/lib/utils";

export function StyleTagPicker({
  selected,
  onChange,
  disabled,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}) {
  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter((item) => item !== id));
      return;
    }
    if (selected.length >= 3) {
      return;
    }
    onChange([...selected, id]);
  }

  return (
    <fieldset disabled={disabled} className="space-y-3">
      <legend className="text-[12px] uppercase tracking-[0.16em] text-ink">
        Style
      </legend>
      <div className="flex flex-wrap gap-2">
        {styleTags.map((tag) => {
          const active = selected.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(tag.id)}
              className={cn(
                "min-h-11 border px-3 py-2 text-sm transition-colors",
                active
                  ? "border-ink text-ink"
                  : "border-line text-ink-soft hover:border-ink",
              )}
            >
              {tag.label}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-muted">
        The room takes the look. Up to three.
      </p>
    </fieldset>
  );
}
