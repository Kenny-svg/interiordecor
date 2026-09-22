export type WorkFilters = {
  room?: string;
  style?: string;
  location?: string;
};

export function parseWorkFilters(input: {
  room?: string | string[];
  style?: string | string[];
  location?: string | string[];
}): WorkFilters {
  return {
    room: single(input.room),
    style: single(input.style),
    location: single(input.location),
  };
}

export function workIndexPath(filters: WorkFilters): string {
  const params = new URLSearchParams();
  if (filters.room) {
    params.set("room", filters.room);
  }
  if (filters.style) {
    params.set("style", filters.style);
  }
  if (filters.location) {
    params.set("location", filters.location);
  }
  const query = params.toString();
  return query ? `/work?${query}` : "/work";
}

export function toggleFilter(
  current: WorkFilters,
  key: keyof WorkFilters,
  value: string,
): WorkFilters {
  const next: WorkFilters = { ...current };
  if (next[key] === value) {
    delete next[key];
  } else {
    next[key] = value;
  }
  return next;
}

export function hasActiveFilters(filters: WorkFilters): boolean {
  return Boolean(filters.room || filters.style || filters.location);
}

function single(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}
