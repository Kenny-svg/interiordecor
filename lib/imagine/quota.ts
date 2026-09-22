import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";
import { site } from "@/lib/site";

const FILE = path.join(process.cwd(), ".data", "imagine-quota.json");
const COOLDOWN_MS = 8_000;
const TRANSCRIBE_DAY = 20;

type IpBucket = {
  day: string;
  generations: number;
  transcribes: number;
  lastGenerateAt: number;
};

type Store = {
  ip: Record<string, IpBucket>;
};

export type ImagineQuota = {
  remaining: number;
  used: number;
  limit: number;
};

export function clientIp(headersList: Headers): string {
  const forwarded = headersList.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || headersList.get("x-real-ip") || "local";
}

export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getImagineQuota(
  sessionId: string | null,
  ip: string,
): Promise<ImagineQuota> {
  const limit = site.freeGenerations;
  const day = todayUtc();
  const store = await readStore();
  const ipUsed = bucketFor(store, ip, day).generations;
  let sessionUsed = 0;
  if (sessionId) {
    try {
      const start = new Date(`${day}T00:00:00.000Z`);
      sessionUsed = await prisma.generation.count({
        where: { sessionId, createdAt: { gte: start } },
      });
    } catch {
      console.error("[imagine.quota]", "session");
    }
  }
  const used = Math.max(ipUsed, sessionUsed);
  return {
    used,
    remaining: Math.max(0, limit - used),
    limit,
  };
}

export async function assertGenerateAllowed(
  sessionId: string | null,
  ip: string,
  options: { cooldown?: boolean } = {},
): Promise<ImagineQuota | { error: string; status: 402 | 429 }> {
  const quota = await getImagineQuota(sessionId, ip);
  if (quota.remaining <= 0) {
    return {
      status: 402,
      error:
        "Three complimentary concepts for today are used. Send the brief, or try again tomorrow.",
    };
  }

  if (options.cooldown === false) {
    return quota;
  }

  const store = await readStore();
  const bucket = bucketFor(store, ip, todayUtc());
  if (Date.now() - bucket.lastGenerateAt < COOLDOWN_MS) {
    return {
      status: 429,
      error: "Give the last stills a moment before composing again.",
    };
  }

  return quota;
}

export async function assertTranscribeAllowed(
  ip: string,
): Promise<{ error: string; status: 429 } | null> {
  const store = await readStore();
  const bucket = bucketFor(store, ip, todayUtc());
  if (bucket.transcribes >= TRANSCRIBE_DAY) {
    return {
      status: 429,
      error: "That’s enough voice notes for today. Paste or type the transcript instead.",
    };
  }
  return null;
}

export async function recordGeneration(ip: string): Promise<void> {
  const store = await readStore();
  const day = todayUtc();
  const bucket = bucketFor(store, ip, day);
  bucket.generations += 1;
  bucket.lastGenerateAt = Date.now();
  store.ip[ip] = bucket;
  await writeStore(store);
}

export async function recordTranscribe(ip: string): Promise<void> {
  const store = await readStore();
  const day = todayUtc();
  const bucket = bucketFor(store, ip, day);
  bucket.transcribes += 1;
  store.ip[ip] = bucket;
  await writeStore(store);
}

function bucketFor(store: Store, ip: string, day: string): IpBucket {
  const current = store.ip[ip];
  if (!current || current.day !== day) {
    return { day, generations: 0, transcribes: 0, lastGenerateAt: 0 };
  }
  return current;
}

async function readStore(): Promise<Store> {
  try {
    const raw = await readFile(FILE, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "ip" in parsed &&
      typeof parsed.ip === "object" &&
      parsed.ip !== null
    ) {
      return parsed as Store;
    }
  } catch {
    // First run, or a corrupt file — start empty.
  }
  return { ip: {} };
}

async function writeStore(store: Store): Promise<void> {
  await mkdir(path.dirname(FILE), { recursive: true });
  await writeFile(FILE, JSON.stringify(store));
}
