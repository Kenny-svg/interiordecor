import type { ReactNode } from "react";
import { InboxLogin } from "@/components/studio/InboxLogin";
import { logoutInbox } from "@/app/studio/inbox/actions";
import { isInboxAuthed } from "@/lib/studio-auth";

export const dynamic = "force-dynamic";

export default async function InboxLayout({ children }: { children: ReactNode }) {
  const authed = await isInboxAuthed();
  if (!authed) {
    return <InboxLogin />;
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-8">
        <p className="text-[12px] uppercase tracking-[0.16em] text-ink">Studio inbox</p>
        <form action={logoutInbox}>
          <button
            type="submit"
            className="text-sm underline decoration-line underline-offset-4"
          >
            Sign out
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
