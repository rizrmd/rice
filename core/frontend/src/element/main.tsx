import { cx } from "../libs/cx";
import { pick } from "../libs/pick";
import { useGlobal } from "../libs/use-global";
import { state_app } from "../state/app";
import { state_bar } from "../state/bar";
import { Bar } from "./bar/bar";
import { Desktop } from "./desktop/desktop";

export const Main = () => {
  const bar = useGlobal(state_bar);
  const app = useGlobal(state_app);
  console.log("main");
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
      <Bar  />
      <Desktop key={"desktop"} />
    </div>
  );
};
