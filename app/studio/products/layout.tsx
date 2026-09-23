import type { ReactNode } from "react";
import { StudioShell } from "@/components/studio/StudioShell";
import { InboxLogin } from "@/components/studio/InboxLogin";
import { isInboxAuthed } from "@/lib/studio-auth";

export const dynamic = "force-dynamic";

export default async function ProductsLayout({ children }: { children: ReactNode }) {
  const authed = await isInboxAuthed();
  if (!authed) {
    return <InboxLogin />;
  }
  return <StudioShell>{children}</StudioShell>;
}
