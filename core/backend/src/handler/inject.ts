import { build } from "esbuild";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "path";
import { backend_state } from "../init-state";
import { app } from "rice";
const root = join(import.meta.dir, "..", "..", "..", "..");

const dec = new TextDecoder();
export const injectIndex = async (appName: string) => {
  const app = backend_state.app[appName].info;
  const base = join(root, "app", appName);
  const path = join(base, app.src.basedir, app.src.index);
  if (existsSync(path)) {
    let src = await readFile(path, "utf-8");
    //       html = html.replace("</head>", backend_state.rice.style + "</head>");
    //       html = html.replace(
    //         "</body>",
    //         `\
    // <script>
    // $APP_MODE="${mode}";
    // $APP_NAME="${appName}";
    // $APP_DATA=new Promise(function (resolve) {
    //   window.app_data_resolve = resolve;
    // });
    // </script></body>`
    //       );

    backend_state.app[appName].index = src;
  }
};
