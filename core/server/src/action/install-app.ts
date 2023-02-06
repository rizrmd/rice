import { spawn } from "bun";
import { existsSync } from "fs";
import { mkdir, readdir } from "fs/promises";
import { dirname, join } from "path";
import { AppInfo } from "../../../rice/src/types";
import { server_state } from "../init-state";

const root = join(import.meta.dir, "..", "..", "..", "..");

export const installAppViaGitURL = async (url: string) => {
  const appUrl = new URL(url);
  const appDir = join(
    root,
    "app",
    appUrl.hostname,
    ...appUrl.pathname.split("/")
  );

  let isNew = true;
  await mkdir(appDir, { recursive: true });
  if ((await readdir(appDir)).length > 0) {
    isNew = false;
  }

  if (isNew) {
    await spawn({
      cmd: ["git", "clone", url, "--depth=1"],
      cwd: dirname(appDir),
    }).exited;
  }

  if (!existsSync(join(appDir, "node_modules", "rice"))) {
    await mkdir(join(appDir, "node_modules"), { recursive: true });
    await spawn({
      cmd: [
        "ln",
        "-s",
        `"${join(root, "core", "rice")}"`,
        `"${join(appDir, "node_modules", "rice")}"`,
      ],
      cwd: dirname(appDir),
    }).exited;
  }

  const info:AppInfo = (await import(join(appDir, "app.ts"))).default;
  
  info.app.absdir = appDir
  server_state.app[info.name] = info;

  return info;
};
