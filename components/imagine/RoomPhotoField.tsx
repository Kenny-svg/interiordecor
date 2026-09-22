"use client";

import { useId, useRef, useState } from "react";
import { Button, Field } from "@/components/ui";

export function RoomPhotoField({
  onChange,
  disabled,
}: {
  onChange: (file: File | null) => void;
  disabled?: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  function replace(next: File | null) {
    setPreview((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return next ? URL.createObjectURL(next) : null;
    });
    onChange(next);
    if (!next && inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <Field
      label="A photograph of the room, if you have one"
      htmlFor={inputId}
      hint="We keep the windows, ceiling, and plan. Decoration only."
    >
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={disabled}
        className="text-sm file:mr-4 file:border file:border-line file:bg-paper file:px-3 file:py-2 file:text-[12px] file:uppercase file:tracking-[0.16em]"
        onChange={(event) => {
          replace(event.target.files?.[0] ?? null);
        }}
      />
      {preview ? (
        <div className="mt-3 space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="The room photograph you attached"
            className="max-h-48 w-auto border border-line object-cover"
          />
          <Button variant="ghost" onClick={() => replace(null)} disabled={disabled}>
            Remove photograph
          </Button>
        </div>
      ) : null}
    </Field>
  );
}
