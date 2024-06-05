import { AuthIORequest, AuthPayload } from "@/library/types";
import cookie from "cookie";
import jwt from "jsonwebtoken";

export const IOAuth = (socket: AuthIORequest, next: (err?: any) => void) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie as string);
  if (!cookies || !cookies.htoken) return socket.disconnect(true);

  let payload: AuthPayload | null = null;
  if (cookies.htoken) {
    try {
      payload = jwt.verify(
        cookies.htoken,
        process.env.JWT_SECRET as string
      ) as AuthPayload;
    } catch {}
  }

  if (!payload) return socket.disconnect(true);
  socket.handshake.user = payload;
  next();
};
