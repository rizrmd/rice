import { css } from "goober";
import { createRoot } from "react-dom/client";
import { bar, cx, app } from "rice";

const container = document.getElementById("app");
const root = createRoot(container);

(async () => {
  switch (app.mode) {
    case "init":
      {
        const mybar = await bar.create({ position: "start", size: "100px" });
      }
      break;
    case "bar": {
      const bar = await app.data;
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
          <div>New Rice Bar</div>
        </div>
      );
      break;
    }
    case "frame":
      {
        root.render(
          <div
            className={css`
              color: white;
              font-size: 9px;
            `}
          >
            New Rice App
          </div>
        );
      }
      break;
  }
})();
