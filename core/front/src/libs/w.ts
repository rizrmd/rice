import type { client } from "server";
import { state_app } from "../state/app";
import { state_bar } from "../state/bar";
import { state_frame } from "../state/frame";
import { css } from "goober";

export const w = (typeof window === "undefined" ? {} : window) as unknown as {
  rpc: ReturnType<typeof client>;
  css: typeof css;
  app: typeof state_app["_ref"];
  bar: typeof state_bar["_ref"];
  frame: typeof state_frame["_ref"];
};
