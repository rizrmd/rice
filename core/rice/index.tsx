import { createClient } from "frontend/src/libs/rpc-action";
import { AppInfo } from "types";

export { cx } from "frontend/src/libs/cx";

export const createApp = (arg: AppInfo) => {
  return arg;
};

export const app = {
  // @ts-ignore
  name: typeof $APP_NAME === "undefined" ? "" : $APP_NAME,
  // @ts-ignore
  mode: (typeof $CURRENT_MODE === "undefined" ? "init" : $CURRENT_MODE) as
    | "init"
    | "bar"
    | "frame",
  data: undefined as any,
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
