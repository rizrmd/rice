import type { ClientQueue, client, schema } from "backend";
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

  let parcelURL = "";
  const { client, schema } = await import("./backend/src/export");
  if (cmd === "dev") {
    if (appName) {
      const app = spawn({
        cmd: ["bun", "run", "dev"],
        cwd: join(import.meta.dir, "..", "app", appName),
        stdin: "ignore",
        stdout: "pipe",
        stderr: "pipe",
      });
      let printStdout = false;
      stream(app.stdout, (raw) => {
        const text = dec.decode(raw);
        if (text.includes("Built in ")) {
          printStdout = true;
        }
        if (
          printStdout &&
          !text.includes("Bundling") &&
          !text.includes("Packaging & Optimizing")
        )
          process.stdout.write(`[${appName}] ` + text);
      });
      stream(app.stderr, (raw) => {
        if (printStdout) {
          process.stdout.write(raw);
        }
      });
    }

    console.log("[Development Mode]");
    const parcel = spawn({
      cmd: ["bun", "run", "dev"],
      cwd: join(import.meta.dir, "frontend"),
      stdin: "ignore",
      stdout: "pipe",
      stderr: "pipe",
    });

    let shouldPrint = false;
    await new Promise<void>((resolve) => {
      stream(parcel.stdout, (raw) => {
        const text = dec.decode(raw);
        if (text.includes("running at ")) {
          parcelURL = text.split("running at ")[1].split("\n").shift() || "";
        }
        if (text.includes("Built in")) {
          shouldPrint = true;
          resolve();
        }

        if (
          shouldPrint &&
          !text.includes("Bundling") &&
          !text.includes("Packaging & Optimizing")
        )
          process.stdout.write(`[rice] ` + text);
      });
      stream(parcel.stderr, (raw) => {
        if (shouldPrint) process.stdout.write(raw);
      });
    });
  }
  console.log("");

  const backend = spawn({
    cmd: ["bun", "--hot", "./src/index.ts"],
    cwd: join(import.meta.dir, "backend"),
    stdin: "ignore",
    stdout: "inherit",
    stderr: "inherit",
  });
  initBackend(parcelURL, client, schema);

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

const initBackend = (
  parcelURL: string,
  _client: typeof client,
  _schema: typeof schema
) => {
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
          const c = _client(ws, queue);
          c.setDevUrl(parcelURL);
        };
        ws.onmessage = async ({ data }) => {
          if (data instanceof ArrayBuffer) {
            const msg = _schema.res.unpack(new Uint8Array(data));
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
