import { serve } from "bun";
import { initApp } from "./init-app";
import { handler } from "./handler/handler";
import { initState, backend_state } from "./init-state";

// Rice Main

await initState();
await initApp();

serve({
  port: backend_state.rice.url.port,
  websocket: {
    open(...args) {
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

console.log(backend_state.rice.url + "\n");
