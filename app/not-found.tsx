import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-24">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted">404</p>
      <h1 className="mt-4 font-display text-5xl text-ink">This page isn’t here.</h1>
      <p className="mt-5 max-w-md text-base leading-7 text-ink-soft">
        The room you were looking for has been put away. The work is still
        downstairs.
      </p>
      <p className="mt-8">
        <ButtonLink href="/">Back to Hale</ButtonLink>
      </p>
    </Container>
  );
}
