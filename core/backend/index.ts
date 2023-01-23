import { watch } from "@napi-rs/notify";
import { serve } from "bun";

watch(process.cwd(), (_, e) => {
  console.log(e);
});

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
