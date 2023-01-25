type AppURL = string;

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
