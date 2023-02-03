import { client } from "backend";
import { defaultTheme } from "backend/src/libs/default-theme";

declare module "*.svg" {
  const content: any;
  export default content;
}

declare global {
  const backend_theme = defaultTheme;
  const app_data_resolve = (result: any) => {};
}
