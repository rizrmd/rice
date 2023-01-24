import { css } from "goober";
import { state_desktop } from "src/state/desktop";
import { bg } from "src/state/unit/bg";
import { cx } from "../libs/cx";
import { pick } from "../libs/pick";
import { useGlobal } from "../libs/use-global";
import { state_bar } from "../state/bar";
import { Bar } from "./bar/bar";
import { Desktop } from "./desktop/desktop";

export const Main = () => {
  const bar = useGlobal(state_bar);
  const desktop = useGlobal(state_desktop);

  return (
    <div
      className={cx(
        "flex flex-1 select-none",
        pick(bar.position, {
          bottom: "flex-col-reverse",
          left: "flex-row",
          right: "flex-row-reverse",
          top: "flex-col",
        }),
        bg.render(desktop.bg)
      )}
    >
      <Bar />
      <Desktop />
    </div>
  );
};
