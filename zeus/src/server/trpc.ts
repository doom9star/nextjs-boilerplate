import { COOKIE } from "@/library/constants";
import { TCtx } from "@/server/context";
import { TRPCError, initTRPC } from "@trpc/server";
import { getCookie } from "cookies-next";
import jwt from "jsonwebtoken";

const trpc = initTRPC.context<TCtx>().create();

export const router = trpc.router;
export const middleware = trpc.middleware;

export const isAuth = middleware((opts) => {
  const { ctx } = opts;

  const token = getCookie(COOKIE, {
    req: ctx.req,
    res: ctx.res,
  });
  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "user is unauthorized!",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    return opts.next({
      ctx: {
        uid: parseInt(payload.id),
      },
    });
  } catch (e) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "user is unauthorized!",
    });
  }
});

export const isNotAuth = middleware((opts) => {
  const { ctx } = opts;
  const token = getCookie(COOKIE, {
    req: ctx.req,
    res: ctx.res,
  });
  if (token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "user is authenticated!",
    });
  }
  return opts.next();
});

export const procedure = trpc.procedure;
export const publicProcedure = trpc.procedure.use(isNotAuth);
export const privateProcedure = trpc.procedure.use(isAuth);
