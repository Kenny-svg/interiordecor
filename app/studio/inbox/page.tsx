import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui";
import { listInquiries } from "@/lib/inquiries";

export const metadata: Metadata = {
  title: "Inbox",
  robots: { index: false, follow: false },
};

export default async function InboxPage() {
  const rows = await listInquiries();

  return (
    <Container className="py-10 sm:py-12">
      <Eyebrow>Briefs</Eyebrow>
      <h1 className="mt-4 font-display text-4xl text-ink sm:text-5xl">Letters.</h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">
        New room briefs from Imagine and the consult form.
      </p>
      {rows.length === 0 ? (
        <p className="mt-10 text-sm text-muted">None yet.</p>
      ) : (
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                href={`/studio/inbox/${row.id}`}
                className="flex flex-wrap items-baseline justify-between gap-3 py-4 hover:bg-paper-2/60"
              >
                <span className="text-ink">
                  {row.name}
                  <span className="text-muted">
                    {" "}
                    · {row.projectType.toLowerCase()} · {row.city}
                  </span>
                </span>
                <span className="text-[12px] uppercase tracking-[0.16em] text-muted">
                  {row.status === "replied" ? "Replied" : "New"} ·{" "}
                  {row.createdAt.toLocaleDateString("en-GB")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
