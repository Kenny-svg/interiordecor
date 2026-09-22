export const site = {
  name: "Hale",
  legalName: "Hale Studio",
  principal: "Ellery Hale",
  city: "Lagos",
  email: "kennnyfagbenro44@gmail.com",
  founded: 2014,
  tagline: "Rooms, offices, and places with a point of view.",
  offer: "Decoration for homes, offices, and places that need a professional finish.",
  description:
    "Interior decoration for homes, offices, and public rooms in Nigeria. Imagine a space, then the studio specifies and makes it.",
  freeGenerations: 3,
  voiceMinSeconds: 8,
  voiceMaxSeconds: 45,
  reply: "two working days",
  area: "Lagos, Abuja, Port Harcourt, and places we can reach",
} as const;

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/imagine", label: "Imagine" },
  { href: "/about", label: "About" },
  { href: "/consult", label: "Consult" },
] as const;

export const roomTypes = [
  "Living room",
  "Bedroom",
  "Kitchen",
  "Dining room",
  "Study",
  "Private office",
  "Open office",
  "Reception",
  "Shop or showroom",
  "A whole house",
  "A whole floor",
  "Not sure yet",
] as const;

export const projectTypes = roomTypes;

export type ProjectType = (typeof roomTypes)[number];

export const timelines = [
  "As soon as we can",
  "This season",
  "Within the year",
  "A longer project",
  "Not sure yet",
] as const;

export type Timeline = (typeof timelines)[number];

export const budgetBands = [
  "Under ₦2,000,000",
  "₦2,000,000–₦8,000,000",
  "₦8,000,000–₦25,000,000",
  "₦25,000,000–₦80,000,000",
  "₦80,000,000 and above",
  "Not sure yet",
] as const;

export type BudgetBand = (typeof budgetBands)[number];

export const processSteps = [
  {
    title: "Discover",
    body: "A visit, or a letter. How you live or work, the light, what should stay.",
  },
  {
    title: "Imagine",
    body: "Choose the space. Paint, seat, light, and dress it on the canvas. A brief, not a specification.",
  },
  {
    title: "Specify",
    body: "Drawings, samples, and named costs in naira. You will know what we intend before anything is bought.",
  },
  {
    title: "Install",
    body: "Makers we know. Site visits in Lagos, Abuja, and beyond. The last ten percent, which is most of it.",
  },
] as const;

export const proof = [
  {
    label: "Practice",
    value: `Decorating since ${String(site.founded)}`,
  },
  {
    label: "Rooms",
    value: "Homes, offices, and public rooms.",
  },
  {
    label: "Area",
    value: site.area,
  },
] as const;
