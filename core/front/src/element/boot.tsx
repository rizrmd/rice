import { motion } from "framer-motion";
import { css } from "goober";
import { cx } from "../libs/cx";
import { useGlobal } from "../libs/use-global";
import { useLocal } from "../libs/use-local";
import { waitUntil } from "../libs/wait-until";
import { state_app } from "../state/app";
import { state_bar } from "../state/bar";

export const Boot = () => {
  const local = useLocal({ show: false }, () => {
    setTimeout(() => {
      local.show = true;
      local.render();
    }, 1000);
  });
  const app = useGlobal(state_app, async () => {
    app.asset.bg = new Image();
    let ival = setInterval(() => {
      if (app.boot.loadingPercent < 95) {
        app.boot.loadingPercent += 7;
        app.render();
      } else {
        clearInterval(ival);
      }
    }, 1000);
    app.asset.bg.onload = function () {
      clearInterval(ival);
      app.boot.loadingPercent = 100;
      app.render();
    };
    app.asset.bg.src = server_theme.bg.img;
  });

  if (app.boot.status === "loading" && app.boot.loadingPercent === 100) {
    waitUntil(() => state_bar._ref).then(() => {
      for (const running of app.running) {
        waitUntil(() => typeof running.start === "function").then(() => {
          running.start();
        });
      }
      app.boot.status = "ready";
      setTimeout(app.render, 500);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cx(
        "flex fixed inset-0 select-none justify-center items-center",
        css`
          z-index: 99;
          background-color: ${server_theme.bg.color};
        `
      )}
    >
      <div
        className={cx(
          "w-[150px] bg-gray-200 h-1 transition-all",
          local.show ? "opacity-1" : "opacity-0"
        )}
      >
        <div
          className={cx(
            "h-1 transition-all opacity-80",
            css`
              background-color: ${server_theme.bg.color};
              width: ${app.boot.loadingPercent}%;
            `
          )}
        ></div>
      </div>
    </motion.div>
  );
};
