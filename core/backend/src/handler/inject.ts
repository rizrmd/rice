import { build } from "esbuild";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { join } from "path";
import { state } from "../state";
import { rice } from "rice";
const root = join(import.meta.dir, "..", "..", "..", "..");

const dec = new TextDecoder();
export const injectIndex = async (
  appName: string,
  mode: typeof rice["mode"]
) => {
  const app = state.app[appName].info;
  if (app.src.type === "file") {
    const base = join(root, "app", appName);
    const path = join(base, app.src.basedir, app.src.index);
    if (existsSync(path)) {
      let html = await readFile(path, "utf-8");

      //       const injectPath = join(root, "core", "rice", "inject.ts");
      //       const { outputFiles } = await build({
      //         entryPoints: [injectPath],
      //         platform: "browser",
      //         target: "es6",
      //         format: "iife",
      //         bundle: true,
      //         minify: true,
      //         write: false,
      //         define: {
      //           $CURRENT_MODE: `"${mode}"`,
      //         },
      //       });
      //       html = html.replace(
      //         "</body>",
      //         `\
      //   <script>${dec.decode(outputFiles[0].contents).trim()}</script>
      // </body>`
      //       );

      html = html.replace(
        "</body>",
        `<script>$CURRENT_MODE="${mode}"</script></body>`
      );

      state.app[appName].html = html;
    }
  }
};
