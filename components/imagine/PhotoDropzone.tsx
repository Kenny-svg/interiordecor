"use client";

import { useId, useRef, useState } from "react";
import { Button, Notice } from "@/components/ui";
import { cn } from "@/lib/utils";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

export function PhotoDropzone({
  file,
  disabled,
  onChange,
  error,
}: {
  file: File | null;
  disabled?: boolean;
  onChange: (file: File | null) => void;
  error?: string;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  function replace(next: File | null, message?: string) {
    setLocalError(message ?? null);
    setPreview((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      if (!next || next.type.includes("heic") || next.type.includes("heif")) {
        return null;
      }
      return next ? URL.createObjectURL(next) : null;
    });
    onChange(next);
    if (!next && inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function take(next: File | null) {
    if (!next) {
      replace(null);
      return;
    }
    if (next.size > MAX_BYTES) {
      replace(null, "One photograph, under 10MB.");
      return;
    }
    const type = next.type || guessType(next.name);
    if (!ACCEPT.includes(type) && !/\.(jpe?g|png|webp)$/i.test(next.name)) {
      replace(null, "Use JPEG, PNG, or WebP.");
      return;
    }
    replace(next);
  }

  const message = error ?? localError;

  return (
    <div className="space-y-3">
      <label htmlFor={inputId} className="text-[12px] uppercase tracking-[0.16em] text-ink">
        Room photograph
      </label>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          take(event.dataTransfer.files[0] ?? null);
        }}
        className={cn(
          "border border-dashed px-4 py-8 text-center text-sm leading-6 text-muted",
          dragOver ? "border-ink bg-paper-2" : "border-line",
        )}
      >
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          disabled={disabled}
          className="sr-only"
          onChange={(event) => take(event.target.files?.[0] ?? null)}
        />
        <p>Drop one photograph, or</p>
        <Button
          type="button"
          variant="ghost"
          className="mt-2"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          Choose a file
        </Button>
        <p className="mt-2">JPEG, PNG, or WebP. 10MB at most.</p>
      </div>
      {file ? (
        <div className="space-y-3">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="The room photograph you attached"
              className="max-h-48 w-auto border border-line object-cover"
            />
          ) : (
            <p className="text-sm text-ink">{file.name}</p>
          )}
          <p className="text-sm leading-6 text-muted">
            We will keep the architecture: windows, ceiling, and plan. Decoration
            only.
          </p>
          <Button variant="ghost" onClick={() => replace(null)} disabled={disabled}>
            Remove photograph
          </Button>
        </div>
      ) : null}
      {message ? <Notice tone="caution">{message}</Notice> : null}
    </div>
  );
}

function guessType(name: string): string {
  if (/\.png$/i.test(name)) {
    return "image/png";
  }
  if (/\.webp$/i.test(name)) {
    return "image/webp";
  }
  if (/\.heic$/i.test(name)) {
    return "image/heic";
  }
  if (/\.heif$/i.test(name)) {
    return "image/heif";
  }
  return "image/jpeg";
}
