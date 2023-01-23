import { createContext } from "react";
import { createRoot } from "react-dom/client";
import { Main } from "../element/main";
import { useLocal } from "../libs/use-local";

import { } from "backend";

import "./index.compiled.css";

//@ts-ignore
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);

  const GlobalContext = createContext({
    global: new WeakMap(),
    render: () => {},
  });

  const App = () => {
    const local = useLocal({
      global: new WeakMap(),
    });
    return (
      <GlobalContext.Provider
        value={{
          global: local.global,
          render: () => {
            local.render();
          },
        }}
      >
        <Main />
      </GlobalContext.Provider>
    );
  };

  root.render(<App />);
}
