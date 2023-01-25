import { declareGlobal } from "src/libs/use-global";
import { bg } from "./unit/bg";

export const state_bar = declareGlobal({
  position: "top" as "top" | "left" | "bottom" | "right",
  size: "35px",
  bg: bg.use({
    blur: "5px",
    color: "rgba(0,0,0,.2)",
  }),
  css: "",
  app: [{ name: "launcher", iframe: null, size: "40px;" }] as {
    name: string;
    size: string;
    dir: "start" | "end" | "center";
    iframe: null | HTMLIFrameElement;
  }[],
});
