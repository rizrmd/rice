import { file, Server } from "bun";
import { existsSync } from "fs";
import { join, resolve } from "path";
import { state } from "../state";
import { frontEndProxy } from "./fe-proxy";

export const http = async (req: Request, server: Server) => {
  if (server.upgrade(req)) {
    return;
  }
  if (state.frontend.url) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path.startsWith("/user/")) {
      const fpath = resolve(
        join(
          import.meta.dir,
          "..",
          "..",
          "..",
          "..",
          "user",
          path.substring("/user/".length)
        )
      );

      if (!state.pathCache[fpath]) {
        if (existsSync(fpath)) {
          state.pathCache[fpath] = true;
        } else {
          return new Response("File Not Found", {
            status: 404,
          });
        }
      }

      return new Response(file(fpath), {
        headers: { "content-disposition": "inline" },
      });
    }

    return frontEndProxy(url);
  }
  return new Response("wkewkew");
};
