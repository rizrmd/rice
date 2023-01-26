import { default_app } from "frontend/src/state/app";
import { AppInfo } from "types";

export const app = (arg: AppInfo) => {
  return arg;
};

export const rice = {
  // @ts-ignore
  mode: (typeof $CURRENT_MODE === "undefined" ? "init" : $CURRENT_MODE) as
    | "init"
    | "bar"
    | "frame",
};

export const bar = {
  start: async (arg: {
    size: string;
    position: "start" | "center" | "end";
  }) => {},
};

export const state = new Proxy(
  {},
  {
    get(target, p, receiver) {
      console.log(p);
    },
  }
) as {
  app: typeof default_app;
};

export const event = {};

export const frame = {
  create: async (arg: {
    width?: string;
    height?: string;
    attachedToBar?: boolean;
  }) => {
    return {
      window_id: "",
    };
  },
  close: async (arg: { window_id: string }) => {},
};
