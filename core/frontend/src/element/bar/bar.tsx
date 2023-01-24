import { css } from "goober";
import { useGlobal } from "../../libs/use-global";
import { state_app } from "../../state/app";
import { state_bar } from "../../state/bar";

export const Bar = () => {
  const app = useGlobal(state_app);
  const bar = useGlobal(state_bar);
  console.log("bar");

  return (
    <div
      key={123}
      className={css`
        background-color: ${bar.bg.color};
        backdrop-filter: blur(${bar.bg.blur});
        flex-basis: ${bar.size};
      `}
    >
      {app.running.length}
    </div>
  );
};
