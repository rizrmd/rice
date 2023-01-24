export const state = globalThis as unknown as typeof defaultState;

const defaultState = {
  frontend: {
    url: null as null | URL,
  },
  pathCache: {} as Record<string, true>,
};

export const initState = () => {
  for (const [k, v] of Object.entries(defaultState)) {
    if (!(state as any)[k]) (state as any)[k] = v;
  }
};
