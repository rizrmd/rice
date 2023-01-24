import { createContext } from "react";
import { createRoot } from "react-dom/client";
import { Main } from "../element/main";
import { useLocal } from "../libs/use-local";
import react from "react";

import "./index.compiled.css";
import { initRPC } from "../libs/rpc";

//@ts-ignore
const container = document.getElementById("root");

(window as any).react = react;

initRPC();

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
