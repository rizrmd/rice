import { createContext } from "react";
import { AppContext, AppInfo } from "rice";
import launcher from "../../../../app/launcher";


export const state_app = {
  installed: [launcher] as AppInfo[],
  running: [
    { pid: "123", ctx: createContext({ ...launcher, pid: "123" }) },
  ] as {
    pid: string;
    ctx: AppContext;
  }[],
};
