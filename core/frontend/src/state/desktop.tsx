import { declareGlobal } from "src/libs/use-global";
import { bg } from "./unit/bg";

export const state_desktop = declareGlobal({
  booting: true,
  bg: bg.use({
    img: "/user/pictures/bg.jpg",
  }),
});
