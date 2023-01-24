import cuid from "cuid";
import { Packr } from "msgpackr";
import {
  createJsonRpcClient,
  Handlers,
  JsonRpcRequest,
  JsonRpcResponse,
} from "rpc";
import type { Action } from "./action";

const structures = {
  req: [["type", "method", "params", "id"]],
  res: [["id", "result", "error"]],
};
export const schema = {
  req: new Packr({
    bundleStrings: true,
    structures: structures.req,
    maxSharedStructures: structures.req.length,
  }),
  res: new Packr({
    bundleStrings: true,
    structures: structures.res,
    maxSharedStructures: structures.res.length,
  }),
};
export type ClientQueue = Record<
  string,
  {
    method: string;
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }
>;
export const client = (ws: WebSocket, queue: ClientQueue) => {
  const sender = {
    sendRequest(req: JsonRpcRequest & { id: string }) {
      const id = cuid();
      return new Promise<JsonRpcResponse>(async (resolve, reject) => {
        queue[id] = { method: req.method, resolve, reject };
        ws.send(
          schema.req.pack({
            type: "action",
            method: req.method,
            params: req.params,
            id,
          })
        );
      });
    },
  };
  return createJsonRpcClient<Handlers<Action>>(sender);
};
