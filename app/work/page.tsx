import type { Metadata } from "next";
import Link from "next/link";
import { FilterChips } from "@/components/work/FilterChips";
import { Still } from "@/components/work/Still";
import { Container, Eyebrow, TextLink } from "@/components/ui";
import {
  projectCaption,
  projects,
  SAMPLE_PORTFOLIO,
  uniqueValues,
} from "@/lib/projects";
import {
  hasActiveFilters,
  parseWorkFilters,
  workIndexPath,
} from "@/lib/work-query";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected rooms — homes, offices, and public interiors.",
};

type Props = {
  searchParams: Promise<{
    room?: string | string[];
    style?: string | string[];
    location?: string | string[];
  }>;
};

export default async function WorkPage({ searchParams }: Props) {
  const raw = await searchParams;
  const rooms = uniqueValues("room");
  const styles = uniqueValues("style");
  const locations = uniqueValues("location");
  const allowed = {
    room: new Set(rooms),
    style: new Set(styles),
    location: new Set(locations),
  };

  const requested = parseWorkFilters(raw);
  const filters = {
    room: requested.room && allowed.room.has(requested.room) ? requested.room : undefined,
    style:
      requested.style && allowed.style.has(requested.style) ? requested.style : undefined,
    location:
      requested.location && allowed.location.has(requested.location)
        ? requested.location
        : undefined,
  };

  const selected = projects.filter((project) => {
    if (filters.room && project.room !== filters.room) {
      return false;
    }
    if (filters.style && project.style !== filters.style) {
      return false;
    }
    if (filters.location && project.location !== filters.location) {
      return false;
    }
    return true;
  });

  return (
    <Container className="py-12 sm:py-16">
      <Eyebrow>Work</Eyebrow>
      <h1 className="mt-4 max-w-2xl font-display text-5xl text-ink sm:text-6xl">
        Selected rooms.
      </h1>
      {SAMPLE_PORTFOLIO ? (
        <p className="mt-5 max-w-xl text-sm leading-6 text-muted">
          Sample portfolio. Photographs stand in for the studio’s own work.
        </p>
      ) : null}

      <form method="get" action="/work" className="mt-10 space-y-8">
        <noscript>
          <p className="text-sm text-muted">
            Choose a room, a style, or a place, then apply.
          </p>
        </noscript>
        <div className="grid gap-8 lg:grid-cols-3">
          <FilterChips
            label="Room"
            facet="room"
            options={rooms}
            filters={filters}
            allowed={allowed.room}
          />
          <FilterChips
            label="Style"
            facet="style"
            options={styles}
            filters={filters}
            allowed={allowed.style}
          />
          <FilterChips
            label="Location"
            facet="location"
            options={locations}
            filters={filters}
            allowed={allowed.location}
          />
        </div>
        <noscript>
          <div className="flex flex-wrap gap-3">
            <select name="room" defaultValue={filters.room ?? ""} className="border border-line bg-paper px-3 py-2 text-sm">
              <option value="">All rooms</option>
              {rooms.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
            <select name="style" defaultValue={filters.style ?? ""} className="border border-line bg-paper px-3 py-2 text-sm">
              <option value="">All styles</option>
              {styles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>
            <select name="location" defaultValue={filters.location ?? ""} className="border border-line bg-paper px-3 py-2 text-sm">
              <option value="">All places</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <button type="submit" className="bg-ink px-4 py-2 text-[12px] uppercase tracking-[0.18em] text-paper">
              Apply
            </button>
          </div>
        </noscript>
      </form>

      {hasActiveFilters(filters) ? (
        <p className="mt-8 text-sm">
          <TextLink href={workIndexPath({})}>Clear filters</TextLink>
        </p>
      ) : null}

      {selected.length === 0 ? (
        <p className="mt-14 max-w-md text-base leading-7 text-ink-soft">
          No rooms in this combination.{" "}
          <TextLink href={workIndexPath({})}>See all work</TextLink>
        </p>
      ) : (
        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selected.map((project) => (
            <li key={project.slug}>
              <Link href={`/work/${project.slug}`} className="group block">
                <Still
                  src={project.cover.src}
                  alt={project.cover.alt}
                  position={project.cover.position}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="motion-safe:[&_img]:transition-transform motion-safe:[&_img]:duration-700 motion-safe:group-hover:[&_img]:scale-[1.03]"
                />
                <p className="mt-4 font-display text-2xl">{project.title}</p>
                <p className="mt-1 text-sm text-muted">{projectCaption(project)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
