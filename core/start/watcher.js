const watcher = require("@parcel/watcher");
watcher.subscribe(process.argv[process.argv.length - 1], (err, events) => {
  console.log(JSON.stringify(events));
});
