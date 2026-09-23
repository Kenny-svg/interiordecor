"use client";

import { PieceGraphic } from "@/components/imagine/PieceGraphic";
import { getFurniture, type FurnitureId } from "@/lib/spaces";

export function pieceBox(kind: FurnitureId): { w: number; h: number; y: number } {
  const item = getFurniture(kind);
  const span = Math.max(item?.span ?? 1, 1);
  const w = 240 * span;
  const textile = item?.group === "textile";
  const low =
    kind === "coffee-table" ||
    kind === "dining-table" ||
    kind === "conference" ||
    kind === "desk" ||
    kind === "workstation" ||
    kind === "bed";
  const cap = textile ? 0.16 : low ? 0.5 : 0.78;
  const h = Math.max(w * 0.28, w * cap);
  return { w, h, y: -h };
}

export function PiecePhoto({
  kind,
  showHandle,
}: {
  kind: FurnitureId;
  showHandle?: boolean;
}) {
  const { w, y } = pieceBox(kind);

  return (
    <g>
      <PieceGraphic kind={kind} />
      {showHandle ? (
        <g data-resize="true">
          <circle cx={w / 2 - 18} cy={y + 18} r={22} fill="#1c1916" />
          <path
            d={`M${w / 2 - 26} ${y + 26} L${w / 2 - 10} ${y + 10} M${w / 2 - 18} ${y + 10} L${w / 2 - 10} ${y + 10} L${w / 2 - 10} ${y + 18}`}
            fill="none"
            stroke="#f3efe6"
            strokeWidth={4}
            strokeLinecap="square"
          />
        </g>
      ) : null}
    </g>
  );
}

export function PieceThumb({ kind }: { kind: FurnitureId }) {
  return (
    <svg viewBox="-140 -90 280 150" className="h-full w-full" aria-hidden>
      <PieceGraphic kind={kind} />
    </svg>
  );
}
