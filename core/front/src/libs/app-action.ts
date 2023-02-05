import { ClientQueue } from "server";
import cuid from "cuid";
import get from "lodash.get";
import {
  createJsonRpcClient,
  Handlers,
  JsonRpcRequest,
  JsonRpcResponse,
} from "rpc";
import { state_app } from "../state/app";
import { BarItem, state_bar } from "../state/bar";
import { state_desktop } from "../state/desktop";
import { w } from "./w";
import { app } from "../../../rice/src";

export const rpcAction = {
  // create_frame(arg: {
  //   appName: string;
  //   title: string;
  //   width: string;
  //   height: string;
  //   data?: any;
  // }) {
  //   const frameID = cuid();
  //   if (state_desktop._ref) {
  //     state_desktop._ref.frame.items.push({
  //       id: frameID,
  //       iframe: null,
  //       appName: arg.appName,
  //       width: arg.width,
  //       height: arg.height,
  //       data: arg.data,
  //       title: arg.title,
  //     });
  //     state_desktop._ref.render();
  //   } else {
  //     console.warn("Failed to create frame, state_desktop is not initialized.");
  //   }
  // },
  closeApp(arg: { appName: string }) {
    w.bar.items = w.bar.items.filter((e) => e.appName !== arg.appName);
    w.bar.render();
  },
  appendStyle(id: string, css: string) {
    const goob = document.getElementById(id);
    if (goob) {
      goob.appendChild(document.createTextNode(css));
    }
  },
  importCSS(appName: string, path: string) {
    let cssLink: HTMLLinkElement = document.getElementById(
      `${appName}-${path}`
    ) as any;
    if (cssLink === null) {
      cssLink = document.createElement("link");
      cssLink.id = `${appName}-${path}`;
      cssLink.rel = "stylesheet";
      document.getElementsByTagName("head")[0].appendChild(cssLink);
    }
    cssLink.href = `/app/${appName}/${path}?t=${Date.now()}`;
  },
  createBarElement(arg: { appName: string }) {
    return new Promise<string>((resolve) => {
      const barID = `bar-${arg.appName}-${cuid()}`;
      w.bar.items.push({
        id: barID,
        appName: arg.appName,
        setBarEl: () => {
          resolve(barID);
        },
      });
      w.bar.render();
    });
  },

  // read_state(arg: { path: string[] }) {
  //   const state = arg.path.shift();
  //   if (state === "bar") return get(state_bar, arg.path.join(".")) || state_bar;
  //   if (state === "app") return get(state_app, arg.path.join(".")) || state_app;
  //   if (state === "desktop")
  //     return get(state_desktop, arg.path.join(".")) || state_desktop;
  //   if (state === "theme")
  //     return get(server_theme, arg.path.join(".")) || server_theme;

  //   return undefined;
  // },
};

export const createClient = (appName: string) => {
  const queue: ClientQueue<{ appName: string }> = {};

  if (typeof window === "undefined") return;

  const eventMethod = window.addEventListener
    ? "addEventListener"
    : "attachEvent";
  const listenEvent = window[eventMethod];
  const onMessage = eventMethod === "attachEvent" ? "onmessage" : "message";

  listenEvent(onMessage, function (e: MessageEvent<any>) {
    const data = e.data;

    if (queue[data.id]) {
      if ("result" in data) {
        queue[data.id].resolve(data.result);
      } else {
        queue[data.id].reject(
          data.error
            ? data.error.message
            : `Error when calling rpc.${queue[data.id].method} from app ${
                queue[data.id].appName
              }. Rice cannot get detailed error. \n\n(${JSON.stringify(
                data.error,
                null,
                2
              )})`
        );
      }
      delete queue[data.id];
    }
  });

  setTimeout(() => {
    app.rpc.closeApp({ appName: app.name });
    app.start();
  });

  return createJsonRpcClient<Handlers<typeof rpcAction>>({
    sendRequest(req: JsonRpcRequest & { id: string }) {
      const id = cuid();
      return new Promise<JsonRpcResponse>(async (resolve, reject) => {
        queue[id] = { appName, method: req.method, resolve, reject };
        parent.postMessage({
          type: "app-register",
          method: req.method,
          params: req.params,
          id,
        });
      });
    },
  });
};
