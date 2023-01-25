type AppURL = string;

export type AppInfo = {
  name: string;
  title: string;
  icon: string;
  desc?: string;
  bar?: {
    src: string;
    size: string;
  };
  app?: {
    src: string;
  };
};

export const app = (arg: AppInfo) => {
  return arg;
};
