export type AppInfo = {
  name: string;
  title: string;
  icon: string;
  desc?: string;
  app: {
    basedir: string;
    index: string;
    absdir?: string;
  };
};
