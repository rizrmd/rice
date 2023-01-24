import { bg } from "./unit/bg";

export const state_bar = {
  position: "top" as "top" | "left" | "bottom" | "right",
  size: "35px",
  bg: bg.use({
    blur: "5px",
    color: "rgba(0,0,0,.2)",
  }),
  css: "",
};
