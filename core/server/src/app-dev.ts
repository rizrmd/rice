import { spawn } from "bun";
import { existsSync } from "fs";
import { join } from "path";
import { AppInfo } from "../../rice/src/types";

const dec = new TextDecoder();
const root = join(import.meta.dir, "..", "..", "..");
export const startAppDev = (
  path: string,
  stdout?: (app: AppInfo, output: string) => void
) => {
  return new Promise<void>(async (resolve) => {
    const appDir = join(root, "app", path);
    if (appDir) {
      if (!existsSync(join(appDir, "node_modules"))) {
        await spawn({
          cmd: ["bun", "i"],
          cwd: appDir,
          stdout: "ignore",
          stderr: "ignore",
        }).exited;
      }

      const info: AppInfo = (await import(join(appDir, "app.ts"))).default;

      const app = spawn({
        cmd: ["bun", "run", "dev"],
        cwd: appDir,
        stdout: "pipe",
        stderr: "pipe",
      });

      let printStdout = false;
      stream(app.stdout, (raw) => {
        const text = dec.decode(raw);
        if (text.includes("Built in ")) {
          printStdout = true;
        }
        if (
          printStdout &&
          !text.includes("Bundling") &&
          !text.includes("Packaging & Optimizing")
        ) {
          resolve();
          if (stdout) stdout(info, text);
          else {
            process.stdout.write(`[${info.name}] ` + text);
          }
        }
      });
      stream(app.stderr, (raw) => {
        if (printStdout) {
          process.stdout.write(raw);
        }
      });
    }
  });
};

const stream = (
  std: ReadableStream<any> | undefined,
  callback: (text: ArrayBuffer) => void
) => {
  if (std) {
    const reader = std.getReader();
    new Promise<void>(async (resolve) => {
      while (true) {
        const { done, value } = await reader.read();
        callback(value);
        if (done) {
          resolve();
          break;
        }
      }
    });
  }
};
