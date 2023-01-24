import { serve, ServerWebSocket } from "bun";
import { createRequestHandler, Handlers, RequestHandler } from "rpc";
import { actions, schema } from "./export";
const clients = new WeakMap<ServerWebSocket, RequestHandler>();

const server = serve({
  port: 12345,
  websocket: {
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
  },
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }

    return new Response("success");
  },
});