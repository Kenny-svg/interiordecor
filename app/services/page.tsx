import type { Metadata } from "next";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full-service decoration, e-design, styling, and consults. The visualizer prepares a brief; a designer still leads.",
};

export default function ServicesPage() {
  return (
    <Container className="py-12 sm:py-16">
      <Eyebrow>Services</Eyebrow>
      <h1 className="mt-4 max-w-3xl font-display text-5xl text-ink sm:text-6xl">
        Four ways to begin.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">
        Figures are starting bands, not quotes. We write a number after we have
        seen the rooms, or the photographs.
      </p>

      <ol className="mt-16 grid gap-12 lg:grid-cols-2">
        {services.map((service) => (
          <li key={service.slug} className="border-t border-line pt-8">
            <h2 className="font-display text-3xl">{service.title}</h2>
            <p className="mt-4 max-w-md text-base leading-7 text-ink-soft">
              {service.summary}
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-muted">
              You receive
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-ink-soft">
              {service.gets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-6 text-ink">
              {service.timeline}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">{service.from}</p>
          </li>
        ))}
      </ol>

      <section className="mt-20 max-w-2xl border border-line p-8 sm:p-10">
        <Eyebrow>Imagine</Eyebrow>
        <h2 className="mt-4 font-display text-3xl">
          The visualizer prepares the brief. A&nbsp;designer still&nbsp;leads.
        </h2>
        <p className="mt-4 text-base leading-7 text-ink-soft">
          Stills from a note or a photograph are concepts — not a specification,
          and not a quote. Ellery Hale remains the author of the work. You can
          write to the studio without using Imagine at all.
        </p>
        <p className="mt-8 flex flex-wrap gap-4">
          <ButtonLink href="/consult">Write to the studio</ButtonLink>
          <ButtonLink href="/imagine" variant="outline">
            Imagine a space
          </ButtonLink>
        </p>
      </section>
    </Container>
  );
}
