"use client";

import { PieceGraphic } from "@/components/imagine/PieceGraphic";
import {
  curtains,
  kitFor,
  lights,
  MAX_PIECES,
  palettes,
  paints,
  PIECE_DRAG,
  PLASTER,
  wallHexes,
  type CurtainId,
  type FurnitureId,
  type LightId,
  type PaletteId,
  type SpaceDesign,
} from "@/lib/spaces";
import { cn } from "@/lib/utils";

const WALL_SLOTS = ["Back wall", "Left wall", "Right wall"] as const;

export function FinishPicker({
  design,
  disabled,
  onPickPalette,
  onSetWallHex,
  onAddPiece,
  onRemovePiece,
  onLight,
  onCurtain,
}: {
  design: SpaceDesign;
  disabled?: boolean;
  onPickPalette: (id: PaletteId) => void;
  onSetWallHex: (index: number, hex: string) => void;
  onAddPiece: (id: FurnitureId) => void;
  onRemovePiece: (id: FurnitureId) => void;
  onLight: (id: LightId) => void;
  onCurtain: (id: CurtainId) => void;
}) {
  const kit = kitFor(design.spaceId);
  const hexes = wallHexes(design);
  const atPieceMax = design.pieces.length >= MAX_PIECES;

  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-[12px] uppercase tracking-[0.16em] text-ink">
          Colour
        </legend>
        <p className="mt-2 text-sm text-muted">
          Tap a square to pick any colour. First is the back wall.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {WALL_SLOTS.map((label, index) => {
            const value = hexes[index] ?? PLASTER;
            return (
              <label key={label} className="min-w-0">
                <span className="block truncate text-[11px] uppercase tracking-[0.12em] text-muted">
                  {label}
                </span>
                <span className="mt-1 flex min-w-0 flex-col overflow-hidden border border-line bg-paper">
                  <span className="relative block h-12 w-full overflow-hidden">
                    <input
                      type="color"
                      value={value}
                      disabled={disabled}
                      aria-label={label}
                      onChange={(event) => onSetWallHex(index, event.target.value)}
                      className="absolute inset-0 h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0"
                    />
                  </span>
                  <span className="truncate px-1.5 py-1 font-mono text-[10px] text-ink-soft">
                    {value}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-muted">Or start from a scheme.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {palettes.map((palette) => {
            const active = design.paletteId === palette.id;
            return (
              <button
                key={palette.id}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                onClick={() => onPickPalette(palette.id)}
                className={cn(
                  "flex min-w-0 items-center gap-2 border px-3 py-2 text-left",
                  active ? "border-ink text-ink" : "border-line text-ink-soft hover:border-ink",
                )}
              >
                <span className="flex shrink-0">
                  {palette.paintIds.slice(0, 4).map((id) => {
                    const paint = paints.find((item) => item.id === id);
                    return (
                      <span
                        key={id}
                        className="-ml-px size-4 border border-line first:ml-0"
                        style={{ backgroundColor: paint?.hex ?? PLASTER }}
                        aria-hidden
                      />
                    );
                  })}
                </span>
                <span className="text-sm text-ink">{palette.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[12px] uppercase tracking-[0.16em] text-ink">
          Furniture
        </legend>
        <p className="mt-2 text-sm text-muted">
          Already placed for this room. Change counts, or drag a piece on the
          room.
        </p>
        <ul className="mt-3 space-y-2">
          {kit.map((item) => {
            const count = design.pieces.filter((piece) => piece.pieceId === item.id).length;
            return (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 border border-line px-3 py-2"
              >
                <div
                  draggable={!disabled && !atPieceMax}
                  onDragStart={(event) => {
                    event.dataTransfer.setData(PIECE_DRAG, item.id);
                    event.dataTransfer.setData("text/plain", item.id);
                    event.dataTransfer.effectAllowed = "copy";
                  }}
                  className="flex min-w-0 flex-1 cursor-grab items-center gap-3 active:cursor-grabbing"
                >
                  <span className="relative size-11 shrink-0 overflow-hidden bg-paper">
                    <svg viewBox="-90 -80 180 120" className="h-full w-full" aria-hidden>
                      <g transform="scale(0.42)">
                        <PieceGraphic kind={item.id} />
                      </g>
                    </svg>
                  </span>
                  <span className="text-sm text-ink">{item.label}</span>
                </div>
                <span className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={disabled || count === 0}
                    aria-label={`Remove a ${item.label}`}
                    onClick={() => onRemovePiece(item.id)}
                    className="flex size-11 items-center justify-center border border-line text-lg text-ink disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm tabular-nums">{count}</span>
                  <button
                    type="button"
                    disabled={disabled || atPieceMax}
                    aria-label={`Add a ${item.label}`}
                    onClick={() => onAddPiece(item.id)}
                    className="flex size-11 items-center justify-center border border-line text-lg text-ink disabled:opacity-30"
                  >
                    +
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      </fieldset>

      <fieldset>
        <legend className="text-[12px] uppercase tracking-[0.16em] text-ink">
          Chandelier
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {lights.map((light) => {
            const active = design.lightId === light.id;
            return (
              <button
                key={light.id}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                onClick={() => onLight(light.id)}
                className={cn(
                  "min-h-11 border px-3 py-2 text-sm",
                  active ? "border-ink text-ink" : "border-line text-ink-soft hover:border-ink",
                )}
              >
                {light.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[12px] uppercase tracking-[0.16em] text-ink">
          Curtains
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {curtains.map((curtain) => {
            const active = design.curtainId === curtain.id;
            return (
              <button
                key={curtain.id}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                onClick={() => onCurtain(curtain.id)}
                className={cn(
                  "min-h-11 border px-3 py-2 text-sm",
                  active ? "border-ink text-ink" : "border-line text-ink-soft hover:border-ink",
                )}
              >
                {curtain.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
