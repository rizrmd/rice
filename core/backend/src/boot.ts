import { spawn, which } from "bun";
import { existsSync, readdirSync, statSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "path";
import { app } from "rice";
import { readStream } from "./libs/read-stream";
import { state } from "./state";

export const initApp = async () => {
  const root = join(import.meta.dir, "..", "..", "..");
  const files = readdirSync(join(root, "app"));
  for (const appName of files) {
    if (appName === "node_modules") continue;
    const path = join(root, "app", appName);
    if (statSync(path).isDirectory()) {
      const appPath = join(path, "app.tsx");
      if (!existsSync(appPath)) {
        console.log(`ERRROR: app.tsx in "${appName}" app is not found.`);
        continue;
      }

      try {
        const info = (await import(appPath)).default as ReturnType<typeof app>;

        let bar = "";
        if (info.bar) {
          if (existsSync(join(path, info.bar.src))) {
            bar = await readFile(join(path, info.bar.src), "utf-8");
          }
        }

        state.app[appName] = {
          info,
          bar
        };
      } catch (e) {
        console.log(`Error when booting app "${appName}":\n`, e);
      }
    }
  }
};
