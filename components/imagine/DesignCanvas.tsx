"use client";

import { useRef, useState, type DragEvent, type PointerEvent } from "react";
import { EmptyRoom, pointerToFloor } from "@/components/imagine/EmptyRoom";
import {
  getPalette,
  getSpace,
  isFurnitureId,
  PIECE_DRAG,
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
}: {
  design: SpaceDesign;
  tags: string[];
  constraints: string[];
  onMove: (key: string, x: number, y: number) => void;
  onDropPiece: (id: FurnitureId, x: number, y: number) => void;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [dragKey, setDragKey] = useState<string | null>(null);
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

  function atFloor(event: { clientX: number; clientY: number }) {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) {
      return { x: 50, y: 40 };
    }
    return pointerToFloor(event.clientX, event.clientY, rect);
  }

  function startDrag(key: string, event: PointerEvent<SVGGElement>) {
    event.preventDefault();
    setDragKey(key);
    frame.current?.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    if (!dragKey) {
      return;
    }
    const next = atFloor(event);
    onMove(dragKey, next.x, next.y);
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (dragKey) {
      const next = atFloor(event);
      onMove(dragKey, next.x, next.y);
    }
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
          activeKey={dragKey}
          onPiecePointerDown={startDrag}
          mood={mood}
        />
      </div>
      <figcaption className="mt-2 text-xs leading-5 text-muted sm:mt-3 sm:text-sm sm:leading-6">
        {notes.length > 0 ? `${notes.join(" · ")}. ` : ""}
        Drag a piece to place it.
      </figcaption>
    </figure>
  );
}
