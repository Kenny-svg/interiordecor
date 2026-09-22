"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { ConceptCanvas, type CanvasStatus } from "@/components/imagine/ConceptCanvas";
import { DesignCanvas } from "@/components/imagine/DesignCanvas";
import { FinishPicker } from "@/components/imagine/FinishPicker";
import { PhotoDropzone } from "@/components/imagine/PhotoDropzone";
import { SpacePicker } from "@/components/imagine/SpacePicker";
import { StyleTagPicker } from "@/components/imagine/StyleTagPicker";
import { TranscriptField } from "@/components/imagine/TranscriptField";
import { VoiceRecorder } from "@/components/imagine/VoiceRecorder";
import { Button, fieldClass, Notice } from "@/components/ui";
import { track } from "@/lib/analytics";
import { briefLanguage } from "@/lib/brief";
import {
  constraintChips,
  exampleBriefs,
  isSafetyBlocked,
  WRITE_PLACEHOLDER,
} from "@/lib/imagine/copy";
import {
  fileFromImageUrl,
  postImagineGenerate,
  postImagineTranscribe,
  type ImagineBudget,
  type ImagineImage,
} from "@/lib/imagine/client";
import {
  activeVersion,
  getClientSnapshot,
  getServerSnapshot,
  hydrateImagine,
  patchSnapshot,
  subscribeImagine,
  type ConceptSummary,
  type StoredConcept,
} from "@/lib/imagine/session-store";
import { isStyleTagId, lookForStyle } from "@/lib/styles";
import {
  defaultLook,
  describeDesign,
  dressedPieces,
  getPalette,
  getSpace,
  isPaletteId,
  MAX_PAINTS,
  MAX_PIECES,
  nextPieceSlot,
  paintHex,
  parseDesign,
  PLASTER,
  wallHexes,
  type CurtainId,
  type FurnitureId,
  type LightId,
  type PaletteId,
  type SpaceId,
} from "@/lib/spaces";
import { cn } from "@/lib/utils";

type Mode = "write" | "voice" | "photo";
type Phase = "idle" | "generating" | "failed" | "blocked" | "limited";

const modes: { id: Mode; label: string }[] = [
  { id: "voice", label: "Voice" },
  { id: "write", label: "Write" },
  { id: "photo", label: "Photo + direction" },
];

const emptySummary: ConceptSummary = {
  palette: "",
  materials: "",
  mood: "",
};

export function ImagineStudio({
  initialTags,
  initialPrompt,
  initialSpace,
  lookFrom,
  demoMode,
  sttLive,
  initialQuota,
}: {
  initialTags?: string[];
  initialPrompt?: string;
  initialSpace?: SpaceId | null;
  lookFrom?: string;
  demoMode: boolean;
  sttLive: boolean;
  initialQuota: ImagineBudget;
}) {
  const router = useRouter();
  const snapshot = useSyncExternalStore(
    subscribeImagine,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [mode, setMode] = useState<Mode>("write");
  const [tagDraft, setTagDraft] = useState<string[] | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const photoUrlRef = useRef<string | null>(null);
  const fromProjectSeeded = useRef(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [refiningId, setRefiningId] = useState<string | null>(null);
  const [quota, setQuota] = useState<ImagineBudget>(initialQuota);
  const [demo, setDemo] = useState(demoMode);
  const [canvasError, setCanvasError] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const sessionId = snapshot?.sessionId ?? "";
  const prompt = snapshot?.prompt ?? "";
  const transcript = snapshot?.transcript ?? "";
  const transcriptWords = snapshot?.transcriptWords ?? [];
  const constraints = snapshot?.constraints ?? [];
  const outputs = snapshot?.outputs ?? [];
  const studioPrompt = snapshot?.studioPrompt ?? "";
  const tags = (
    tagDraft ??
    (initialTags && initialTags.length > 0 ? initialTags : (snapshot?.tags ?? []))
  )
    .filter(isStyleTagId)
    .slice(0, 3);
  const remaining = quota.remaining;
  const gated = remaining <= 0;
  const design = parseDesign({
    spaceId: snapshot?.spaceId,
    paletteId: snapshot?.paletteId,
    paintId: snapshot?.paintId,
    paintIds: snapshot?.paintIds,
    customHexes: snapshot?.customHexes,
    chairId: snapshot?.chairId,
    pieces: snapshot?.pieces,
    chairX: snapshot?.chairX,
    lightId: snapshot?.lightId,
    curtainId: snapshot?.curtainId,
  });
  const space = getSpace(design.spaceId);
  const designNote = describeDesign(design);
  const language = briefLanguage({
    rawText: [designNote, prompt].filter(Boolean).join("\n\n"),
    transcript,
    styleTags: tags,
    constraints,
    source: sourceFrom(mode),
  });
  const canGenerate = Boolean(design.spaceId);
  const busy = phase === "generating" || Boolean(refiningId) || transcribing || sending;
  const canvas: CanvasStatus =
    phase === "idle" ? (outputs.length > 0 ? "ready" : "empty") : phase;

  useEffect(() => {
    const key = "hale_imagine_started";
    try {
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, "1");
        track("imagine_started", { demo: demoMode });
      }
    } catch {
      track("imagine_started", { demo: demoMode });
    }
  }, [demoMode]);

  useEffect(() => {
    hydrateImagine();
  }, []);

  useEffect(() => {
    if (fromProjectSeeded.current || (!initialPrompt && !initialSpace)) {
      return;
    }
    if (!snapshot) {
      return;
    }
    fromProjectSeeded.current = true;
    const sameBrief =
      !initialPrompt || snapshot.prompt.trim() === initialPrompt.trim();
    patchSnapshot({
      ...(initialPrompt ? { prompt: initialPrompt } : {}),
      tags: initialTags && initialTags.length > 0 ? initialTags : snapshot.tags,
      spaceId: snapshot.spaceId ?? initialSpace ?? snapshot.spaceId,
      ...(sameBrief
        ? {}
        : {
            outputs: [],
            studioPrompt: "",
            constraints: [],
            transcript: "",
            transcriptWords: [],
          }),
    });
  }, [initialPrompt, initialSpace, initialTags, snapshot]);

  useEffect(() => {
    return () => {
      if (photoUrlRef.current) {
        URL.revokeObjectURL(photoUrlRef.current);
      }
    };
  }, []);

  function applyExample(id: string) {
    const example = exampleBriefs.find((item) => item.id === id);
    if (!example) {
      return;
    }
    setMode("write");
    setTagDraft([...example.tags]);
    const placeX =
      example.placementId === "left" ? 22 : example.placementId === "right" ? 78 : 50;
    const pieces = example.pieces.map((item, index) => ({
      key: crypto.randomUUID(),
      pieceId: item.pieceId,
      x: item.x ?? (index === 0 ? placeX : 50),
      y: item.y,
    }));
    const last = pieces[pieces.length - 1];
    const palette = getPalette(example.paletteId);
    patchSnapshot({
      prompt: example.prompt,
      transcript: "",
      transcriptWords: [],
      tags: [...example.tags],
      constraints: [...example.constraints],
      spaceId: example.spaceId,
      paletteId: example.paletteId,
      paintId: example.paintId,
      paintIds: [example.paintId],
      customHexes: palette ? palette.paintIds.slice(0, 2).map((id) => paintHex(id)) : [],
      chairId: last?.pieceId ?? null,
      pieces,
      chairX: last?.x ?? placeX,
      lightId: example.lightId,
      curtainId: example.curtainId,
      outputs: [],
      studioPrompt: "",
    });
    setPhase("idle");
    setCanvasError(null);
  }

  function pickSpace(id: SpaceId) {
    const look = defaultLook(id);
    setTagDraft([...look.tags]);
    patchSnapshot({
      spaceId: id,
      paletteId: look.paletteId,
      paintId: look.paintIds[0] ?? null,
      paintIds: [...look.paintIds],
      customHexes: [...look.customHexes],
      chairId: look.pieces[0]?.pieceId ?? null,
      pieces: dressedPieces(id),
      placementId: "centre",
      chairX: look.pieces[0]?.x ?? 50,
      lightId: look.lightId,
      curtainId: look.curtainId,
      tags: [...look.tags],
      constraints: [...look.constraints],
      outputs: [],
      studioPrompt: "",
    });
    setPhase("idle");
    setCanvasError(null);
  }

  function pickPalette(id: PaletteId) {
    const palette = getPalette(id);
    if (!palette) {
      return;
    }
    const hexes = palette.paintIds.slice(0, MAX_PAINTS).map((paint) => paintHex(paint));
    patchSnapshot({
      paletteId: id,
      paintIds: [...palette.paintIds.slice(0, MAX_PAINTS)],
      paintId: palette.paintIds[0] ?? null,
      customHexes: hexes,
    });
  }

  function setWallHex(index: number, hex: string) {
    const current = wallHexes(design);
    const next = [current[0] ?? PLASTER, current[1] ?? PLASTER, current[2] ?? PLASTER];
    next[index] = hex;
    patchSnapshot({ customHexes: next, paintId: null, paintIds: [] });
  }

  function addPiece(id: FurnitureId, x?: number, y?: number) {
    if (design.pieces.length >= MAX_PIECES) {
      return;
    }
    const slot = nextPieceSlot(
      design.pieces.map((piece) => ({ x: piece.x, y: piece.y })),
      id,
    );
    const placed = {
      key: crypto.randomUUID(),
      pieceId: id,
      x: x ?? slot.x,
      y: y ?? slot.y,
    };
    patchSnapshot({
      chairId: id,
      chairX: placed.x,
      pieces: [...design.pieces, placed],
    });
  }

  function removePiece(id: FurnitureId) {
    let removed = false;
    const next = [...design.pieces].reverse().filter((piece) => {
      if (!removed && piece.pieceId === id) {
        removed = true;
        return false;
      }
      return true;
    });
    const pieces = next.reverse();
    const last = pieces[pieces.length - 1];
    patchSnapshot({
      pieces,
      chairId: last?.pieceId ?? null,
      chairX: last?.x ?? 50,
    });
  }

  function movePiece(key: string, x: number, y: number) {
    const pieces = design.pieces.map((piece) =>
      piece.key === key ? { ...piece, x, y } : piece,
    );
    patchSnapshot({ pieces, chairX: x });
  }

  function toggleConstraint(id: string) {
    patchSnapshot({
      constraints: constraints.includes(id)
        ? constraints.filter((item) => item !== id)
        : [...constraints, id],
    });
  }

  function takePhoto(file: File | null) {
    if (photoUrlRef.current) {
      URL.revokeObjectURL(photoUrlRef.current);
      photoUrlRef.current = null;
    }
    if (file) {
      const url = URL.createObjectURL(file);
      photoUrlRef.current = url;
      setPhotoUrl(url);
    } else {
      setPhotoUrl(null);
    }
    setPhoto(file);
    patchSnapshot({
      photoId: file ? crypto.randomUUID() : null,
      photoName: file?.name ?? null,
    });
  }

  function setTags(next: string[]) {
    setTagDraft(next);
    const added = next.find((id) => tags.every((tag) => tag !== id));
    const look = lookForStyle(added ?? "");
    patchSnapshot({
      tags: next,
      ...(look
        ? {
            paletteId: isPaletteId(look.paletteId) ? look.paletteId : design.paletteId,
            customHexes: look.hexes,
            paintIds: [],
            paintId: null,
            ...(look.curtainId ? { curtainId: look.curtainId } : {}),
            ...(look.lightId ? { lightId: look.lightId } : {}),
          }
        : {}),
    });
  }

  function buildForm(extra: {
    n: number;
    charge: boolean;
    refine?: string;
    previous?: File | null;
  }): FormData {
    const form = new FormData();
    form.set("rawText", [designNote, prompt].filter(Boolean).join("\n\n"));
    form.set("transcript", transcript);
    form.set("styleTags", JSON.stringify(tags.filter(isStyleTagId).slice(0, 3)));
    form.set("constraints", JSON.stringify(constraints));
    form.set("source", sourceFrom(mode));
    form.set("n", String(extra.n));
    form.set("charge", extra.charge ? "true" : "false");
    if (extra.refine) {
      form.set("refine", extra.refine);
    }
    if (photo) {
      form.set("photo", photo);
    }
    if (extra.previous) {
      form.set("previous", extra.previous);
    }
    return form;
  }

  function latestOutputs(): StoredConcept[] {
    return getClientSnapshot()?.outputs ?? outputs;
  }

  async function transcribeNote(file: File, hint: string | null, durationSeconds: number) {
    setTranscribing(true);
    setVoiceError(null);
    try {
      const result = await postImagineTranscribe({ audio: file, hint, durationSeconds });
      if (!result.ok) {
        setVoiceError(result.error);
        if (hint) {
          patchSnapshot({ transcript: hint, transcriptWords: [] });
        }
        return;
      }
      patchSnapshot({ transcript: result.text, transcriptWords: result.words });
      track("voice_used", { demo: result.demo });
    } catch {
      setVoiceError("The transcript could not be made. Edit the note, or paste it.");
    } finally {
      setTranscribing(false);
    }
  }

  async function generate(options: { charge?: boolean } = {}) {
    const charge = options.charge !== false;
    if ((gated && charge) || busy) {
      return;
    }
    if (isSafetyBlocked(prompt) || isSafetyBlocked(transcript)) {
      setPhase("blocked");
      setCanvasError(null);
      patchSnapshot({ outputs: [], studioPrompt: "" });
      return;
    }
    if (!canGenerate) {
      return;
    }
    setCanvasError(null);
    setPhase("generating");
    try {
      const result = await postImagineGenerate(buildForm({ n: 4, charge }));
      if (!result.ok) {
        if (result.code === "blocked" || result.status === 422) {
          setPhase("blocked");
          setCanvasError(result.error);
          patchSnapshot({ outputs: [], studioPrompt: "" });
          return;
        }
        if (
          result.status === 429 ||
          result.status === 402 ||
          result.code === "rate" ||
          result.code === "budget"
        ) {
          setPhase("limited");
          setCanvasError(result.error);
          return;
        }
        setCanvasError(result.error);
        setPhase("failed");
        return;
      }
      setDemo(result.demo);
      setQuota(result.budget);
      patchSnapshot({
        prompt: mode === "voice" ? prompt : language,
        transcript: mode === "voice" ? language : transcript,
        tags,
        used: result.budget.used,
        studioPrompt: result.studioPrompt,
        outputs: toStoredConcepts(result.images, result.summary),
      });
      setPhase("idle");
      track("generate_succeeded", { demo: result.demo, n: result.images.length });
    } catch {
      setCanvasError("The studio couldn’t compose stills just now.");
      setPhase("failed");
    }
  }

  async function refine(
    id: string,
    direction: string,
    options: { charge?: boolean } = {},
  ) {
    const latest = latestOutputs();
    const current = latest.find((item) => item.id === id);
    const charge = options.charge !== false;
    if (!current || busy || (charge && gated)) {
      return;
    }
    setRefiningId(id);
    setCanvasError(null);
    try {
      const still = activeVersion(current);
      const previous = still.url
        ? await fileFromImageUrl(still.url, `previous-${current.id}.jpg`)
        : null;
      const result = await postImagineGenerate(
        buildForm({ n: 1, charge, refine: direction, previous }),
      );
      if (!result.ok) {
        if (
          result.status === 429 ||
          result.status === 402 ||
          result.code === "rate" ||
          result.code === "budget"
        ) {
          setPhase("limited");
          setCanvasError(result.error);
          return;
        }
        const failed = latestOutputs();
        patchSnapshot({
          outputs: failed.map((item) =>
            item.id === id ? { ...item, status: "failed" } : item,
          ),
        });
        setCanvasError(result.error);
        setPhase("failed");
        return;
      }
      const next = result.images[0];
      if (!next) {
        throw new Error("No still.");
      }
      setDemo(result.demo);
      setQuota(result.budget);
      const version = {
        id: next.id,
        url: next.url,
        alt: next.alt,
        label: direction,
      };
      const cards = latestOutputs();
      patchSnapshot({
        used: result.budget.used,
        outputs: cards.map((item) =>
          item.id === id
            ? {
                ...item,
                url: next.url,
                alt: next.alt,
                status: "ready" as const,
                history: [...item.history, version],
                activeHistoryId: version.id,
                summary:
                  item.summary.palette ||
                  item.summary.materials ||
                  item.summary.mood
                    ? item.summary
                    : result.summary,
              }
            : item,
        ),
        studioPrompt: result.studioPrompt,
      });
      setPhase("idle");
    } catch {
      const failed = latestOutputs();
      patchSnapshot({
        outputs: failed.map((item) =>
          item.id === id ? { ...item, status: "failed" } : item,
        ),
      });
      setCanvasError("This frame didn’t return. Retry it, or generate all four again.");
      setPhase("failed");
    } finally {
      setRefiningId(null);
    }
  }

  async function download(concept: StoredConcept) {
    const still = activeVersion(concept);
    try {
      const image = document.createElement("img");
      image.crossOrigin = "anonymous";
      image.src = still.url;
      await image.decode();
      const canvasEl = document.createElement("canvas");
      canvasEl.width = image.naturalWidth;
      canvasEl.height = image.naturalHeight;
      const context = canvasEl.getContext("2d");
      if (!context) {
        throw new Error("No canvas.");
      }
      context.drawImage(image, 0, 0);
      const bar = Math.max(48, Math.round(canvasEl.height * 0.08));
      context.fillStyle = "rgba(28, 25, 22, 0.55)";
      context.fillRect(0, canvasEl.height - bar, canvasEl.width, bar);
      context.fillStyle = "#f3efe6";
      context.font = `${Math.round(bar * 0.35)}px "Karla", sans-serif`;
      context.fillText("HALE  ·  CONCEPT", 24, canvasEl.height - bar * 0.38);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvasEl.toBlob(
          (file) => (file ? resolve(file) : reject(new Error("No file."))),
          "image/jpeg",
          0.9,
        );
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "hale-concept.jpg";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      window.open(still.url, "_blank", "noopener,noreferrer");
    }
  }

  async function sendToStudio() {
    const cards = latestOutputs().filter((item) => item.status === "ready");
    const picked = cards.filter((item) => item.selected || item.favorite);
    const source = picked.length > 0 ? picked : cards;
    if (
      source.length === 0 &&
      !design.spaceId &&
      prompt.trim().length < 12 &&
      transcript.trim().length < 12
    ) {
      router.push("/consult");
      return;
    }
    setSending(true);
    setCanvasError(null);
    try {
      const body = new FormData();
      body.set(
        "payload",
        JSON.stringify({
          sessionId: sessionId || "imagine",
          prompt,
          transcript,
          studioPrompt,
          tags,
          selectedIds: source.map((item) => item.id),
          images: source.map((item) => {
            const still = activeVersion(item);
            return {
              id: item.id,
              url: still.url,
              alt: still.alt,
              favorite: item.favorite,
              selected: item.selected,
              summary: item.summary,
            };
          }),
        }),
      );
      if (photo) {
        body.set("photo", photo);
      }
      const response = await fetch("/api/imagine/handoff", {
        method: "POST",
        body,
      });
      const data = (await response.json()) as {
        briefId?: string;
        token?: string;
        error?: string;
      };
      if (!response.ok || !data.briefId) {
        setCanvasError(data.error ?? "The brief could not be sent just now.");
        return;
      }
      const params = new URLSearchParams({ from: data.briefId });
      if (data.token) {
        params.set("resume", data.token);
      }
      router.push(`/consult?${params.toString()}`);
      track("brief_sent");
    } catch {
      setCanvasError("The brief could not be sent just now.");
    } finally {
      setSending(false);
    }
  }

  const hasStills = outputs.length > 0;
  const primaryIsSend = (canvas === "ready" || gated) && hasStills;

  if (!design.spaceId) {
    return (
      <div>
        {lookFrom ? (
          <p className="mb-6 text-sm text-muted">
            Direction from {lookFrom}. Choose a space first.
          </p>
        ) : null}
        {demo ? (
          <div className="mb-8">
            <Notice>Sample stills. The camera is not live.</Notice>
          </div>
        ) : null}
        <SpacePicker onSelect={pickSpace} />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:items-start lg:gap-x-12">
      <div className="order-1 sticky top-14 z-20 min-w-0 overflow-hidden bg-paper py-2 lg:col-start-2 lg:row-start-1 lg:self-start lg:top-[4.5rem] lg:py-8">
        <DesignCanvas
          design={design}
          tags={tags}
          constraints={constraints}
          onMove={movePiece}
          onDropPiece={(id, x, y) => addPiece(id, x, y)}
        />
      </div>
      <aside className="order-2 min-w-0 overflow-x-hidden bg-paper-2 lg:col-start-1 lg:row-start-1 lg:row-span-2">
        <div className="space-y-8 p-4 sm:p-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[12px] uppercase tracking-[0.16em] text-muted">
                Designing
              </p>
              <p className="mt-2 font-display text-3xl text-ink">{space?.label}</p>
            </div>
            <button
              type="button"
              className="text-sm text-muted underline decoration-line underline-offset-4 hover:text-ink"
              onClick={() => patchSnapshot({ spaceId: null })}
            >
              Change space
            </button>
          </div>

          {lookFrom ? (
            <p className="text-sm text-muted">
              Direction from {lookFrom}. Edit anything that is wrong.
            </p>
          ) : null}

          {demo ? <Notice>Sample stills. The camera is not live.</Notice> : null}

          <StyleTagPicker selected={tags} onChange={setTags} disabled={busy} />

          <fieldset className="space-y-3">
            <legend className="text-[12px] uppercase tracking-[0.16em] text-ink">
              Constraints
            </legend>
            <p className="text-sm text-muted">
              These change the room you see, and the stills.
            </p>
            <div className="flex flex-wrap gap-2">
              {constraintChips.map((chip) => {
                const active = constraints.includes(chip.id);
                return (
                  <button
                    key={chip.id}
                    type="button"
                    aria-pressed={active}
                    disabled={busy}
                    onClick={() => toggleConstraint(chip.id)}
                    className={cn(
                      "min-h-11 border px-3 py-2 text-sm",
                      active
                        ? "border-ink text-ink"
                        : "border-line text-ink-soft hover:border-ink",
                    )}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-muted">
              {constraintChips
                .filter((chip) => constraints.includes(chip.id))
                .map((chip) => chip.hint)
                .join(" ")}
            </p>
          </fieldset>

          <FinishPicker
            design={design}
            disabled={busy}
            onPickPalette={pickPalette}
            onSetWallHex={setWallHex}
            onAddPiece={addPiece}
            onRemovePiece={removePiece}
            onLight={(id: LightId) => patchSnapshot({ lightId: id })}
            onCurtain={(id: CurtainId) => patchSnapshot({ curtainId: id })}
          />

          <details className="text-sm">
            <summary className="cursor-pointer text-muted hover:text-ink">
              Add a spoken or written note
            </summary>
            <div className="mt-6 space-y-6">
              <div role="tablist" aria-label="Brief" className="flex flex-wrap gap-6">
                {modes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={mode === item.id}
                    className={cn(
                      "border-b pb-1 text-[12px] uppercase tracking-[0.16em]",
                      mode === item.id
                        ? "border-ink text-ink"
                        : "border-transparent text-muted hover:text-ink",
                    )}
                    onClick={() => setMode(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

          {mode === "write" ? (
            <div className="space-y-2">
              <label htmlFor="brief" className="text-[12px] uppercase tracking-[0.16em] text-ink">
                Write
              </label>
              <textarea
                id="brief"
                rows={8}
                value={prompt}
                disabled={busy}
                onChange={(event) => patchSnapshot({ prompt: event.target.value })}
                className={`${fieldClass} min-h-[10rem] resize-y`}
                placeholder={WRITE_PLACEHOLDER}
              />
            </div>
          ) : null}

          {mode === "voice" ? (
            <div className="space-y-4">
              <VoiceRecorder
                disabled={busy}
                sttConfigured={sttLive}
                onAudio={(file, hint, duration) => {
                  if (hint) {
                    patchSnapshot({ transcript: hint });
                  }
                  void transcribeNote(file, hint, duration);
                }}
                onLiveHint={(hint) => patchSnapshot({ transcript: hint })}
                onClear={() => {
                  setVoiceError(null);
                  patchSnapshot({ transcript: "", transcriptWords: [] });
                }}
              />
              <TranscriptField
                id="transcript"
                value={transcript}
                words={transcriptWords}
                disabled={busy}
                transcribing={transcribing}
                onChange={(value) => patchSnapshot({ transcript: value })}
              />
              {voiceError ? <Notice tone="caution">{voiceError}</Notice> : null}
            </div>
          ) : null}

          {mode === "photo" ? (
            <div className="space-y-4">
              <PhotoDropzone file={photo} onChange={takePhoto} disabled={busy} />
              <p className="text-sm leading-6 text-muted">
                A photograph is optional. If you add one, we keep the windows where
                they are.
              </p>
              <div className="space-y-2">
                <label
                  htmlFor="direction"
                  className="text-[12px] uppercase tracking-[0.16em] text-ink"
                >
                  Direction
                </label>
                <textarea
                  id="direction"
                  rows={5}
                  value={prompt}
                  disabled={busy}
                  onChange={(event) => patchSnapshot({ prompt: event.target.value })}
                  className={`${fieldClass} resize-y`}
                  placeholder="Keep the windows. Laterite walls, a lounge chair, evening light."
                />
              </div>
            </div>
          ) : null}
            </div>
          </details>

          <p className="text-sm leading-6 text-muted">
            Start from{" "}
            {exampleBriefs.map((example, index) => (
              <span key={example.id}>
                {index > 0 ? <span>, </span> : null}
                <button
                  type="button"
                  className="text-ink underline decoration-line underline-offset-4"
                  onClick={() => applyExample(example.id)}
                >
                  {example.title.toLowerCase()}
                </button>
              </span>
            ))}
            .
          </p>

          <div className="space-y-3 border-t border-line pt-6">
            <p className="text-sm text-muted">
              {gated
                ? "Complimentary concepts are used. Favourites stay here. You can still send this to the studio."
                : `${remaining} of ${quota.limit} free concepts left`}
            </p>
            {!gated ? (
              <Button
                type="button"
                variant={hasStills ? "ghost" : "solid"}
                disabled={busy || !canGenerate}
                onClick={() => void generate()}
              >
                {phase === "generating"
                  ? "Composing"
                  : hasStills
                    ? "Compose again"
                    : "Compose stills"}
              </Button>
            ) : hasStills ? null : (
              <Button type="button" disabled={busy} onClick={() => void sendToStudio()}>
                {sending ? "Sending" : "Send this to the studio"}
              </Button>
            )}
          </div>
        </div>
      </aside>

      <div className="order-3 min-w-0 lg:col-start-2 lg:row-start-2">
        {canvas !== "empty" || outputs.length > 0 ? (
        <div className="mt-8">
        <ConceptCanvas
          status={canvas}
          concepts={outputs}
          studioPrompt={studioPrompt}
          refiningId={refiningId}
          photoUrl={photoUrl}
          canRefine={!gated}
          errorMessage={canvasError}
          onFavorite={(id) => {
            patchSnapshot({
              outputs: latestOutputs().map((item) =>
                item.id === id ? { ...item, favorite: !item.favorite } : item,
              ),
            });
          }}
          onSelect={(id) => {
            patchSnapshot({
              outputs: latestOutputs().map((item) =>
                item.id === id ? { ...item, selected: !item.selected } : item,
              ),
            });
          }}
          onRefine={(id, direction) => void refine(id, direction)}
          onRetryOne={(id) => {
            const current = latestOutputs().find((item) => item.id === id);
            void refine(id, "a different still of the same room", {
              charge: current?.status !== "failed",
            });
          }}
          onRetryAll={() => void generate({ charge: false })}
          onDownload={(concept) => void download(concept)}
          onSelectVersion={(conceptId, versionId) => {
            patchSnapshot({
              outputs: latestOutputs().map((item) => {
                if (item.id !== conceptId) {
                  return item;
                }
                const version = item.history.find((entry) => entry.id === versionId);
                if (!version) {
                  return item;
                }
                return {
                  ...item,
                  activeHistoryId: versionId,
                  url: version.url,
                  alt: version.alt,
                };
              }),
            });
          }}
          onSummaryChange={(id, field, value) => {
            patchSnapshot({
              outputs: latestOutputs().map((item) =>
                item.id === id
                  ? { ...item, summary: { ...item.summary, [field]: value } }
                  : item,
              ),
            });
          }}
        />
        </div>
        ) : (
          <p className="mt-6 text-sm leading-6 text-muted">
            Compose stills when the room is dressed the way you mean it.
          </p>
        )}
        {primaryIsSend ? (
          <div className="mt-10">
            <Button type="button" disabled={busy} onClick={() => void sendToStudio()}>
              {sending ? "Sending" : "Send this to the studio"}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function sourceFrom(mode: Mode): "voice" | "text" | "photo" {
  if (mode === "voice") {
    return "voice";
  }
  if (mode === "photo") {
    return "photo";
  }
  return "text";
}

function toStoredConcepts(
  images: ImagineImage[],
  summary: ConceptSummary,
): StoredConcept[] {
  const bullets = summary.palette ? summary : emptySummary;
  return images.map((image) => ({
    id: image.id,
    url: image.url,
    alt: image.alt,
    status: image.status,
    favorite: false,
    selected: false,
    history: [
      {
        id: image.id,
        url: image.url,
        alt: image.alt,
        label: "Original",
      },
    ],
    activeHistoryId: image.id,
    summary: bullets,
  }));
}
