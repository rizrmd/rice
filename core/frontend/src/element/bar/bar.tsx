import { css } from "goober";
import { cx } from "src/libs/cx";
import { pick } from "src/libs/pick";
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
        "flex",
        pick(bar.position, {
          top: "flex-row",
          left: "flex-col",
          bottom: "flex-col",
          right: "flex-row",
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
      {bar.app.map((item) => {
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
      })}
    </div>
  );
};
