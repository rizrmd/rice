import { state } from "./state.js";
import open, { App } from "open";
import { AppInfo } from "rice";

export const action = {
  initFE({ url }: { url: string }) {
    state.frontend.url = new URL(url);
    state.frontend.url.pathname = "";

    const openurl = "http://localhost:12345";
    console.log(openurl);
    // open(openurl);
    return "ok";
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
