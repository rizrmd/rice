import { spawn } from "bun";
import { join } from "path";

const frontend = spawn({
  cmd: ["bun", "dev", "-p", "12345", "--public-dir", "./"],
  cwd: join(import.meta.dir, "frontend"),
  stdin: null,
  stdout: null,
  stderr: null,
});

const tailwind = spawn({
  cmd: ["bun", "run", "tw"],
  cwd: join(import.meta.dir, "frontend"),
  stdin: "inherit",
  stdout: "ignore",
  stderr: "ignore",
});

const backend = spawn({
  cmd: ["bun", "--hot", "index.ts"],
  cwd: join(import.meta.dir, "backend"),
  stdin: null,
  stdout: "inherit",
  stderr: "inherit",
});

//@ts-ignore
process.on("SIGINT", () => {
  console.log("closing", "sigint");
});

await Promise.all([frontend.exited, tailwind.exited, backend.exited]);
