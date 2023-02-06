import { declareGlobal } from "../libs/use-global";
import { css } from "goober";
import { w } from "../libs/w";
w.css = css;

export const state_bar = declareGlobal({
  position: "top" as "top" | "left" | "bottom" | "right",
  css: css`
    height: 35px;
    position: absolute;
    z-index: 20;
    left: 0px;
    top: 0px;
    right: 0px;
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  `,
  items: [] as BarItem[],
});

export type BarID = string;

export type BarItem = {
  id: BarID;
  barName: string;
  appName: string;
  placement: "start" | "center" | "end";
  setBarEl: (el: HTMLDivElement) => void;
};
