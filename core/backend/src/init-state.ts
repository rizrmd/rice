import { readFile } from "fs/promises";
import { join } from "path";
import { createApp } from "rice";
import { AppInfo } from "rice/types";
import { action } from "./action";

const root = join(import.meta.dir, "..", "..", "..");

export const backend_state =
  globalThis as unknown as typeof default_backend_state;

const default_backend_state = {
  rice: {
    url: new URL("http://localhost:12345"),
    style: "",
  },
  dev: {
    url: "",
  },
  app: {} as Record<
    string,
    {
      info: AppInfo;
      index: string;
    }
  >,
};

export const initState = async () => {
  for (const [k, v] of Object.entries(default_backend_state)) {
    if (!(backend_state as any)[k]) (backend_state as any)[k] = v;
  }

  const fedir = join(root, "core", "frontend", "build");
  const index = await readFile(join(fedir, "index.html"), "utf-8");

  backend_state.rice.style =
    index
      .split("<!-- app-style:start -->")[1]
      .split("<!-- app-style:end -->")
      .shift() || "";

  const theme = action.theme();
  backend_state.rice.style += `
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
