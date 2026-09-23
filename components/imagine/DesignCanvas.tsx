"use client";

import { useRef, useState, type DragEvent, type PointerEvent } from "react";
import { EmptyRoom, pointerToFloor } from "@/components/imagine/EmptyRoom";
import {
  getPalette,
  getSpace,
  isFurnitureId,
  MAX_PIECE_SIZE,
  MIN_PIECE_SIZE,
  PIECE_DRAG,
  pieceSize,
  wallHexes,
  type FurnitureId,
  type SpaceDesign,
} from "@/lib/spaces";
import { cn } from "@/lib/utils";

export function DesignCanvas({
  design,
  tags,
  constraints,
  onMove,
  onDropPiece,
  onScale,
}: {
  design: SpaceDesign;
  tags: string[];
  constraints: string[];
  onMove: (key: string, x: number, y: number) => void;
  onDropPiece: (id: FurnitureId, x: number, y: number) => void;
  onScale: (key: string, size: number) => void;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const gesture = useRef<{
    key: string;
    mode: "move" | "resize";
    size: number;
    y: number;
  } | null>(null);
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [over, setOver] = useState(false);
  const space = getSpace(design.spaceId);
  const palette = getPalette(design.paletteId);
  const paintHexes = wallHexes(design);
  const mood = {
    evening: constraints.includes("evening-light"),
    keepWindows: constraints.includes("keep-windows"),
    garden: tags.includes("garden-city"),
    coast: tags.includes("coastal"),
    unoccupied: constraints.includes("no-people"),
  };
  const selected = design.pieces.find((piece) => piece.key === selectedKey);

  function atFloor(event: { clientX: number; clientY: number }) {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) {
      return { x: 50, y: 40 };
    }
    return pointerToFloor(event.clientX, event.clientY, rect);
  }

  function startDrag(
    key: string,
    event: PointerEvent<SVGGElement>,
    mode: "move" | "resize",
  ) {
    event.preventDefault();
    const piece = design.pieces.find((item) => item.key === key);
    gesture.current = {
      key,
      mode,
      size: pieceSize(piece),
      y: event.clientY,
    };
    setDragKey(key);
    setSelectedKey(key);
    frame.current?.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current;
    if (!current) {
      return;
    }
    if (current.mode === "resize") {
      const next = current.size + (current.y - event.clientY) / 140;
      onScale(current.key, Math.min(MAX_PIECE_SIZE, Math.max(MIN_PIECE_SIZE, next)));
      return;
    }
    const floor = atFloor(event);
    onMove(current.key, floor.x, floor.y);
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current;
    if (current?.mode === "move") {
      const floor = atFloor(event);
      onMove(current.key, floor.x, floor.y);
    }
    gesture.current = null;
    setDragKey(null);
  }

  function allowDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setOver(true);
  }

  function dropPiece(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setOver(false);
    const id = event.dataTransfer.getData(PIECE_DRAG) || event.dataTransfer.getData("text/plain");
    if (!isFurnitureId(id)) {
      return;
    }
    const next = atFloor(event);
    onDropPiece(id, next.x, next.y);
  }

  if (!space) {
    return (
      <div className="flex aspect-[4/3] max-h-[38vh] items-end bg-paper-2 px-6 py-6 lg:aspect-[3/2] lg:max-h-none lg:px-8 lg:py-8">
        <p className="max-w-sm font-display text-3xl text-ink">
          Choose a space to begin.
        </p>
      </div>
    );
  }

  const notes = [
    palette?.label,
    mood.evening ? "evening light" : null,
    mood.keepWindows ? "windows kept" : null,
    mood.unoccupied ? "no people" : null,
    mood.garden ? "garden city" : null,
  ].filter(Boolean);

  return (
    <figure>
      <div
        ref={frame}
        className={cn(
          "relative aspect-[4/3] max-h-[38vh] w-full min-w-0 overflow-hidden bg-paper-2 touch-none lg:aspect-[3/2] lg:max-h-none",
          dragKey ? "cursor-grabbing" : "",
          over ? "ring-1 ring-ink" : "",
        )}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) {
            setSelectedKey(null);
          }
        }}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragOver={allowDrop}
        onDragLeave={() => setOver(false)}
        onDrop={dropPiece}
        role="img"
        aria-label={space.emptyAlt}
      >
        <EmptyRoom
          space={space}
          paintHexes={paintHexes}
          lightId={design.lightId}
          curtainId={design.curtainId}
          pieces={design.pieces}
          interactive
          activeKey={dragKey ?? selectedKey}
          onPiecePointerDown={startDrag}
          mood={mood}
        />
        {selected ? (
          <div className="absolute bottom-3 right-3 z-10 flex gap-2">
            <button
              type="button"
              aria-label="Make smaller"
              disabled={pieceSize(selected) <= MIN_PIECE_SIZE}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => onScale(selected.key, pieceSize(selected) - 0.15)}
              className="flex size-11 items-center justify-center border border-ink bg-paper text-lg text-ink disabled:opacity-30"
            >
              −
            </button>
            <button
              type="button"
              aria-label="Make larger"
              disabled={pieceSize(selected) >= MAX_PIECE_SIZE}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => onScale(selected.key, pieceSize(selected) + 0.15)}
              className="flex size-11 items-center justify-center border border-ink bg-paper text-lg text-ink disabled:opacity-30"
            >
              +
            </button>
          </div>
        ) : null}
      </div>
      <figcaption className="mt-2 text-xs leading-5 text-muted sm:mt-3 sm:text-sm sm:leading-6">
        Illustration — not a photograph.{" "}
        {notes.length > 0 ? `${notes.join(" · ")}. ` : ""}
        Drag a piece to place it. Tap it, then +/− to change size.
      </figcaption>
    </figure>
  );
}
