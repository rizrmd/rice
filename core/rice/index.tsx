import { DeepProxy, THandlerContext } from "@qiwi/deep-proxy";
import { createClient } from "frontend/src/libs/rpc-action";
import { state_app } from "frontend/src/state/app";
import { AppBarData, state_bar } from "frontend/src/state/bar";
import { state_desktop } from "frontend/src/state/desktop";
import { state_frame } from "frontend/src/state/frame";
import { AppInfo } from "types";

export { cx } from "frontend/src/libs/cx";

export const createApp = (arg: AppInfo) => {
  return arg;
};

export const app = {
  // @ts-ignore
  name: typeof $APP_NAME === "undefined" ? "" : $APP_NAME,
  // @ts-ignore
  mode: (typeof $APP_MODE === "undefined" ? "init" : $APP_MODE) as
    | "init"
    | "bar"
    | "frame",
  // @ts-ignore
  modeInfo: (typeof $APP_DATA === "undefined"
    ? undefined
    : // @ts-ignore
      $APP_DATA) as Promise<undefined | AppBarData>,
};

export const readState = (
  fn: (state: {
    bar: typeof state_bar;
    app: typeof state_app;
    desktop: typeof state_desktop;
    frame: typeof state_frame;
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
    const result = await rpc.read_state({ path: getter.___READ___ });
    resolve(result);
  });
};

const rpc = createClient(app.name);

export const bar = {
  create: async (
    arg: Omit<Parameters<typeof rpc.create_bar>[0], "appName">
  ) => {
    return await rpc.create_bar({ ...arg, appName: app.name });
  },
};

export const frame = {
  create: async (
    arg: Omit<Parameters<typeof rpc.create_frame>[0], "appName">
  ) => {
    return await rpc.create_frame({ ...arg, appName: app.name });
  },
  close: async (arg: { windowID: string }) => {},
};
