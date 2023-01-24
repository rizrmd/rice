import type { ClientQueue } from "backend";
import { spawn, spawnSync } from "bun";
import { existsSync, rmSync } from "fs";
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
  console.log("Installing dependencies:\n");
  for (const [dir, main] of Object.entries(dirs)) {
    spawnSync({
      cmd: ["bun", "i"],
      cwd: join(import.meta.dir, dir),
      stdin: "inherit",
      stdout: "ignore",
      stderr: "ignore",
    });

    // spawnSync({
    //   cmd: ["bun", "bun", join(import.meta.dir, dir, main)],
    //   cwd: join(import.meta.dir, dir),
    //   stdin: "inherit",
    //   stdout: "inherit",
    //   stderr: "inherit",
    // });
  }
  console.log(`\n
Done

== Please run ./rice again ==
`);
  process.exit();
}

const { client, schema } = await import("./backend/src/export");

const cmd = ["bun", "dev", "-p", "12340"];
const frontend = spawn({
  cmd,
  cwd: join(import.meta.dir, "frontend"),
  stdin: null,
  stdout: "pipe",
  stderr: "pipe",
});

let frontEndURL = "";
if (frontend.stderr) {
  const reader = frontend.stderr.getReader();
  while (true) {
    const { done, value } = await reader.read();
    const text = dec.decode(value);
    // process.stdout.write(text);
    if (text.includes("Link: ")) {
      frontEndURL = text.split("Link: ")[1].split("\n").shift() || "";
      break;
    }
    if (done) {
      break;
    }
  }
}

const tailwind = spawn({
  cmd: [
    "node",
    join(import.meta.dir, "frontend", "node_modules", ".bin", "tailwindcss"),
    "-i",
    "./src/main/index.css",
    "-o",
    "./src/main/index.compiled.css",
    "-w",
  ],
  cwd: join(import.meta.dir, "frontend"),
  stdin: "inherit",
  stdout: "ignore",
  stderr: "ignore",
});

const backend = spawn({
  cmd: ["bun", "--hot", "./src/index.ts"],
  cwd: join(import.meta.dir, "backend"),
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
});

const init = () => {
  let retry = 0;
  return new Promise<void>((resolve) => {
    const connect = () => {
      setTimeout(() => {
        if (retry > 0) {
          console.log("Retrying connection: ", retry);
        }
        if (retry > 4) {
          resolve();
          return;
        }
        try {
          const ws = new WebSocket("ws://localhost:12345");
          const queue: ClientQueue = {};
          ws.onopen = async () => {
            const c = client(ws, queue);
            await c.initFE({ url: frontEndURL });

            resolve();
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
  });
};
await init();

await Promise.all([frontend.exited, tailwind.exited, backend.exited]);
