import { file, Server } from "bun";
import { existsSync, readFileSync, statSync, writeFileSync } from "fs";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { action } from "../action";
import { backend_state } from "../init-state";
import { defaultTheme } from "../libs/default-theme";
import { injectIndex } from "./inject";
import { proxy } from "./proxy";

const root = join(import.meta.dir, "..", "..", "..", "..");
const exists = new Set<string>();
const skipCheckContent = new Set<string>();
const index = {
  html: "",
};

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

  const url = new URL(req.url);
  const path = url.pathname;

  if (!index.html) {
    initIndexHtml();
  }

  if (path.startsWith("/app/")) {
    const q = url.search;
    const [_, appName, part, ...pathname] = path.split("/").filter((e) => e);

    const app = backend_state.app[appName];
    if (app) {
      if (part === "icon") {
        const iconPath = join(root, "app", appName, app.info.icon);
        if (existsSync(iconPath)) return new Response(file(iconPath));
      } else {
        const src = app.info.src;

        let mode: Parameters<typeof injectIndex>[1] = "init";
        if (q === "?bar") mode = "bar";
        if (q === "?frame") mode = "frame";

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

        await injectIndex(appName, mode);

        return new Response(app.html, {
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
    const fpath = resolve(join(root, "user", path.substring("/user/".length)));

    if (!existsSync(fpath)) {
      return new Response("File Not Found", {
        status: 404,
      });
    }

    return new Response(file(fpath), {
      headers: { "content-disposition": "inline" },
    });
  }

  const fedir = join(root, "core", "frontend", "build");
  if (url.pathname === "/") {
    return new Response(index.html, {
      headers: {
        "content-type": "text/html",
      },
    });
  }

  const targetPath = join(fedir, url.pathname);

  if (exists.has(url.pathname)) {
    const replaced = await replaceContent(targetPath);
    if (replaced) return replaced;

    return new Response(file(targetPath));
  } else {
    if (existsSync(targetPath)) {
      exists.add(url.pathname);
      const replaced = await replaceContent(targetPath);
      if (replaced) return replaced;

      return new Response(file(targetPath));
    }

    return new Response(index.html, {
      headers: {
        "content-type": "text/html",
      },
    });
  }
};

const replaceContent = async (targetPath: string) => {
  if (!skipCheckContent.has(targetPath)) {
    const res = await readFile(targetPath, "utf-8");
    if (
      backend_state.dev.url &&
      res.includes(
        `new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "")`
      )
    ) {
      const url = new URL(backend_state.dev.url);
      const replaced = res.replace(
        `new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "")`,
        `new WebSocket(protocol + "://" + hostname + ":${url.port}"`
      );
      return new Response(replaced);
    }
    skipCheckContent.add(targetPath);
  }
};

const initIndexHtml = () => {
  const fedir = join(root, "core", "frontend", "build");
  index.html = readFileSync(join(fedir, "index.html"), "utf-8");

  const themePath = join(root, "user", "theme.json");
  if (!existsSync(themePath)) {
    writeFileSync(themePath, JSON.stringify(defaultTheme, null, 2));
  }

  const html = [
    index.html.split("<!-- app-style:start -->")[0],
    backend_state.rice.style,
    index.html.split("<!-- app-style:end -->")[1],
  ];

  const theme = action.theme();

  index.html = html
    .join("\n")
    .replace(
      `<!-- base-style -->`,
      `\
<style>
html,
body{
  background-color: ${theme.bg.color};
}
</style>`
    )
    .replace(
      "</body>",
      `\
  <script>window.backend_theme = ${JSON.stringify(action.theme())}</script>
</body>`
    );
};
