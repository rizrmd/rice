import { css } from "goober";
import { cx } from "../libs/cx";
import { useGlobal } from "../libs/use-global";
import { state_desktop } from "../state/desktop";

export const Boot = () => {
  const desktop = useGlobal(state_desktop);
  return (
    <div
      className={cx(
        "flex flex-1 select-none justify-center items-center",
        css`
          color: white;
          background: ${desktop.bg.color};
        `
      )}
    >
      Booting...
    </div>
  );
};
