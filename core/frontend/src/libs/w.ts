import type { client } from "backend";

export const w = window as unknown as {
  rpc: ReturnType<typeof client>;
};
