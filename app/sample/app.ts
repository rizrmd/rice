import { app } from "rice";
export default app({
  name: "sample",
  title: "Sample",
  icon: "/src/logo192.png",
  src: {
    type: "file",
    basedir: "build",
    index: "index.html",
  },
});
