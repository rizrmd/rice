import { ServerWebSocket, WebSocketHandler } from "bun";
import { createRequestHandler, Handlers, RequestHandler } from "rpc";
import { actions, schema } from "../action";

const clients = new WeakMap<ServerWebSocket, RequestHandler>();
export const ws: WebSocketHandler<any> = {
  open(ws) {
    ws.subscribe("all");
    clients.set(ws, createRequestHandler<Handlers<typeof actions>>(actions));
  },
  async message(ws, raw) {
    if (raw instanceof Uint8Array) {
      const msg = schema.req.unpack(raw);

      const handler = clients.get(ws);
      const res = await handler?.handleRequest(msg);

      ws.send(schema.res.pack(res));
    }
  },
  close(ws) {
    clients.delete(ws);
  },
};
