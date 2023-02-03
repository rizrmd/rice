import { declareGlobal } from "../libs/use-global";

export const state_desktop = declareGlobal({
  frame: { items: [] as FrameItem[], css: "" },
  css: "",
});

export type FrameID = string;

export type FrameItem = {
  id: FrameID;
  appName: string;
  title: string;
  width: string;
  height: string;
  iframe: null | HTMLIFrameElement;
  data?: any;
};

export type AppFrameData = { type: "frame" } & Omit<FrameItem, "iframe">;
