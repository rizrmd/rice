import { client, ClientQueue, schema } from "backend";
import { createRequestHandler, Handlers } from "rpc";
import { AppRunning, state_app } from "../state/app";
import { rpcAction } from "./rpc-action";
import { w } from "./w";
import { waitUntil } from "./wait-until";

let retry = 0;
export const initRPC = () => {
  retry++;

  if (retry > 5) return;
  const ws = new WebSocket("ws://localhost:12345/rice:rpc");
  const queue: ClientQueue = {};
  ws.onopen = async () => {
    w.rpc = client(ws, queue);

    await waitUntil(() => state_app._ref);

    const apps = await w.rpc.apps();

    if (Object.keys(state_app.installed).length === 0) {
      for (const [k, v] of Object.entries(apps)) {
        state_app.installed[k] = v;

        if (state_app.startup.includes(k)) {
          const app: AppRunning = v as any;
          app.iframe = document.createElement("iframe");
          app.iframe.src = `/app/${app.name}`;
          app.iframe.id = `app-${app.name}`;
          app.iframe.className = "hidden";
          app.iframe.onload = () => {
            const w: any = app.iframe.contentWindow;
            if (w.app_data_resolve) {
              w.app_data_resolve({ type: "app" });
            }
          };
          document.body.append(app.iframe);
          state_app._ref.running.push(app);
        }
      }
    }
    state_app._ref.boot.appLoaded = true;
    state_app._ref.render();
  };

  ws.onmessage = async ({ data }) => {
    let msg = null as any;
    if (data instanceof ArrayBuffer) {
      msg = schema.res.unpack(new Uint8Array(data));
    } else if (data instanceof Blob) {
      const ab = await data.arrayBuffer();
      msg = schema.res.unpack(new Uint8Array(ab));
    }

    if (msg) {
      if (msg.result) queue[msg.id].resolve(msg.result);
      else if (msg.error) queue[msg.id].reject(msg.error);
      delete queue[msg.id];
    }
  };
  ws.onclose = () => setTimeout(initRPC, 2000);
  ws.onerror = () => setTimeout(initRPC, 2000);
};

const eventMethod = window.addEventListener
  ? "addEventListener"
  : "attachEvent";
const eventer = window[eventMethod];
const messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";
const handler = createRequestHandler<Handlers<typeof rpcAction>>(rpcAction);
eventer(messageEvent, async function (e: MessageEvent<any>) {
  const data = e.data;
  if (typeof data === "object" && data.type === "action") {
    const result = await handler.handleRequest(data);
    e.source.postMessage(result);
  }
});
