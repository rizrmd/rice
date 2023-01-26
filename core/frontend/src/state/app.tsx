import { AppInfo } from "rice/types";
import { declareGlobal } from "../libs/use-global";

export type AppRunning = AppInfo & { iframe: HTMLIFrameElement };
export const default_app = {
  startup: ["launcher"],
  installed: {} as Record<string, AppInfo>,
  running: [] as AppRunning[],
}
export const state_app = declareGlobal(default_app);
