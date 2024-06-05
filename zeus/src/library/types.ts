import { AppRouter } from "@/server/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

type TRPCOutput = inferRouterOutputs<AppRouter>;

export type TAlert = {
  message: string;
  description: string;
  type: "success" | "error" | "info";
};

export type TUser = NonNullable<TRPCOutput["user"]["auth"]["data"]>;
