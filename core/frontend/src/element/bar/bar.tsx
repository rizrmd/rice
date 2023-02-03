import { css } from "goober";
import { FC } from "react";
import { cx } from "../../libs/cx";
import { pick } from "../../libs/pick";
import { useGlobal } from "../../libs/use-global";
import { state_app } from "../../state/app";
import { BarItem, state_bar } from "../../state/bar";
import { bg } from "../../state/unit/bg";

export const Bar = () => {
  const bar = useGlobal(state_bar);
  const app = useGlobal(state_app);
  bar._ref = bar;

  const dir =
    bar.position === "bottom" || bar.position === "top"
      ? "horizontal"
      : "vertical";

  return (
    <div
      className={cx(
        "flex justify-between",
        // app.boot.status !== 'ready' && 'opacity-0',
        pick(dir, {
          horizontal: "flex-row",
          vertical: "flex-col",
        }),
        css`
          flex-basis: ${bar.size};
        `,
        bg.render(bar.bg),
        css`
          ${bar.css}
        `
      )}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="bar">
        {bar.items.map((item) => {
          return <BarItem key={item.id} item={item} dir={dir} bar={bar} />;
        })}
      </div>
    </div>
  );
};

const BarItem: FC<{
  item: BarItem;
  dir: "horizontal" | "vertical";
  bar: typeof state_bar;
}> = ({ item, dir, bar }) => {
  return (
    <iframe
      src={`/app/${item.appName}?bar`}
      onLoad={(e) => {
        const data = { ...item };
        delete data.iframe;

        item.iframe = e.currentTarget;
        e.currentTarget.contentWindow.postMessage({
          type: "APP_DATA",
          result: { type: "bar", ...data },
        });
      }}
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
};
