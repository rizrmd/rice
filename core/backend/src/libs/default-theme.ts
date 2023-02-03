import { bg } from "frontend/src/state/unit/bg";

export const defaultTheme = {
  text: {
    color: "white",
  },
  bg: bg.use({
    img: "/user/pictures/bg.jpg",
    color: "#0a1a20",
  }),
  font: "Jetbrains Mono",
};
