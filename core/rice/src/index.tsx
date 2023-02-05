import { DeepProxy, THandlerContext } from "@qiwi/deep-proxy";
import { createClient, rpcAction } from "front/src/libs/app-action";
import { state_app } from "front/src/state/app";
import { state_bar } from "front/src/state/bar";
import { state_desktop } from "front/src/state/desktop";
import { Handlers, JsonRpcClient } from "rpc";
import { defaultTheme } from "server/src/libs/default-theme";
import { AppInfo } from "./types";
export { cx } from "front/src/libs/cx";

export const createApp = (arg: AppInfo) => {
  return arg as AppInfo;
};

export const app = {
  name: "",
  rpc: null as JsonRpcClient<Handlers<typeof rpcAction>>,
  start: async () => {},
  register(name: string, fn: () => Promise<void>) {
    this.name = name;
    this.rpc = createClient(name);
    this.start = fn;
  },
};

export const readState = (
  fn: (state: {
    bar: typeof state_bar;
    app: typeof state_app;
    desktop: typeof state_desktop;
    theme: typeof defaultTheme;
  }) => any
): Promise<any> => {
  return new Promise<any>(async (resolve) => {
    const getter = fn(
      new DeepProxy(
        {},
        ({ trapName, PROXY, path, key }: THandlerContext<any>) => {
          if (trapName === "set") {
            throw new TypeError("target is immutable");
          }
          if (key === "___READ___") return path;

          return PROXY({});
        }
      ) as any
    );
    // const result = await app.rpc.read_state({ path: getter.___READ___ });
    // resolve(result);
  });
};

export const bar = {
  create: async (fn: (el: HTMLDivElement) => void) => {
    const barID = await app.rpc.createBarElement({ appName: app.name });

    const divEl = parent.window.document.getElementById(
      barID
    ) as HTMLDivElement;
    if (divEl) {
      fn(divEl);
    }
  },
};

// export const frame = {
//   create: async (
//     arg: Omit<Parameters<typeof app.rpc.create_frame>[0], "appName">
//   ) => {
//     return await app.rpc.create_frame({ ...arg, appName: app.name });
//   },
//   close: async (arg: { windowID: string }) => {},
// };
