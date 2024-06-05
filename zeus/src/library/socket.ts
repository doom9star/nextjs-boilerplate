import IO from "socket.io-client";

export default IO(process.env.NEXT_PUBLIC_APOLLO as string, {
  withCredentials: true,
  reconnection: false,
  autoConnect: false,
});
