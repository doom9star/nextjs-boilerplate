import { AT } from "./actionTypes";
import { TAction, TState } from "./types";

export default function Reducer(state: TState, action: TAction): TState {
  switch (action.type) {
    case AT.SET_USER: {
      return { ...state, user: action.payload };
    }
    case AT.SET_ALERT: {
      return { ...state, alert: action.payload };
    }
    default:
      return state;
  }
}
