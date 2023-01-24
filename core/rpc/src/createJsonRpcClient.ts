import { createBasicJsonRpcClient } from "./createBasicJsonRpcClient";
import { Func, JsonRpcClient, RequestSender } from "./types";

export const createJsonRpcClient = <T extends { [P in keyof T]: Func }>(
  client: RequestSender
): JsonRpcClient<T> => {
  const basicClient = createBasicJsonRpcClient<T>(client);
  return new Proxy(basicClient, {
    get: (target, methodOrAttributeName) => {
      if (methodOrAttributeName === "then") return null;
      return (...rest: any) => {
        return target.send(methodOrAttributeName as keyof T, ...rest);
      };
    },
  }) as any;
};
