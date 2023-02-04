import type { client, ClientQueue, schema } from "server";
import { spawn, spawnSync } from "bun";
import { existsSync, readdirSync, rmSync, statSync } from "fs";
import { join } from "path";

const root = join(import.meta.dir, "..", "..", "..");
const core = async () => {
  const [_runtime, _scriptName, cmd, appName] = process.argv;
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
      // try {
      //   unlinkSync(join(import.meta.dir, dir, "node_modules.bun"));
      // } catch (e) {}
    }
    process.exit();
  }

  if (cmd === "i" || !existsSync(join(root, "core", "start", "node_modules"))) {
    const appDir = join(root, "app");
    process.stdout.write("Installing App  deps: ");

    for (const dir of readdirSync(appDir)) {
      if (statSync(join(appDir, dir)).isDirectory()) {
        process.stdout.write(dir + " ");
        spawnSync({
          cmd: ["bun", "i"],
          cwd: join(appDir, dir),
          stdin: "inherit",
          stdout: "ignore",
          stderr: "ignore",
        });
      }
    }

    process.stdout.write("\nInstalling Rice deps: ");
    for (const [dir, _] of Object.entries(dirs)) {
      process.stdout.write(dir + " ");
      spawnSync({
        cmd: ["bun", "i"],
        cwd: join(root, "core", dir),
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

  const { client, schema } = await import("server");
  if (cmd === "dev") {
    if (appName) {
      const app = spawn({
        cmd: ["bun", "run", "dev"],
        cwd: join(root, "app", appName),
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
  }

  const server = spawn({
    cmd: ["bun", "--hot", "./src/index.ts"],
    cwd: join(root, "core", "server"),
    stdin: "ignore",
    stdout: "inherit",
    stderr: "inherit",
  });
  initBackend(parcelURL, client, schema);

  await Promise.all([server.exited]);
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
