import { http } from "./http";
import { ws } from "./ws";

export const handler = globalThis as unknown as {
  http: typeof http;
  ws: Required<typeof ws>;
};

handler.http = http;
handler.ws = ws as any;
