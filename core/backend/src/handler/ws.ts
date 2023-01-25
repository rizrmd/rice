import { ServerWebSocket, WebSocketHandler } from "bun";
import { createRequestHandler, Handlers, RequestHandler } from "rpc";
import { Action, action } from "../action";
import { schema } from "../export";

const clients = new WeakMap<ServerWebSocket<{ url: string }>, RequestHandler>();
export const ws: WebSocketHandler<{ url: string }> = {
  open(ws) {
    const { url } = ws.data;
    ws.subscribe("all");

    if (url.includes("rice:rpc")) {
      clients.set(ws, createRequestHandler<Handlers<Action>>(action));
    }
  },
  async message(ws, raw) {
    const { url } = ws.data;

    if (url.includes("rice:rpc")) {
      if (raw instanceof Uint8Array) {
        const msg = schema.req.unpack(raw);

        const handler = clients.get(ws);
        const res = await handler?.handleRequest(msg);

        ws.send(schema.res.pack(res));
      }
    }
  },
  close(ws) {
    const { url } = ws.data;

    if (url.includes("rice:rpc")) {
      clients.delete(ws);
    }
  },
};
