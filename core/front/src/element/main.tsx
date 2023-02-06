import { AnimatePresence } from "framer-motion";
import { cx } from "../libs/cx";
import { pick } from "../libs/pick";
import { useGlobal } from "../libs/use-global";
import { state_app } from "../state/app";
import { state_bar } from "../state/bar";
import { state_frame } from "../state/frame";
import { bg } from "../state/unit/bg";
import { Bar } from "./bar/bar";
import { Boot } from "./boot";
import { Frame } from "./desktop/frame";

export const Main = () => {
  const bar = useGlobal(state_bar);
  const app = useGlobal(state_app);
  const frame = useGlobal(state_frame);
  app._ref = app;

  return (
    <div
      className={cx(
        "flex flex-1 select-none relative",
        pick(bar.position, {
          bottom: "flex-col-reverse",
          left: "flex-row",
          right: "flex-row-reverse",
          top: "flex-col",
        }),
        bg.render(server_theme.bg)
      )}
      onPointerDown={() => {
        frame.focus = null;
        frame.render();
      }}
    >
      <>
        <Bar />
        <Frame />
      </>
      <AnimatePresence>
        {app.boot.status === "loading" && <Boot />}
      </AnimatePresence>
    </div>
  );
};
