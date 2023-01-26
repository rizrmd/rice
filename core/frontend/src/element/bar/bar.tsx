import { css } from "goober";
import { Fragment } from "react";
import { cx } from "../../libs/cx";
import { pick } from "../../libs/pick";
import { useGlobal } from "../../libs/use-global";
import { state_app } from "../../state/app";
import { state_bar } from "../../state/bar";
import { bg } from "../../state/unit/bg";

export const Bar = () => {
  const app = useGlobal(state_app);
  const bar = useGlobal(state_bar);

  const dir =
    bar.position === "bottom" || bar.position === "top"
      ? "horizontal"
      : "vertical";

  return (
    <div
      className={cx(
        "flex justify-between",
        pick(dir, {
          horizontal: "flex-row",
          vertical: "flex-col",
        }),
        css`
          flex-basis: ${bar.size};
        `,
        bg.render(bar.bg)
      )}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="bar-start">
        {bar.items.start.map((item) => {
          return (
            <iframe
              key={item.id}
              src={`/app/${item.name}?bar`}
              className={cx(
                pick(dir, {
                  horizontal: css`
                    width: ${item.size};
                    height: ${bar.size};
                  `,
                  vertical: css`
                    width: ${bar.size};
                    height: ${item.size};
                  `,
                }),
                css`
                  overflow: hidden;
                `
              )}
            />
          );
        })}
      </div>
      <div className="bar-center"></div>
      <div className="bar-end"></div>
      {/* {bar.app.map((item) => {
        return (
          <iframe
            className={cx(
              pick(bar.position, {
                top: css`
                  width: ${item.size};
                  height: ${bar.size};
                `,
                left: css`
                  width: ${bar.size};
                  height: ${item.size};
                `,
                bottom: css`
                  width: ${item.size};
                  height: ${bar.size};
                `,
                right: css`
                  width: ${bar.size};
                  height: ${item.size};
                `,
              }),
              css`
                overflow: hidden;
              `
            )}
            src={`/app/${item.name}/index?bar`}
            key={item.name}
            ref={(e) => (item.iframe = e)}
          />
        );
      })} */}
    </div>
  );
};
