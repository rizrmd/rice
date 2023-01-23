import { cx } from "../libs/cx";
import { pick } from "../libs/pick";
import { useGlobal } from "../libs/use-global";
import { StateBar } from "../state/bar";
import { Bar } from "./bar/bar";
import { Desktop } from "./desktop/desktop";

export const Main = () => {
  const bar = useGlobal(StateBar);
  return (
    <div
      className={cx(
        "flex flex-1",
        pick(bar.position, {
          bottom: "flex-col-reverse",
          left: "flex-row",
          right: "flex-row-reverse",
          top: "flex-col",
        })
      )}
    >
      <Bar key={"bar"} />
      <Desktop key={"desktop"} />
    </div>
  );
};
