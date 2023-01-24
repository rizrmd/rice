import { serve } from "bun";
import { handler } from "./handler/handler";
import { initState } from "./state";

initState();
serve({
  port: 12345,
  websocket: handler.ws,
  fetch: (...args) => {
    return handler.http(...args);
  },
});
