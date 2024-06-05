import { useCtx } from "@/context";
import socket from "@/library/socket";
import { useEffect } from "react";

export function useSocket() {
  const {
    state: { user },
  } = useCtx();

  useEffect(() => {
    if (user) {
      if (!socket.connected) {
        socket.connect();
      }
    } else if (socket.connected) {
      socket.disconnect();
    }
  }, [user]);
}
