import { authRouter } from "@/server/routers/auth";
import { userRouter } from "@/server/routers/user";
import { procedure, router } from "@/server/trpc";

export const appRouter = router({
  test: procedure.query(() => {
    return {
      status: 200,
      message: "It works fine!",
    };
  }),
  auth: authRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
