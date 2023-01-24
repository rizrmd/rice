import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";

export const GlobalContext = createContext({
  global: new WeakMap(),
  render: new Set<(e: {}) => void>(),
});
export const useGlobal = <T extends object>(
  defaultValue: T,
  effect?: () => Promise<void | (() => void)> | void | (() => void)
): T & { render: () => void } => {
  const ctx = useContext(GlobalContext);
  const [_, _render] = useState({});
  const { global, render } = ctx;

  if (!global.has(defaultValue)) {
    global.set(defaultValue, { ...defaultValue });
  }

  useEffect(() => {
    let res: any = null;
    if (effect) {
      res = effect();
    }
    if (!render.has(_render)) {
      render.add(_render);
    }

    return () => {
      if (render.has(_render)) {
        render.delete(_render);
      }

      if (typeof res === "function") res();
      else if (res instanceof Promise) {
        res.then((e) => {
          if (typeof e === "function") e();
        });
      }
    };
  }, []);

  const res = global.get(defaultValue);
  res.render = () => {
    ctx.render.forEach((render) => {
      render({});
    });
  };
  return res;
};
