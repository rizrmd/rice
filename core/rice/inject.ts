const w: any = window;
export const _rice = {
  bar: {
    start: (arg: { size: string; position: "start" | "center" | "end" }) => {},
  },
  frame: {
    create: (arg: {
      width?: string;
      height?: string;
      attachedToBar?: boolean;
    }) => {
      return {
        window_id: "",
      };
    },
    close: (arg: { window_id: string }) => {},
  },
};

w.rice = _rice;
