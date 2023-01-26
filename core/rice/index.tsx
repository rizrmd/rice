import { default_app } from "frontend/src/state/app";
import { createClient } from "frontend/src/libs/rpc-action";
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
  data: undefined as any,
  app: {
    // @ts-ignore
    name: typeof $APP_NAME === "undefined" ? "" : $APP_NAME,
  },
};

const rpc = createClient(rice.app.name);

export const bar = {
  create: async (
    arg: Omit<Parameters<typeof rpc.create_bar>[0], "appName">
  ) => {
    return await rpc.create_bar({ ...arg, appName: rice.app.name });
  },
};

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
