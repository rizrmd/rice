import { readFileSync } from "fs";
import { join } from "path";
import { AppInfo } from "../../rice/src/types.js";
import { g, server_state } from "./init-state.js";
import { defaultTheme } from "./libs/default-theme.js";

const root = join(import.meta.dir, "..", "..", "..");

export const action = {
  setDevUrl(url: string) {
    server_state.dev.url = url;
  },
  appInfo: async (appName: string) => {
    const info = (await import(join(root, "app", appName, "app.ts"))).default;
    info.app.absdir = join(root, "app", appName);
    server_state.app[info.name] = info;
    return { name: appName } as AppInfo;
  },
  hmrApp: (appName: string) => {
    for (const ws of g.wsClients) {
      ws.send(JSON.stringify({ type: "hmr-app", name: appName }));
    }
  },
  theme() {
    const theme = readFileSync(join(root, "user", "theme.json"), "utf-8");
    return JSON.parse(theme) as unknown as typeof defaultTheme;
  },
  // setTheme(value: typeof theme) {},
};
export type Action = typeof action;
