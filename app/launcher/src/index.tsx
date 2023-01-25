import { createRoot } from "react-dom/client";
import { css } from "goober";
const container = document.getElementById("app");
const root = createRoot(container);

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
