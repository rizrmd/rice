import { AppInfo } from "rice";
import { declareGlobal } from "src/libs/use-global";

export const state_app = declareGlobal({
  installed: {} as Record<string, AppInfo>,
  running: [] as (AppInfo & {
    pid: string;
  })[],
});
