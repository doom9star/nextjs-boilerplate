import { appRouter } from "@/server/routers/_app";
import * as trpcNext from "@trpc/server/adapters/next";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: (opts) => ({
    req: opts.req,
    res: opts.res,
  }),
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
};
