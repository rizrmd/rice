import { DeepProxy, THandlerContext } from "@qiwi/deep-proxy";
import { defaultTheme } from "backend/src/libs/default-theme";
import { rpcAction } from "frontend/src/libs/rpc-action";
import { state_app } from "frontend/src/state/app";
import { state_bar } from "frontend/src/state/bar";
import { state_desktop } from "frontend/src/state/desktop";
import { AppInfo } from "types";
export { cx } from "frontend/src/libs/cx";

export const createApp = (arg: AppInfo) => {
  return arg as AppInfo;
};

export const app = {
  name: "",
  rpc: rpcAction,
  register(name: string, fn: () => Promise<void>) {
    this.name = name;
    const sapp: typeof state_app = (window as any).app;
    const running = sapp.running.find((e) => e.name === name);
    if (running) {
      running.start = fn;
    }
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
    const result = await app.rpc.read_state({ path: getter.___READ___ });
    resolve(result);
  });
};

export const bar = {
  create: async (fn: Parameters<typeof app.rpc["create_bar"]>[0]["fn"]) => {
    return await app.rpc.create_bar({ appName: app.name, fn });
  },
};

export const frame = {
  create: async (
    arg: Omit<Parameters<typeof app.rpc.create_frame>[0], "appName">
  ) => {
    return await app.rpc.create_frame({ ...arg, appName: app.name });
  },
  close: async (arg: { windowID: string }) => {},
};
