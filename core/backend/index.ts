import { serve } from "bun";

serve({
  port: 12340,
  websocket: {
    open(ws) {
      ws.subscribe("all");
    },
    message(ws, msg) {},
    close(ws) {},
  },
  fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }

    return new Response("success");
  },
});
