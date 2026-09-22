"use client";

import { useRouter } from "next/navigation";
import { snapshotFromBrief } from "@/lib/imagine/restore";
import type { PublicBrief } from "@/lib/imagine/brief-types";
import { getClientSnapshot, patchSnapshot } from "@/lib/imagine/session-store";
import { Button } from "@/components/ui";

export function RestoreBrief({ brief }: { brief: PublicBrief }) {
  const router = useRouter();

  function open() {
    patchSnapshot(snapshotFromBrief(brief, getClientSnapshot()));
    router.replace("/imagine");
  }

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border border-line px-5 py-4">
      <p className="text-sm leading-6 text-ink-soft">
        A saved session. Stills last seven days from when you sent them.
      </p>
      <Button type="button" variant="ghost" onClick={open}>
        Open this session
      </Button>
    </div>
  );
}
