import type { client } from "backend";
import { state_app } from "../state/app";
import { state_bar } from "../state/bar";
export const w = (typeof window === "undefined" ? {} : window) as unknown as {
  rpc: ReturnType<typeof client>;
  app: typeof state_app["_ref"];
  bar: typeof state_bar["_ref"];
};
