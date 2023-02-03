import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import { app } from "rice";
import { backend_state } from "./init-state";

export const initApp = async () => {
  const root = join(import.meta.dir, "..", "..", "..");
  const files = readdirSync(join(root, "app"));

  for (const appName of files) {
    if (appName === "node_modules") continue;
    const path = join(root, "app", appName);
    if (statSync(path).isDirectory()) {
      const appPath = join(path, "app.ts");
      if (!existsSync(appPath)) {
        console.log(`ERRROR: app.ts in "${appName}" app is not found.`);
        continue;
      }

      try {
        const info = (await import(appPath)).default as typeof app;
        backend_state.app[appName] = {
          info,
          html: "",
        };
      } catch (e) {
        console.log(`Error when booting app "${appName}":\n`, e);
      }
    }
  }
};
