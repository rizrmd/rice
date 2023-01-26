import { ClientQueue } from "backend";
import cuid from "cuid";
import {
  createJsonRpcClient,
  Handlers,
  JsonRpcRequest,
  JsonRpcResponse,
} from "rpc";
import { AppBarData, state_bar } from "../state/bar";

export const rpcAction = {
  create_bar(arg: {
    appName: string;
    size: string;
    position: "start" | "center" | "end";
    data?: any;
  }) {
    const bar_id = cuid();
    state_bar._ref.items[arg.position].push({
      id: bar_id,
      iframe: null,
      name: arg.appName,
      size: arg.size,
    });
    state_bar._ref.render();

    const result: AppBarData = {
      type: "bar",
      id: bar_id,
      name: arg.appName,
      size: arg.size,
      data: arg.data,
    };
    return result;
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
      (window as any).app_data_resolve(data.result);
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
