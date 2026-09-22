"use client";

import { useActionState, useState } from "react";
import { submitInquiry, type InquiryState } from "@/app/consult/actions";
import { Button, Field, fieldClass, Notice } from "@/components/ui";
import {
  loadSnapshot,
  studioBriefFrom,
} from "@/lib/imagine/session-store";
import { budgetBands, roomTypes, timelines } from "@/lib/site";
import {
  inquirySchema,
  isAllowedPhotoType,
  PHOTO_MAX_BYTES,
} from "@/lib/validation";

const initial: InquiryState = { status: "idle" };

export function ConsultForm({
  kind,
  imagineSessionId,
  briefId,
  resumeToken,
  initialMessage = "",
}: {
  kind: "consult" | "pack";
  imagineSessionId: string | null;
  briefId: string | null;
  resumeToken: string | null;
  initialMessage?: string;
}) {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState(initialMessage);
  const [sessionField, setSessionField] = useState(imagineSessionId ?? "");

  function useImagineBrief() {
    const snapshot = loadSnapshot();
    if (!snapshot) {
      return;
    }
    const brief = studioBriefFrom(snapshot).trim();
    if (brief.length > 0) {
      setMessage(brief);
    }
    if (snapshot.sessionId) {
      setSessionField(snapshot.sessionId);
    }
  }

  if (state.status === "ok") {
    return (
      <div className="max-w-xl space-y-5 border border-line bg-paper-2/40 p-8 sm:p-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
          Hale Studio
        </p>
        <h2 className="font-display text-4xl text-ink">
          We have your&nbsp;letter.
        </h2>
        <p className="text-base leading-7 text-ink-soft">
          The studio will read the brief{state.magicUrl ? " and the stills" : ""}.
          A reply will come to {state.email} within {state.reply}. If we can help,
          we will suggest a time. If we cannot, we will say so.
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-ink-soft">
          <li>The studio opens your note, and any stills you sent.</li>
          <li>You hear from us within {state.reply} — not a quote, a first letter.</li>
          <li>Nothing is booked until we write to confirm a time.</li>
        </ol>
        {state.magicUrl ? (
          <p className="text-sm leading-6 text-muted">
            Reopen these stills for seven days, without an account:{" "}
            <a href={state.magicUrl} className="underline decoration-line underline-offset-4">
              Open my Imagine session
            </a>
          </p>
        ) : null}
        <p className="text-sm leading-6 text-muted">
          This is not a ticket, and not a quote.
        </p>
      </div>
    );
  }

  const errors = {
    ...(state.status === "error" ? state.fieldErrors ?? {} : {}),
    ...clientErrors,
  };

  return (
    <form
      action={action}
      noValidate
      className="max-w-xl space-y-7"
      onSubmit={(event) => {
        const form = event.currentTarget;
        const data = new FormData(form);
        const parsed = inquirySchema.safeParse({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          city: data.get("city"),
          projectType: data.get("projectType"),
          timeline: data.get("timeline"),
          budgetBand: data.get("budgetBand"),
          message: data.get("message"),
          kind: data.get("kind") || "consult",
          imagineSessionId: data.get("imagineSessionId"),
          briefId: data.get("briefId"),
          resumeToken: data.get("resumeToken"),
        });
        const nextErrors: Record<string, string> = {};
        if (!parsed.success) {
          for (const issue of parsed.error.issues) {
            const key = issue.path[0];
            if (typeof key === "string" && !nextErrors[key]) {
              nextErrors[key] = issue.message;
            }
          }
        }
        const photo = data.get("photo");
        if (photo instanceof File && photo.size > 0) {
          if (photo.size > PHOTO_MAX_BYTES) {
            nextErrors.photo = "The photograph is too large. Use a file under 10MB.";
          } else if (!isAllowedPhotoType(photo.type)) {
            nextErrors.photo = "Use a JPEG, PNG, or WebP photograph.";
          }
        }
        if (Object.keys(nextErrors).length > 0) {
          event.preventDefault();
          setClientErrors(nextErrors);
          return;
        }
        setClientErrors({});
      }}
    >
      <input type="hidden" name="kind" value={kind} />
      {briefId ? <input type="hidden" name="briefId" value={briefId} /> : null}
      {resumeToken ? <input type="hidden" name="resumeToken" value={resumeToken} /> : null}
      <Field label="Name" htmlFor="name" error={errors.name}>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          minLength={2}
          className={fieldClass}
        />
      </Field>
      <Field label="Email" htmlFor="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={fieldClass}
        />
      </Field>
      <Field
        label="Telephone"
        htmlFor="phone"
        hint="Optional."
        error={errors.phone}
      >
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          className={fieldClass}
        />
      </Field>
      <Field label="City" htmlFor="city" error={errors.city}>
        <input
          id="city"
          name="city"
          autoComplete="address-level2"
          required
          minLength={2}
          placeholder="Lagos"
          className={fieldClass}
        />
      </Field>
      <Field label="Space" htmlFor="projectType" error={errors.projectType}>
        <select
          id="projectType"
          name="projectType"
          required
          defaultValue=""
          className={fieldClass}
        >
          <option value="" disabled>
            Choose one
          </option>
          {roomTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Timeline" htmlFor="timeline" error={errors.timeline}>
        <select
          id="timeline"
          name="timeline"
          required
          defaultValue=""
          className={fieldClass}
        >
          <option value="" disabled>
            Choose one
          </option>
          {timelines.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Budget" htmlFor="budgetBand" error={errors.budgetBand}>
        <select
          id="budgetBand"
          name="budgetBand"
          required
          defaultValue=""
          className={fieldClass}
        >
          <option value="" disabled>
            A band, not a quote
          </option>
          {budgetBands.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </Field>
      <Field
        label="A note about the rooms"
        htmlFor="message"
        error={errors.message}
      >
        <textarea
          id="message"
          name="message"
          rows={7}
          required
          minLength={20}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={`${fieldClass} resize-y`}
          placeholder="A living room in Ikoyi, or a private office on Victoria Island."
        />
        <p className="mt-2">
          <button
            type="button"
            className="text-sm underline decoration-line underline-offset-4"
            onClick={useImagineBrief}
          >
            Use the Imagine brief
          </button>
        </p>
      </Field>
      <Field
        label="A photograph of the room"
        htmlFor="photo"
        hint="Optional. JPEG, PNG, or WebP, under 10MB."
        error={errors.photo}
      >
        <input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="text-sm file:mr-4 file:border file:border-line file:bg-paper file:px-3 file:py-2 file:text-[12px] file:uppercase file:tracking-[0.16em]"
        />
      </Field>
      {briefId ? (
        <input type="hidden" name="imagineSessionId" value={sessionField} />
      ) : (
        <Field
          label="Imagine session"
          htmlFor="imagineSessionId"
          hint="Optional. Leave blank if you have not used Imagine."
          error={errors.imagineSessionId}
        >
          <input
            id="imagineSessionId"
            name="imagineSessionId"
            value={sessionField}
            onChange={(event) => setSessionField(event.target.value)}
            autoComplete="off"
            spellCheck={false}
            className={fieldClass}
          />
        </Field>
      )}

      {state.status === "error" ? (
        <Notice tone="caution">{state.message}</Notice>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Sending" : "Send the letter"}
      </Button>
    </form>
  );
}
