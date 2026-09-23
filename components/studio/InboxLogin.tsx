"use client";

import { loginInbox } from "@/app/studio/inbox/actions";
import { Button, Field, fieldClass } from "@/components/ui";

export function InboxLogin() {
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="text-[12px] uppercase tracking-[0.16em] text-ink">Studio</p>
      <h1 className="mt-4 font-display text-4xl text-ink">The desk.</h1>
      <p className="mt-3 text-sm leading-6 text-muted">
        A password for the studio only. Letters, pieces, and orders.
      </p>
      <form action={loginInbox} className="mt-8 space-y-5">
        <Field label="Password" htmlFor="password">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={fieldClass}
          />
        </Field>
        <Button type="submit">Enter</Button>
      </form>
    </div>
  );
}
