import { serve, ServerWebSocket } from "bun";
import { handler } from "./handler/handler";
import { initState, server_state } from "./init-state";

// Rice Main

await initState();

serve({
  port: server_state.rice.url.port,
  websocket: {
    open(...args: [ws: ServerWebSocket<{url:string}>]) {
      return handler.ws.open(...args);
    },
    message(...args) {
      return handler.ws.message(...args);
    },
    close(...args) {
      return handler.ws.close(...args);
    },
  },
  fetch: (...args) => {
    return handler.http(...args);
  },
});

console.log(server_state.rice.url + "\n");
