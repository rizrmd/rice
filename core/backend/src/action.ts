import { AppInfo } from "rice/types";
import { state } from "./state.js";

export const action = {
  setDevUrl(url: string) {
    state.dev.url = url;
  },
  apps() {
    const apps: Record<string, AppInfo> = {};

    for (const app of Object.values(state.app)) {
      apps[app.info.name] = app.info;
    }
    return apps;
  },
};
export type Action = typeof action;
