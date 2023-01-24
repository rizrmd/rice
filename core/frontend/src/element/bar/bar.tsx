import { css } from "goober";
import { cx } from "src/libs/cx";
import { bg } from "src/state/unit/bg";
import { useGlobal } from "../../libs/use-global";
import { state_app } from "../../state/app";
import { state_bar } from "../../state/bar";

export const Bar = () => {
  const app = useGlobal(state_app);
  const bar = useGlobal(state_bar);

  return (
    <div
      className={cx(
        css`
          flex-basis: ${bar.size};
        `,
        bg.render(bar.bg)
      )}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    ></div>
  );
};
