import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Ellery Hale has decorated homes, offices, and public rooms in Nigeria since 2014.",
};

export default function AboutPage() {
  return (
    <>
      <Container className="py-12 sm:py-16">
        <Eyebrow>About</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-display text-5xl text-ink sm:text-6xl">
          {site.principal} has decorated homes, offices, and public rooms since&nbsp;{site.founded}.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">
          The work is quiet, specific, and meant to be lived in. We do not sell
          a look. We finish rooms.
        </p>
      </Container>

      <div className="relative aspect-[4/5] w-full sm:aspect-[16/9]">
        {/* Unsplash photo-1600607687939-ce8a6c25118c — Spacejoy */}
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80"
          alt="A long studio table, samples, and tall windows"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      <Container className="grid gap-14 py-16 lg:grid-cols-2">
        <section>
          <Eyebrow>Philosophy</Eyebrow>
          <p className="mt-4 max-w-md text-base leading-7 text-ink-soft">
            Rooms should hold a particular life, not a catalogue — a house, an
            office, a shop floor. We keep what is already good, specify what is
            missing, and stop before the place looks newly arrived.
          </p>
        </section>
        <section>
          <Eyebrow>Where we work</Eyebrow>
          <p className="mt-4 max-w-md text-base leading-7 text-ink-soft">
            {site.area}. Full-service work is undertaken in person. E-design
            can travel further.
          </p>
        </section>
        <section>
          <Eyebrow>Credentials</Eyebrow>
          <p className="mt-4 max-w-md text-base leading-7 text-ink-soft">
            Twelve years in private houses, offices, and public rooms. The
            practice is based in Lagos. References from clients, on request. We
            are not a product studio, and we do not publish every job.
          </p>
        </section>
        <section>
          <Eyebrow>Imagine</Eyebrow>
          <p className="mt-4 max-w-md text-base leading-7 text-ink-soft">
            If you arrive with stills, we look at them as we would a tearing
            from a magazine: useful, incomplete, a way to talk. The decorator
            remains the author.
          </p>
          <p className="mt-8">
            <ButtonLink href="/consult">Write to the studio</ButtonLink>
          </p>
        </section>
      </Container>
    </>
  );
}
