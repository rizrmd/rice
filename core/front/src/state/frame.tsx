import { declareGlobal } from "../libs/use-global";

export const state_frame = declareGlobal({
  css: () => {
    return css`
      position: absolute;

      .frame-control {
        position: absolute;
        z-index: 1;

        display: flex;
        flex-direction: column;
        align-items: stretch;

        .frame-close {
          width: 22px;
          height: 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-right: 0px;
          position: relative;
          z-index: 1;

          svg {
            width: 14px;
            height: 15px;
          }

          &::before {
            background-color: ${server_theme.bg.color};
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
          }

          &:active {
            &::before {
              background-color: rgba(255, 255, 255, 0.1);
            }
          }
        }

        .frame-title {
          position: relative;

          .frame-title-text {
            position: absolute;
            writing-mode: vertical-lr;
            width: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 7px 0px;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);

            left: 50%;
            top: 0;
            transform: translateX(-50%) scale(var(--s, 1));
          }
        }
      }

      .frame-body {
        position: relative;
        margin-left: 22px;
        z-index: 1;
        border: 1px solid rgba(255, 255, 255, 0.1);

        &::before {
          background-color: ${server_theme.bg.color};
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.9;
          z-index: -1;
        }
      }

      .frame-resizer {
        border-color: rgba(255, 255, 255, 0.2);
        &.resizing,
        &:hover {
          border-bottom-width: 2px;
          border-right-width: 2px;
          border-color: rgba(255, 255, 255, 0.5);
        }
      }
    `;
  },
  focus: null as FrameItem,
  hover: null as FrameItem,
  items: [] as FrameItem[],
});

export type FrameID = string;

export type FrameItem = {
  id: FrameID;
  appName: string;
  frameName: string;
  title?: string;
  setFrameEl: (el: HTMLDivElement) => void;
};
