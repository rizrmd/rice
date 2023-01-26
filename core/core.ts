import type { ClientQueue } from "backend";
import { spawn, spawnSync } from "bun";
import { existsSync, readdirSync, rmSync, statSync } from "fs";
import { join } from "path";

let arg = process.argv.pop();

const dec = new TextDecoder();
const dirs = {
  "": "",
  frontend: "src/main/index.tsx",
  backend: "src/index.ts",
  rpc: "src/index.ts",
};

if (arg === "r") {
  for (const [dir, main] of Object.entries(dirs)) {
    try {
      rmSync(join(import.meta.dir, dir, "node_modules"), {
        recursive: true,
        force: true,
      });
    } catch (e) {}
    // try {
    //   unlinkSync(join(import.meta.dir, dir, "node_modules.bun"));
    // } catch (e) {}
  }
  process.exit();
}

if (arg === "i" || !existsSync(join(import.meta.dir, "node_modules"))) {
  console.log("Installing dependencies...");

  const appDir = join(import.meta.dir, "..", "app");
  for (const dir of readdirSync(appDir)) {
    if (statSync(join(appDir, dir)).isDirectory()) {
      spawnSync({
        cmd: ["bun", "i"],
        cwd: join(appDir, dir),
        stdin: "inherit",
        stdout: "ignore",
        stderr: "ignore",
      });
    }
  }

  for (const [dir, main] of Object.entries(dirs)) {
    spawnSync({
      cmd: ["bun", "i"],
      cwd: join(import.meta.dir, dir),
      stdin: "inherit",
      stdout: "ignore",
      stderr: "ignore",
    });
  }
  console.log(`
Done

== Please run ./rice again ==
`);
  process.exit();
}

const { client, schema } = await import("./backend/src/export");

if (arg === "dev") {
  console.log("[Development Mode]\n");
  const parcel = spawn({
    cmd: [
      "parcel", // bun ga bisa ngewatch fs >.<, jadi kalau di save ga ngebuild
      "public/index.html",
      "--dist-dir",
      "build",
    ],
    cwd: join(import.meta.dir, "frontend"),
    stdin: "ignore",
    stdout: "pipe",
    stderr: "pipe",
  });

  let parcelURL = "";
  if (parcel.stdout) {
    const reader = parcel.stdout.getReader();
    new Promise(async () => {
      while (true) {
        const { done, value } = await reader.read();
        const text = dec.decode(value);
        if (parcelURL) process.stdout.write(text);
        if (text.includes("running at ")) {
          parcelURL = text.split("running at ")[1].split("\n").shift() || "";
          let retry = 0;
          const connect = () => {
            setTimeout(() => {
              if (retry > 0) {
                console.log("Retrying connection: ", retry);
              }
              if (retry > 4) {
                return;
              }
              try {
                const ws = new WebSocket("ws://localhost:12345/rice:rpc");
                const queue: ClientQueue = {};
                ws.onopen = async () => {
                  const c = client(ws, queue);
                  c.setDevUrl(parcelURL);
                };
                ws.onmessage = async ({ data }) => {
                  if (data instanceof ArrayBuffer) {
                    const msg = schema.res.unpack(new Uint8Array(data));
                    if (msg.result) queue[msg.id].resolve(msg.result);
                    else if (msg.error) queue[msg.id].reject(msg.reject);
                    delete queue[msg.id];
                  }
                };
                ws.onclose = connect;
                ws.onerror = connect;
              } catch (e: any) {
                connect();
              }
              retry++;
            }, 300);
          };
          connect();
        }
        if (done) {
          break;
        }
      }
    });
  }
}

const backend = spawn({
  cmd: ["bun", "--hot", "./src/index.ts"],
  cwd: join(import.meta.dir, "backend"),
  stdin: "ignore",
  stdout: "inherit",
  stderr: "inherit",
});

await Promise.all([backend.exited]);
