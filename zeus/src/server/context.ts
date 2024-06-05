import * as trpcNext from "@trpc/server/adapters/next";

export function createContext({ res, req }: trpcNext.CreateNextContextOptions) {
  return {
    res,
    req,
  };
}

export type TCtx = ReturnType<typeof createContext> & { uid?: number };
