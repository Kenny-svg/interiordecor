import type { ReactNode } from "react";
import { InboxLogin } from "@/components/studio/InboxLogin";
import { StudioShell } from "@/components/studio/StudioShell";
import { isInboxAuthed } from "@/lib/studio-auth";

export const dynamic = "force-dynamic";

export default async function InboxLayout({ children }: { children: ReactNode }) {
  const authed = await isInboxAuthed();
  if (!authed) {
    return <InboxLogin />;
  }

  return <StudioShell>{children}</StudioShell>;
}
