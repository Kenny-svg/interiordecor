import type { ReactNode } from "react";
import Link from "next/link";
import { logoutInbox } from "@/app/studio/inbox/actions";

export function StudioShell({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-8">
        <nav className="flex flex-wrap gap-6 text-[12px] uppercase tracking-[0.16em]" aria-label="Studio">
          <Link href="/studio/inbox" className="text-ink">
            Letters
          </Link>
          <Link href="/studio/products" className="text-ink">
            Pieces
          </Link>
          <Link href="/studio/orders" className="text-ink">
            Orders
          </Link>
        </nav>
        <form action={logoutInbox}>
          <button type="submit" className="text-sm underline decoration-line underline-offset-4">
            Sign out
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
