import { useGlobal } from "../../libs/use-global";
import { state_app } from "../../state/app";
import { state_desktop } from "../../state/desktop";

export const Desktop = () => {
  const desktop = useGlobal(state_desktop);
  const app = useGlobal(state_app);
  console.log("desktop");
  return (
    <div className="flex-1">
      <div key={1}>{JSON.stringify(app.running)}</div>
      <button
        key={2}
        onClick={() => {
          app.running = [{ icon: "hula", name: "hop" }];
          app.render();
        }}
      >
        haloha
      </button>
    </div>
  );
};
