import type { client, ClientQueue, schema } from "server";
import { spawn, spawnSync } from "bun";
import { existsSync, readdirSync, rmSync, statSync } from "fs";
import { join } from "path";

const root = join(import.meta.dir, "..", "..");
const core = async () => {
  const [_runtime, _scriptName, cmd, devPath] = process.argv;
  const dec = new TextDecoder();
  const dirs = {
    start: "index.ts",
    front: "src/main/index.tsx",
    server: "src/index.ts",
    rpc: "src/index.ts",
    rice: "src/index.tsx",
  };

  if (cmd === "r") {
    for (const [dir, _main] of Object.entries(dirs)) {
      try {
        rmSync(join(root, "core", dir, "node_modules"), {
          recursive: true,
          force: true,
        });
      } catch (e) {}
    }
    process.exit();
  }

  if (cmd === "i" || !existsSync(join(root, "core", "start", "node_modules"))) {
    process.stdout.write("\nInstalling Rice deps: ");
    for (const [dir, _] of Object.entries(dirs)) {
      process.stdout.write(dir + " ");
      spawnSync({
        cmd: ["bun", "i"],
        cwd: join(root, "core", dir),
        stdin: "inherit",
        stdout: "inherit",
        stderr: "inherit",
      });
    }
    console.log(`
Done

== Please run ./rice again ==
`);
    process.exit();
  }

  let parcelURL = "";

  const { client, schema } = await import("server");
  const { startAppDev } = await import("server/src/app-dev");
  if (cmd === "dev") {
    console.log("[Development Mode]");
    const parcel = spawn({
      cmd: ["bun", "run", "dev"],
      cwd: join(root, "core", "front"),
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

    console.log("");

    const server = spawn({
      cmd: ["bun", "--hot", "./src/index.ts"],
      cwd: join(root, "core", "server"),
      stdin: "ignore",
      stdout: "inherit",
      stderr: "inherit",
    });

    const rpc = await initBackend(parcelURL, client, schema);

    if (devPath) {
      await startAppDev(devPath, (app, text) => {
        if (text.includes("Built in")) {
          rpc.hmrApp(app.name);
        }
        process.stdout.write(`[${app.name}] ${text}`);
      });
    }

    await Promise.all([server.exited]);
  } else {
    setTimeout(async () => {
      initBackend(parcelURL, client, schema);
    }, 1000);

    await import("../server/src/index");
  }
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
  return new Promise<ReturnType<typeof client>>((resolve) => {
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
            resolve(c);
          };
          ws.onmessage = async ({ data }) => {
            if (data instanceof ArrayBuffer) {
              const msg = _schema.res.unpack(new Uint8Array(data));
              if (typeof msg === "object") {
                if (msg.result) queue[msg.id].resolve(msg.result);
                else if (msg.error) queue[msg.id].reject(msg.reject);
                delete queue[msg.id];
              }
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

core();
