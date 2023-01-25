import { client, ClientQueue, schema } from "backend";
import { AppRunning, state_app } from "src/state/app";
import { state_desktop } from "src/state/desktop";
import { w } from "./w";

let retry = 0;
export const initRPC = () => {
  retry++;

  if (retry > 5) return;
  const ws = new WebSocket("ws://localhost:12345/rice:rpc");
  const queue: ClientQueue = {};
  ws.onopen = async () => {
    w.rpc = client(ws, queue);

    const apps = await w.rpc.apps();

    if (Object.keys(state_app.installed).length === 0) {
      for (const [k, v] of Object.entries(apps)) {
        state_app.installed[k] = v;

        if (state_app.startup.includes(k)) {
          const app: AppRunning = v as any;
          app.iframe = document.createElement("iframe");
          app.iframe.src = `/app/${app.name}`;
          app.iframe.id = `app-${app.name}`;
          document.body.append(app.iframe);
          state_app.running.push(app);
        }
      }
    }

    state_desktop._ref.booting = false;
    state_desktop._ref.render();
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
  ws.onclose = () => setTimeout(initRPC, 1000);
  ws.onerror = () => setTimeout(initRPC, 1000);
};
