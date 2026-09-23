import { Container } from "@/components/ui";

export default function ShopLoading() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="h-3 w-16 bg-paper-2 motion-safe:animate-pulse" />
      <div className="mt-6 h-14 w-full max-w-xl bg-paper-2 motion-safe:animate-pulse" />
      <div className="mt-4 h-16 max-w-lg bg-paper-2 motion-safe:animate-pulse" />
      <ul className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <li key={index} className="space-y-4">
            <div className="aspect-[4/5] bg-paper-2 motion-safe:animate-pulse" />
            <div className="h-6 w-2/3 bg-paper-2 motion-safe:animate-pulse" />
            <div className="h-4 w-1/2 bg-paper-2 motion-safe:animate-pulse" />
          </li>
        ))}
      </ul>
      <p className="sr-only">Loading the shop.</p>
    </Container>
  );
}
