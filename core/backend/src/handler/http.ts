import { file, Server } from "bun";
import { existsSync, statSync } from "fs";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { state } from "../state";
import { indexRewrite } from "./index-rewrite";
import { frontEndProxy, proxy } from "./proxy";
const root = join(import.meta.dir, "..", "..", "..", "..");

export const http = async (req: Request, server: Server) => {
  if (
    server.upgrade(req, {
      data: {
        url: req.url,
      },
    })
  ) {
    return;
  }
  if (state.frontend.url) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path.startsWith("/app/")) {
      const q = url.search;
      const [_, appName, part, ...pathname] = path.split("/").filter((e) => e);

      const app = state.app[appName];
      if (app) {
        if (part === "icon") {
          const iconPath = join(root, "app", appName, app.info.icon);
          if (existsSync(iconPath)) return new Response(file(iconPath));
        } else {
          const src = app.info.src;

          const mode = q === "?bar" ? "bar" : "app";

          if (src.type === "file") {
            const base = join(root, "app", appName);

            const path = join(base, src.basedir, part, ...pathname);
            try {
              if (statSync(path).isFile()) {
                return new Response(file(path));
              }
            } catch (e) {}
          } else if (src.type === "url") {
            return proxy([src.url, path].join("/"));
          }

          await indexRewrite(appName, mode);

          return new Response(app.html[mode], {
            headers: {
              "content-type": "text/html",
            },
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
