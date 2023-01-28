import { createApp } from "rice";
export default createApp({
  name: "launcher",
  title: "Launcher",
  icon: "/src/logo.png",
  src: {
    type: "file",
    basedir: "build",
    index: "index.html",
  },
});
