import { app } from "rice";
export default app({
  name: "launcher",
  title: "Launcher",
  icon: "/src/logo192.png",
  src: {
    type: "file",
    basedir: "build",
    index: "index.html",
  },
});
