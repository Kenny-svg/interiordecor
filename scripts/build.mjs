import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const cwd = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bin = (name) => path.join(cwd, "node_modules", ".bin", name);
const env = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
};

function run(command, args) {
  const result = spawnSync(command, args, { cwd, env, stdio: "inherit" });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run(bin("prisma"), ["generate"]);
run(bin("prisma"), ["db", "push", "--skip-generate"]);
run(bin("next"), ["build"]);
