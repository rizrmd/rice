import { file, Server } from "bun";
import { existsSync, readFileSync, statSync, writeFileSync } from "fs";
import { readFile } from "fs/promises";
import { join, resolve } from "path";
import { action } from "../action";
import { server_state } from "../init-state";
import { defaultTheme } from "../libs/default-theme";

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

    const app = server_state.app[appName];
    if (app) {
      if (part === "icon") {
        const iconPath = join(root, "app", appName, app.icon);
        if (existsSync(iconPath)) return new Response(file(iconPath));
      } else if (part === "index") {
        return new Response(
          `\
<script src="/app/${appName}/js"></script>
<script>
(() => {
function getHostname() {
    return (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return location.port;
} 
var hostname = getHostname();
var port = getPort();
var protocol =  location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
var ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
ws.onmessage = async function(event) {
  location.reload()
} 
})()
</script>`,
          {
            headers: {
              "content-type": "text/html",
            },
          }
        );
      } else {
        try {
          const path = join(
            app.app.absdir || "",
            app.app.basedir,
            part || "",
            ...(pathname || [])
          );
          if (statSync(path).isFile()) {
            return new Response(file(path));
          }
        } catch (e) {}

        try {
          const path = join(
            app.app.absdir || "",
            "public",
            part || "",
            ...(pathname || [])
          );
          if (statSync(path).isFile()) {
            return new Response(file(path));
          }
        } catch (e) {}

        return new Response(
          file(join(app.app.absdir || "", app.app.basedir, app.app.index)),
          {
            headers: {
              "content-type": "text/javascript",
            },
          }
        );
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

  const fedir = join(root, "core", "front", "build");
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
      server_state.dev.url &&
      res.includes(
        `new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "")`
      )
    ) {
      const url = new URL(server_state.dev.url);
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
  const fedir = join(root, "core", "front", "build");
  index.html = readFileSync(join(fedir, "index.html"), "utf-8");

  const themePath = join(root, "user", "theme.json");
  if (!existsSync(themePath)) {
    writeFileSync(themePath, JSON.stringify(defaultTheme, null, 2));
  }

  const html = [
    index.html.split("<!-- app-style:start -->")[0],
    server_state.rice.style,
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
  <script>window.server_theme = ${JSON.stringify(action.theme())}</script>
</body>`
    );
};
