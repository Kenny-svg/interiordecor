import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/db";
import { SESSION_COOKIE, SESSION_HEADER } from "@/lib/session-constants";
import { site } from "@/lib/site";

export { SESSION_COOKIE, SESSION_HEADER };

export async function getSessionId(): Promise<string | null> {
  const headerStore = await headers();
  const fromHeader = headerStore.get(SESSION_HEADER);
  if (fromHeader) {
    return fromHeader;
  }
  const jar = await cookies();
  return jar.get(SESSION_COOKIE)?.value ?? null;
}

export async function ensureSession(id: string) {
  return prisma.session.upsert({
    where: { id },
    update: {},
    create: { id },
  });
}

export async function getBudget(sessionId: string | null): Promise<{
  remaining: number;
  used: number;
  limit: number;
}> {
  const limit = site.freeGenerations;
  if (!sessionId) {
    return { remaining: limit, used: 0, limit };
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return { remaining: limit, used: 0, limit };
  }

  const allowance = limit + session.packCredits;
  const remaining = Math.max(0, allowance - session.generationCount);
  return {
    remaining,
    used: session.generationCount,
    limit: allowance,
  };
}
