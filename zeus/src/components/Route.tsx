import { useCtx } from "@/context";
import { useRouter } from "next/router";
import { Fragment } from "react";

type RouteProps = { children: JSX.Element | JSX.Element[] };

export const PrivateRoute = ({ children }: RouteProps) => {
  const {
    state: { user },
  } = useCtx();
  const router = useRouter();

  if (!user) {
    router.replace("/");
    return null;
  }

  return <Fragment>{children}</Fragment>;
};

export const PublicRoute = ({ children }: RouteProps) => {
  const {
    state: { user },
  } = useCtx();
  const router = useRouter();

  if (user) {
    router.replace("/home");
    return null;
  }

  return <Fragment>{children}</Fragment>;
};
