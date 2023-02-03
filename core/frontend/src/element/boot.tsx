import { css } from "goober";
import { cx } from "../libs/cx";
import { useGlobal } from "../libs/use-global";
import { default_app } from "../state/app";
export const Boot = () => {
  const app = useGlobal(default_app, async () => {
    setTimeout(() => {
      app.boot.loadingPercent = 100;
      app.render();
    }, 500);

    setTimeout(() => {
      app.boot.status = "asset-loaded";
      app.render();
    }, 800);
  });

  return (
    <div
      className={cx(
        "flex absolute inset-0 select-none justify-center items-center",
        css`
          background-color: ${backend_theme.bg.color};
        `
      )}
    >
      <div className="w-[150px] bg-gray-200 h-1">
        <div
          className={cx(
            "bg-[#265058] h-1 transition-all",
            css`
              width: ${app.boot.loadingPercent}%;
            `
          )}
        ></div>
      </div>
    </div>
  );
};
