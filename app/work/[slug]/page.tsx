import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Still } from "@/components/work/Still";
import { ButtonLink, Container, Eyebrow, TextLink } from "@/components/ui";
import {
  getProject,
  getProjectIndex,
  imagineHrefFor,
  projectCaption,
  projects,
} from "@/lib/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return { title: "Work" };
  }
  return {
    title: `${project.title}, ${project.city}`,
    description: project.brief,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    notFound();
  }

  const index = getProjectIndex(slug);
  const previous = index > 0 ? projects[index - 1] : undefined;
  const next = index >= 0 ? projects[index + 1] : undefined;

  return (
    <article>
      <Still
        src={project.cover.src}
        alt={project.cover.alt}
        position={project.cover.position}
        aspect="hero"
        sizes="100vw"
        priority
      />

      <Container className="py-10 sm:py-14">
        <Eyebrow>{project.style}</Eyebrow>
        <h1 className="mt-4 font-display text-5xl text-ink sm:text-6xl">
          {project.title}
        </h1>
        <p className="mt-3 text-sm text-muted">{projectCaption(project)}</p>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">
          {project.brief}
        </p>
      </Container>

      <Container className="grid gap-10 border-t border-line py-12 sm:grid-cols-2">
        <section>
          <Eyebrow>Constraints</Eyebrow>
          <ul className="mt-4 space-y-3 text-base leading-7 text-ink-soft">
            {project.constraints.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <Eyebrow>Materials</Eyebrow>
          <ul className="mt-4 space-y-3 text-base leading-7 text-ink-soft">
            {project.materials.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </Container>

      <div className="space-y-4 pb-4">
        {project.images.map((image) => (
          <figure key={`${image.src}-${image.alt}`}>
            <Still
              src={image.src}
              alt={image.alt}
              position={image.position}
              aspect="landscape"
              sizes="100vw"
            />
            <Container>
              <figcaption className="py-4 text-sm text-muted">
                {image.caption ?? projectCaption(project)}
              </figcaption>
            </Container>
          </figure>
        ))}
      </div>

      {project.beforeAfter ? (
        <Container className="grid gap-4 py-8 sm:grid-cols-2">
          <figure>
            <Still
              src={project.beforeAfter.before.src}
              alt={project.beforeAfter.before.alt}
              position={project.beforeAfter.before.position}
              aspect="landscape"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
            <figcaption className="py-4 text-sm text-muted">
              Before. {projectCaption(project)}
            </figcaption>
          </figure>
          <figure>
            <Still
              src={project.beforeAfter.after.src}
              alt={project.beforeAfter.after.alt}
              position={project.beforeAfter.after.position}
              aspect="landscape"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
            <figcaption className="py-4 text-sm text-muted">
              After. {projectCaption(project)}
            </figcaption>
          </figure>
        </Container>
      ) : null}

      <Container className="border-t border-line py-16">
        <Eyebrow>Imagine</Eyebrow>
        <p className="mt-4 max-w-xl font-display text-3xl leading-snug text-ink">
          Start from this look.
        </p>
        <p className="mt-4 max-w-lg text-sm leading-6 text-muted">
          Opens Imagine with this room’s direction. It is an illustration, not a
          photograph of the finished work.
        </p>
        <p className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={imagineHrefFor(project)}>Start from this look</ButtonLink>
          <ButtonLink href="/shop" variant="outline">
            Shop pieces
          </ButtonLink>
        </p>
        <div className="mt-12 flex flex-col gap-3 text-sm">
          <TextLink href="/work">All work</TextLink>
          {previous ? (
            <Link href={`/work/${previous.slug}`} className="text-muted hover:text-ink">
              Previous: {previous.title}
            </Link>
          ) : null}
          {next ? (
            <Link href={`/work/${next.slug}`} className="text-muted hover:text-ink">
              Next: {next.title}
            </Link>
          ) : null}
        </div>
      </Container>
    </article>
  );
}
