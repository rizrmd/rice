import { createRoot } from "react-dom/client";
import { css } from "goober";
import { rice, state } from "rice";

const container = document.getElementById("app");
const root = createRoot(container);

switch (rice.mode) {
  case "init":
    {  
      console.log('mantap jiwa lah')
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
