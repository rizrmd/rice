import { client, ClientQueue, schema } from "backend";
import { spawn, spawnSync } from "bun";
import { existsSync, readdirSync, rmSync, statSync } from "fs";
import { join } from "path";

const core = async () => {
  const [runtime, _, cmd, appName] = process.argv;
  const dec = new TextDecoder();
  const dirs = {
    "": "",
    frontend: "src/main/index.tsx",
    backend: "src/index.ts",
    rpc: "src/index.ts",
  };

  if (cmd === "r") {
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

  if (cmd === "i" || !existsSync(join(import.meta.dir, "node_modules"))) {
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
  if (cmd === "dev") {
    if (appName) {
      // const app = spawn({
      //   cmd: ["bun", "run", "dev"],
      //   cwd: join(import.meta.dir, "..", "app", appName),
      //   stdin: "inherit",
      //   stdout: "inherit",
      //   stderr: "inherit",
      // });
      // if (app.stdout) {
      //   const reader = app.stdout.getReader();
      //   new Promise(async () => {
      //     while (true) {
      //       const { done, value } = await reader.read();
      //       const text = dec.decode(value);
      //       process.stdout.write(text);
      //       if (done) {
      //         break;
      //       }
      //     }
      //   });
      // }
    }

    console.log("[Development Mode]\n");
    const parcel = spawn({
      cmd: ["parcel", "public/index.html", "--dist-dir", "build"],
      cwd: join(import.meta.dir, "frontend"),
      stdin: "ignore",
      stdout: "pipe",
      stderr: "pipe",
    });

    let parcelURL = "";
    stream(parcel.stdout, (raw) => {
      if (parcelURL) process.stdout.write(raw);
      const text = dec.decode(raw);
      if (text.includes("running at ")) {
        parcelURL = text.split("running at ")[1].split("\n").shift() || "";
        initBackend(parcelURL);
      }
    });
    stream(parcel.stderr, (raw) => process.stdout.write(raw));
  }

  const backend = spawn({
    cmd: ["bun", "--hot", "./src/index.ts"],
    cwd: join(import.meta.dir, "backend"),
    stdin: "ignore",
    stdout: "inherit",
    stderr: "inherit",
  });

  await Promise.all([backend.exited]);
};

const stream = (
  std: ReadableStream<any> | undefined,
  callback: (text: ArrayBuffer) => void
) => {
  if (std) {
    const reader = std.getReader();
    new Promise<void>(async (resolve) => {
      while (true) {
        const { done, value } = await reader.read();
        callback(value);
        if (done) {
          resolve();
          break;
        }
      }
    });
  }
};

const initBackend = (parcelURL: string) => {
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
};

core();
