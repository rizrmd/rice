import { readFileSync } from "fs";
import { join } from "path";
import { AppInfo } from "rice/types";
import { defaultTheme } from "./libs/default-theme.js";
import { backend_state } from "./init-state.js";
const root = join(import.meta.dir, "..", "..", "..");

export const action = {
  setDevUrl(url: string) {
    backend_state.dev.url = url;
  },
  apps() {
    const apps: Record<string, AppInfo> = {};

    for (const app of Object.values(backend_state.app)) {
      apps[app.info.name] = app.info;
    }
    return apps;
  },
  theme() {
    const theme = readFileSync(join(root, "user", "theme.json"), "utf-8");
    return JSON.parse(theme) as unknown as typeof defaultTheme;
  },
  // setTheme(value: typeof theme) {},
};
export type Action = typeof action;
