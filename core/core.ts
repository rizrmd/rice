import { client, ClientQueue, schema } from "backend";
import { spawn, spawnSync } from "bun";
import { join } from "path";

const dec = new TextDecoder();
const dirs = ["", "frontend", "backend", "rpc"];
for (const dir of dirs) {
  // if (!existsSync(join(import.meta.dir, dir, "node_modules"))) {
  spawnSync({
    cmd: ["bun", "i"],
    cwd: join(import.meta.dir, dir),
  });
  // }
}

const frontend = spawn({
  cmd: ["bun", "dev", "-p", "12340", "--public-dir", "./"],
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
  cmd: ["bun", "--hot", "index.ts"],
  cwd: join(import.meta.dir, "backend"),
  stdin: null,
  stdout: "inherit",
  stderr: "inherit",
});

const init = () => {
  const ws = new WebSocket("ws://localhost:12345");
  const queue: ClientQueue = {};
  ws.onopen = async () => {
    const c = client(ws, queue);
    c.initFE({ url: frontEndURL });
  };
  ws.onmessage = async ({ data }) => {
    if (data instanceof ArrayBuffer) {
      const msg = schema.res.unpack(new Uint8Array(data));
      if (msg.result) queue[msg.id].resolve(msg.result);
      else if (msg.error) queue[msg.id].reject(msg.reject);
      delete queue[msg.id];
    }
  };
  ws.onclose = init;
  ws.onerror = init;
};
init();

await Promise.all([frontend.exited, tailwind.exited, backend.exited]);
