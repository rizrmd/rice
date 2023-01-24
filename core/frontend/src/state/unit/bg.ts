import { css } from "goober";

const bg_default = {
  img: "",
  fill: "cover" as "cover" | "contain" | "stretch",
  color: "transparent",
  blur: "",
};

export type UnitBg = typeof bg_default;

export const bg = {
  default: bg_default,
  use(value: Partial<UnitBg>) {
    return Object.assign({ ...bg_default }, value) as UnitBg;
  },
  render(bg: UnitBg) {
    return css`
      ${bg.img && `background-image: url(${bg.img});`}
      ${bg.fill &&
      `background-size: ${bg.fill === "stretch" ? "100% 100%" : bg.fill};`}
      ${bg.blur && `backdrop-filter: blur(${bg.blur});`}
      ${bg.color && `background-color: ${bg.color};`}
    `;
  },
};
