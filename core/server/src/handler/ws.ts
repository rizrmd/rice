import { ServerWebSocket, WebSocketHandler } from "bun";
import { createRequestHandler, Handlers, RequestHandler } from "rpc";
import { Action, action } from "../action";
import { schema } from "../export";
import { g } from "../init-state";

type SWS = ServerWebSocket<{ url: string }>;
const clients = new WeakMap<SWS, RequestHandler>();
const appParcel = {
  ws: null as null | WebSocket,
  client: null as null | ServerWebSocket<{ url: string }>,
};
export const ws: WebSocketHandler<{ url: string }> = {
  open(ws) {
    const { url } = ws.data;
    ws.subscribe("all");

    if (!g.wsClients) {
      g.wsClients = new Set();
    }
    g.wsClients.add(ws);

    if (url.includes("rice:rpc")) {
      clients.set(ws, createRequestHandler<Handlers<Action>>(action));
    } else {
      appParcel.client = ws;
      appParcel.ws = new WebSocket("ws://localhost:12300");
      appParcel.ws.onmessage = ({ data }) => {
        appParcel.client?.send(data);
      };
    }
  },
  async message(ws, raw) {
    const { url } = ws.data;

    if (appParcel.client === ws) {
      appParcel.ws?.send(raw);
    } else if (url.includes("rice:rpc")) {
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

    if (g.wsClients.has(ws)) {
      g.wsClients.delete(ws);
    }

    if (url.includes("rice:rpc")) {
      clients.delete(ws);
    }
  },
};
