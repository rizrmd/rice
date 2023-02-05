import { css } from "goober";
import { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { app, bar, cx } from "rice";

app.register("launcher", async () => {
  await bar.create((el) => {
    renderRoot(
      el,
      <div
        className={css`
          height: 100%;  
        `}
      >
      </div>
    );
  });
  // await frame.create({ width: "640px", height: "480px", title: "Halo" });
});

const renderRoot = (el: HTMLDivElement, node: ReactNode) => {
  const reactEl = el as unknown as HTMLDivElement & {
    root: ReturnType<typeof createRoot>;
  };

  if (!reactEl.root) {
    const root = createRoot(el);
    reactEl.root = root;
  }

  reactEl.root.render(node);
};
