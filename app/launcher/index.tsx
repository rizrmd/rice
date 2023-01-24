import { useState } from "react";
import { App, Img } from "rice";

export default App({
  name: "launcher",
  description: "Launch your App",
  icon: ({ ctx, width, height }) => {
    const [a, _a] = useState("aa");

    return <Img ctx={ctx} src="./icon.svg" width={width} height={height} />;
  },
  app: () => {
    return <div>Hello World</div>;
  },
});
