import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { replyInquiry } from "@/app/studio/inbox/actions";
import { Button, Container, Eyebrow } from "@/components/ui";
import { getInquiry, inquiryImages, inquiryTags } from "@/lib/inquiries";
import { labelsForTags } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Brief",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function InboxBriefPage({ params }: Props) {
  const { id } = await params;
  const row = await getInquiry(id);
  if (!row) {
    notFound();
  }
  const images = inquiryImages(row);
  const tags = labelsForTags(inquiryTags(row));
  const replied = row.status === "replied";

  return (
    <Container className="py-10 sm:py-12">
      <p className="text-sm">
        <Link href="/studio/inbox" className="underline decoration-line underline-offset-4">
          Inbox
        </Link>
      </p>
      <Eyebrow>
        {replied ? "Replied" : "New"} · {row.createdAt.toLocaleDateString("en-GB")}
      </Eyebrow>
      <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">{row.name}</h1>
      <p className="mt-3 text-base text-ink-soft">
        {row.projectType} · {row.city}
        {row.budgetBand ? ` · ${row.budgetBand}` : ""}
      </p>

      <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-[12px] uppercase tracking-[0.16em] text-ink">Email</dt>
          <dd className="mt-1">
            <a href={`mailto:${row.email}`} className="underline decoration-line underline-offset-4">
              {row.email}
            </a>
          </dd>
        </div>
        {row.phone ? (
          <div>
            <dt className="text-[12px] uppercase tracking-[0.16em] text-ink">Telephone</dt>
            <dd className="mt-1">{row.phone}</dd>
          </div>
        ) : null}
        <div>
          <dt className="text-[12px] uppercase tracking-[0.16em] text-ink">Timeline</dt>
          <dd className="mt-1">{row.timeline || "—"}</dd>
        </div>
        <div>
          <dt className="text-[12px] uppercase tracking-[0.16em] text-ink">Kind</dt>
          <dd className="mt-1">{row.kind}</dd>
        </div>
      </dl>

      {tags.length > 0 ? (
        <p className="mt-6 text-sm text-muted">{tags.join(" · ")}</p>
      ) : null}

      {images.length > 0 ? (
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image) => (
            <li key={image.id} className="relative aspect-[3/2] overflow-hidden bg-paper-2">
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="(min-width: 640px) 30vw, 50vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      ) : null}

      {row.photoUrl ? (
        <div className="mt-8">
          <p className="text-[12px] uppercase tracking-[0.16em] text-ink">Room photograph</p>
          <div className="relative mt-3 aspect-[3/2] max-w-lg overflow-hidden bg-paper-2">
            <Image
              src={row.photoUrl}
              alt="The room photograph attached to this letter"
              fill
              sizes="(min-width: 640px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      <section className="mt-10 max-w-2xl space-y-8 text-sm leading-6">
        <div>
          <h2 className="text-[12px] uppercase tracking-[0.16em] text-ink">Note</h2>
          <p className="mt-2 whitespace-pre-wrap text-ink-soft">{row.message}</p>
        </div>
        {row.transcript ? (
          <div>
            <h2 className="text-[12px] uppercase tracking-[0.16em] text-ink">Transcript</h2>
            <p className="mt-2 whitespace-pre-wrap text-ink-soft">{row.transcript}</p>
          </div>
        ) : null}
        {row.prompt ? (
          <div>
            <h2 className="text-[12px] uppercase tracking-[0.16em] text-ink">Original words</h2>
            <p className="mt-2 whitespace-pre-wrap text-ink-soft">{row.prompt}</p>
          </div>
        ) : null}
        {row.studioPrompt ? (
          <div>
            <h2 className="text-[12px] uppercase tracking-[0.16em] text-ink">Studio prompt</h2>
            <p className="mt-2 whitespace-pre-wrap text-muted">{row.studioPrompt}</p>
          </div>
        ) : null}
        {row.summary ? (
          <div>
            <h2 className="text-[12px] uppercase tracking-[0.16em] text-ink">Summary</h2>
            <p className="mt-2 whitespace-pre-wrap text-ink-soft">{row.summary}</p>
          </div>
        ) : null}
      </section>

      {!replied ? (
        <form action={replyInquiry} className="mt-10">
          <input type="hidden" name="id" value={row.id} />
          <Button type="submit">Mark as replied</Button>
        </form>
      ) : (
        <p className="mt-10 text-sm text-muted">Marked as replied.</p>
      )}
    </Container>
  );
}
