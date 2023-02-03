import { ClientQueue } from "backend";
import cuid from "cuid";
import get from "lodash.get";
import {
  createJsonRpcClient,
  Handlers,
  JsonRpcRequest,
  JsonRpcResponse
} from "rpc";
import { state_app } from "../state/app";
import { BarItem, state_bar } from "../state/bar";
import { state_desktop } from "../state/desktop";

export const rpcAction = {
  create_frame(arg: {
    appName: string;
    title: string;
    width: string;
    height: string;
    data?: any;
  }) {
    const frameID = cuid();
    if (state_desktop._ref) {
      state_desktop._ref.frame.items.push({
        id: frameID,
        iframe: null,
        appName: arg.appName,
        width: arg.width,
        height: arg.height,
        data: arg.data,
        title: arg.title,
      });
      state_desktop._ref.render();
    } else {
      console.warn("Failed to create frame, state_desktop is not initialized.");
    }
  },
  create_bar(arg: { appName: string; fn: BarItem["fn"] }) {
    const barID = cuid();
    state_bar._ref.items.push({
      id: barID,
      appName: arg.appName,
      fn: arg.fn,
    });
    state_bar._ref.render();
  },

  read_state(arg: { path: string[] }) {
    const state = arg.path.shift();
    if (state === "bar") return get(state_bar, arg.path.join(".")) || state_bar;
    if (state === "app") return get(state_app, arg.path.join(".")) || state_app;
    if (state === "desktop")
      return get(state_desktop, arg.path.join(".")) || state_desktop;
    if (state === "theme")
      return get(backend_theme, arg.path.join(".")) || backend_theme;

    return undefined;
  },
};

export const createClient = (appName: string) => {
  const queue: ClientQueue<{ appName: string }> = {};

  if (typeof window === "undefined") return;

  const eventMethod = window.addEventListener
    ? "addEventListener"
    : "attachEvent";
  const eventer = window[eventMethod];
  const messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";
  eventer(messageEvent, function (e: MessageEvent<any>) {
    const data = e.data;

    if (data.type === "APP_DATA") {
      app_data_resolve(data.result);
      return;
    }

    if (queue[data.id]) {
      if ("result" in data) {
        queue[data.id].resolve(data.result);
      } else {
        queue[data.id].reject(
          data.error
            ? data.error.message
            : `Error when calling rpc.${queue[data.id].method} from app ${
                queue[data.id].appName
              }. Rice cannot get detailed error. \n\n(${JSON.stringify(
                data.error,
                null,
                2
              )})`
        );
      }
      delete queue[data.id];
    }
  });

  return createJsonRpcClient<Handlers<typeof rpcAction>>({
    sendRequest(req: JsonRpcRequest & { id: string }) {
      const id = cuid();
      return new Promise<JsonRpcResponse>(async (resolve, reject) => {
        queue[id] = { appName, method: req.method, resolve, reject };
        parent.postMessage({
          type: "action",
          method: req.method,
          params: req.params,
          id,
        });
      });
    },
  });
};
