import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

function prepareDatabaseUrl(): void {
  const url = process.env.DATABASE_URL || "file:./dev.db";
  if (!url.startsWith("file:")) {
    process.env.DATABASE_URL = url;
    return;
  }

  if (!process.env.VERCEL) {
    process.env.DATABASE_URL = url;
    return;
  }

  const tmp = "/tmp/hale.db";
  if (!existsSync(tmp)) {
    const bundled = path.join(process.cwd(), "prisma", "dev.db");
    if (existsSync(bundled)) {
      copyFileSync(bundled, tmp);
    }
  }
  process.env.DATABASE_URL = `file:${tmp}`;
}

prepareDatabaseUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function isMissingSchemaError(error: unknown): boolean {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return false;
  }
  const code = (error as { code?: string }).code;
  return code === "P2021" || code === "P2022" || code === "P1003" || code === "P1012";
}
