import { motion } from "framer-motion";
import { FC, RefObject, useRef } from "react";
import { cx } from "../../libs/cx";
import { pick } from "../../libs/pick";
import { useGlobal } from "../../libs/use-global";
import { w } from "../../libs/w";
import { BarItem, state_bar } from "../../state/bar";

export const Bar = () => {
  const bar = useGlobal(state_bar);
  const containerEl = useRef<HTMLDivElement>(null);
  bar._ref = bar;
  w.bar = bar;

  const dir =
    bar.position === "bottom" || bar.position === "top"
      ? "horizontal"
      : "vertical";

  return (
    <>
      <div
        ref={containerEl}
        className={cx(
          bar.css,
          "flex justify-between",
          pick(dir, {
            horizontal: "flex-row items-stretch",
            vertical: "flex-col items-stretch",
          })
        )}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="flex">
          {bar.items
            .filter((e) => e.placement === "start")
            .map((item) => {
              return (
                <RenderBar
                  key={item.id}
                  item={item}
                  dir={dir}
                  bar={bar}
                  containerEl={containerEl}
                />
              );
            })}
        </div>
        <div className="flex">
          {bar.items
            .filter((e) => e.placement === "center")
            .map((item) => {
              return (
                <RenderBar
                  key={item.id}
                  item={item}
                  dir={dir}
                  bar={bar}
                  containerEl={containerEl}
                />
              );
            })}
        </div>
        <div className="flex flex-reverse">
          {bar.items
            .filter((e) => e.placement === "end")
            .map((item) => {
              return (
                <RenderBar
                  key={item.id}
                  item={item}
                  dir={dir}
                  bar={bar}
                  containerEl={containerEl}
                />
              );
            })}
        </div>
      </div>
      {containerEl.current && (
        <div
          className={css`
            flex-basis: ${containerEl.current.offsetHeight}px;
          `}
        ></div>
      )}
    </>
  );
};

const RenderBar: FC<{
  item: BarItem;
  dir: "horizontal" | "vertical";
  bar: typeof state_bar;
  containerEl: RefObject<HTMLDivElement>;
}> = ({ item, dir, bar, containerEl }) => {
  return (
    <div
      id={item.id}
      className={cx("flex")}
      ref={(el) => {
        if (el) {
          item.setBarEl(el);
        }
      }}
    ></div>
  );
};
