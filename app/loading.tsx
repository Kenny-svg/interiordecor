import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <Container className="py-24">
      <div className="grid grid-cols-2 gap-4 max-w-xl">
        <div className="aspect-[3/2] bg-paper-2 motion-safe:animate-pulse" />
        <div className="aspect-[3/2] bg-paper-2 motion-safe:animate-pulse" />
      </div>
      <p className="mt-6 text-sm text-muted">A moment…</p>
    </Container>
  );
}
