"use client";

import { EmptyRoom } from "@/components/imagine/EmptyRoom";
import { spaceGroups, spaces, type SpaceId } from "@/lib/spaces";

export function SpacePicker({
  onSelect,
}: {
  onSelect: (id: SpaceId) => void;
}) {
  return (
    <div className="space-y-12 py-8 sm:py-10">
      <p className="max-w-xl text-base leading-7 text-ink-soft">
        Choose the kind of space. Each one is a different empty shell — then a
        palette, the furniture that belongs there, light, and dress.
      </p>
      {spaceGroups.map((group) => {
        const items = spaces.filter((space) => space.group === group.id);
        return (
          <section key={group.id}>
            <h2 className="text-[11px] uppercase tracking-[0.22em] text-muted">
              {group.label}
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((space) => (
                <li key={space.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(space.id)}
                    className="group flex w-full flex-col overflow-hidden border border-line bg-paper text-left hover:border-ink"
                  >
                    <span className="relative aspect-[3/2] overflow-hidden bg-paper-2">
                      <EmptyRoom space={space} paintHexes={[]} />
                    </span>
                    <span className="px-4 py-3 font-display text-xl text-ink">
                      {space.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
