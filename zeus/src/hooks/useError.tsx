import { useCtx } from "@/context";
import { setAlert } from "@/context/actionCreators";
import { useCallback } from "react";

type TError = {
  status: number;
  message: string;
  description: string;
};

export function useError() {
  const { dispatch } = useCtx();

  const handler = useCallback((error?: TError) => {
    if (error) {
      console.log(error);
      dispatch(
        setAlert({
          type: "error",
          message: error.message,
          description: error.description,
        })
      );
    }
  }, []);

  return { handler };
}
