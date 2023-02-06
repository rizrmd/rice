import { DeepProxy, THandlerContext } from "@qiwi/deep-proxy";
import { createClient, rpcAction } from "front/src/libs/app-action";
import { state_app } from "front/src/state/app";
import { state_bar } from "front/src/state/bar";
import { state_frame } from "front/src/state/frame";
import { extractCss } from "goober";
import { Handlers, JsonRpcClient } from "rpc";
import { defaultTheme } from "server/src/libs/default-theme";
import { AppInfo } from "./types";
export { cx } from "front/src/libs/cx";
export { css } from "goober";

export const createApp = (arg: AppInfo) => {
  return arg as AppInfo;
};

export const app = {
  name: "",
  rpc: null as JsonRpcClient<Handlers<typeof rpcAction>>,
  register(name: string, start: () => Promise<void>) {
    this.name = name;
    this.rpc = createClient(name);
    this.rpc.closeApp({ appName: app.name });
    setTimeout(() => {
      start();
    });
  },
};

export const state = {
  peek: (
    fn: (state: {
      bar: typeof state_bar;
      app: typeof state_app;
      frame: typeof state_frame;
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
  },
};

export const ui = {
  bar: {
    create: async (arg: {
      name: string;
      placement: "start" | "center" | "end";
      render: (el: HTMLDivElement) => void;
    }) => {
      const barID = await app.rpc.createBarElement({
        appName: app.name,
        barName: arg.name,
        placement: arg.placement,
      });
      const divEl = parent.window.document.getElementById(
        barID
      ) as HTMLDivElement;
      if (divEl) {
        arg.render(divEl);
        const goobcss = extractCss();
        app.rpc.appendStyle("_goober", goobcss);
      }
    },
  },
  frame: {
    create: async (arg: {
      name: string;
      title?: string;
      render: (el: HTMLDivElement) => void;
    }) => {
      const frameID = await app.rpc.createFrameElement({
        appName: app.name,
        frameName: arg.name,
        title: arg.title,
      });
      const divEl = parent.window.document.getElementById(
        frameID
      ) as HTMLDivElement;
      if (divEl) {
        arg.render(divEl);
        const goobcss = extractCss();
        app.rpc.appendStyle("_goober", goobcss);
      }
    },
  },
};

export const asset = {
  injectCSS: (path: string) => {
    app.rpc.importCSS(app.name, path);
  },
  url: (path: string) => {
    return `/app/${app.name}/${path}`;
  },
  preload: (arg: { images: [] }) => {},
};

// export const frame = {
//   create: async (
//     arg: Omit<Parameters<typeof app.rpc.create_frame>[0], "appName">
//   ) => {
//     return await app.rpc.create_frame({ ...arg, appName: app.name });
//   },
//   close: async (arg: { windowID: string }) => {},
// };
