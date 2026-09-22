import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const MAGIC_DAYS = 7;

export function createMagicToken(): string {
  return randomBytes(24).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function tokensMatch(token: string, storedHash: string): boolean {
  const next = Buffer.from(hashToken(token));
  const prev = Buffer.from(storedHash);
  if (next.length !== prev.length) {
    return false;
  }
  return timingSafeEqual(next, prev);
}

export function magicExpiry(from = new Date()): Date {
  return new Date(from.getTime() + MAGIC_DAYS * 24 * 60 * 60 * 1000);
}
