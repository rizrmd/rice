import {
  Handlers,
  JsonRpcRequest,
  JsonRpcResponse,
  RequestHandler,
} from "./types";

export const createRequestHandler = <T extends { [key: string]: any }>(
  handlers: Handlers<T>,
  invokeAction?: any
): RequestHandler => {
  return {
    bindThis: (arg: Record<string, any>) => {
      for (const [k, v] of Object.entries(arg)) {
        (handlers as any)[k] = v;
      }
    },
    handleRequest: async (request: JsonRpcRequest) => {
      try {
        if (request.method === "action") {
          const params: Parameters<typeof invokeAction> = request.params;
          const result = await invokeAction(...params);
          return {
            // jsonrpc: "2.0",
            id: request.id,
            result,
          };
        }

        const result = (await handlers[request.method](
          ...request.params
        )) as Promise<any>;
        const response: JsonRpcResponse = {
          // jsonrpc: "2.0",
          id: request.id,
          result,
        };
        return response;
      } catch (error) {
        let response: JsonRpcResponse;
        if (error instanceof Error) {
          response = {
            // jsonrpc: "2.0",
            id: request.id,
            error: {
              message: error.message,
              cause: error.cause,
              name: error.name,
              stack: error.stack,
            },
          };
        } else {
          response = {
            // jsonrpc: "2.0",
            id: request.id,
            error,
          };
        }
        return response;
      }
    },
  };
};
