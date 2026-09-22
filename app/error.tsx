"use client";

import { Button, ButtonLink, Container, Eyebrow } from "@/components/ui";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="py-16 sm:py-24">
      <Eyebrow>A pause</Eyebrow>
      <h1 className="mt-4 max-w-xl font-display text-4xl text-ink sm:text-5xl">
        This page couldn’t be shown.
      </h1>
      <p className="mt-5 max-w-md text-base leading-7 text-ink-soft">
        The studio is still here. Try again, or write a letter instead of
        waiting on the page.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <ButtonLink href="/consult" variant="outline">
          Write to the studio
        </ButtonLink>
      </div>
    </Container>
  );
}
