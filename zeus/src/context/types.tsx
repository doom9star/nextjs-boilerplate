import { TAlert, TUser } from "@/library/types";
import { Dispatch } from "react";

export type TState = {
  user: TUser | null;
  alert: TAlert | null;
};

export type TAction = {
  type: string;
  payload: any;
};

export type TCtx = {
  state: TState;
  dispatch: Dispatch<TAction>;
};
