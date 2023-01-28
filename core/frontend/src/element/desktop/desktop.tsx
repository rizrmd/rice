import { css } from "goober";
import { FC } from "react";
import { cx } from "../../libs/cx";
import { useGlobal } from "../../libs/use-global";
import { state_app } from "../../state/app";
import { FrameItem, state_frame } from "../../state/frame";

export const Desktop = () => {
  const frame = useGlobal(state_frame);
  frame._ref = frame;

  return (
    <div
      className={cx("flex-1 flex p-10")}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {frame.items.map((item) => {
        return <FrameItem key={item.id} item={item} frame={frame} />;
      })}
    </div>
  );
};

const FrameItem: FC<{ item: FrameItem; frame: typeof state_frame }> = ({
  item,
  frame,
}) => {
  return (
    <iframe
      src={`/app/${item.appName}?frame`}
      onLoad={(e) => {
        const data = { ...item };
        delete data.iframe;

        item.iframe = e.currentTarget;
        e.currentTarget.contentWindow.postMessage({
          type: "APP_DATA",
          result: { type: "frame", ...data },
        });
      }}
      className={cx(
        css`
          width: ${item.width};
          height: ${item.height};
        `,
        css`
          ${frame.css}
        `
      )}
    />
  );
};
