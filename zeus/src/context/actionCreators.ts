import { AT } from "@/context/actionTypes";
import { TAction } from "@/context/types";
import { TAlert, TUser } from "@/library/types";

export const setUser = (user: TUser | null): TAction => {
  return {
    type: AT.SET_USER,
    payload: user,
  };
};

export const setAlert = (alert: TAlert | null): TAction => {
  return {
    type: AT.SET_ALERT,
    payload: alert,
  };
};
