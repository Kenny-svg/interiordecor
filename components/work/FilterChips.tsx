import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  type WorkFilters,
  toggleFilter,
  workIndexPath,
} from "@/lib/work-query";

export function FilterChips({
  label,
  facet,
  options,
  filters,
  allowed,
}: {
  label: string;
  facet: keyof WorkFilters;
  options: string[];
  filters: WorkFilters;
  allowed: Set<string>;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-[11px] uppercase tracking-[0.22em] text-muted">
        {label}
      </legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = filters[facet] === option;
          const known = allowed.has(option);
          if (!known && !active) {
            return null;
          }
          return (
            <Link
              key={option}
              href={workIndexPath(toggleFilter(filters, facet, option))}
              scroll={false}
              className={cn(
                "border px-3 py-2 text-sm transition-colors",
                active
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink-soft hover:border-ink",
              )}
              aria-current={active ? "true" : undefined}
            >
              {option}
            </Link>
          );
        })}
      </div>
    </fieldset>
  );
}
