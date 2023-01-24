import { state } from "./state.js";
import open from "open";

export const action = {
  initFE({ url }: { url: string }) {
    state.frontend.url = new URL(url);
    state.frontend.url.pathname = "";

    const openurl = "http://localhost:12345";
    console.log(openurl);
    open(openurl);
    return "ok";
  },
};
export type Action = typeof action;
