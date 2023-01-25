import { app } from "rice";
export default app({
  name: "launcher",
  title: "Launcher",
  icon: "/src/logo192.png",
  src: {
    type: "url",
    url: "http://localhost:1234",
    // type: "file",
    // basedir: "dist",
    // index: "index.html",
  },
});
