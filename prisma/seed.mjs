import { mkdir } from "node:fs/promises";
import path from "node:path";

const generatedDir = path.join(process.cwd(), "public", "generated");
const mediaDir = path.join(process.cwd(), ".data", "media");

async function seed() {
  await mkdir(generatedDir, { recursive: true });
  await mkdir(mediaDir, { recursive: true });
  console.info(
    JSON.stringify({
      ok: true,
      portfolio: "lib/projects.ts",
      note: "Sample rooms live in code. Replace that file with the studio’s photography. Database holds sessions, briefs, and inquiries only.",
    }),
  );
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
