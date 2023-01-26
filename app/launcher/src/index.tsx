import { css } from "goober";
import { createRoot } from "react-dom/client";
import { bar, rice } from "rice";

const container = document.getElementById("app");
const root = createRoot(container);

(async () => {
  switch (rice.mode) {
    case "init":
      {
        bar.create({ position: "start", size: "32px" });
      }
      break;
    case "bar": {
      root.render(
        <div
          className={css`
            color: white;
            font-size: 9px;
          `}
        >
          New Rice Bar
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
