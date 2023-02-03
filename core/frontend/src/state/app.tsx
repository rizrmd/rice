import { AppInfo } from "rice/types";
import { declareGlobal } from "../libs/use-global";

export type AppRunning = AppInfo & { iframe: HTMLIFrameElement };
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
