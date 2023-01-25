import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "path";
import { state } from "../state";
const root = join(import.meta.dir, "..", "..", "..", "..");

export const indexRewrite = async (appName: string, mode: "app" | "bar") => {
  const app = state.app[appName].info;
  const html = state.app[appName].html;
  if (app.src.type === "file") {
    const base = join(root, "app", appName);
    const path = join(base, app.src.basedir, app.src.index);
    if (existsSync(path)) {
      html[mode] = await readFile(path, "utf-8");
    }
  }
};
