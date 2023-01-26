import { createApp } from "rice";
export default createApp({
  name: "launcher",
  title: "Launcher",
  icon: "/src/logo192.png",
  src: {
    type: "file",
    basedir: "build",
    index: "index.html",
  },
});
