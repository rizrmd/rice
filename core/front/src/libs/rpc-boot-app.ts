import { createRequestHandler, Handlers } from "rpc";
import { client, ClientQueue, schema } from "server";
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
    w.app = state_app._ref;
    const app = state_app._ref;

    if (Object.keys(app.installed).length === 0) {
      for (const giturl of Object.values(app.startup)) {
        const info = await w.rpc.installApp(giturl);

        app.installed[giturl] = info;

        const current: AppRunning = { ...info } as any;
        app.running.push(current);

        current.script = document.createElement("script");
        current.script.src = `/app/${current.name}/${current.name}-install`;
        current.script.id = `app-${current.name}`;
        document.body.append(current.script);
      }
    }
    app.render();
  };

  ws.onmessage = async ({ data }) => {
    let msg = null as any;
    const app = state_app._ref;
    if (typeof data === "string") {
      try {
        const json = JSON.parse(data);
        if (json.type === "hmr-app") {
          for (const current of Object.values(app.running)) {
            if (current.name === json.name) {
              const now = Date.now();
              current.script.remove();
              current.script = document.createElement("script");
              current.script.type = "text/javascript";
              // current.script.src = `/app/${current.name}/${current.name}-install?t=${now}`;
              // current.script.innerHTML = 'console.log("wowowoi")';
              current.script.id = `app-${current.name}-${now}`;
              document.body.append(current.script);
            }
          }
        }
      } catch (e) {}
      return;
    }

    if (data instanceof ArrayBuffer) {
      msg = schema.res.unpack(new Uint8Array(data));
    } else if (data instanceof Blob) {
      const ab = await data.arrayBuffer();
      msg = schema.res.unpack(new Uint8Array(ab));
    }

    if (msg) {
      if (msg.result) queue[msg.id].resolve(msg.result);
      else if (msg.error)
        queue[msg.id].reject(
          `\n\nRPC ERROR (calling ${queue[msg.id].method}), ${
            msg.error.name
          }: \n${msg.error.message}: \n\n${msg.error.stack}`
        );
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
