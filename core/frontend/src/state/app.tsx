import { AppInfo } from "rice";
import { declareGlobal } from "src/libs/use-global";

export type AppRunning = AppInfo & { iframe: HTMLIFrameElement };
export const state_app = declareGlobal({
  startup: ["launcher"],
  installed: {} as Record<string, AppInfo>,
  running: [] as AppRunning[],
});
