"use client";

import type { PointerEvent } from "react";
import { PieceGraphic } from "@/components/imagine/PieceGraphic";
import { getFurniture, type PlacedPiece, type Space } from "@/lib/spaces";

const PLASTER = "#ebe6dc";

export function EmptyRoom({
  space,
  paintHexes,
  lightId,
  curtainId,
  pieces,
  interactive,
  activeKey,
  onPiecePointerDown,
  mood,
}: {
  space: Space;
  paintHexes: string[];
  lightId?: string;
  curtainId?: string;
  pieces?: PlacedPiece[];
  interactive?: boolean;
  activeKey?: string | null;
  onPiecePointerDown?: (key: string, event: PointerEvent<SVGGElement>) => void;
  mood?: {
    evening?: boolean;
    keepWindows?: boolean;
    garden?: boolean;
    coast?: boolean;
    unoccupied?: boolean;
  };
}) {
  const box = geometry(space);
  const back = paintHexes[0] ?? PLASTER;
  const left = paintHexes[1] ?? paintHexes[0] ?? PLASTER;
  const right = paintHexes[2] ?? paintHexes[1] ?? paintHexes[0] ?? PLASTER;
  const leftWall = mix(left, "#1c1916", 0.1);
  const rightWall = mix(right, "#1c1916", 0.05);
  const ceiling = mix(back, "#ffffff", space.shell.height === "tall" ? 0.28 : 0.18);
  const skirting = mix(back, "#1c1916", 0.22);
  const floor = floorFill(space.shell.floor);
  const uid = space.id.replace(/[^a-z0-9-]/gi, "");
  const panes = windowRects(space, box);
  const showLight = lightId && lightId !== "none";
  const showCurtain = curtainId && curtainId !== "none";
  const { l, r, t, b } = box;

  return (
    <svg
      viewBox="0 0 1600 1000"
      className="absolute inset-0 h-full w-full"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          {mood?.evening ? (
            <>
              <stop offset="0%" stopColor="#2a3348" />
              <stop offset="45%" stopColor="#c47a4a" />
              <stop offset="100%" stopColor="#f0c48a" />
            </>
          ) : mood?.garden ? (
            <>
              <stop offset="0%" stopColor="#8eae9a" />
              <stop offset="55%" stopColor="#d5e4d4" />
              <stop offset="100%" stopColor="#e7efe0" />
            </>
          ) : mood?.coast ? (
            <>
              <stop offset="0%" stopColor="#7eafd0" />
              <stop offset="55%" stopColor="#d7e7f2" />
              <stop offset="100%" stopColor="#f7f0e2" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#c9d8e6" />
              <stop offset="55%" stopColor="#e7eef4" />
              <stop offset="100%" stopColor="#f4ead8" />
            </>
          )}
        </linearGradient>
        <linearGradient id={`${uid}-floor-wash`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${uid}-floor`}>
          <polygon points={`0,1000 ${l},${b} ${r},${b} 1600,1000`} />
        </clipPath>
      </defs>

      <polygon points={`0,0 1600,0 ${r},${t} ${l},${t}`} fill={ceiling} />
      <polygon points={`0,0 ${l},${t} ${l},${b} 0,1000`} fill={leftWall} />
      <polygon points={`1600,0 ${r},${t} ${r},${b} 1600,1000`} fill={rightWall} />
      {space.shell.window === "storefront" ? (
        <rect x={l} y={t} width={r - l} height={b - t} fill={`url(#${uid}-sky)`} />
      ) : (
        <polygon points={`${l},${t} ${r},${t} ${r},${b} ${l},${b}`} fill={back} />
      )}
      <polygon points={`0,1000 ${l},${b} ${r},${b} 1600,1000`} fill={floor.base} />

      <g clipPath={`url(#${uid}-floor)`}>
        {floor.lines.map((line) => (
          <line
            key={line}
            x1="0"
            y1={line}
            x2="1600"
            y2={line}
            stroke={floor.line}
            strokeWidth={space.shell.floor === "timber" ? 3 : 1}
            opacity="0.35"
          />
        ))}
        <polygon
          points={`${l},${b} ${r},${b} 1480,1000 120,1000`}
          fill={`url(#${uid}-floor-wash)`}
        />
      </g>

      <polygon
        points={`0,980 ${l},${b - 12} ${r},${b - 12} 1600,980 1600,1000 0,1000`}
        fill={skirting}
        opacity="0.55"
      />
      <rect x={l} y={b - 16} width={r - l} height="16" fill={skirting} />
      <line x1={l} y1={t} x2={r} y2={t} stroke={mix(back, "#1c1916", 0.12)} strokeWidth="2" />

      {space.shell.feature === "beam" ? (
        <polygon
          points={`${l + 40},${t} ${r - 40},${t} ${r - 80},${t + 28} ${l + 80},${t + 28}`}
          fill={mix(ceiling, "#1c1916", 0.18)}
        />
      ) : null}

      {space.shell.feature === "fireplace" ? (
        <g>
          <rect x={(l + r) / 2 - 70} y={b - 210} width="140" height="210" fill={mix(back, "#1c1916", 0.12)} />
          <rect x={(l + r) / 2 - 46} y={b - 118} width="92" height="118" fill="#2a2420" />
          <rect x={(l + r) / 2 - 90} y={t} width="180" height={b - t - 210} fill={mix(back, "#1c1916", 0.08)} />
        </g>
      ) : null}

      {space.shell.feature === "alcoves" ? (
        <g>
          <rect x={l + 36} y={t + 70} width="110" height={b - t - 90} fill={mix(back, "#1c1916", 0.14)} />
          <rect x={r - 146} y={t + 70} width="110" height={b - t - 90} fill={mix(back, "#1c1916", 0.14)} />
        </g>
      ) : null}

      {space.shell.feature === "niche" ? (
        <rect
          x={r - (r - l) * 0.28}
          y={t + 80}
          width={(r - l) * 0.16}
          height={(b - t) * 0.45}
          fill={mix(back, "#1c1916", 0.12)}
        />
      ) : null}

      {space.shell.feature === "counter" ? (
        <g>
          <rect x={l + 24} y={b - 78} width={r - l - 48} height="78" fill={mix(back, "#1c1916", 0.16)} />
          <rect x={l + 24} y={b - 90} width={r - l - 48} height="14" fill="#d7cfc2" />
        </g>
      ) : null}

      {space.shell.feature === "columns" ? (
        <g>
          <polygon
            points={`${l + 90},1000 ${l + 130},${b} ${l + 168},${b} ${l + 150},1000`}
            fill={mix(floor.base, "#1c1916", 0.25)}
          />
          <polygon
            points={`${r - 150},1000 ${r - 168},${b} ${r - 130},${b} ${r - 90},1000`}
            fill={mix(floor.base, "#1c1916", 0.25)}
          />
        </g>
      ) : null}

      {space.shell.door !== "none" ? (
        <Door side={space.shell.door} box={box} fill={mix(left, "#1c1916", 0.2)} />
      ) : null}

      {space.shell.window === "storefront"
        ? storefrontMullions(box, uid)
        : panes.map((pane) => (
            <g key={`${pane.x}-${pane.y}`}>
              <rect
                x={pane.x - 8}
                y={pane.y - 8}
                width={pane.w + 16}
                height={pane.h + 16}
                fill="#f4f0e8"
              />
              <rect x={pane.x} y={pane.y} width={pane.w} height={pane.h} fill={`url(#${uid}-sky)`} />
              {space.shell.window === "french" ? (
                <>
                  <line
                    x1={pane.x + pane.w / 2}
                    y1={pane.y}
                    x2={pane.x + pane.w / 2}
                    y2={pane.y + pane.h}
                    stroke="#f4f0e8"
                    strokeWidth="7"
                  />
                  <line
                    x1={pane.x}
                    y1={pane.y + pane.h * 0.5}
                    x2={pane.x + pane.w}
                    y2={pane.y + pane.h * 0.5}
                    stroke="#f4f0e8"
                    strokeWidth="7"
                  />
                </>
              ) : null}
            </g>
          ))}

      {showCurtain ? (
        <CurtainLayer
          kind={curtainId}
          panes={panes}
          box={box}
          storefront={space.shell.window === "storefront"}
          pulled={Boolean(mood?.keepWindows)}
        />
      ) : null}
      {showLight ? (
        <LightLayer kind={lightId} x={(l + r) / 2} y={t - 40} evening={Boolean(mood?.evening)} />
      ) : null}
      {mood?.garden ? <GardenPlant box={box} /> : null}
      {mood?.evening ? (
        <polygon
          points={`0,0 1600,0 1600,1000 0,1000`}
          fill="#c47a4a"
          opacity="0.12"
          style={{ pointerEvents: "none" }}
        />
      ) : null}

      {sortedPieces(pieces ?? []).map((piece) => {
        const kind = piece.pieceId;
        const extra = kind === "bed" ? 1.2 : 1;
        const anchor = floorAnchor(piece.x, piece.y, box);
        const active = activeKey === piece.key;
        return (
          <g
            key={piece.key}
            transform={`translate(${anchor.x}, ${anchor.y}) scale(${anchor.scale * extra})`}
            data-piece-key={piece.key}
            onPointerDown={
              interactive && onPiecePointerDown
                ? (event) => {
                    event.stopPropagation();
                    onPiecePointerDown(piece.key, event);
                  }
                : undefined
            }
            style={{
              pointerEvents: interactive ? "auto" : "none",
              cursor: interactive ? (active ? "grabbing" : "grab") : undefined,
            }}
          >
            {active ? (
              <ellipse cx="0" cy="10" rx="90" ry="22" fill="none" stroke="#1c1916" strokeWidth="3" opacity="0.35" />
            ) : null}
            <PieceGraphic kind={kind} />
          </g>
        );
      })}
    </svg>
  );
}

type Box = { l: number; r: number; t: number; b: number };

function sortedPieces(pieces: PlacedPiece[]): PlacedPiece[] {
  return [...pieces].sort((a, b) => {
    const aRug = getFurniture(a.pieceId)?.group === "textile" ? 0 : 1;
    const bRug = getFurniture(b.pieceId)?.group === "textile" ? 0 : 1;
    if (aRug !== bRug) {
      return aRug - bRug;
    }
    return a.y - b.y;
  });
}

export function pointerToFloor(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): { x: number; y: number } {
  const px = ((clientX - rect.left) / rect.width) * 100;
  const py = ((clientY - rect.top) / rect.height) * 100;
  const depth = Math.min(92, Math.max(8, ((py - 48) / 48) * 100));
  return {
    x: Math.min(88, Math.max(12, px)),
    y: depth,
  };
}

function floorAnchor(xPct: number, depthPct: number, box: Box) {
  const t = Math.min(1, Math.max(0, depthPct / 100));
  const y = box.b + t * (980 - box.b);
  const left = box.l + t * (80 - box.l);
  const right = box.r + t * (1520 - box.r);
  const x = left + (xPct / 100) * (right - left);
  const scale = 0.46 + t * 0.74;
  return { x, y, scale };
}

function geometry(space: Space): Box {
  const top = space.shell.height === "tall" ? 72 : space.shell.height === "low" ? 236 : 158;
  const bottom = space.shell.depth === "deep" ? 528 : space.shell.depth === "shallow" ? 708 : 612;
  const inset = space.shell.depth === "deep" ? 470 : space.shell.depth === "shallow" ? 250 : 372;
  return { l: inset, r: 1600 - inset, t: top, b: bottom };
}

function windowRects(space: Space, box: Box): { x: number; y: number; w: number; h: number }[] {
  const { l, r, t, b } = box;
  const width = r - l;
  if (space.shell.window === "storefront") {
    return [{ x: l + 18, y: t + 18, w: width - 36, h: b - t - 36 }];
  }
  if (space.shell.window === "ribbon") {
    const y = t + (b - t) * 0.22;
    const h = (b - t) * 0.28;
    const paneW = (width - 80) / space.shell.panes;
    return Array.from({ length: space.shell.panes }, (_, index) => ({
      x: l + 40 + index * paneW,
      y,
      w: paneW - 16,
      h,
    }));
  }
  if (space.shell.window === "clerestory") {
    const y = t + 28;
    const h = (b - t) * 0.22;
    const paneW = (width - 100) / space.shell.panes;
    return Array.from({ length: space.shell.panes }, (_, index) => ({
      x: l + 50 + index * paneW,
      y,
      w: paneW - 18,
      h,
    }));
  }
  if (space.shell.panes === 1) {
    const w = width * 0.36;
    return [{ x: l + (width - w) / 2, y: t + (b - t) * 0.16, w, h: (b - t) * 0.58 }];
  }
  const w = (width - 90) / 2;
  const y = t + (b - t) * 0.14;
  const h = (b - t) * 0.62;
  return [
    { x: l + 30, y, w, h },
    { x: r - 30 - w, y, w, h },
  ];
}

function storefrontMullions(box: Box, uid: string) {
  const { l, r, t, b } = box;
  const cols = 4;
  const width = (r - l) / cols;
  return (
    <g>
      {Array.from({ length: cols + 1 }, (_, index) => (
        <rect
          key={`${uid}-m-${index}`}
          x={l + index * width - 5}
          y={t}
          width="10"
          height={b - t}
          fill="#f4f0e8"
        />
      ))}
      <rect x={l} y={(t + b) / 2 - 5} width={r - l} height="10" fill="#f4f0e8" />
      <rect x={l} y={t} width={r - l} height="12" fill="#f4f0e8" />
      <rect x={l} y={b - 14} width={r - l} height="14" fill="#f4f0e8" />
    </g>
  );
}

function Door({ side, box, fill }: { side: "left" | "right"; box: Box; fill: string }) {
  const { l, r, b } = box;
  if (side === "left") {
    return <polygon points={`70,430 ${l - 20},${b - 250} ${l - 20},${b} 40,790`} fill={fill} />;
  }
  return <polygon points={`1530,430 ${r + 20},${b - 250} ${r + 20},${b} 1560,790`} fill={fill} />;
}

function CurtainLayer({
  kind,
  panes,
  box,
  storefront,
  pulled,
}: {
  kind: string;
  panes: { x: number; y: number; w: number; h: number }[];
  box: Box;
  storefront: boolean;
  pulled?: boolean;
}) {
  const first = storefront
    ? { x: box.l + 20, y: box.t + 10, w: box.r - box.l - 40, h: box.b - box.t - 20 }
    : panes[0];
  const last = storefront ? first : panes[panes.length - 1];
  if (!first || !last) {
    return null;
  }
  const x = first.x - 28;
  const w = last.x + last.w - first.x + 56;
  const y = first.y - 22;
  const h = first.h + 70;

  if (kind === "blinds") {
    const drop = pulled ? 0.18 : 1;
    return (
      <g>
        {Array.from({ length: Math.max(3, Math.round(12 * drop)) }, (_, index) => (
          <rect
            key={index}
            x={x}
            y={y + 16 + index * 16}
            width={w}
            height="9"
            fill="#d8d0c4"
            opacity="0.85"
          />
        ))}
      </g>
    );
  }

  const opacity = kind === "sheer" ? 0.38 : 0.82;
  const fill = kind === "sheer" ? "#f7f3ea" : "#d9cbb8";
  const panel = pulled ? 0.1 : 0.24;
  return (
    <g>
      <rect x={x} y={y} width={w} height="10" fill="#cfc6b8" />
      <rect x={x} y={y + 8} width={w * panel} height={h} fill={fill} opacity={opacity} />
      <rect x={x + w * (1 - panel)} y={y + 8} width={w * panel} height={h} fill={fill} opacity={opacity} />
    </g>
  );
}

function LightLayer({
  kind,
  x,
  y,
  evening,
}: {
  kind: string;
  x: number;
  y: number;
  evening?: boolean;
}) {
  const glow = evening ? 0.28 : 0.16;
  return (
    <g transform={`translate(${x}, ${Math.max(20, y)})`}>
      <ellipse cx="0" cy="130" rx="90" ry="28" fill="#f4e2b8" opacity={glow} />
      {kind === "pendant" ? (
        <g>
          <line x1="0" y1="0" x2="0" y2="62" stroke="#2c2a28" strokeWidth="3" />
          <path d="M-48 78 L0 168 L48 78 Z" fill="#c4a070" />
          <ellipse cx="0" cy="78" rx="48" ry="14" fill="#d4b484" />
          <ellipse cx="0" cy="150" rx="18" ry="8" fill="#f7e7c2" opacity="0.7" />
        </g>
      ) : kind === "lantern" ? (
        <g>
          <line x1="0" y1="0" x2="0" y2="58" stroke="#2c2a28" strokeWidth="3" />
          <rect x="-40" y="58" width="80" height="96" fill="#6b4a32" />
          <rect x="-32" y="70" width="64" height="72" fill="#e8c878" opacity="0.55" />
          <rect x="-40" y="58" width="80" height="10" fill="#8a6a45" />
          <rect x="-40" y="144" width="80" height="10" fill="#8a6a45" />
        </g>
      ) : (
        <g>
          <ellipse cx="0" cy="8" rx="22" ry="8" fill="#b08a4a" />
          <line x1="0" y1="12" x2="0" y2="52" stroke="#8a6a45" strokeWidth="4" />
          <circle cx="0" cy="70" r="14" fill="#c4a070" />
          {[-70, -42, -14, 14, 42, 70].map((arm) => (
            <g key={arm}>
              <path
                d={`M0 70 Q${arm * 0.4} 88 ${arm} 102`}
                fill="none"
                stroke="#b08a4a"
                strokeWidth="4"
              />
              <ellipse cx={arm} cy="108" rx="12" ry="9" fill="#d4b484" />
              <path
                d={`M${arm} 116 L${arm - 6} 138 L${arm} 148 L${arm + 6} 138 Z`}
                fill="#e8d8c0"
                opacity="0.85"
              />
              <circle cx={arm} cy="104" r="4" fill="#f7e7c2" />
            </g>
          ))}
          <ellipse cx="0" cy="148" rx="70" ry="16" fill="#f4e2b8" opacity="0.35" />
        </g>
      )}
    </g>
  );
}

function GardenPlant({ box }: { box: Box }) {
  return (
    <g transform={`translate(180, ${box.b + 220})`} style={{ pointerEvents: "none" }}>
      <ellipse cx="0" cy="40" rx="36" ry="10" fill="#1c1916" opacity="0.16" />
      <path d="M-18 36 L18 36 L12 8 L-12 8 Z" fill="#8a6a55" />
      <path d="M0 8 C-40 -20 -36 -90 0 -100 C36 -90 40 -20 0 8" fill="#3f4f3a" />
      <path d="M0 8 C-8 -30 24 -70 48 -40 C20 -20 8 0 0 8" fill="#5a6e4e" />
      <path d="M0 8 C8 -36 -28 -80 -52 -46 C-20 -24 -6 0 0 8" fill="#2f3f2c" />
    </g>
  );
}

function floorFill(kind: Space["shell"]["floor"]) {
  if (kind === "stone") {
    return { base: "#cfc6b8", line: "#b7ad9e", lines: [680, 760, 840, 920] };
  }
  if (kind === "concrete") {
    return { base: "#b8b3ab", line: "#a39e96", lines: [700, 820, 940] };
  }
  return {
    base: "#c4a070",
    line: "#a07d4e",
    lines: [660, 710, 760, 810, 860, 910, 960],
  };
}

function mix(hex: string, other: string, t: number): string {
  const a = toRgb(hex);
  const b = toRgb(other);
  return toHex(
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  );
}

function toRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

function toHex(r: number, g: number, b: number): string {
  const channel = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}
