import { serve } from "bun";
import { initApp } from "./boot";
import { handler } from "./handler/handler";
import { initState, state } from "./state";

initState();
await initApp();
serve({
  port: state.rice.url.port,
  websocket: handler.ws,
  fetch: (...args) => {
    return handler.http(...args);
  },
});
