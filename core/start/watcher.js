const watcher = require("@parcel/watcher");
const { existsSync } = require("fs");
const path = JSON.parse(process.argv[process.argv.length - 1]);

if (existsSync(path)) {
  watcher.subscribe(path, (err, events) => {
    console.log(JSON.stringify(events));
  });
}
