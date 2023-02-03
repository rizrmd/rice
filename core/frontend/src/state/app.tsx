import { AppInfo } from "rice/types";
import { declareGlobal } from "../libs/use-global";

export type AppRunning = AppInfo & { iframe: HTMLIFrameElement };
export const default_app = {
  startup: ["launcher"],
  installed: {} as Record<string, AppInfo>,
  running: [] as AppRunning[],
  boot: {
    status: "loading" as "loading" | "asset-loaded" | "ready",
    loadingPercent: 0,
  },
  cache: {
    bg: null as typeof Image,
    font: null as typeof FontFace,
  },
};
export const state_app = declareGlobal(default_app);
