import { css } from "goober";
import { FC } from "react";
import { cx } from "../../libs/cx";
import { useGlobal } from "../../libs/use-global";
import { state_app } from "../../state/app";
import { FrameItem, state_desktop } from "../../state/desktop";

export const Desktop = () => {
  const desktop = useGlobal(state_desktop);
  const app = useGlobal(state_app);
  desktop._ref = desktop;

  if (
    app.boot.status === "loading" &&
    app.boot.loadingPercent === 100 &&
    app.boot.appLoaded
  ) {
    for (const running of app.running) {
      running.iframe.contentWindow.postMessage({
        type: "APP_DATA",
        result: undefined,
      });
    }
    app.boot.status = "ready";
    setTimeout(app.render, 500);
  }

  return (
    <div
      className={cx("flex-1 flex p-10")}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {desktop.frame.items.map((item) => {
        return <FrameItem key={item.id} item={item} frame={desktop} />;
      })}
    </div>
  );
};

const FrameItem: FC<{ item: FrameItem; frame: typeof state_desktop }> = ({
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
