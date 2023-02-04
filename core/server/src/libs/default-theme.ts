import { bg } from "front/src/state/unit/bg";

export const defaultTheme = {
  bg: bg.use({
    img: "/user/pictures/bg.jpg",
    color: "#0a1a20",
  }),
  font: {
    color: "white",
    family: "Jetbrains Mono",
    weight: 400,
    size: "9px",
  },
};
