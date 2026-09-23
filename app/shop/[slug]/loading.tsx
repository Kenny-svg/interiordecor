import { Container } from "@/components/ui";

export default function ProductLoading() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="h-4 w-28 bg-paper-2 motion-safe:animate-pulse" />
      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <div className="aspect-[4/5] bg-paper-2 motion-safe:animate-pulse" />
        <div className="space-y-5">
          <div className="h-3 w-20 bg-paper-2 motion-safe:animate-pulse" />
          <div className="h-14 w-3/4 bg-paper-2 motion-safe:animate-pulse" />
          <div className="h-8 w-40 bg-paper-2 motion-safe:animate-pulse" />
          <div className="h-24 max-w-md bg-paper-2 motion-safe:animate-pulse" />
        </div>
      </div>
      <p className="sr-only">Loading this piece.</p>
    </Container>
  );
}
