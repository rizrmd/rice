import { readFileSync } from "fs";
import { join } from "path";
import { installApp } from "./action/install-app.js";
import { server_state } from "./init-state.js";
import { defaultTheme } from "./libs/default-theme.js";

const root = join(import.meta.dir, "..", "..", "..");

export const action = {
  setDevUrl(url: string) {
    server_state.dev.url = url;
  },
  installApp: installApp,
  theme() {
    const theme = readFileSync(join(root, "user", "theme.json"), "utf-8");
    return JSON.parse(theme) as unknown as typeof defaultTheme;
  },
  // setTheme(value: typeof theme) {},
};
export type Action = typeof action;
