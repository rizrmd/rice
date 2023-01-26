import { build } from "esbuild";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "path";
import { backend_state } from "../state";
import { rice } from "rice";
const root = join(import.meta.dir, "..", "..", "..", "..");

const dec = new TextDecoder();
export const injectIndex = async (
  appName: string,
  mode: typeof rice["mode"]
) => {
  const app = backend_state.app[appName].info;
  if (app.src.type === "file") {
    const base = join(root, "app", appName);
    const path = join(base, app.src.basedir, app.src.index);
    if (existsSync(path)) {
      let html = await readFile(path, "utf-8");

      html = html.replace("</head>", backend_state.rice.style + "</head>");

      html = html.replace(
        "</body>",
        `<script>$CURRENT_MODE="${mode}"; $APP_NAME="${appName}";</script></body>`
      );

      backend_state.app[appName].html = html;
    }
  }
};
