import { client } from "backend";

declare module "*.svg" {
  const content: any;
  export default content;
}
