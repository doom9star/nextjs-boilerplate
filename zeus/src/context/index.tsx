import Reducer from "@/context/reducer";
import { TCtx, TState } from "@/context/types";
import { createContext, useContext, useReducer } from "react";

const Ctx = createContext({} as TCtx);

export const useCtx = () => useContext(Ctx);

const initial: TState = {
  user: null,
  alert: null,
};

export default function CtxProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const [state, dispatch] = useReducer(Reducer, initial);
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}
