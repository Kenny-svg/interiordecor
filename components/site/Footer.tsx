import Link from "next/link";
import { Container } from "@/components/ui";
import { DISCLOSURE } from "@/lib/prompt";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <Container className="grid gap-10 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl tracking-[0.18em]">
            {site.name.toUpperCase()}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
            {site.legalName}. {site.offer} {site.city}. By
            appointment.
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm" aria-label="Footer">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-ink hover:text-ink-soft">
              {item.label}
            </Link>
          ))}
          <Link href="/cart" className="text-ink hover:text-ink-soft">
            Cart
          </Link>
        </nav>
        <div className="text-sm text-muted">
          <p>
            <a href={`mailto:${site.email}`} className="text-ink underline decoration-line underline-offset-4">
              {site.email}
            </a>
          </p>
          <p className="mt-6 max-w-xs leading-6">{DISCLOSURE}</p>
          <p className="mt-6">© 2026 {site.principal}</p>
        </div>
      </Container>
    </footer>
  );
}
