import { state_app } from "src/state/app";
import { state_desktop } from "src/state/desktop";
import { bg } from "src/state/unit/bg";
import { cx } from "../libs/cx";
import { pick } from "../libs/pick";
import { useGlobal } from "../libs/use-global";
import { state_bar } from "../state/bar";
import { Bar } from "./bar/bar";
import { Boot } from "./boot";
import { Desktop } from "./desktop/desktop";

export const Main = () => {
  const bar = useGlobal(state_bar);
  const _ = useGlobal(state_app); // required to re-render on app change
  const desktop = useGlobal(state_desktop);

  if (desktop.booting) {
    return <Boot />;
  }

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
