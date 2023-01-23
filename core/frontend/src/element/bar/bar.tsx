import { css } from "goober";
import { useGlobal } from "../../libs/use-global";
import { StateBar } from "../../state/bar";

export const Bar = () => {
  const bar = useGlobal(StateBar);
  return (
    <div
    key={123}
      className={css`
        background-color: ${bar.bg.color};
        backdrop-filter: blur(${bar.bg.blur});
        flex-basis: ${bar.size};
      `}
    ></div>
  );
};
