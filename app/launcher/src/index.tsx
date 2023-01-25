import { createRoot } from "react-dom/client";
import { css } from "goober";
import "rice";

const container = document.getElementById("app");
const root = createRoot(container);

switch (rice.mode) {
  case "init":
    {
    }
    break;
  case "bar": {
    break;
  }
  case "app":
    {
      root.render(
        <div
          className={css`
            color: white;
            font-size: 9px;
          `}
        >
          Halo sodara
        </div>
      );
    }
    break;
}
