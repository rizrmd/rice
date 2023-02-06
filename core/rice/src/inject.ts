import * as rice from "./index";

const g = typeof window !== "undefined" ? window : globalThis;
for (const [k, v] of Object.entries(rice)) {
  g[k] = v;
}
