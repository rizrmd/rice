import type { _rice } from "inject";

export type AppInfo = {
  name: string;
  title: string;
  icon: string;
  desc?: string;
  src:
    | {
        type: "url";
        url: string;
      }
    | {
        type: "file";
        basedir: string;
        index: string;
      };
};

export const app = (arg: AppInfo) => {
  return arg;
};

declare global {
  const rice: typeof _rice;
}
