import { spawn } from "bun";
import { join } from "path";

const frontend = spawn({
  cmd: ["bun", "dev", "-p", "12345"],
  cwd: join(import.meta.dir, "frontend"),
  stdin: null,
  stdout: null,
  stderr: null,
});

await frontend.exited;

const backend = spawn({
  cmd: ["bun", "index.ts"],
  cwd: join(import.meta.dir, "backend"),
  stdin: null,
  stdout: "inherit",
  stderr: "inherit",
});

await backend.exited;
