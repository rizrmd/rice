import * as rice from "./index";

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

declare global {
  const app: typeof rice.app;
  const asset: typeof rice.asset;
  const bar: typeof rice.bar;
  const createApp: typeof rice.createApp;
  const cx: typeof rice.cx;
  const css: typeof rice.css;
  const state: typeof rice.state;
}
