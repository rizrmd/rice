import { FC, useContext } from "react";
import { AppContext } from "rice";
import { cx } from "src/libs/cx";
import { useGlobal } from "../../libs/use-global";
import { state_app } from "../../state/app";

export const Desktop = () => {
  const app = useGlobal(state_app);
  return (
    <div
      className={cx("flex-1")}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {app.running.map((item) => {
        return <AppInstance key={item.pid} ctx={item.ctx} />;
      })}
    </div>
  );
};

const AppInstance: FC<{ ctx: AppContext }> = (prop) => {
  const ctx = useContext(prop.ctx);

  const Icon = ctx.icon;
  const App = ctx.app;

  return (
    <div className="text-white">
      <Icon width={20} height={20} ctx={prop.ctx} />
    </div>
  );
};
