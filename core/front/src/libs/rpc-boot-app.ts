import { createRequestHandler, Handlers } from "rpc";
import { client, ClientQueue, schema } from "server";
import { AppRunning, state_app } from "../state/app";
import { rpcAction } from "./app-action";
import { w } from "./w";
import { waitUntil } from "./wait-until";

const wsURL = () => {
  const hostname =
    location.protocol.indexOf("http") === 0 ? location.hostname : "localhost";
  const port = location.port;
  const protocol =
    location.protocol == "https:" &&
    !/localhost|127.0.0.1|0.0.0.0/.test(hostname)
      ? "wss"
      : "ws";
  return protocol + "://" + hostname + (port ? ":" + port : "");
};

let retry = 0;
export const initRPC = () => {
  retry++;

  if (retry > 5) return;
  const ws = new WebSocket(`${wsURL()}/rice:rpc`);
  const queue: ClientQueue = {};

  ws.onopen = async () => {
    w.rpc = client(ws, queue);

    await waitUntil(() => state_app._ref);
    w.app = state_app._ref;
    const app = state_app._ref;

    if (Object.keys(app.installed).length === 0) {
      for (const appName of Object.values(app.startup)) {
        const info = await w.rpc.appInfo(appName);

        app.installed[appName] = info;

        const current: AppRunning = { ...info } as any;
        app.running.push(current);

        current.iframe = document.createElement("iframe");
        current.iframe.src = `/app/${current.name}/index`;
        current.iframe.id = `app-${current.name}`;
        current.iframe.style.display = "none";
        current.iframe.onload = () => {
          current.iframe.contentWindow.postMessage({
            type: "app-start",
          });
        };
        document.body.append(current.iframe);
      }
    }
    app.render();
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
const listenEvent = window[eventMethod];
const onMessage = eventMethod === "attachEvent" ? "onmessage" : "message";
const handler = createRequestHandler<Handlers<typeof rpcAction>>(rpcAction);
listenEvent(onMessage, async function (e: MessageEvent<any>) {
  const data = e.data;
  if (typeof data === "object") {
    if (data.type === "app-register") {
      const result = await handler.handleRequest(data);
      e.source.postMessage(result);
    }
  }
});
