const defaultBar = {
  position: "top" as "top" | "left" | "bottom" | "right",
  size: "35px",
  bg: {
    blur: "0px",
    color: "rgba(0,0,0,.5)",
  },
};
export const TStateBar = typeof defaultBar;
export const StateBar = { ...defaultBar };
