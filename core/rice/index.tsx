import { FC, Context } from "react";
import r from "react";

const react: typeof r = (window as any).react;

export const Img: FC<{
  src: string;
  ctx: AppContext;
  width?: number;
  height?: number;
}> = (prop) => {
  const ctx = react.useContext(prop.ctx);

  return <div>{ctx.name}</div>;
};

export type AppContext = Context<AppInfo & { pid: string }>;

export type AppInfo = {
  name: string;
  description: string;
  icon: FC<{ width: number; height: number; ctx: AppContext }>;
  app: FC<{ ctx: AppContext }>;
};

export const App = (app: AppInfo) => {
  return app;
};
