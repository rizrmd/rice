import { createContext } from "react";
import { createRoot } from "react-dom/client";
import { Main } from "./element/main";
import { initRPC } from "./libs/rpc-boot-app";
import { useLocal } from "./libs/use-local";
import { waitUntil } from "./libs/wait-until";

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

  waitUntil(() => typeof server_theme !== "undefined").then(() => {
    initRPC();
    root.render(<App />);
  });
}
