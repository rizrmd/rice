import { declareGlobal } from "../libs/use-global";
import { bg } from "./unit/bg";

export const state_frame = declareGlobal({
  items: [] as FrameItem[],
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
