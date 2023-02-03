import { app } from "rice";
import { AppInfo } from "rice/types";
import { declareGlobal } from "../libs/use-global";

export type AppRunning = AppInfo & {
  script: HTMLScriptElement;
  start: Parameters<typeof app["register"]>[1];
};
const default_app = {
  startup: ["launcher"],
  installed: {} as Record<string, AppInfo>,
  running: [] as AppRunning[],
  boot: {
    appLoaded: false,
    status: "loading" as "loading" | "ready",
    loadingPercent: 0,
  },
  asset: {
    bg: null as HTMLImageElement,
  },
};
export const state_app = declareGlobal(default_app);
