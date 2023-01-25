import { Subprocess } from "bun";
import { ChildProcess } from "child_process";
import { app } from "rice";
export const state = globalThis as unknown as typeof defaultState;

const defaultState = {
  rice: {
    url: new URL("http://localhost:12345"),
  },
  frontend: {
    url: null as null | URL,
  },
  app: {} as Record<
    string,
    {
      info: ReturnType<typeof app>;
      bar?: string;
      app?: string
    }
  >,
};

export const initState = () => {
  for (const [k, v] of Object.entries(defaultState)) {
    if (!(state as any)[k]) (state as any)[k] = v;
  }
};
