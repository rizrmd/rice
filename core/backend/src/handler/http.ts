import { file, Server } from "bun";
import { existsSync } from "fs";
import { join, resolve } from "path";
import { state } from "../state";
import { frontEndProxy } from "./proxy";
const root = join(import.meta.dir, "..", "..", "..", "..");

export const http = async (req: Request, server: Server) => {
  if (server.upgrade(req)) {
    return;
  }
  if (state.frontend.url) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path.startsWith("/app/")) {
      const [_, appName, part, ...pathname] = path.split("/").filter((e) => e);

      const app = state.app[appName];
      if (app) {
        if (part === "icon") {
          const iconPath = join(root, "app", appName, app.info.icon);
          if (existsSync(iconPath)) return new Response(file(iconPath));
        } else if (part === "bar") {
          if (app.bar) {
            return new Response(app.bar, {
              headers: { "content-type": "text/html" },
            });
          }

          return new Response(`Bar "${appName}" Not Found`, {
            status: 404,
          });
        }
      }
      return new Response(`App "${appName}" Not Found`, {
        status: 404,
      });
    }

    if (path.startsWith("/user/")) {
      const fpath = resolve(
        join(root, "user", path.substring("/user/".length))
      );

      if (!existsSync(fpath)) {
        return new Response("File Not Found", {
          status: 404,
        });
      }

      return new Response(file(fpath), {
        headers: { "content-disposition": "inline" },
      });
    }

    return frontEndProxy(url);
  }
  return new Response("You shouldn't be here", {
    status: 403,
  });
};
