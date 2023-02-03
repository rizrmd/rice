import { createApp } from "rice";
export default createApp({
  name: "launcher",
  title: "Launcher",
  icon: "/src/logo.png",
  src: {
    basedir: "build",
    index: "index.js",
  },
});
