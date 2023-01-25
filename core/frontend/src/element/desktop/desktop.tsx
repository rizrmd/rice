import { css } from "goober";
import { FC, useContext } from "react";
import { cx } from "src/libs/cx";
import { useGlobal } from "../../libs/use-global";
import { state_app } from "../../state/app";

export const Desktop = () => {
  const app = useGlobal(state_app);

  return (
    <div
      className={cx("flex-1 flex p-10")}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* {app.installed.map((e) => {
        if (!e.app) return null;
        return (
          <div key={e.name} className="flex flex-col items-center space-y-1">
            <img
              className={cx(
                css`
                  width: 50px;
                  height: 50px;
                `
              )}
              draggable={false}
              src={`/app/${e.name}/icon`}
            />
            <div className="text-white text-xs">{e.title}</div>
          </div>
        );
      })} */}
    </div>
  );
};
