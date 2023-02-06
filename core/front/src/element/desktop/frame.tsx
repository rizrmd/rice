import {
  AnimatePresence,
  FlatTree,
  motion,
  useDragControls,
} from "framer-motion";
import { FC, RefObject, useRef } from "react";
import { cx } from "../../libs/cx";
import { useGlobal } from "../../libs/use-global";
import { useLocal } from "../../libs/use-local";
import { w } from "../../libs/w";
import { FrameItem, state_frame } from "../../state/frame";

export const Frame = () => {
  const frame = useGlobal(state_frame);
  const containerEl = useRef<HTMLDivElement>(null);
  frame._ref = frame;
  w.frame = frame;

  return (
    <div
      className={cx("flex-1")}
      ref={containerEl}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {frame.items.map((item) => {
        return (
          <FrameItem
            key={item.id}
            item={item}
            frame={frame}
            containerEl={containerEl}
          />
        );
      })}
    </div>
  );
};

const FrameItem: FC<{
  item: FrameItem;
  frame: typeof state_frame["_ref"];
  containerEl: RefObject<HTMLDivElement>;
}> = ({ item, containerEl, frame }) => {
  const local = useLocal({
    bodyEl: null as HTMLDivElement,
    resizing: false,
  });
  const controls = useDragControls();
  const resize = useDragControls();

  return (
    <motion.div
      drag
      dragConstraints={containerEl}
      dragMomentum={false}
      dragControls={controls}
      dragElastic={false}
      dragListener={false}
      initial={{ x: item.frameName === "frame" ? 700 : 50, y: 50 }}
      className={cx(frame.css(), frame.focus === item ? "z-10" : "z-9")}
    >
      <AnimatePresence>
        {(frame.focus === item || frame.hover === item || local.resizing) && (
          <motion.div
            className="frame-control"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0, duration: 0.1 }}
            onPointerOver={() => {
              frame.hover = item;
              frame.render();
            }}
            onPointerOut={() => {
              frame.hover = null;
              frame.render();
            }}
          >
            <div
              className="frame-close"
              onClick={() => {
                frame.items = frame.items.filter((e) => e !== item);
                frame.render();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <div
              className="frame-title"
              onPointerDown={(e) => {
                e.stopPropagation();
                controls.start(e);
                frame.focus = item;
                frame.render();
              }}
            >
              <div className="frame-title-text whitespace-nowrap">
                {item.title === undefined ? (
                  <span className="capitalize">{item.appName}</span>
                ) : (
                  item.title
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        id={item.id}
        className="frame-body flex min-w-[200px] min-h-[100px]"
        onPointerOver={() => {
          frame.hover = item;
          frame.render();
        }}
        onPointerOut={() => {
          frame.hover = null;
          frame.render();
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          controls.start(e);
          frame.focus = item;
          frame.render();
        }}
        ref={(el) => {
          if (el) {
            local.bodyEl = el;
            local.render();

            item.setFrameEl(el);
          }
        }}
      ></div>
      <div
        className={cx(
          "absolute right-0 bottom-0 w-[15px] h-[15px] z-10 border-r border-b cursor-nwse-resize frame-resizer",
          local.resizing && "resizing"
        )}
        onPointerDown={(e) => {
          e.stopPropagation();
          local.resizing = true;
          local.render();
          setTimeout(() => {
            resize.start(e);
          });
        }}
        onPointerUp={() => {
          local.resizing = false;
          local.render();
        }}
      ></div>
      {local.resizing && (
        <>
          <div className="cursor-nwse-resize absolute inset-0 bg-white bg-opacity-20"></div>
          <motion.div
            drag
            dragControls={resize}
            dragElastic={false}
            dragMomentum={false}
            onDragStart={() => {
              document.body.style.cursor = "nwse-resize";
            }}
            onDragEnd={() => {
              document.body.style.cursor = "";
              local.resizing = false;
              local.render();
            }}
            onDrag={(e, info) => {
              const el = local.bodyEl;
              el.style.width = el.offsetWidth + info.delta.x + "px";
              el.style.height = el.offsetHeight + info.delta.y + "px";
            }}
          ></motion.div>
        </>
      )}
    </motion.div>
  );
};
