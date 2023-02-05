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
  items: [] as BarItem[],
});

export type BarID = string;

export type BarItem = {
  id: BarID;
  appName: string;
  fn: (el: HTMLDivElement) => void;
};