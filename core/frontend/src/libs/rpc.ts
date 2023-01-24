import { client, ClientQueue, schema } from "backend";

export const initRPC = () => {
  return;
  const ws = new WebSocket("ws://localhost:12345");
  const queue: ClientQueue = {};
  ws.onopen = async () => {
    (window as any).rpc = client(ws, queue);
  };
  ws.onmessage = async ({ data }) => {
    if (data instanceof ArrayBuffer) {
      const msg = schema.res.unpack(new Uint8Array(data));
      if (msg.result) queue[msg.id].resolve(msg.result);
      else if (msg.error) queue[msg.id].reject(msg.reject);
      delete queue[msg.id];
    }
  };
  ws.onclose = () => setTimeout(initRPC, 1000);
  ws.onerror = () => setTimeout(initRPC, 1000);
};
