import { load } from "ffontsloader";
import { motion } from "framer-motion";
import { css } from "goober";
import { cx } from "../libs/cx";
import { useGlobal } from "../libs/use-global";
import { state_app } from "../state/app";

export const Boot = () => {
  const app = useGlobal(state_app, async () => {
    app.boot.loadingPercent = 100;
    app.render();
  });

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cx(
        "flex absolute inset-0 select-none justify-center items-center",
        css`
          background-color: ${backend_theme.bg.color};
        `
      )}
    >
      <div className="w-[150px] bg-gray-200 h-1">
        <div
          className={cx(
            "bg-[#265058] h-1 transition-all",
            css`
              width: ${app.boot.loadingPercent}%;
            `
          )}
        ></div>
      </div>
    </motion.div>
  );
};
