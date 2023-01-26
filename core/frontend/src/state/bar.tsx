import { declareGlobal } from "../libs/use-global";
import { bg } from "./unit/bg";

export const state_bar = declareGlobal({
  position: "top" as "top" | "left" | "bottom" | "right",
  size: "35px",
  bg: bg.use({
    blur: "5px",
    color: "rgba(0,0,0,.2)",
  }),
  css: "",
  items: {
    start: [] as BarItem[],
    center: [] as BarItem[],
    end: [] as BarItem[],
  },
});

type BarItem = {
  id: string;
  name: string;
  size: string;
  iframe: null | HTMLIFrameElement;
  data?: any;
};
