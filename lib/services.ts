export type Service = {
  slug: string;
  title: string;
  summary: string;
  gets: string[];
  timeline: string;
  from: string;
};

export const services: Service[] = [
  {
    slug: "full-service",
    title: "Full-service",
    summary:
      "We take the room, the house, or the floor — from the first visit to the last lamp. Homes, offices, and public rooms.",
    gets: [
      "A visit and a written direction",
      "Drawings and samples",
      "A specification with named costs in naira",
      "Procurement and site attendance",
    ],
    timeline: "A room: four to nine months. A house or a floor: a year or more.",
    from: "From ₦8,000,000 a room, quoted after we have seen the place.",
  },
  {
    slug: "e-design",
    title: "E-design",
    summary:
      "A complete direction at a distance. You receive a plan, finishes, and a specified list. You buy; we do not attend site.",
    gets: [
      "A furnished layout",
      "Finishes and colour",
      "A specified list, with quantities",
      "One round of revision",
    ],
    timeline: "Three to six weeks, once we have photographs and measurements.",
    from: "From ₦1,200,000 a room.",
  },
  {
    slug: "styling",
    title: "Styling",
    summary:
      "Furniture, textiles, and objects in a room or office that is already built. The architecture stays; the life of the place changes.",
    gets: [
      "A visit or a set of photographs",
      "A furniture and textile plan",
      "Sourcing, or a list you can follow",
      "A dressing day, if we are nearby",
    ],
    timeline: "Two to eight weeks.",
    from: "From ₦850,000 a room, plus the things themselves.",
  },
  {
    slug: "consult",
    title: "Consult",
    summary:
      "Ninety minutes in the house, the office, or at the studio. A letter afterwards, so the conversation does not evaporate.",
    gets: [
      "A walk through the rooms that matter",
      "Plain advice on what to keep, change, or leave",
      "A letter within a week",
    ],
    timeline: "Usually within two weeks of writing.",
    from: "From ₦150,000.",
  },
];
