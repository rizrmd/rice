import { client } from "backend";

declare module "*.svg" {
  const content: any;
  export default content;
}

declare global {
  const rpc: ReturnType<typeof client>;
}
