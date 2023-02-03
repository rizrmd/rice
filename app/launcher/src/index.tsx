import { css } from "goober";
import { createRoot } from "react-dom/client";
import { bar, cx, app, frame, readState } from "rice";

const container = document.getElementById("app");
const root = createRoot(container);

(async () => {
  const info = await app.modeInfo;

  switch (app.mode) {
    case "init":
      {
        await bar.create({
          position: "start",
          size: "100px",
          data: { hello: "world" },
        });

        await frame.create({ width: "640px", height: "480px", title: "Halo" });
      }
      break;
    case "bar": {
      root.render(
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={cx(
            "flex items-center px-4 border-r border-r-[#ececeb22]",
            css`
              color: white;
              font-size: 9px;
            `
          )}
        >
          <div>New {info.data.hello}</div>
        </div>
      );
      break;
    }
    case "frame":
      {
        root.render(
          <div
            className={cx(
              "flex-1",
              css`
                background: #6e89ff2e;
                color: white;
                font-size: 9px;
              `
            )}
          >
            New Rice
          </div>
        );
      }
      break;
  }
})();
