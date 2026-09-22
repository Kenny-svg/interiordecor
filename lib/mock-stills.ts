import { hashString } from "@/lib/utils";

export type MockStill = {
  url: string;
  alt: string;
  tags: string[];
};

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

export const mockStills: MockStill[] = [
  {
    url: u("photo-1615873968403-89e068629265"),
    alt: "A collected sitting room with plaster walls and a low sofa",
    tags: ["collected", "laterite", "afro-modern"],
  },
  {
    url: u("photo-1631679706909-1844bbd07221"),
    alt: "A pale living room with a linen sofa and a timber coffee table",
    tags: ["warm-contemporary", "quiet-contemporary", "lagos-apartment"],
  },
  {
    url: u("photo-1600607687920-4e2a09cf159d"),
    alt: "An airy interior with a long table and tall windows",
    tags: ["afro-modern", "collected", "laterite"],
  },
  {
    url: u("photo-1616594039964-ae9021a400a0"),
    alt: "A bedroom with linen bedding and a simple timber headboard",
    tags: ["warm-contemporary", "coastal", "laterite"],
  },
  {
    url: u("photo-1600566752355-35792bedcfea"),
    alt: "A calm bedroom with layered textiles and a reading lamp",
    tags: ["collected", "collected", "coastal"],
  },
  {
    url: u("photo-1556911220-bff31c812dba"),
    alt: "A kitchen with timber cabinets and a stone worktop",
    tags: ["collected", "collected", "warm-contemporary"],
  },
  {
    url: u("photo-1618221195710-dd6b41faaea6"),
    alt: "A contemporary sitting room with a low sofa and a large window",
    tags: ["quiet-contemporary", "lagos-apartment", "warm-contemporary"],
  },
  {
    url: u("photo-1594026112284-02bb6f3352fe"),
    alt: "A dining corner with a round table and a hanging light",
    tags: ["lagos-apartment", "quiet-contemporary", "collected"],
  },
  {
    url: u("photo-1615529328331-f8917597711f"),
    alt: "A sitting room with antique furniture and a pale rug",
    tags: ["afro-modern", "collected", "collected"],
  },
  {
    url: u("photo-1505693416388-ac5ce068fe85"),
    alt: "A bedroom looking toward tall, light-filled windows",
    tags: ["coastal", "laterite", "warm-contemporary"],
  },
  {
    url: u("photo-1600585154340-be6161a56a0c"),
    alt: "A living space with a sectional sofa and plaster walls",
    tags: ["quiet-contemporary", "lagos-apartment", "laterite"],
  },
  {
    url: u("photo-1586023492125-27b2c045efd7"),
    alt: "A composed interior with a chair, a lamp, and a low table",
    tags: ["warm-contemporary", "quiet-contemporary", "lagos-apartment"],
  },
  {
    url: u("photo-1600210491369-e753d80a41f3"),
    alt: "A sitting room in late light with a deep sofa and books",
    tags: ["collected", "afro-modern", "collected"],
  },
  {
    url: u("photo-1600585154363-67eb9e2e2099"),
    alt: "A house interior with a kitchen beyond a sitting area",
    tags: ["quiet-contemporary", "warm-contemporary", "coastal"],
  },
  {
    url: u("photo-1616486338812-3dadae4b4ace"),
    alt: "A bedroom with a upholstered bed and quiet curtains",
    tags: ["afro-modern", "collected", "lagos-apartment"],
  },
  {
    url: u("photo-1560448204-e02f11c3d0e2"),
    alt: "A living room with a fireplace and a pair of chairs",
    tags: ["collected", "afro-modern", "tropical-modern"],
  },
  {
    url: u("photo-1497366811353-6870744d04b2"),
    alt: "A private office with a long desk and quiet walls",
    tags: ["corporate-quiet", "quiet-contemporary", "lagos-apartment"],
  },
  {
    url: u("photo-1497366754035-f200968a6e72"),
    alt: "An open office floor with daylight and empty desks",
    tags: ["corporate-quiet", "quiet-contemporary", "warm-contemporary"],
  },
];

export function pickMockStills(input: {
  prompt: string;
  styleTags: string[];
  count: number;
}): MockStill[] {
  const scored = mockStills
    .map((still, index) => {
      const overlap = still.tags.filter((tag) =>
        input.styleTags.includes(tag),
      ).length;
      const salt = hashString(`${input.prompt}:${still.url}:${index}`) % 7;
      return { still, score: overlap * 10 + salt };
    })
    .sort((a, b) => b.score - a.score);

  const count = Math.min(Math.max(input.count, 1), 4);
  return scored.slice(0, count).map((entry) => entry.still);
}
