import type { FurnitureId } from "@/lib/spaces";

const LINEN = "#cbb8a2";
const LINEN_DEEP = "#a89278";
const WALNUT = "#6b4a32";
const WALNUT_DEEP = "#4a3222";
const OAK = "#a0784c";
const OAK_LIGHT = "#c4a070";
const LEATHER = "#7a4e38";
const LEATHER_DEEP = "#5c3828";
const CHAR = "#3d3934";
const CHAR_DEEP = "#2a2724";
const STONE = "#d4ccc0";
const STONE_DEEP = "#b7ad9e";
const BRASS = "#b08a4a";
const SHEET = "#e8e0d4";
const INK = "#1c1916";
const INDIGO = "#3d4a6b";
const FOREST = "#3f4f3a";

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

function Sofa() {
  return (
    <g>
      <ellipse cx="0" cy="18" rx="118" ry="16" fill={INK} opacity="0.18" />
      <path d="M-108 8 L108 8 L96 22 L-96 22 Z" fill={LINEN_DEEP} />
      <rect x="-100" y="-28" width="200" height="40" rx="8" fill={LINEN} />
      <rect x="-96" y="-52" width="192" height="28" rx="10" fill={LINEN_DEEP} />
      <rect x="-108" y="-18" width="22" height="34" rx="6" fill={LINEN_DEEP} />
      <rect x="86" y="-18" width="22" height="34" rx="6" fill={LINEN_DEEP} />
      <rect x="-88" y="-22" width="82" height="22" rx="5" fill="#d8c6b0" />
      <rect x="6" y="-22" width="82" height="22" rx="5" fill="#d8c6b0" />
      <rect x="-94" y="10" width="10" height="14" fill={WALNUT_DEEP} />
      <rect x="84" y="10" width="10" height="14" fill={WALNUT_DEEP} />
    </g>
  );
}

function Lounge() {
  return (
    <g>
      <ellipse cx="0" cy="20" rx="58" ry="12" fill={INK} opacity="0.18" />
      <ellipse cx="0" cy="4" rx="52" ry="18" fill={LEATHER} />
      <path d="M-46 0 C-50 -38 -18 -62 4 -62 C36 -62 54 -30 48 4 Z" fill={LEATHER} />
      <path d="M-28 -8 C-24 -36 8 -48 28 -36 C18 -8 0 4 -28 -8 Z" fill={LEATHER_DEEP} opacity="0.45" />
      <rect x="-28" y="8" width="56" height="8" rx="2" fill={WALNUT} />
      <rect x="-22" y="14" width="8" height="12" fill={WALNUT_DEEP} />
      <rect x="14" y="14" width="8" height="12" fill={WALNUT_DEEP} />
    </g>
  );
}

function Armchair() {
  return (
    <g>
      <ellipse cx="0" cy="20" rx="54" ry="12" fill={INK} opacity="0.16" />
      <rect x="-40" y="-8" width="80" height="22" rx="6" fill={LINEN} />
      <rect x="-36" y="-40" width="72" height="36" rx="8" fill={LINEN_DEEP} />
      <rect x="-48" y="-16" width="16" height="28" rx="5" fill={LINEN} />
      <rect x="32" y="-16" width="16" height="28" rx="5" fill={LINEN} />
      <rect x="-28" y="-18" width="56" height="16" rx="4" fill="#d4c2ac" />
      <rect x="-32" y="12" width="8" height="14" fill={WALNUT_DEEP} />
      <rect x="24" y="12" width="8" height="14" fill={WALNUT_DEEP} />
    </g>
  );
}

function DiningChair() {
  return (
    <g>
      <ellipse cx="0" cy="22" rx="28" ry="8" fill={INK} opacity="0.14" />
      <rect x="-18" y="-2" width="36" height="10" rx="2" fill={OAK} />
      <rect x="-16" y="-42" width="32" height="42" rx="3" fill={OAK_LIGHT} />
      <rect x="-12" y="-36" width="24" height="20" rx="2" fill="none" stroke={WALNUT} strokeWidth="3" />
      <rect x="-14" y="8" width="6" height="18" fill={WALNUT} />
      <rect x="8" y="8" width="6" height="18" fill={WALNUT} />
    </g>
  );
}

function TaskChair() {
  return (
    <g>
      <ellipse cx="0" cy="24" rx="36" ry="10" fill={INK} opacity="0.16" />
      <rect x="-22" y="-38" width="44" height="34" rx="8" fill={CHAR} />
      <rect x="-26" y="-8" width="52" height="14" rx="4" fill={CHAR_DEEP} />
      <line x1="0" y1="6" x2="0" y2="18" stroke={INK} strokeWidth="4" />
      <line x1="-22" y1="22" x2="22" y2="22" stroke={INK} strokeWidth="3" />
      <line x1="-16" y1="14" x2="-28" y2="28" stroke={INK} strokeWidth="3" />
      <line x1="16" y1="14" x2="28" y2="28" stroke={INK} strokeWidth="3" />
      <circle cx="-28" cy="30" r="4" fill={CHAR} />
      <circle cx="28" cy="30" r="4" fill={CHAR} />
      <circle cx="0" cy="24" r="4" fill={CHAR} />
    </g>
  );
}

function VisitorChair() {
  return (
    <g>
      <ellipse cx="0" cy="20" rx="36" ry="9" fill={INK} opacity="0.14" />
      <rect x="-24" y="-6" width="48" height="12" rx="3" fill={LEATHER} />
      <path d="M-22 -6 L-22 -40 L22 -40 L22 -6" fill={LEATHER_DEEP} />
      <rect x="-20" y="6" width="6" height="16" fill={WALNUT} />
      <rect x="14" y="6" width="6" height="16" fill={WALNUT} />
    </g>
  );
}

function Bench() {
  return (
    <g>
      <ellipse cx="0" cy="18" rx="90" ry="12" fill={INK} opacity="0.14" />
      <rect x="-84" y="-8" width="168" height="16" rx="3" fill={OAK} />
      <rect x="-80" y="-2" width="160" height="6" fill={OAK_LIGHT} />
      <rect x="-72" y="8" width="10" height="16" fill={WALNUT_DEEP} />
      <rect x="62" y="8" width="10" height="16" fill={WALNUT_DEEP} />
    </g>
  );
}

function Banquette() {
  return (
    <g>
      <ellipse cx="0" cy="18" rx="110" ry="14" fill={INK} opacity="0.16" />
      <rect x="-100" y="-8" width="200" height="22" rx="4" fill={LEATHER} />
      <rect x="-100" y="-44" width="200" height="38" rx="6" fill={LEATHER_DEEP} />
      <rect x="-88" y="-18" width="56" height="14" rx="3" fill="#8a5a42" />
      <rect x="-24" y="-18" width="56" height="14" rx="3" fill="#8a5a42" />
      <rect x="40" y="-18" width="48" height="14" rx="3" fill="#8a5a42" />
    </g>
  );
}

function Stool() {
  return (
    <g>
      <ellipse cx="0" cy="22" rx="22" ry="7" fill={INK} opacity="0.14" />
      <ellipse cx="0" cy="-6" rx="20" ry="8" fill={OAK} />
      <rect x="-16" y="-4" width="32" height="6" fill={OAK_LIGHT} />
      <line x1="-10" y1="2" x2="-14" y2="22" stroke={WALNUT} strokeWidth="4" />
      <line x1="10" y1="2" x2="14" y2="22" stroke={WALNUT} strokeWidth="4" />
      <line x1="0" y1="2" x2="0" y2="22" stroke={WALNUT} strokeWidth="4" />
      <line x1="-12" y1="14" x2="12" y2="14" stroke={WALNUT} strokeWidth="3" />
    </g>
  );
}

function CoffeeTable() {
  return (
    <g>
      <ellipse cx="0" cy="16" rx="78" ry="14" fill={INK} opacity="0.14" />
      <ellipse cx="0" cy="-6" rx="72" ry="22" fill={OAK} />
      <ellipse cx="0" cy="-10" rx="68" ry="18" fill={OAK_LIGHT} />
      <rect x="-8" y="-2" width="8" height="18" fill={WALNUT_DEEP} />
      <rect x="4" y="-2" width="6" height="16" fill={WALNUT} opacity="0.7" />
    </g>
  );
}

function SideTable() {
  return (
    <g>
      <ellipse cx="0" cy="18" rx="28" ry="8" fill={INK} opacity="0.14" />
      <ellipse cx="0" cy="-8" rx="26" ry="10" fill={STONE} />
      <rect x="-22" y="-6" width="44" height="6" fill={STONE_DEEP} />
      <rect x="-4" y="0" width="8" height="18" fill={WALNUT} />
    </g>
  );
}

function DiningTable() {
  return (
    <g>
      <ellipse cx="0" cy="16" rx="130" ry="18" fill={INK} opacity="0.16" />
      <ellipse cx="0" cy="-8" rx="124" ry="36" fill={WALNUT} />
      <ellipse cx="0" cy="-16" rx="118" ry="30" fill={OAK} />
      <line x1="-40" y1="-16" x2="-40" y2="-8" stroke={OAK_LIGHT} strokeWidth="2" opacity="0.5" />
      <line x1="0" y1="-20" x2="0" y2="-10" stroke={OAK_LIGHT} strokeWidth="2" opacity="0.4" />
      <line x1="40" y1="-16" x2="40" y2="-8" stroke={OAK_LIGHT} strokeWidth="2" opacity="0.5" />
      <rect x="-88" y="4" width="10" height="16" fill={WALNUT_DEEP} />
      <rect x="78" y="4" width="10" height="16" fill={WALNUT_DEEP} />
    </g>
  );
}

function ConferenceTable() {
  return (
    <g>
      <ellipse cx="0" cy="18" rx="150" ry="20" fill={INK} opacity="0.16" />
      <ellipse cx="0" cy="-10" rx="144" ry="32" fill={CHAR} />
      <ellipse cx="0" cy="-16" rx="138" ry="26" fill={CHAR_DEEP} />
      <ellipse cx="0" cy="-18" rx="40" ry="8" fill={BRASS} opacity="0.35" />
      <rect x="-100" y="6" width="12" height="16" fill={INK} />
      <rect x="88" y="6" width="12" height="16" fill={INK} />
    </g>
  );
}

function Desk() {
  return (
    <g>
      <ellipse cx="0" cy="18" rx="96" ry="14" fill={INK} opacity="0.15" />
      <path d="M-92 -12 L92 -12 L80 8 L-80 8 Z" fill={OAK} />
      <path d="M-92 -12 L92 -12 L88 -20 L-88 -20 Z" fill={OAK_LIGHT} />
      <rect x="-78" y="8" width="28" height="16" fill={WALNUT_DEEP} />
      <rect x="50" y="8" width="28" height="16" fill={WALNUT_DEEP} />
      <rect x="36" y="-8" width="22" height="14" rx="1" fill={WALNUT} />
    </g>
  );
}

function Workstation() {
  return (
    <g>
      <ellipse cx="0" cy="16" rx="86" ry="12" fill={INK} opacity="0.14" />
      <path d="M-80 -10 L80 -10 L70 6 L-70 6 Z" fill={STONE} />
      <path d="M-80 -10 L80 -10 L76 -18 L-76 -18 Z" fill={SHEET} />
      <rect x="-64" y="-40" width="4" height="30" fill={CHAR} />
      <rect x="-64" y="-44" width="48" height="28" rx="1" fill={CHAR_DEEP} />
      <rect x="-58" y="6" width="18" height="14" fill={CHAR} />
      <rect x="42" y="6" width="18" height="14" fill={CHAR} />
    </g>
  );
}

function Bed() {
  return (
    <g>
      <ellipse cx="10" cy="36" rx="132" ry="20" fill={INK} opacity="0.18" />
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
      <ellipse cx="0" cy="16" rx="28" ry="8" fill={INK} opacity="0.14" />
      <rect x="-24" y="-22" width="48" height="34" rx="2" fill={WALNUT} />
      <rect x="-24" y="-22" width="48" height="6" fill={OAK} />
      <rect x="-18" y="-10" width="36" height="10" fill={WALNUT_DEEP} />
      <rect x="-4" y="-7" width="8" height="3" rx="1" fill={BRASS} />
    </g>
  );
}

function Dresser() {
  return (
    <g>
      <ellipse cx="0" cy="16" rx="70" ry="10" fill={INK} opacity="0.14" />
      <rect x="-64" y="-40" width="128" height="52" rx="2" fill={WALNUT} />
      <rect x="-64" y="-40" width="128" height="8" fill={OAK} />
      <rect x="-54" y="-26" width="108" height="12" fill={WALNUT_DEEP} />
      <rect x="-54" y="-10" width="108" height="12" fill={WALNUT_DEEP} />
      <rect x="-8" y="-22" width="16" height="4" rx="1" fill={BRASS} />
      <rect x="-8" y="-6" width="16" height="4" rx="1" fill={BRASS} />
    </g>
  );
}

function Sideboard() {
  return (
    <g>
      <ellipse cx="0" cy="16" rx="100" ry="12" fill={INK} opacity="0.14" />
      <rect x="-94" y="-32" width="188" height="44" rx="2" fill={OAK} />
      <rect x="-94" y="-32" width="188" height="8" fill={OAK_LIGHT} />
      <rect x="-80" y="-18" width="70" height="22" fill={WALNUT} />
      <rect x="10" y="-18" width="70" height="22" fill={WALNUT} />
      <rect x="-50" y="-8" width="10" height="4" rx="1" fill={BRASS} />
      <rect x="40" y="-8" width="10" height="4" rx="1" fill={BRASS} />
    </g>
  );
}

function Credenza() {
  return (
    <g>
      <ellipse cx="0" cy="16" rx="96" ry="11" fill={INK} opacity="0.14" />
      <rect x="-90" y="-28" width="180" height="40" rx="1" fill={CHAR} />
      <rect x="-90" y="-28" width="180" height="6" fill={STONE} />
      <line x1="-30" y1="-22" x2="-30" y2="12" stroke={CHAR_DEEP} strokeWidth="2" />
      <line x1="30" y1="-22" x2="30" y2="12" stroke={CHAR_DEEP} strokeWidth="2" />
    </g>
  );
}

function Console() {
  return (
    <g>
      <ellipse cx="0" cy="16" rx="78" ry="10" fill={INK} opacity="0.12" />
      <path d="M-72 -16 L72 -16 L64 4 L-64 4 Z" fill={OAK} />
      <path d="M-72 -16 L72 -16 L68 -22 L-68 -22 Z" fill={STONE} />
      <rect x="-60" y="4" width="8" height="14" fill={WALNUT_DEEP} />
      <rect x="52" y="4" width="8" height="14" fill={WALNUT_DEEP} />
    </g>
  );
}

function Bookcase() {
  return (
    <g>
      <ellipse cx="0" cy="18" rx="42" ry="8" fill={INK} opacity="0.12" />
      <rect x="-38" y="-78" width="76" height="92" fill={WALNUT} />
      <rect x="-32" y="-70" width="64" height="18" fill={WALNUT_DEEP} />
      <rect x="-32" y="-46" width="64" height="18" fill={WALNUT_DEEP} />
      <rect x="-32" y="-22" width="64" height="18" fill={WALNUT_DEEP} />
      <rect x="-28" y="-66" width="12" height="12" fill={LEATHER} />
      <rect x="-12" y="-66" width="10" height="12" fill={LINEN} />
      <rect x="2" y="-66" width="14" height="12" fill={CHAR} />
      <rect x="-26" y="-42" width="16" height="12" fill={INDIGO} />
      <rect x="-6" y="-42" width="12" height="12" fill={FOREST} />
      <rect x="10" y="-42" width="16" height="12" fill={LEATHER_DEEP} />
    </g>
  );
}

function ReceptionDesk() {
  return (
    <g>
      <ellipse cx="0" cy="20" rx="130" ry="16" fill={INK} opacity="0.16" />
      <path d="M-120 8 L120 8 L108 20 L-108 20 Z" fill={STONE_DEEP} />
      <rect x="-118" y="-28" width="236" height="38" fill={STONE} />
      <path d="M-118 -28 L118 -28 L108 -40 L-108 -40 Z" fill={OAK} />
      <rect x="-40" y="-18" width="80" height="8" fill={STONE_DEEP} />
    </g>
  );
}

function Plinth() {
  return (
    <g>
      <ellipse cx="0" cy="16" rx="36" ry="10" fill={INK} opacity="0.14" />
      <rect x="-28" y="-24" width="56" height="36" fill={STONE} />
      <path d="M-28 -24 L28 -24 L22 -32 L-22 -32 Z" fill={SHEET} />
      <rect x="-22" y="-18" width="44" height="4" fill={STONE_DEEP} />
    </g>
  );
}

function Rug() {
  return (
    <g>
      <ellipse cx="0" cy="8" rx="150" ry="48" fill="#8a5a42" opacity="0.55" />
      <ellipse cx="0" cy="8" rx="132" ry="38" fill="none" stroke="#d4c4a8" strokeWidth="3" opacity="0.7" />
      <ellipse cx="0" cy="8" rx="70" ry="18" fill="none" stroke="#cbb8a2" strokeWidth="2" opacity="0.5" />
    </g>
  );
}
