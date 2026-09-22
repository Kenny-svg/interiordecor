/**
 * SAMPLE CONTENT — replace this file with the practice’s own photography
 * and case notes. Images below are real photographs (Unsplash License),
 * standing in for Hale’s camera work. They are not generated rooms.
 *
 * Photographers (Unsplash): Spacejoy, Sidekix Media, R ARCHITECTURE.
 */

import type { StyleTagId } from "@/lib/styles";

export const SAMPLE_PORTFOLIO = true;

export type ProjectImage = {
  src: string;
  alt: string;
  caption?: string;
  /** CSS object-position, e.g. "50% 40%" */
  position: string;
};

export type BeforeAfter = {
  before: ProjectImage;
  after: ProjectImage;
};

export type Project = {
  slug: string;
  title: string;
  year: number;
  room: string;
  style: string;
  city: string;
  place: string;
  location: string;
  styleTags: StyleTagId[];
  brief: string;
  constraints: string[];
  materials: string[];
  cover: ProjectImage;
  images: ProjectImage[];
  beforeAfter?: BeforeAfter;
};

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=80`;

export const projects: Project[] = [
  {
    slug: "primrose-hill",
    title: "The living room",
    year: 2019,
    room: "Living room",
    style: "Laterite",
    city: "Lagos",
    place: "Ikoyi",
    location: "Lagos",
    styleTags: ["laterite", "collected"],
    brief:
      "A first-floor room that had been painted too often. We stripped it back to plaster, kept the original fireplace, and furnished it as if the books had always been there.",
    constraints: [
      "North light, and not much of it in winter",
      "The chimney breast and cornice were to stay",
      "No built-in lighting; lamps only",
      "A sofa that could take two people and a dog",
    ],
    materials: [
      "Lime plaster, left unpainted",
      "Linen on the sofa, a faded Tabriz underfoot",
      "Unlacquered brass on the lamps",
      "One antique table, already marked",
    ],
    cover: {
      // Unsplash photo-1600210492486-724fe5c67fb0 — Spacejoy
      src: u("photo-1600210492486-724fe5c67fb0"),
      alt: "A pale sitting room with a linen sofa, plaster walls, and a low table of books",
      position: "50% 45%",
    },
    images: [
      {
        src: u("photo-1600210492486-724fe5c67fb0"),
        alt: "The sitting room seen from the doorway",
        caption: "The sofa is the only new piece.",
        position: "50% 45%",
      },
      {
        src: u("photo-1618221195710-dd6b41faaea6"),
        alt: "A quiet corner with an armchair and a window",
        caption: "The chimney breast was left alone.",
        position: "50% 40%",
      },
      {
        src: u("photo-1600210491892-03d54c0aaf87"),
        alt: "A close view of textiles and a timber table",
        position: "50% 50%",
      },
      {
        src: u("photo-1615873968403-89e068629265"),
        alt: "Collected furniture against plaster walls",
        position: "50% 40%",
      },
      {
        src: u("photo-1631679706909-1844bbd07221"),
        alt: "A linen sofa and a timber coffee table in late light",
        position: "50% 50%",
      },
    ],
  },
  {
    slug: "chelsea-mews",
    title: "A kitchen in Ikoyi",
    year: 2021,
    room: "Kitchen",
    style: "Tropical modern",
    city: "Lagos",
    place: "Ikoyi",
    location: "Lagos",
    styleTags: ["tropical-modern", "collected"],
    brief:
      "A mews kitchen with no room to waste. Joinery in oak, a stone trough sink, and a table that takes four if they know each other.",
    constraints: [
      "A room too honest for an island",
      "The garden door was the brief",
      "Services already ran along one wall",
      "Breakfast, not entertaining",
    ],
    materials: [
      "Oak joinery, simple doors",
      "A stone trough sink",
      "Unlacquered brass, left to mark",
      "Open shelves, not glass",
    ],
    cover: {
      // Unsplash photo-1556911220-bff31c812dba — Sidekix Media
      src: u("photo-1556911220-bff31c812dba"),
      alt: "A kitchen with timber cabinets and a stone worktop",
      position: "50% 40%",
    },
    images: [
      {
        src: u("photo-1556911220-bff31c812dba"),
        alt: "Kitchen looking along the timber run",
        caption: "The run of cabinets is shorter than it looks.",
        position: "50% 40%",
      },
      {
        src: u("photo-1556912172-45b7abe8b7e1"),
        alt: "Open timber shelves with pottery and glass",
        position: "50% 45%",
      },
      {
        src: u("photo-1600566753190-17f0baa2a6c3"),
        alt: "A dining end of the kitchen with a simple table",
        caption: "Four, if they know each other.",
        position: "50% 50%",
      },
      {
        src: u("photo-1600566753086-00f18fb6b3ea"),
        alt: "A kitchen in morning light with a long timber counter",
        position: "40% 50%",
      },
    ],
    beforeAfter: {
      before: {
        src: u("photo-1556909114-f6e7ad7d3136"),
        alt: "The kitchen as found, white and unused",
        caption: "As found.",
        position: "50% 50%",
      },
      after: {
        src: u("photo-1556911220-bff31c812dba"),
        alt: "The finished timber kitchen",
        caption: "As lived in.",
        position: "50% 40%",
      },
    },
  },
  {
    slug: "norfolk-bedroom",
    title: "The main bedroom",
    year: 2020,
    room: "Bedroom",
    style: "Coastal",
    city: "Lagos",
    place: "Lekki",
    location: "Lagos",
    styleTags: ["coastal", "laterite", "warm-contemporary"],
    brief:
      "A coastal house, inland enough to be still. The bedroom is for sleeping and one chair. Colour comes from the weather.",
    constraints: [
      "Shutters instead of curtains",
      "A chest that was already in the family",
      "No television",
      "Morning light, and a lot of it",
    ],
    materials: [
      "Limewashed plaster",
      "Linen bedding, washed often",
      "A timber floor, left bare",
      "One reading lamp",
    ],
    cover: {
      // Unsplash photo-1616594039964-ae9021a400a0 — Spacejoy
      src: u("photo-1616594039964-ae9021a400a0"),
      alt: "A bedroom with linen bedding, pale walls, and a view to a garden",
      position: "50% 50%",
    },
    images: [
      {
        src: u("photo-1616594039964-ae9021a400a0"),
        alt: "The bed against a quiet wall of plaster",
        caption: "Linen, and not much else.",
        position: "50% 50%",
      },
      {
        src: u("photo-1631679706909-1844bbd07221"),
        alt: "A bedroom corner with a chair and a reading lamp",
        position: "50% 40%",
      },
      {
        src: u("photo-1616137466211-f939a420be84"),
        alt: "Morning light across a timber floor",
        position: "50% 60%",
      },
      {
        src: u("photo-1618221195710-dd6b41faaea6"),
        alt: "A bedroom with linen bedding and a simple timber headboard",
        position: "50% 45%",
      },
      {
        src: u("photo-1600566753086-00f18fb6b3ea"),
        alt: "Layered textiles and a lamp beside the bed",
        position: "50% 40%",
      },
      {
        src: u("photo-1505693416388-ac5ce068fe85"),
        alt: "The bedroom looking toward tall windows",
        position: "50% 40%",
      },
    ],
  },
  {
    slug: "bloomsbury-study",
    title: "A private office",
    year: 2022,
    room: "Private office",
    style: "Corporate quiet",
    city: "Lagos",
    place: "Victoria Island",
    location: "Lagos",
    styleTags: ["corporate-quiet", "collected", "lagos-apartment"],
    brief:
      "A private office on Victoria Island that had become a corridor of screens. We kept the windows, specified a desk that can actually be used, and stopped before it looked like a lounge.",
    constraints: [
      "Shelves in the existing alcoves only",
      "The carpet stayed",
      "One picture, hung too low on purpose",
      "A desk that was too good to leave",
    ],
    materials: [
      "Painted joinery in the alcoves",
      "The existing wool carpet",
      "A green lamp, found",
      "Timber, already worn",
    ],
    cover: {
      // Unsplash photo-1600585154526-990dced4db0d — Spacejoy
      src: u("photo-1600585154526-990dced4db0d"),
      alt: "A small study with a timber desk, a lamp, and floor-to-ceiling shelves",
      position: "50% 40%",
    },
    images: [
      {
        src: u("photo-1600585154526-990dced4db0d"),
        alt: "The study from the threshold",
        caption: "Built around a desk that was too good to leave.",
        position: "50% 40%",
      },
      {
        src: u("photo-1600607687939-ce8a6c25118c"),
        alt: "Shelves and a reading chair in afternoon light",
        position: "50% 45%",
      },
      {
        src: u("photo-1600210491892-03d54c0aaf87"),
        alt: "A lamp on a desk with papers",
        position: "50% 50%",
      },
      {
        src: u("photo-1616046229478-9901c5536a45"),
        alt: "A living space with plaster walls and a long sofa",
        position: "50% 45%",
      },
      {
        src: u("photo-1594026112284-02bb6f3352fe"),
        alt: "A dining corner with a round table and a hanging light",
        position: "50% 40%",
      },
    ],
  },
  {
    slug: "marylebone-dining",
    title: "The dining room",
    year: 2018,
    room: "Dining room",
    style: "Quiet contemporary",
    city: "Lagos",
    place: "Banana Island",
    location: "Lagos",
    styleTags: ["quiet-contemporary", "lagos-apartment"],
    brief:
      "A dining room that had become a corridor. We closed it, laid a stone floor, and put the table back in the middle.",
    constraints: [
      "Used most nights, not only for guests",
      "A hanging light, not a chandelier",
      "Chairs from three decades, to be re-covered together",
      "Stone underfoot, timber above",
    ],
    materials: [
      "Limestone flags",
      "A long timber table",
      "Linen on the chairs",
      "A single hanging light",
    ],
    cover: {
      // Unsplash photo-1600566752355-35792bedcfea — Spacejoy
      src: u("photo-1600566752355-35792bedcfea"),
      alt: "A dining room with a long table, plaster walls, and a hanging light",
      position: "50% 45%",
    },
    images: [
      {
        src: u("photo-1600566752355-35792bedcfea"),
        alt: "The dining table set simply, with a view through to the hall",
        caption: "Used most nights.",
        position: "50% 45%",
      },
      {
        src: u("photo-1600566753190-17f0baa2a6c3"),
        alt: "A sideboard and a pair of lamps",
        position: "50% 50%",
      },
      {
        src: u("photo-1616046229478-9901c5536a45"),
        alt: "Evening light on a timber table",
        position: "50% 40%",
      },
      {
        src: u("photo-1600607687920-4e2a09cf159d"),
        alt: "An airy interior with a long table and tall windows",
        position: "50% 40%",
      },
      {
        src: u("photo-1615529328331-f8917597711f"),
        alt: "A sitting room with antique furniture and a pale rug",
        position: "50% 45%",
      },
    ],
  },
  {
    slug: "wiltshire-hall",
    title: "Reception",
    year: 2023,
    room: "Reception",
    style: "Collected",
    city: "Port Harcourt",
    place: "GRA",
    location: "Port Harcourt",
    styleTags: ["collected", "afro-modern"],
    brief:
      "The first room of a house that had been over-restored. We took the sheen off the walls, put a runner on the flags, and stopped there.",
    constraints: [
      "The flags were original; the wear was to stay",
      "No console table pretending to be architecture",
      "A bench that is actually sat on",
      "The stair carpet, replaced once",
    ],
    materials: [
      "The existing stone flags",
      "A wool runner",
      "Limewash, not gloss",
      "A timber bench",
    ],
    cover: {
      // Unsplash photo-1600585154340-be6161a56a0c — Spacejoy
      src: u("photo-1600585154340-be6161a56a0c"),
      alt: "A country-house hall with a staircase, stone flags, and a long runner",
      position: "50% 40%",
    },
    images: [
      {
        src: u("photo-1600585154340-be6161a56a0c"),
        alt: "The hall looking toward the stair",
        caption: "The flags were original.",
        position: "50% 40%",
      },
      {
        src: u("photo-1600607687939-ce8a6c25118c"),
        alt: "A landing with a window seat and a single picture",
        position: "50% 45%",
      },
      {
        src: u("photo-1600573472592-401b489a3cdc"),
        alt: "A doorway into a pale sitting room",
        position: "50% 50%",
      },
      {
        src: u("photo-1600585154363-67eb9e2e2099"),
        alt: "A house interior looking through to the kitchen",
        position: "50% 45%",
      },
      {
        src: u("photo-1560448204-e02f11c3d0e2"),
        alt: "A living room with a fireplace and a pair of chairs",
        position: "50% 40%",
      },
    ],
    beforeAfter: {
      before: {
        src: u("photo-1600210491892-03d54c0aaf87"),
        alt: "A bare, over-restored interior before the hall was quieted",
        caption: "As found: too much sheen.",
        position: "50% 50%",
      },
      after: {
        src: u("photo-1600585154340-be6161a56a0c"),
        alt: "The finished hall with a runner on the original flags",
        caption: "The wear left in.",
        position: "50% 40%",
      },
    },
  },
];

const firstProject = projects[0];
if (!firstProject) {
  throw new Error("The portfolio is empty.");
}
export const featuredProject = firstProject;

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectIndex(slug: string): number {
  return projects.findIndex((project) => project.slug === slug);
}

export function projectCaption(project: Pick<Project, "room" | "year" | "city">): string {
  return `${project.room}, ${project.year}, ${project.city}`;
}

export function imagineHrefFor(project: Project): string {
  const tags = project.styleTags.join(",");
  const params = new URLSearchParams({ tags, from: project.slug });
  return `/imagine?${params.toString()}`;
}

export function uniqueValues(key: "room" | "style" | "location"): string[] {
  const seen = new Set<string>();
  const values: string[] = [];
  for (const project of projects) {
    const value = project[key];
    if (!seen.has(value)) {
      seen.add(value);
      values.push(value);
    }
  }
  return values;
}
