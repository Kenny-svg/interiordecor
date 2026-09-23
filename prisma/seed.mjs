import { mkdir } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const generatedDir = path.join(process.cwd(), "public", "generated");
const mediaDir = path.join(process.cwd(), ".data", "media");
const productsDir = path.join(process.cwd(), "public", "products");

const u = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

/**
 * SAMPLE CATALOGUE — Unsplash stills until the studio photographs its own pieces.
 * Toggle SAMPLE_CATALOG in lib/catalog-meta.ts when these are replaced.
 */
const pieces = [
  {
    slug: "linen-sofa",
    name: "The linen sofa",
    category: "seating",
    sort: 10,
    priceNaira: 2_450_000,
    summary: "A deep sofa in undyed linen. For a sitting room that already has a life.",
    description:
      "Three seats, a loose cover, and a seat you can lie on. We specify it in living rooms in Ikoyi and Victoria Island where the light is kind to pale cloth. Delivery in Lagos is arranged after we write.",
    images: [
      {
        id: "photo-1600210492486-724fe5c67fb0",
        alt: "A pale linen sofa in a sitting room, low table of books in front",
      },
      {
        id: "photo-1600121848594-d8644e57abab",
        alt: "A cream sofa against a quiet wall",
      },
    ],
  },
  {
    slug: "two-seater",
    name: "The two-seater",
    category: "seating",
    sort: 20,
    priceNaira: 1_850_000,
    summary: "A compact sofa. Two people, a lamp, and a conversation.",
    description:
      "Shorter than a family sofa, deeper than a bench. Useful in a study, a suite, or a sitting room that cannot take a third seat. The cloth is a warm grey.",
    images: [
      {
        id: "photo-1484101403633-562f891dc89a",
        alt: "A grey two-seat sofa with pale cushions",
      },
      {
        id: "photo-1618221195710-dd6b41faaea6",
        alt: "A sitting room with a low sofa and a timber floor",
      },
    ],
  },
  {
    slug: "velvet-sofa",
    name: "A velvet sofa",
    category: "seating",
    sort: 30,
    priceNaira: 3_200_000,
    summary: "Green velvet, a firm seat, and a presence in the room.",
    description:
      "We use this where the architecture is plain and the furniture has to do the work. The pile takes evening light. Not for a house with young children and a dog — unless you mean it.",
    images: [
      {
        id: "photo-1555041469-a586c61ea9bc",
        alt: "A green velvet sofa on a pale floor",
      },
      {
        id: "photo-1567016432779-094069958ea5",
        alt: "A deep velvet sofa in a quiet interior",
      },
    ],
  },
  {
    slug: "deep-armchair",
    name: "A deep armchair",
    category: "seating",
    sort: 40,
    priceNaira: 780_000,
    summary: "One person, a book, a window. The seat is generous.",
    description:
      "An armchair that does not look as if it arrived last week. We place it toward the light, with a small table at the right hand. The cover is a warm stone.",
    images: [
      {
        id: "photo-1567538096630-e0c55bd6374c",
        alt: "A grey upholstered armchair on a timber floor",
      },
      {
        id: "photo-1586023492125-27b2c045efd7",
        alt: "A wooden armchair beside a plant, against a pale wall",
      },
    ],
  },
  {
    slug: "lounge-chair",
    name: "The lounge chair",
    category: "seating",
    sort: 50,
    priceNaira: 920_000,
    summary: "A low chair with a mind of its own. For a sitting room or a suite.",
    description:
      "Not a replica of a famous chair. A lounge with a leather seat and a quiet frame. We specify it where a sofa would be too much, and a dining chair too little.",
    images: [
      {
        id: "photo-1592078615290-033ee584e267",
        alt: "A black lounge chair with a timber frame",
      },
      {
        id: "photo-1598300042247-d088f8ab3a91",
        alt: "A mustard armchair in a corner with a lamp",
      },
    ],
  },
  {
    slug: "dining-table",
    name: "A dining table",
    category: "table",
    sort: 60,
    priceNaira: 1_650_000,
    summary: "A long table for eight. Oak, a calm top, and room for elbows.",
    description:
      "Made for a dining room that is also used for homework, a laptop, and Sunday lunch. The top is timber. We will confirm the length once we have seen the room.",
    images: [
      {
        id: "photo-1617806118233-18e1de247200",
        alt: "A long dining table set with chairs in a pale room",
      },
      {
        id: "photo-1616137466211-f939a420be84",
        alt: "A dining table and chairs under a simple pendant",
      },
    ],
  },
  {
    slug: "low-table",
    name: "The low table",
    category: "table",
    sort: 70,
    priceNaira: 420_000,
    summary: "A coffee table that can take books, a tray, and a pair of feet.",
    description:
      "Low, rectangular, and not precious. We put it in front of a sofa that people actually sit on. Timber, with a top that can be wiped.",
    images: [
      {
        id: "photo-1600210491892-03d54c0aaf87",
        alt: "A low timber table in front of a sofa",
      },
      {
        id: "photo-1616486338812-3dadae4b4ace",
        alt: "A sitting room with a low table and a rug",
      },
    ],
  },
  {
    slug: "writing-desk",
    name: "A writing desk",
    category: "table",
    sort: 80,
    priceNaira: 680_000,
    summary: "A desk for a private office, a study, or a bedroom that works.",
    description:
      "A simple top, drawers that close, and room for a lamp. We specify it facing a window when we can, and away from the door. Oak, or a painted finish.",
    images: [
      {
        id: "photo-1611269154421-4e27233ac5c7",
        alt: "A wooden writing desk against a wall",
      },
      {
        id: "photo-1497366811353-6870744d04b2",
        alt: "A quiet office with a long desk and a chair",
      },
    ],
  },
  {
    slug: "round-table",
    name: "The round table",
    category: "table",
    sort: 90,
    priceNaira: 540_000,
    summary: "A round table for four. Breakfast, or a small dining room.",
    description:
      "Useful where a rectangle would crowd the walk. Four chairs sit without a head of the table. Timber top, a simple base.",
    images: [
      {
        id: "photo-1533090481720-856c6e3c1fdc",
        alt: "A round wooden table with two chairs",
      },
      {
        id: "photo-1600566752355-35792bedcfea",
        alt: "A dining corner with a table and a window",
      },
    ],
  },
  {
    slug: "oak-sideboard",
    name: "The oak sideboard",
    category: "storage",
    sort: 100,
    priceNaira: 980_000,
    summary: "A long sideboard for a dining room or a hall. Doors, not shelves.",
    description:
      "Plates, linen, the things you do not want on the table. The doors close quietly. We leave the top clear except for a lamp and one object.",
    images: [
      {
        id: "photo-1600607687939-ce8a6c25118c",
        alt: "A long timber table and storage in a studio with tall windows",
      },
      {
        id: "photo-1595428774223-ef52624120d2",
        alt: "A wooden dresser with drawers and a lamp",
      },
    ],
  },
  {
    slug: "tall-chest",
    name: "A tall chest",
    category: "storage",
    sort: 110,
    priceNaira: 720_000,
    summary: "A chest of drawers for a bedroom. Five drawers, a calm face.",
    description:
      "Clothes, or papers, depending on the room. Tall enough to matter, not so tall it looks like an office. Painted or timber, as the room asks.",
    images: [
      {
        id: "photo-1595428774223-ef52624120d2",
        alt: "A wooden chest of drawers in a bedroom",
      },
      {
        id: "photo-1594026112284-02bb6f3352fe",
        alt: "A cabinet and a chair in a quiet interior",
      },
    ],
  },
  {
    slug: "console",
    name: "The console",
    category: "storage",
    sort: 120,
    priceNaira: 610_000,
    summary: "A narrow table for a hall, a landing, or behind a sofa.",
    description:
      "Keys, a lamp, a bowl. The piece is slim so a passage still works. We specify it in timber, with a drawer if the hall needs one.",
    images: [
      {
        id: "photo-1615529328331-f8917597711f",
        alt: "A console table in an entrance with a lamp",
      },
      {
        id: "photo-1600607687920-4e2a09cf159d",
        alt: "A long interior table in a pale room",
      },
    ],
  },
  {
    slug: "still-bed",
    name: "The still bed",
    category: "sleep",
    sort: 130,
    priceNaira: 1_850_000,
    summary: "A low bed in linen. Quiet, and meant to be slept in.",
    description:
      "A timber frame, a headboard you can sit against, and a cover that is washed. We dress it with two pillows and one throw. The figure is for the bed as shown, without mattress extras.",
    images: [
      {
        id: "photo-1505693416388-ac5ce068fe85",
        alt: "A white bed with linen in a pale bedroom",
      },
      {
        id: "photo-1616594039964-ae9021a400a0",
        alt: "A bedroom with a made bed, a bench, and morning light",
      },
    ],
  },
  {
    slug: "upholstered-bed",
    name: "An upholstered bed",
    category: "sleep",
    sort: 140,
    priceNaira: 2_150_000,
    summary: "A bed with a padded headboard. For a room that needs a little weight.",
    description:
      "The headboard is upholstered in a cloth we can change. Useful in a room with hard floors, or a suite that should feel finished. King, or a smaller size if the room is tight.",
    images: [
      {
        id: "photo-1616627547584-bf28cee262db",
        alt: "An upholstered bed with a tall headboard",
      },
      {
        id: "photo-1560448204-e02f11c3d0e2",
        alt: "A bedroom with an upholstered bed and side tables",
      },
    ],
  },
  {
    slug: "nightstand",
    name: "The nightstand",
    category: "sleep",
    sort: 150,
    priceNaira: 280_000,
    summary: "A small table by the bed. A lamp, a book, a glass of water.",
    description:
      "Sold as a pair if the bed needs two. A drawer, a quiet face, and a height that meets the mattress. Timber, or painted to the room.",
    images: [
      {
        id: "photo-1540932239986-30128078f3c5",
        alt: "A bedroom with a hanging light and a side table",
      },
      {
        id: "photo-1595526114035-0d45ed16cfbf",
        alt: "A made bed with pillows and a table beside it",
      },
    ],
  },
  {
    slug: "wool-rug",
    name: "A wool rug",
    category: "textile",
    sort: 160,
    priceNaira: 480_000,
    summary: "A wool rug with a quiet pattern. Under a sofa, or a dining table.",
    description:
      "Large enough that the front legs of the sofa sit on it. Wool, not silk. We will confirm the size once we have the plan of the room.",
    images: [
      {
        id: "photo-1603912699214-92627f304eb6",
        alt: "A patterned wool rug on a timber floor",
      },
      {
        id: "photo-1631679706909-1844bbd07221",
        alt: "A sitting room with a large rug under the furniture",
      },
    ],
  },
  {
    slug: "lined-curtains",
    name: "Lined curtains",
    category: "textile",
    sort: 170,
    priceNaira: 390_000,
    summary: "Lined curtains, made to the window. A cloth we will agree in person.",
    description:
      "The figure is a starting band for a typical sitting-room pair, lined, to the floor. We measure on site. Sheers can sit behind if the street is close.",
    images: [
      {
        id: "photo-1513694203232-719a280e022f",
        alt: "Floor-length curtains at a tall window",
      },
      {
        id: "photo-1600573472592-401b489a3cdc",
        alt: "A room with long curtains and afternoon light",
      },
    ],
  },
  {
    slug: "sitting-room-rug",
    name: "The sitting-room rug",
    category: "textile",
    sort: 180,
    priceNaira: 620_000,
    summary: "A larger rug for a living room. Soft underfoot, and not too pale.",
    description:
      "Meant to hold a sofa, two chairs, and the low table. The ground is a warm clay. We will not put a white rug in a house that is lived in.",
    images: [
      {
        id: "photo-1616486338812-3dadae4b4ace",
        alt: "A living room rug under a sofa and a low table",
      },
      {
        id: "photo-1600585154363-67eb9e2e2099",
        alt: "A furnished sitting room with a rug and a window",
      },
    ],
  },
];

async function seed() {
  await mkdir(generatedDir, { recursive: true });
  await mkdir(mediaDir, { recursive: true });
  await mkdir(productsDir, { recursive: true });

  const prisma = new PrismaClient();
  try {
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();

    for (const piece of pieces) {
      await prisma.product.create({
        data: {
          slug: piece.slug,
          name: piece.name,
          category: piece.category,
          summary: piece.summary,
          description: piece.description,
          priceNaira: piece.priceNaira,
          published: true,
          sort: piece.sort,
          images: {
            create: piece.images.map((image, index) => ({
              url: u(image.id),
              alt: image.alt,
              sort: index,
            })),
          },
        },
      });
    }

    console.info(
      JSON.stringify({
        ok: true,
        products: pieces.length,
        note: "Demo catalogue. Unsplash stills until the studio photographs its own pieces.",
      }),
    );
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
