import type { FurnitureId } from "@/lib/spaces";

const LINEN = "#cbb8a2";
const LINEN_LIT = "#ddcbb6";
const LINEN_DEEP = "#a89278";
const WALNUT = "#6b4a32";
const WALNUT_DEEP = "#4a3222";
const OAK = "#a0784c";
const OAK_LIGHT = "#c4a070";
const LEATHER = "#7a4e38";
const LEATHER_DEEP = "#5c3828";
const LEATHER_LIT = "#95624a";
const CHAR = "#3d3934";
const CHAR_DEEP = "#2a2724";
const CHAR_LIT = "#524c46";
const STONE = "#d4ccc0";
const STONE_DEEP = "#b7ad9e";
const BRASS = "#b08a4a";
const SHEET = "#e8e0d4";
const INK = "#1c1916";
const INDIGO = "#3d4a6b";
const FOREST = "#3f4f3a";
const CREAM = "#efe6d8";

export function PieceGraphic({ kind }: { kind: FurnitureId }) {
  switch (kind) {
    case "sofa":
      return <Sofa />;
    case "lounge":
      return <Lounge />;
    case "armchair":
      return <Armchair />;
    case "dining-chair":
      return <DiningChair />;
    case "swivel":
      return <TaskChair />;
    case "visitor":
      return <VisitorChair />;
    case "bench":
      return <Bench />;
    case "banquette":
      return <Banquette />;
    case "stool":
      return <Stool />;
    case "coffee-table":
      return <CoffeeTable />;
    case "side-table":
      return <SideTable />;
    case "dining-table":
      return <DiningTable />;
    case "conference":
      return <ConferenceTable />;
    case "desk":
      return <Desk />;
    case "workstation":
      return <Workstation />;
    case "bed":
      return <Bed />;
    case "nightstand":
      return <Nightstand />;
    case "dresser":
      return <Dresser />;
    case "sideboard":
      return <Sideboard />;
    case "credenza":
      return <Credenza />;
    case "console":
      return <Console />;
    case "bookcase":
      return <Bookcase />;
    case "reception-desk":
      return <ReceptionDesk />;
    case "plinth":
      return <Plinth />;
    case "rug":
      return <Rug />;
    default:
      return <Armchair />;
  }
}

function Shadow({ rx, ry, cy = 24 }: { rx: number; ry: number; cy?: number }) {
  return <ellipse cx={4} cy={cy} rx={rx} ry={ry} fill={INK} opacity={0.2} />;
}

function isoBox(
  cx: number,
  cy: number,
  w: number,
  h: number,
  d: number,
  fills: { top: string; front: string; side: string },
) {
  const ox = d * 0.58;
  const oy = d * 0.3;
  const x0 = cx - w / 2;
  const y0 = cy - h;
  const x1 = x0 + w;
  const y1 = cy;
  return (
    <g>
      <polygon
        points={`${x1},${y0} ${x1 + ox},${y0 + oy} ${x1 + ox},${y1 + oy} ${x1},${y1}`}
        fill={fills.side}
      />
      <polygon
        points={`${x0},${y0} ${x1},${y0} ${x1},${y1} ${x0},${y1}`}
        fill={fills.front}
      />
      <polygon
        points={`${x0},${y0} ${x1},${y0} ${x1 + ox},${y0 + oy} ${x0 + ox},${y0 + oy}`}
        fill={fills.top}
      />
    </g>
  );
}

function taperedLeg(x: number, y: number, h: number, fill = WALNUT_DEEP) {
  return (
    <polygon
      points={`${x - 3.5},${y} ${x + 3.5},${y} ${x + 2},${y + h} ${x - 2},${y + h}`}
      fill={fill}
    />
  );
}

function Sofa() {
  return (
    <g>
      <Shadow rx={128} ry={22} />
      {taperedLeg(-88, 10, 16)}
      {taperedLeg(78, 10, 16)}
      {taperedLeg(-64, 22, 12, WALNUT)}
      {taperedLeg(98, 22, 12, WALNUT)}
      {isoBox(0, 12, 196, 16, 52, {
        top: LINEN_DEEP,
        front: LINEN,
        side: "#9a846c",
      })}
      <path
        d="M-108 -8 C-118 -44 -96 -58 -78 -58 L-78 8 C-96 10 -108 4 -108 -8 Z"
        fill={LINEN}
      />
      <path
        d="M-78 -58 C-78 -64 -70 -68 -58 -64 C-42 -20 -48 6 -78 8 Z"
        fill={LINEN_LIT}
        opacity="0.55"
      />
      <path
        d="M108 -8 C118 -44 96 -58 78 -58 L78 8 C96 10 108 4 108 -8 Z"
        fill={LINEN_DEEP}
      />
      <path
        d="M-76 -54 L70 -54 C78 -54 82 -46 80 -22 L-74 -18 C-80 -42 -80 -54 -76 -54 Z"
        fill={LINEN_DEEP}
      />
      <path
        d="M-70 -48 L64 -48 C70 -48 72 -42 70 -28 L-68 -24 Z"
        fill={LINEN}
      />
      <rect x="-72" y="-14" width="58" height="20" rx="6" fill={LINEN_LIT} />
      <rect x="-10" y="-14" width="58" height="20" rx="6" fill={CREAM} />
      <rect x="52" y="-12" width="28" height="18" rx="6" fill={LINEN_LIT} />
      <path d="M-108 2 C-90 14 -40 18 0 16 C40 14 86 12 108 2" fill="none" stroke={LINEN_DEEP} strokeWidth="2" opacity="0.5" />
    </g>
  );
}

function Lounge() {
  return (
    <g>
      <Shadow rx={62} ry={16} />
      {taperedLeg(-22, 8, 18)}
      {taperedLeg(18, 8, 18)}
      {taperedLeg(-8, 18, 14, WALNUT)}
      {taperedLeg(32, 18, 14, WALNUT)}
      <ellipse cx="2" cy="2" rx="48" ry="20" fill={LEATHER} />
      <ellipse cx="2" cy="-2" rx="44" ry="16" fill={LEATHER_LIT} />
      <path
        d="M-38 0 C-48 -36 -20 -68 8 -70 C40 -72 58 -36 50 2 C28 8 -18 10 -38 0 Z"
        fill={LEATHER}
      />
      <path
        d="M-18 -8 C-12 -40 18 -52 38 -36 C22 -8 4 2 -18 -8 Z"
        fill={LEATHER_DEEP}
        opacity="0.45"
      />
      <path
        d="M-42 -4 C-50 -28 -36 -40 -22 -18"
        fill="none"
        stroke={LEATHER_LIT}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <ellipse cx="6" cy="-58" rx="10" ry="6" fill={LEATHER_DEEP} />
    </g>
  );
}

function Armchair() {
  return (
    <g>
      <Shadow rx={58} ry={16} />
      {taperedLeg(-28, 10, 16)}
      {taperedLeg(24, 10, 16)}
      {taperedLeg(-12, 20, 12, WALNUT)}
      {taperedLeg(40, 20, 12, WALNUT)}
      {isoBox(2, 10, 78, 14, 36, { top: LINEN, front: LINEN_LIT, side: LINEN_DEEP })}
      <path
        d="M-40 -6 C-48 -40 -20 -58 4 -58 C30 -58 48 -34 42 -4 L-36 0 Z"
        fill={LINEN_DEEP}
      />
      <path
        d="M-28 -8 C-16 -40 16 -46 32 -22 C14 -6 -8 0 -28 -8 Z"
        fill={LINEN_LIT}
      />
      <path
        d="M-46 -4 C-54 -22 -46 -28 -36 -10 L-34 8 C-46 8 -50 2 -46 -4 Z"
        fill={LINEN}
      />
      <path
        d="M44 -4 C52 -22 44 -28 34 -10 L36 8 C48 8 52 2 44 -4 Z"
        fill={LINEN_DEEP}
      />
    </g>
  );
}

function DiningChair() {
  return (
    <g>
      <Shadow rx={32} ry={10} cy={28} />
      {taperedLeg(-16, 6, 22, OAK)}
      {taperedLeg(12, 6, 22, OAK)}
      {taperedLeg(-6, 16, 18, WALNUT)}
      {taperedLeg(24, 16, 18, WALNUT)}
      <polygon
        points="-22,4 18,4 32,16 -8,16"
        fill={OAK}
      />
      <polygon
        points="-22,4 18,4 16,-2 -24,-2"
        fill={OAK_LIGHT}
      />
      <polygon
        points="-20,-1 14,-1 12,-8 -22,-8"
        fill={LINEN}
      />
      <rect x="-18" y="-62" width="7" height="56" rx="2" fill={OAK} />
      <rect x="8" y="-62" width="7" height="56" rx="2" fill={WALNUT} />
      <path
        d="M-16 -60 C-16 -68 12 -68 12 -60 L14 -18 C14 -12 -18 -12 -16 -18 Z"
        fill={OAK_LIGHT}
      />
      <path
        d="M-10 -54 C-8 -58 6 -58 8 -52 L8 -24 C4 -20 -8 -20 -10 -24 Z"
        fill={LINEN}
      />
      <line x1="-14" y1="12" x2="20" y2="20" stroke={WALNUT} strokeWidth="3" />
    </g>
  );
}

function TaskChair() {
  return (
    <g>
      <Shadow rx={40} ry={12} cy={32} />
      <line x1="-26" y1="28" x2="26" y2="28" stroke={INK} strokeWidth="3" />
      <line x1="-18" y1="18" x2="-30" y2="34" stroke={INK} strokeWidth="3" />
      <line x1="18" y1="18" x2="30" y2="34" stroke={INK} strokeWidth="3" />
      <circle cx="-30" cy="36" r="4.5" fill={CHAR} />
      <circle cx="30" cy="36" r="4.5" fill={CHAR} />
      <circle cx="0" cy="30" r="4.5" fill={CHAR} />
      <line x1="0" y1="8" x2="0" y2="22" stroke={INK} strokeWidth="4" />
      {isoBox(0, 8, 54, 12, 28, { top: CHAR_LIT, front: CHAR, side: CHAR_DEEP })}
      <path
        d="M-24 -6 C-28 -40 4 -50 26 -38 C30 -12 16 0 -18 2 Z"
        fill={CHAR}
      />
      <path
        d="M-10 -8 C-4 -34 16 -36 22 -16 C10 -4 -2 0 -10 -8 Z"
        fill={CHAR_LIT}
        opacity="0.5"
      />
      <rect x="22" y="-18" width="8" height="22" rx="3" fill={CHAR_DEEP} />
    </g>
  );
}

function VisitorChair() {
  return (
    <g>
      <Shadow rx={38} ry={11} />
      {taperedLeg(-18, 8, 18, WALNUT)}
      {taperedLeg(14, 8, 18, WALNUT)}
      {taperedLeg(-4, 18, 14)}
      {taperedLeg(28, 18, 14)}
      {isoBox(2, 8, 48, 10, 26, { top: LEATHER_LIT, front: LEATHER, side: LEATHER_DEEP })}
      <path
        d="M-22 -4 L-20 -48 L22 -52 L24 -6 Z"
        fill={LEATHER}
      />
      <path
        d="M-14 -10 L-12 -44 L16 -46 L18 -12 Z"
        fill={LEATHER_DEEP}
        opacity="0.35"
      />
      <rect x="-20" y="-50" width="42" height="6" rx="1" fill={WALNUT} />
    </g>
  );
}

function Bench() {
  return (
    <g>
      <Shadow rx={96} ry={14} />
      {taperedLeg(-72, 8, 18, WALNUT)}
      {taperedLeg(64, 8, 18, WALNUT)}
      {taperedLeg(-52, 20, 14)}
      {taperedLeg(84, 20, 14)}
      {isoBox(4, 8, 168, 12, 36, { top: OAK_LIGHT, front: OAK, side: WALNUT })}
      <polygon points="-80,-6 84,-6 104,8 -60,8" fill={OAK_LIGHT} opacity="0.4" />
    </g>
  );
}

function Banquette() {
  return (
    <g>
      <Shadow rx={118} ry={16} />
      {isoBox(4, 12, 200, 18, 40, { top: LEATHER, front: LEATHER_LIT, side: LEATHER_DEEP })}
      <path
        d="M-98 -10 L102 -10 L118 8 L-82 8 Z"
        fill={LEATHER_DEEP}
      />
      <rect x="-90" y="-42" width="62" height="32" rx="6" fill={LEATHER} />
      <rect x="-24" y="-42" width="62" height="32" rx="6" fill={LEATHER_LIT} />
      <rect x="42" y="-40" width="58" height="30" rx="6" fill={LEATHER} />
    </g>
  );
}

function Stool() {
  return (
    <g>
      <Shadow rx={24} ry={8} cy={26} />
      {taperedLeg(-10, 2, 24, WALNUT)}
      {taperedLeg(10, 2, 24, WALNUT)}
      {taperedLeg(0, 10, 20, OAK)}
      <ellipse cx="2" cy="-4" rx="22" ry="10" fill={OAK} />
      <ellipse cx="2" cy="-8" rx="20" ry="8" fill={OAK_LIGHT} />
      <line x1="-12" y1="14" x2="16" y2="18" stroke={WALNUT} strokeWidth="3" />
    </g>
  );
}

function CoffeeTable() {
  return (
    <g>
      <Shadow rx={82} ry={16} />
      {taperedLeg(-48, 2, 22, WALNUT)}
      {taperedLeg(40, 2, 22, WALNUT)}
      {taperedLeg(-28, 16, 16)}
      {taperedLeg(62, 16, 16)}
      {isoBox(4, 4, 132, 8, 48, { top: OAK_LIGHT, front: OAK, side: WALNUT })}
      <polygon
        points="-62,-6 70,-6 96,10 -36,10"
        fill={CREAM}
        opacity="0.35"
      />
      <line x1="-40" y1="14" x2="70" y2="22" stroke={WALNUT} strokeWidth="4" opacity="0.7" />
    </g>
  );
}

function SideTable() {
  return (
    <g>
      <Shadow rx={30} ry={9} />
      {taperedLeg(-4, 0, 22, WALNUT)}
      <ellipse cx="4" cy="0" rx="26" ry="12" fill={STONE_DEEP} />
      <ellipse cx="4" cy="-8" rx="24" ry="10" fill={STONE} />
      <ellipse cx="8" cy="-10" rx="10" ry="4" fill={SHEET} opacity="0.5" />
    </g>
  );
}

function DiningTable() {
  return (
    <g>
      <Shadow rx={138} ry={22} />
      {taperedLeg(-88, 2, 22, WALNUT)}
      {taperedLeg(72, 2, 22, WALNUT)}
      {taperedLeg(-60, 20, 16)}
      {taperedLeg(100, 20, 16)}
      {isoBox(6, 4, 220, 10, 64, { top: OAK_LIGHT, front: OAK, side: WALNUT })}
      <polygon
        points="-104,-8 116,-8 152,12 -68,12"
        fill={WALNUT}
        opacity="0.25"
      />
      <line x1="-70" y1="-4" x2="-70" y2="2" stroke={OAK_LIGHT} strokeWidth="2" opacity="0.6" />
      <line x1="0" y1="-6" x2="0" y2="0" stroke={OAK_LIGHT} strokeWidth="2" opacity="0.45" />
      <line x1="70" y1="-4" x2="70" y2="2" stroke={OAK_LIGHT} strokeWidth="2" opacity="0.6" />
    </g>
  );
}

function ConferenceTable() {
  return (
    <g>
      <Shadow rx={156} ry={22} />
      {taperedLeg(-100, 4, 20, CHAR_DEEP)}
      {taperedLeg(90, 4, 20, CHAR_DEEP)}
      {taperedLeg(-70, 20, 14, INK)}
      {taperedLeg(118, 20, 14, INK)}
      {isoBox(8, 4, 260, 10, 56, { top: CHAR_LIT, front: CHAR, side: CHAR_DEEP })}
      <ellipse cx="8" cy="-8" rx="36" ry="8" fill={BRASS} opacity="0.28" />
    </g>
  );
}

function Desk() {
  return (
    <g>
      <Shadow rx={100} ry={16} />
      {isoBox(-62, 22, 36, 22, 28, { top: WALNUT, front: WALNUT_DEEP, side: "#3a2818" })}
      {isoBox(70, 22, 36, 22, 28, { top: WALNUT, front: WALNUT_DEEP, side: "#3a2818" })}
      {isoBox(4, 4, 176, 10, 48, { top: OAK_LIGHT, front: OAK, side: WALNUT })}
      {isoBox(58, 2, 28, 12, 22, { top: WALNUT, front: WALNUT_DEEP, side: "#3a2818" })}
      <rect x="62" y="-6" width="14" height="4" rx="1" fill={BRASS} />
    </g>
  );
}

function Workstation() {
  return (
    <g>
      <Shadow rx={90} ry={14} />
      {taperedLeg(-64, 6, 16, CHAR)}
      {taperedLeg(56, 6, 16, CHAR)}
      {isoBox(0, 6, 156, 8, 40, { top: SHEET, front: STONE, side: STONE_DEEP })}
      <rect x="-58" y="-44" width="6" height="36" fill={CHAR} />
      <rect x="-56" y="-48" width="52" height="32" rx="2" fill={CHAR_DEEP} />
      <rect x="-52" y="-44" width="44" height="22" fill="#1a2330" />
    </g>
  );
}

function Bed() {
  return (
    <g>
      <Shadow rx={140} ry={22} cy={40} />
      <path d="M-86 18 L96 28 L118 -6 L-64 -18 Z" fill={WALNUT} />
      <path d="M-86 18 L96 28 L96 42 L-86 32 Z" fill={WALNUT_DEEP} />
      <path d="M96 28 L118 -6 L118 8 L96 42 Z" fill={WALNUT} />
      <path d="M-78 12 L88 22 L106 -4 L-58 -14 Z" fill={SHEET} />
      <path d="M-78 12 L88 22 L88 30 L-78 20 Z" fill="#d9cfc2" />
      <path d="M-72 -18 L-58 -14 L-52 -78 L-78 -74 Z" fill={WALNUT_DEEP} />
      <path d="M-78 -74 L-52 -78 L-48 -82 L-82 -78 Z" fill={WALNUT} />
      <path d="M-70 -16 C-68 -40 -40 -48 -18 -36 L-8 -8 C-32 -12 -62 -8 -70 -16 Z" fill={SHEET} />
      <path d="M-22 -14 C-8 -38 28 -40 48 -22 L42 0 C18 -8 -8 -4 -22 -14 Z" fill="#f4eee6" />
      <path d="M-40 10 L70 20 L78 6 L-28 -4 Z" fill={LINEN} />
      <path d="M50 18 L88 24 L96 16 L70 10 Z" fill={LINEN_DEEP} />
    </g>
  );
}

function Nightstand() {
  return (
    <g>
      <Shadow rx={32} ry={10} />
      {isoBox(2, 16, 48, 34, 22, { top: OAK, front: WALNUT, side: WALNUT_DEEP })}
      <rect x="-16" y="-8" width="32" height="12" fill={WALNUT_DEEP} />
      <rect x="-4" y="-4" width="10" height="3" rx="1" fill={BRASS} />
    </g>
  );
}

function Dresser() {
  return (
    <g>
      <Shadow rx={74} ry={12} />
      {isoBox(4, 16, 128, 52, 28, { top: OAK, front: WALNUT, side: WALNUT_DEEP })}
      <rect x="-50" y="-26" width="100" height="12" fill={WALNUT_DEEP} />
      <rect x="-50" y="-10" width="100" height="12" fill={WALNUT_DEEP} />
      <rect x="-8" y="-22" width="16" height="4" rx="1" fill={BRASS} />
      <rect x="-8" y="-6" width="16" height="4" rx="1" fill={BRASS} />
    </g>
  );
}

function Sideboard() {
  return (
    <g>
      <Shadow rx={104} ry={13} />
      {taperedLeg(-80, 12, 12, WALNUT)}
      {taperedLeg(80, 12, 12, WALNUT)}
      {isoBox(4, 12, 188, 40, 32, { top: OAK_LIGHT, front: OAK, side: WALNUT })}
      <rect x="-74" y="-16" width="68" height="22" fill={WALNUT} />
      <rect x="10" y="-16" width="68" height="22" fill={WALNUT} />
      <rect x="-48" y="-6" width="12" height="4" rx="1" fill={BRASS} />
      <rect x="36" y="-6" width="12" height="4" rx="1" fill={BRASS} />
    </g>
  );
}

function Credenza() {
  return (
    <g>
      <Shadow rx={100} ry={12} />
      {isoBox(4, 14, 180, 38, 30, { top: STONE, front: CHAR, side: CHAR_DEEP })}
      <line x1="-28" y1="-20" x2="-28" y2="14" stroke={CHAR_DEEP} strokeWidth="2" />
      <line x1="32" y1="-20" x2="32" y2="14" stroke={CHAR_DEEP} strokeWidth="2" />
    </g>
  );
}

function Console() {
  return (
    <g>
      <Shadow rx={82} ry={12} />
      {taperedLeg(-60, 6, 16, WALNUT)}
      {taperedLeg(56, 6, 16, WALNUT)}
      {taperedLeg(-42, 16, 12)}
      {taperedLeg(74, 16, 12)}
      {isoBox(4, 6, 144, 8, 28, { top: STONE, front: OAK, side: WALNUT })}
    </g>
  );
}

function Bookcase() {
  return (
    <g>
      <Shadow rx={46} ry={10} />
      {isoBox(4, 16, 76, 92, 22, { top: OAK, front: WALNUT, side: WALNUT_DEEP })}
      <rect x="-28" y="-68" width="60" height="16" fill={WALNUT_DEEP} />
      <rect x="-28" y="-44" width="60" height="16" fill={WALNUT_DEEP} />
      <rect x="-28" y="-20" width="60" height="16" fill={WALNUT_DEEP} />
      <rect x="-24" y="-64" width="12" height="12" fill={LEATHER} />
      <rect x="-8" y="-64" width="10" height="12" fill={LINEN} />
      <rect x="6" y="-64" width="14" height="12" fill={CHAR} />
      <rect x="-22" y="-40" width="16" height="12" fill={INDIGO} />
      <rect x="-2" y="-40" width="12" height="12" fill={FOREST} />
      <rect x="14" y="-40" width="14" height="12" fill={LEATHER_DEEP} />
    </g>
  );
}

function ReceptionDesk() {
  return (
    <g>
      <Shadow rx={136} ry={18} />
      {isoBox(4, 18, 236, 36, 40, { top: OAK, front: STONE, side: STONE_DEEP })}
      <polygon points="-114,-18 122,-18 144,-4 -92,-4" fill={OAK_LIGHT} />
      <rect x="-36" y="-10" width="72" height="8" fill={STONE_DEEP} />
    </g>
  );
}

function Plinth() {
  return (
    <g>
      <Shadow rx={38} ry={11} />
      {isoBox(2, 14, 56, 34, 24, { top: SHEET, front: STONE, side: STONE_DEEP })}
    </g>
  );
}

function Rug() {
  return (
    <g>
      <ellipse cx="4" cy="10" rx="154" ry="50" fill="#7a4e38" opacity="0.45" />
      <ellipse cx="4" cy="8" rx="148" ry="46" fill="#8a5a42" opacity="0.7" />
      <ellipse cx="4" cy="8" rx="128" ry="36" fill="none" stroke="#d4c4a8" strokeWidth="3" opacity="0.75" />
      <ellipse cx="4" cy="8" rx="64" ry="16" fill="none" stroke="#cbb8a2" strokeWidth="2" opacity="0.55" />
    </g>
  );
}
