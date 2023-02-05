import { readFile } from "fs/promises";
import { join } from "path";
import { action } from "./action";
import { AppInfo } from "../../rice/src/types";
import { ServerWebSocket } from "bun";

const root = join(import.meta.dir, "..", "..", "..");
export const g = globalThis as unknown as {
  wsClients: Set<
    ServerWebSocket<{
      url: string;
    }>
  >;
};

export const server_state =
  globalThis as unknown as typeof default_server_state;

const default_server_state = {
  rice: {
    url: new URL("http://localhost:12345"),
    style: "",
  },
  dev: {
    url: "",
  },
  app: {} as Record<string, AppInfo>,
};

export const initState = async () => {
  for (const [k, v] of Object.entries(default_server_state)) {
    if (!(server_state as any)[k]) (server_state as any)[k] = v;
  }

  const fedir = join(root, "core", "front", "build");
  const index = await readFile(join(fedir, "index.html"), "utf-8");

  server_state.rice.style =
    index
      .split("<!-- app-style:start -->")[1]
      .split("<!-- app-style:end -->")
      .shift() || "";

  const theme = action.theme();
  server_state.rice.style += `
<style>

@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    theme.font.family
  )}:wght@${theme.font.weight}&display=block');

html,
body,
#root,
#app {
  font-family: '${theme.font.family}';
  font-size: ${theme.font.size};
  color: ${theme.font.color};
}
</style>`;
};
