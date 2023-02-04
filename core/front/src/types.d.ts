import { client } from "server";
import { defaultTheme } from "server/src/libs/default-theme";

declare module "*.svg" {
  const content: any;
  export default content;
}

declare global {
  const server_theme = defaultTheme;
  const app_data_resolve = (result: any) => {};
}
