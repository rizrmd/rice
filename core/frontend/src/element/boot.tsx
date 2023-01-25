import { css } from "goober";
import { cx } from "src/libs/cx";

export const Boot = () => {
  return (
    <div
      className={cx(
        "flex flex-1 select-none justify-center items-center",
        css`
          color: white;
          background: #0a1a20;
        `
      )}
    >
      Booting...
    </div>
  );
};
