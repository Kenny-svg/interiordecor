import Link from "next/link";
import { Still } from "@/components/work/Still";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { featuredProject, projectCaption, projects } from "@/lib/projects";
import { processSteps, proof } from "@/lib/site";

export default function HomePage() {
  const strip = projects.slice(1, 4);

  return (
    <>
      <figure className="relative h-[min(85svh,52rem)] min-h-[28rem] w-full overflow-hidden bg-paper-2">
        <Still
          src={featuredProject.cover.src}
          alt={featuredProject.cover.alt}
          position={featuredProject.cover.position}
          aspect="fill"
          sizes="100vw"
          priority
        />
      </figure>
      <Container className="py-10 sm:py-14">
        <p className="text-sm text-muted">{projectCaption(featuredProject)}</p>
        <h1 className="mt-8 max-w-3xl font-display text-4xl text-ink sm:text-6xl">
          Decoration for homes, offices, and places that need a professional finish.
        </h1>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/work">View work</ButtonLink>
          <ButtonLink href="/imagine" variant="outline">
            Imagine a space
          </ButtonLink>
        </div>
      </Container>

      <Container className="pb-8 pt-6">
        <Eyebrow>Completed rooms</Eyebrow>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {strip.map((project) => (
            <li key={project.slug}>
              <Link href={`/work/${project.slug}`} className="group block">
                <Still
                  src={project.cover.src}
                  alt={project.cover.alt}
                  position={project.cover.position}
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="motion-safe:[&_img]:transition-transform motion-safe:[&_img]:duration-700 motion-safe:group-hover:[&_img]:scale-[1.03]"
                />
                <p className="mt-3 font-display text-xl">{project.room}</p>
                <p className="mt-1 text-sm text-muted">{projectCaption(project)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      <section className="mt-10 border-y border-line">
        <Container className="py-16">
          <Eyebrow>Process</Eyebrow>
          <ol className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <li key={step.title}>
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 font-display text-3xl">{step.title}</h2>
                <p className="mt-3 text-sm leading-6 text-ink-soft">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <Container className="py-16">
        <ul className="grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
          {proof.map((item) => (
            <li key={item.label}>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
                {item.label}
              </p>
              <p className="mt-3 font-display text-2xl leading-snug text-ink">
                {item.value}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
