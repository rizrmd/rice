import { css } from "goober";
import { FC } from "react";
import { cx } from "../../libs/cx";
import { pick } from "../../libs/pick";
import { useGlobal } from "../../libs/use-global";
import { w } from "../../libs/w";
import { BarItem, state_bar } from "../../state/bar";
import { bg } from "../../state/unit/bg";

export const Bar = () => {
  const bar = useGlobal(state_bar);
  bar._ref = bar;
  w.bar = bar;

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
          return <RenderBar key={item.id} item={item} dir={dir} bar={bar} />;
        })}
      </div>
    </div>
  );
};

const RenderBar: FC<{
  item: BarItem;
  dir: "horizontal" | "vertical";
  bar: typeof state_bar;
}> = ({ item, dir, bar }) => {
  return (
    <div
      id={item.id}
      ref={(el) => {
        if (el) {
          item.fn(el);
        }
      }}
    ></div>
  );
};
