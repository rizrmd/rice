import { client, ClientQueue, schema } from "backend";
import { state_app } from "src/state/app";
import { state_desktop } from "src/state/desktop";
import { w } from "./w";

export const initRPC = () => {
  const ws = new WebSocket("ws://localhost:12345/rice:rpc");
  const queue: ClientQueue = {};
  ws.onopen = async () => {
    w.rpc = client(ws, queue);

    state_app._ref.installed = await w.rpc.apps();

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
